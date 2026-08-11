/* =============================================================================
   EXPLORADOR SOCIO-TÉCNICO DEL PERÚ — V3
   Motor de simulación estocástica. Lógica pura, sin DOM.

   QUÉ ES
   Un modelo de dinámica de sistemas de 9 estados y 6 parámetros, normalizado
   0–100 con línea neutra en 50. Cada estado se acerca a un objetivo que depende
   de los parámetros y de los otros estados, con una tasa de ajuste propia
   (el retardo). No es un modelo econométrico: es un modelo de estructura.

   QUÉ NO ES
   No predice. Los signos causales se apoyan en las fuentes citadas en v3-data.js;
   las magnitudes son heurísticas. Cualquier lectura debe hacerse en términos
   relativos entre escenarios, nunca como nivel absoluto del Perú.

   GENERACIÓN ALEATORIA VÁLIDA
   `randomScenario()` no sortea seis números independientes. Muestrea tres
   factores latentes —institucional, comunitario y de exposición externa— y de
   ellos deriva los seis parámetros con correlación realista, truncando cada uno
   a su rango admisible. Así, un escenario aleatorio nunca es incoherente
   (por ejemplo, integridad máxima con capacidad estatal mínima).
   ========================================================================== */

const V3Sim = (() => {

  /* ------------------------------------------------------------------ RNG */
  /* mulberry32: generador determinista y reproducible a partir de semilla. */
  function rngFrom(seed) {
    let a = (seed >>> 0) || 1;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* Box–Muller: normal estándar a partir de uniforme. */
  function gauss(rnd) {
    let u = 0, v = 0;
    while (u === 0) u = rnd();
    while (v === 0) v = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  const clamp = (x, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, x));
  const approach = (cur, target, rate) => clamp(cur + (target - cur) * rate);

  /* ---------------------------------------------------- ESTADO INICIAL
     El punto de partida NO es neutro. Refleja de forma cualitativa el retrato
     que devuelven los indicadores del explorador —informalidad alta, confianza
     institucional baja, carga nutricional elevada— porque arrancar todo en 50
     produce trayectorias planas que no enseñan nada sobre la dinámica.
     Son anclas heurísticas ordinales, NO mediciones: describen "alto", "medio"
     o "bajo" dentro del propio modelo y nada más.                            */
  const INITIAL = {
    urbana: 58, informal: 68, corrupcion: 60, captura: 60,
    ilicitos: 55, confianza: 30, estres: 58, carga: 60, cultura: 55
  };

  const KEYS = Object.keys(INITIAL);

  /* ------------------------------------------------------------ MODELO */
  /*
     Cada línea es una hipótesis estructural explícita:
     - urbana    ← migración (+), mercado (+), capacidad (−)
     - informal  ← urbana (+), migración (+), captura (+), capacidad (−), integridad (−)
     - ilicitos  ← mercado (+), informal (+), corrupción (+), captura (+), integridad (−)
     - corrupcion← captura (+), informal (+), ilícitos (+), integridad (−), capacidad (−)
     - captura   ← corrupción (+), mercado (+), ilícitos (+), integridad (−), capacidad (−)
     - confianza ← capacidad (+), integridad (+), comunidad (+), captura (−), corrupción (−)
     - estres    ← urbana (+), informal (+), desconfianza (+), captura (+), comunidad (−)
     - carga     ← mercado (+), estrés (+), urbana (+), resiliencia (−), capacidad (−)
     - cultura   ← resiliencia (+), comunidad (+), confianza (+), mercado (−), estrés (−)
  */
  function step(s, p, shock) {
    const d = k => (p[k] - 50);
    const n = () => shock ? shock() : 0;

    const urbana = approach(s.urbana,
      clamp(50 + 0.46 * d('migracion') + 0.12 * d('mercado') - 0.36 * d('capacidad') + n()), 0.19);

    const informal = approach(s.informal,
      clamp(50 + 0.22 * (s.urbana - 50) + 0.18 * d('migracion') + 0.20 * (s.captura - 50)
            - 0.25 * d('capacidad') - 0.18 * d('integridad') + n()), 0.16);

    const ilicitos = approach(s.ilicitos,
      clamp(50 + 0.18 * d('mercado') + 0.17 * (s.informal - 50) + 0.22 * (s.corrupcion - 50)
            + 0.14 * (s.captura - 50) - 0.31 * d('integridad') - 0.10 * d('capacidad') + n()), 0.18);

    const corrupcion = approach(s.corrupcion,
      clamp(50 + 0.25 * (s.captura - 50) + 0.15 * (s.informal - 50) + 0.18 * (s.ilicitos - 50)
            - 0.29 * d('integridad') - 0.12 * d('capacidad') + n()), 0.17);

    const captura = approach(s.captura,
      clamp(50 + 0.32 * (s.corrupcion - 50) + 0.12 * d('mercado') + 0.10 * (s.ilicitos - 50)
            - 0.28 * d('integridad') - 0.13 * d('capacidad') + n()), 0.15);

    const confianza = approach(s.confianza,
      clamp(50 + 0.25 * d('capacidad') + 0.25 * d('integridad') + 0.12 * d('comunidad')
            - 0.24 * (s.captura - 50) - 0.15 * (s.corrupcion - 50) + n()), 0.17);

    const estres = approach(s.estres,
      clamp(50 + 0.20 * (s.urbana - 50) + 0.15 * (s.informal - 50) + 0.18 * (50 - s.confianza)
            + 0.10 * (s.captura - 50) - 0.20 * d('comunidad') - 0.10 * d('capacidad') + n()), 0.16);

    const carga = approach(s.carga,
      clamp(50 + 0.25 * d('mercado') + 0.18 * (s.estres - 50) + 0.10 * (s.urbana - 50)
            - 0.20 * d('resiliencia') - 0.12 * d('capacidad') + n()), 0.13);

    const cultura = approach(s.cultura,
      clamp(50 + 0.25 * d('resiliencia') + 0.20 * d('comunidad') + 0.15 * (s.confianza - 50)
            - 0.16 * d('mercado') - 0.12 * (s.estres - 50) + n()), 0.14);

    return { urbana, informal, corrupcion, captura, ilicitos, confianza, estres, carga, cultura };
  }

  /* --------------------------------------------------------------- RUN */
  /**
   * @param {Object} params  seis parámetros 0–100
   * @param {Object} opts    { periods, noise (0–1), seed }
   * @returns {Object} series por estado, cada una un array de longitud `periods`
   */
  function run(params, opts = {}) {
    const periods = opts.periods || (window.V3 && V3.simulation.periods) || 30;
    const amp = opts.noise || 0;
    const rnd = opts.seed != null ? rngFrom(opts.seed) : null;
    const shock = amp > 0 && rnd ? () => gauss(rnd) * amp * 6 : null;

    let s = { ...INITIAL };
    const series = {};
    KEYS.forEach(k => series[k] = []);

    for (let t = 0; t < periods; t++) {
      s = step(s, params, shock);
      KEYS.forEach(k => series[k].push(s[k]));
    }
    return series;
  }

  /* ----------------------------------------------------------- RESUMEN */
  function last(series, k) { return series[k][series[k].length - 1]; }

  /** Índice de tensión: promedio de las siete tensiones y el complemento de
      las dos protecciones. 0 = sistema distendido, 100 = sistema al límite. */
  function tensionIndex(series) {
    const v = k => last(series, k);
    return (v('urbana') + v('informal') + v('corrupcion') + v('captura') + v('ilicitos')
          + v('estres') + v('carga') + (100 - v('confianza')) + (100 - v('cultura'))) / 9;
  }

  function summary(series) {
    const v = k => Math.round(last(series, k));
    const tension = Math.round(tensionIndex(series));
    const level = tension >= 68 ? 'Alta tensión' : tension >= 48 ? 'Tensión media' : 'Tensión contenida';

    const blocks = [
      { id: 'institucional',       label: 'institucional',        value: (v('corrupcion') + v('captura') + v('ilicitos') + (100 - v('confianza'))) / 4 },
      { id: 'social-territorial',  label: 'social-territorial',   value: (v('urbana') + v('informal') + v('estres')) / 3 },
      { id: 'nutricional-cultural',label: 'nutricional-cultural', value: (v('carga') + (100 - v('cultura'))) / 2 }
    ].sort((a, b) => b.value - a.value);

    /* Dirección de la última quinta parte de la serie: ¿se estabiliza o sigue? */
    const n = series.confianza.length;
    const cut = Math.max(1, Math.floor(n * 0.2));
    const driftOf = k => last(series, k) - series[k][n - 1 - cut];
    const drift = (driftOf('captura') + driftOf('estres') + driftOf('carga') - driftOf('confianza') - driftOf('cultura')) / 5;

    return {
      values: Object.fromEntries(KEYS.map(k => [k, v(k)])),
      tension, level,
      dominant: blocks[0].label,
      blocks,
      drift: Math.round(drift * 10) / 10,
      settling: Math.abs(drift) < 0.6
    };
  }

  /* -------------------------------------------- ESCENARIO ALEATORIO VÁLIDO */
  /**
   * Muestrea un escenario coherente a partir de tres factores latentes.
   * No produce combinaciones absurdas: la calidad institucional co-mueve,
   * igual que la densidad comunitaria y la resiliencia cultural.
   */
  function randomScenario(seed) {
    const rnd = rngFrom(seed);
    const specs = (window.V3 && V3.simulation.params) || [];
    const byId = Object.fromEntries(specs.map(p => [p.id, p]));

    const fInst = gauss(rnd);   // factor institucional  → capacidad, integridad
    const fSoc  = gauss(rnd);   // factor comunitario    → comunidad, resiliencia
    const fExt  = gauss(rnd);   // factor de exposición  → mercado, migración

    /* mezcla latente + ruido propio conservando varianza unitaria */
    const mix = (latent, w) => w * latent + Math.sqrt(Math.max(0, 1 - w * w)) * gauss(rnd);

    const z = {
      capacidad:   mix(fInst,  0.82),
      integridad:  mix(fInst,  0.86),
      comunidad:   mix(fSoc,   0.80),
      resiliencia: mix(fSoc,   0.84),
      mercado:     mix(fExt,   0.78),
      migracion:   mix(fExt,   0.55)
    };

    /* la capacidad estatal alta modera levemente la exposición no regulada */
    z.mercado -= 0.15 * z.capacidad;

    const out = {};
    Object.keys(z).forEach(k => {
      const spec = byId[k] || { def: 50, lo: 10, hi: 90 };
      const sd = (spec.hi - spec.lo) / 5.2;
      out[k] = Math.round(clamp(spec.def + z[k] * sd, spec.lo, spec.hi));
    });
    return out;
  }

  /* -------------------------------------------------------- MONTE CARLO */
  /**
   * Corre N escenarios aleatorios válidos y devuelve:
   *  - band: percentiles 10/50/90 del índice de tensión en cada periodo
   *  - sensitivity: correlación de Pearson entre cada parámetro y la tensión final
   *  - outcomes: distribución de la tensión final por tercios
   */
  function monteCarlo(n = 240, seed = 12345, periods) {
    const specs = (window.V3 && V3.simulation.params) || [];
    const ids = specs.map(p => p.id);
    const P = periods || (window.V3 && V3.simulation.periods) || 30;

    const paths = [];
    const rows = [];

    for (let i = 0; i < n; i++) {
      const params = randomScenario(seed + i * 7919);
      const series = run(params, { periods: P });
      const path = [];
      for (let t = 0; t < P; t++) {
        const snap = {};
        KEYS.forEach(k => snap[k] = series[k][t]);
        path.push((snap.urbana + snap.informal + snap.corrupcion + snap.captura + snap.ilicitos
                 + snap.estres + snap.carga + (100 - snap.confianza) + (100 - snap.cultura)) / 9);
      }
      paths.push(path);
      rows.push({ params, final: path[P - 1] });
    }

    const pct = (arr, q) => {
      const a = [...arr].sort((x, y) => x - y);
      const i = (a.length - 1) * q;
      const lo = Math.floor(i), hi = Math.ceil(i);
      return lo === hi ? a[lo] : a[lo] + (a[hi] - a[lo]) * (i - lo);
    };

    const band = { p10: [], p50: [], p90: [] };
    for (let t = 0; t < P; t++) {
      const col = paths.map(p => p[t]);
      band.p10.push(pct(col, 0.10));
      band.p50.push(pct(col, 0.50));
      band.p90.push(pct(col, 0.90));
    }

    const finals = rows.map(r => r.final);
    const sensitivity = ids.map(id => ({
      id,
      label: (specs.find(s => s.id === id) || {}).label || id,
      color: (specs.find(s => s.id === id) || {}).color || '#888',
      r: pearson(rows.map(r => r.params[id]), finals)
    })).sort((a, b) => Math.abs(b.r) - Math.abs(a.r));

    const thirds = { baja: 0, media: 0, alta: 0 };
    finals.forEach(f => { if (f < 48) thirds.baja++; else if (f < 68) thirds.media++; else thirds.alta++; });

    return {
      n, periods: P, band, sensitivity, thirds,
      mean: finals.reduce((a, b) => a + b, 0) / finals.length,
      min: Math.min(...finals),
      max: Math.max(...finals)
    };
  }

  function pearson(x, y) {
    const n = x.length;
    const mx = x.reduce((a, b) => a + b, 0) / n;
    const my = y.reduce((a, b) => a + b, 0) / n;
    let num = 0, dx = 0, dy = 0;
    for (let i = 0; i < n; i++) {
      const a = x[i] - mx, b = y[i] - my;
      num += a * b; dx += a * a; dy += b * b;
    }
    const den = Math.sqrt(dx * dy);
    return den === 0 ? 0 : Math.round((num / den) * 1000) / 1000;
  }

  /* ------------------------------------------------------------ EXPORT */
  function toCSV(series, params, meta = {}) {
    const head = ['periodo', ...KEYS].join(',');
    const n = series[KEYS[0]].length;
    const lines = [];
    lines.push('# Explorador Socio-Técnico del Perú — V3 · simulación');
    lines.push('# Índices normalizados 0-100. Línea neutra = 50. NO es un pronóstico.');
    lines.push('# Estudio y modelo sistémico planteado por Pierre R.');
    if (meta.seed != null) lines.push('# semilla: ' + meta.seed);
    lines.push('# parametros: ' + Object.entries(params).map(([k, v]) => k + '=' + v).join(' '));
    lines.push(head);
    for (let t = 0; t < n; t++) {
      lines.push([t + 1, ...KEYS.map(k => series[k][t].toFixed(2))].join(','));
    }
    return lines.join('\n');
  }

  return { rngFrom, gauss, run, summary, tensionIndex, randomScenario, monteCarlo, toCSV, KEYS, INITIAL, pearson };
})();

if (typeof window !== 'undefined') window.V3Sim = V3Sim;
