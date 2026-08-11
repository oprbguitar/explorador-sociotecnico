/* =============================================================================
   EXPLORADOR SOCIO-TÉCNICO DEL PERÚ — V3 "CIRCULACIÓN"
   Aplicación: enrutado por capítulos, grafos dinámicos, diagrama de circulación,
   simulador estocástico y exportación de textos y datos.

   Estudio y modelo sistémico planteado por Pierre R.

   DECISIONES DE DISEÑO
   1. Un solo estado global (`S`) y un render por capítulo. Sin framework.
   2. Los layouts de grafo son deterministas y calculados a mano (pentágono,
      radial por eje, hexágono de bucle). El layout de fuerza queda como opción,
      no como comportamiento por defecto: distribuye peor y cambia en cada carga.
   3. Todo texto visible puede descargarse en Markdown. La interfaz no es el
      único soporte del análisis.
   ========================================================================== */

(() => {
  'use strict';

  const D = window.V3;
  const Sim = window.V3Sim;
  if (!D) { console.error('v3-data.js no cargó'); return; }

  /* =========================================================== UTILIDADES */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const esc = v => String(v ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const ico = (id, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${id}"/></svg>`;

  const axisById  = Object.fromEntries(D.axes.map(a => [a.id, a]));
  const varById   = Object.fromEntries(D.variables.map(v => [v.id, v]));
  const srcById   = Object.fromEntries(D.sources.map(s => [s.id, s]));

  const nf = n => {
    if (n >= 10000) return n.toLocaleString('es-PE');
    return String(n).replace('.', ',');
  };

  function toast(msg) {
    const host = $('#toasts');
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    host.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; }, 2600);
    setTimeout(() => el.remove(), 3000);
  }

  function download(filename, content, mime = 'text/markdown;charset=utf-8') {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
    toast('Descargado: ' + filename);
  }

  /* ============================================================== ESTADO */
  const S = {
    lens: 'panorama',
    axes: new Set(D.axes.map(a => a.id)),
    flow: D.flows[0].id,
    query: '',
    animate: true,
    forceLayout: false,
    seed: 20260811,
    params: Object.fromEntries(D.simulation.params.map(p => [p.id, p.def])),
    preset: 'base',
    mc: null,
    cy: null,
    anim: null
  };

  /* ============================================================ CAPÍTULOS */
  const LENSES = [
    { id: 'panorama',    label: 'Panorama',    icon: 'home',   acc: '#EDEAE3' },
    { id: 'sistema',     label: 'Sistema',     icon: 'orbit',  acc: D.palette.amarillo },
    { id: 'circulacion', label: 'Circulación', icon: 'flow',   acc: D.palette.azul },
    { id: 'causal',      label: 'Causal',      icon: 'branch', acc: D.palette.naranja },
    { id: 'nutricion',   label: 'Nutrición',   icon: 'food',   acc: D.palette.rojo },
    { id: 'corrupcion',  label: 'Corrupción',  icon: 'scale',  acc: D.palette.rojo },
    { id: 'territorio',  label: 'Territorio',  icon: 'map',    acc: D.palette.azul },
    { id: 'identidad',   label: 'Identidad',   icon: 'id',     acc: D.palette.verde },
    { id: 'historia',    label: 'Historia',    icon: 'clock',  acc: D.palette.amarillo },
    { id: 'simulador',   label: 'Simulador',   icon: 'lab',    acc: D.palette.verde },
    { id: 'evidencia',   label: 'Evidencia',   icon: 'book',   acc: '#EDEAE3' }
  ];
  const lensById = Object.fromEntries(LENSES.map(l => [l.id, l]));

  /* ============================================================== FRAGMENTOS */

  /* La unidad corta (%, pp) va como exponente; la larga, en su propia línea:
     de otro modo rompe el titular numérico y arruina la lectura. */
  function kpiCard(i) {
    const a = axisById[i.axis];
    const short = i.unit.length <= 2;
    return `<div class="kpi" style="--acc:${a.color}">
      <span class="yr">${esc(i.year)}</span>
      <b>${nf(i.value)}${short ? `<sup>${esc(i.unit)}</sup>` : ''}</b>
      ${short ? '' : `<span class="un">${esc(i.unit)}</span>`}
      <span>${esc(i.label)}</span>
      <small>${esc(i.note)}</small>
    </div>`;
  }

  function srcTags(ids = []) {
    if (!ids.length) return '';
    return `<div class="cite">${ids.map(id => {
      const s = srcById[id];
      if (!s) return '';
      return s.url
        ? `<a class="srctag" href="${esc(s.url)}" target="_blank" rel="noopener" title="${esc(s.name)}">${esc(s.inst)}</a>`
        : `<span class="srctag" title="${esc(s.name)}">${esc(s.inst)}</span>`;
    }).join('')}</div>`;
  }

  function interpBlock(o) {
    return `<div class="interp">
      <span class="lvl lvl-interpretacion">Interpretación</span>
      <h3>${esc(o.title)}</h3>
      <p class="warn">${esc(o.warning)}</p>
      ${o.body.map(p => `<p>${esc(p)}</p>`).join('')}
    </div>`;
  }

  function graphShell(kicker, title, opts = {}) {
    return `<div class="stagegraph">
      <div class="graphcard">
        <div class="gtool">
          <div><span class="eyebrow">${esc(kicker)}</span><strong>${esc(title)}</strong></div>
          <span class="gtool-sp"></span>
          <button class="iact ${S.animate ? 'on' : ''}" id="gAnim" title="Animar el sentido del flujo">${ico('anim')}</button>
          <button class="iact ${S.forceLayout ? 'on' : ''}" id="gForce" title="Alternar distribución: determinista / fuerza">${ico('shuffle')}</button>
          <button class="iact" id="gFit" title="Ajustar a la vista">${ico('fit')}</button>
          <button class="iact" id="gCenter" title="Centrar">${ico('center')}</button>
        </div>
        <div class="graph ${opts.tall ? 'tall' : ''}" id="cy"></div>
        <div class="legend">${opts.legend || ''}</div>
      </div>
      <aside class="inspector" id="inspector">${emptyInspector()}</aside>
    </div>`;
  }

  function emptyInspector() {
    return `<div class="insp-empty">
      ${ico('cursor')}
      <h3>Selecciona un nodo</h3>
      <p>Cada nodo abre su función, su evidencia y sus relaciones. Cada arista abre su polaridad, su retardo y su nivel de evidencia.</p>
    </div>`;
  }

  function axisFilters() {
    return `<div class="filters">
      ${D.axes.map(a => `<button class="fchip ${S.axes.has(a.id) ? 'on' : ''}" data-axis="${a.id}">
        <i style="background:${a.color}"></i>${esc(a.label)}</button>`).join('')}
      <label class="search">${ico('search')}
        <input type="search" id="gSearch" placeholder="Buscar variable, eje o fuente" value="${esc(S.query)}">
      </label>
    </div>`;
  }

  /* ============================================================ CAPÍTULOS */
  const CH = {};

  /* ------------------------------------------------------------ PANORAMA */
  CH.panorama = () => {
    const featured = ['i_inf', 'i_anemia', 'i_obes', 'i_apr', 'i_net', 'i_sane']
      .map(id => D.indicators.find(i => i.id === id)).filter(Boolean);

    return `<section class="chapter">
      <div class="wrap">
        <div class="hero">
          <span class="eyebrow">${esc(D.meta.author)}</span>
          <h1>Cómo <span class="k">circula</span> todo en una <span class="k2">sociedad</span></h1>
          <p class="hero-sub">${esc(D.meta.thesis)}</p>
          <div class="hero-meta">
            <span class="chip">V${esc(D.meta.version)} · ${esc(D.meta.codename)}</span>
            <span class="chip">${D.axes.length} ejes · ${D.variables.length} variables · ${D.causal.length} relaciones</span>
            <span class="chip">${D.sources.length} fuentes registradas</span>
            <span class="chip">${D.indicators.length} indicadores con fuente</span>
          </div>
          <div class="axisbar">${D.axes.map(a => `<i style="background:${a.color}"></i>`).join('')}</div>
        </div>

        <div class="rule"></div>

        <span class="eyebrow" style="margin-bottom:14px">SEIS CIFRAS QUE ORDENAN EL RESTO</span>
        <div class="kpis">${featured.map(kpiCard).join('')}</div>

        <div class="rule"></div>

        <div class="chead" style="--acc:${D.palette.amarillo}">
          <div class="rule-acc"></div>
          <span class="eyebrow">LOS CINCO EJES</span>
          <h2>Cinco subsistemas, ninguno autónomo</h2>
          <p class="lead">Cada eje recibe entradas, las transforma y devuelve salidas que se convierten en entradas de otro. Ninguno se explica solo. Leer el sistema es leer los intercambios, no las partes.</p>
        </div>

        <div class="grid2">
          ${D.axes.map(a => `<article class="card" style="--acc:${a.color};border-top:3px solid ${a.color}">
            <span class="eyebrow" style="color:${a.color}">EJE ${a.number} · ${esc(a.colorName.toUpperCase())}</span>
            <h3 style="margin-top:8px;font-size:20px">${esc(a.label)}</h3>
            <p style="font-size:12.5px;color:var(--muted);margin:2px 0 12px">${esc(a.long)}</p>
            <p style="font-size:13.6px">${esc(a.role)}</p>
            <p style="font-size:13px;color:${a.color};margin-bottom:0">${esc(a.question)}</p>
          </article>`).join('')}
        </div>

        <div class="rule"></div>

        <div class="chead" style="--acc:${D.palette.naranja}">
          <div class="rule-acc"></div>
          <span class="eyebrow">EL CICLO — SEXTO EJE, IMPLÍCITO</span>
          <h2>No es un círculo. Es una espiral.</h2>
          <p class="lead">Las cuatro fases se repiten, pero nunca vuelven al mismo punto: cada reconfiguración fija un piso distinto. Por eso los problemas parecen los mismos y sin embargo cambian de forma.</p>
        </div>

        <div class="cyclegrid">
          ${D.cycle.map(c => `<div class="cyc" style="--acc:${c.color}">
            <span class="n">FASE ${c.n}</span>
            <h4>${esc(c.name)}</h4>
            <p class="sh">${esc(c.short)}</p>
            <p class="bd">${esc(c.body)}</p>
            <span class="sg">Señal: ${esc(c.signal)}</span>
          </div>`).join('')}
        </div>

        <div class="rule"></div>

        <div class="callout">
          <span class="lvl lvl-dato">Método</span>
          <p style="margin-top:12px">${esc(D.meta.disclaimer)}</p>
          <p style="font-size:12.6px;color:var(--muted)">Cada afirmación de este explorador lleva un nivel declarado —dato, documentada, hipótesis, estimación o interpretación— y las lecturas de sentido están separadas visualmente de la evidencia. Ese es el compromiso metodológico del proyecto: mezclar los registros sería más vistoso y menos útil.</p>
        </div>
      </div>
    </section>`;
  };

  /* ------------------------------------------------------------- SISTEMA */
  CH.sistema = () => `<section class="chapter">
    <div class="wide">
      <div class="chead" style="--acc:${D.palette.amarillo}">
        <div class="rule-acc"></div>
        <span class="eyebrow">LENTE SISTEMA</span>
        <h2>Estructura de cinco ejes dentro del anillo del ciclo</h2>
        <p class="lead">Los cinco ejes forman el pentágono interior; las cuatro fases del ciclo forman el anillo exterior. El anillo no es decorativo: indica que cualquier relación entre ejes se lee distinto según la fase en la que el sistema se encuentre. <strong>Arrastra los nodos, toca las aristas.</strong></p>
      </div>
      ${axisFilters()}
      ${graphShell('LENTE SISTEMA', 'Pentágono de ejes + anillo cíclico', {
        legend: `<span><i style="background:${D.palette.amarillo}"></i>Eje</span>
                 <span><i class="sq" style="background:var(--border-2)"></i>Fase del ciclo</span>
                 <span><i class="solid"></i>Relación de misma dirección (+)</span>
                 <span><i class="dashed"></i>Relación de dirección contraria (−)</span>
                 <span>R = lazo reforzador · B = lazo balanceador</span>`
      })}
      <div class="rule"></div>
      <div class="prose">
        <h3>Cómo leer este grafo</h3>
        <p>Una arista con polaridad <strong>+</strong> significa que un aumento en el origen empuja al destino en la misma dirección. Una arista con polaridad <strong>−</strong> significa que lo empuja en dirección contraria. Un circuito cerrado de aristas todas <strong>+</strong> —o con un número par de <strong>−</strong>— es un <strong>lazo reforzador</strong>: se alimenta a sí mismo. Un circuito con un número impar de <strong>−</strong> es un <strong>lazo balanceador</strong>: corrige.</p>
        <p>La asimetría estructural del sistema peruano, según este modelo, es que los lazos reforzadores —integración global que concentra población, presión que produce informalidad, informalidad que reduce control— se cierran solos, mientras los balanceadores —regulación sanitaria, control patrimonial, organización comunitaria— requieren decisión sostenida para seguir corrigiendo. Un sistema con reforzadores automáticos y balanceadores voluntarios tiende, por defecto, a acumular tensión.</p>
      </div>
    </div>
  </section>`;

  /* --------------------------------------------------------- CIRCULACIÓN */
  CH.circulacion = () => {
    const f = D.flows.find(x => x.id === S.flow) || D.flows[0];
    return `<section class="chapter">
      <div class="wrap">
        <div class="chead" style="--acc:${f.color}">
          <div class="rule-acc"></div>
          <span class="eyebrow">LENTE CIRCULACIÓN</span>
          <h2>Cinco cosas circulan. Cada una a distinta velocidad.</h2>
          <p class="lead">Esta es la idea central de la V3. Un sistema social no se describe por sus partes sino por lo que se mueve entre ellas. Cuando dos flujos con velocidades muy distintas se acoplan —información inmediata sobre una capacidad estatal que cambia en décadas— la tensión no es un accidente: es aritmética.</p>
        </div>

        <div class="circ" id="circ">${circulationSVG(f)}</div>
        <div class="flowlist">
          ${D.flows.map(x => `<button class="flowitem ${x.id === S.flow ? 'on' : ''}" data-flow="${x.id}" style="--acc:${x.color}">
            <b><i></i>${esc(x.label)}</b>
            <span>${esc(x.desc)}</span>
            <em>velocidad ${esc(x.speed)} · unidad: ${esc(x.unit)}</em>
          </button>`).join('')}
        </div>

        <div class="rule"></div>

        <div class="grid2">
          <div class="card" style="--acc:${f.color};border-left:3px solid ${f.color}">
            <span class="eyebrow" style="color:${f.color}">ANCLA EMPÍRICA · ${esc(f.label).toUpperCase()}</span>
            <p style="margin-top:12px;font-size:15px;color:var(--heading)">${esc(f.anchor)}</p>
            <p style="font-size:12.6px;color:var(--muted);margin-bottom:0">Recorrido en el modelo: ${f.path.map(id => esc(axisById[id].label)).join(' → ')} → ${esc(axisById[f.path[0]].label)}.</p>
          </div>
          <div class="card">
            <span class="eyebrow">POR QUÉ IMPORTA LA VELOCIDAD</span>
            <p style="margin-top:12px;font-size:13.6px">Un flujo rápido sobre un stock lento produce sobrepaso. La información y el mercado se mueven en meses; la capacidad estatal, la infraestructura y la confianza institucional se mueven en décadas. El desfase de dos décadas entre la expansión del mercado de ultraprocesados y la entrada en vigor de los octógonos es el ejemplo más limpio: para cuando llegó la corrección, el flujo ya se había convertido en stock inscrito en cuerpos.</p>
            <p style="font-size:13.6px;margin-bottom:0">Ese es el motivo por el que este explorador insiste en el retardo. Sin retardo, todo sistema parece corregible a tiempo. Con retardo, la mayoría no lo es.</p>
          </div>
        </div>

        <div class="rule"></div>

        <div class="prose">
          <h3>La regla de circulación</h3>
          <p>Puede formularse en una sola línea: <strong>donde un flujo entra más rápido de lo que el stock receptor puede absorber, el excedente no desaparece — se convierte en tensión almacenada en otro eje.</strong></p>
          <p>El mercado alimentario entra más rápido de lo que la regulación absorbe: el excedente se almacena en el cuerpo como doble carga. La migración entra más rápido de lo que el saneamiento absorbe: el excedente se almacena como informalidad y presión urbana. La renta pública entra más rápido de lo que el control patrimonial absorbe: el excedente se almacena como captura. Es el mismo mecanismo, tres veces.</p>
          <p>Y de ahí la consecuencia práctica: intervenir sobre el flujo sin ampliar el stock receptor solamente cambia dónde se almacena la tensión.</p>
        </div>
      </div>
    </section>`;
  };

  function circulationSVG(flow) {
    const W = 940, H = 520, cx = W / 2, cy = H / 2 - 6, R = 172;
    const pos = {};
    D.axes.forEach((a, i) => {
      const ang = -Math.PI / 2 + i * (2 * Math.PI / 5);
      pos[a.id] = { x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang) };
    });

    /* aristas del recorrido del flujo, cerrando el circuito */
    const seq = [...flow.path, flow.path[0]];
    const paths = [];
    for (let i = 0; i < seq.length - 1; i++) {
      const a = pos[seq[i]], b = pos[seq[i + 1]];
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const k = 0.28;                                   // curvatura hacia el centro
      const qx = mx + (cx - mx) * k, qy = my + (cy - my) * k;
      paths.push({ id: `fp${i}`, d: `M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${qx.toFixed(1)},${qy.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}` });
    }

    /* aristas de fondo: todas las relaciones entre ejes, en gris */
    const bg = D.axisRelations.map(r => {
      const a = pos[r.source], b = pos[r.target];
      if (!a || !b) return '';
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const qx = mx + (cx - mx) * 0.16, qy = my + (cy - my) * 0.16;
      return `<path d="M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${qx.toFixed(1)},${qy.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}"
                fill="none" stroke="currentColor" stroke-opacity=".13" stroke-width="1"/>`;
    }).join('');

    const nodes = D.axes.map(a => {
      const p = pos[a.id];
      const on = flow.path.includes(a.id);
      return `<g transform="translate(${p.x.toFixed(1)},${p.y.toFixed(1)})">
        <circle r="34" fill="var(--panel)" stroke="${a.color}" stroke-width="${on ? 2.6 : 1.2}" opacity="${on ? 1 : .45}"/>
        <text y="4" text-anchor="middle" font-family="var(--mono)" font-size="14" font-weight="700" fill="${a.color}" opacity="${on ? 1 : .5}">${a.number}</text>
        <text y="54" text-anchor="middle" font-size="11.5" font-weight="600" fill="currentColor" opacity="${on ? .95 : .4}">${esc(a.label)}</text>
      </g>`;
    }).join('');

    const particles = paths.map((p, i) => `
      <circle r="4" fill="${flow.color}">
        <animateMotion dur="${(3.2 + i * 0.35).toFixed(2)}s" repeatCount="indefinite" begin="${(i * 0.5).toFixed(2)}s" path="${p.d}"/>
      </circle>
      <circle r="2.4" fill="${flow.color}" opacity=".55">
        <animateMotion dur="${(3.2 + i * 0.35).toFixed(2)}s" repeatCount="indefinite" begin="${(i * 0.5 + 1.3).toFixed(2)}s" path="${p.d}"/>
      </circle>`).join('');

    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Diagrama de circulación de ${esc(flow.label)} entre los cinco ejes" style="color:var(--body)">
      <circle cx="${cx}" cy="${cy}" r="${R + 62}" fill="none" stroke="currentColor" stroke-opacity=".07"/>
      <circle cx="${cx}" cy="${cy}" r="${R - 62}" fill="none" stroke="currentColor" stroke-opacity=".07" stroke-dasharray="3 6"/>
      ${bg}
      ${paths.map(p => `<path id="${p.id}" d="${p.d}" fill="none" stroke="${flow.color}" stroke-width="2"
          stroke-linecap="round" stroke-dasharray="7 7" class="flowline"/>`).join('')}
      ${particles}
      ${nodes}
      <text x="${cx}" y="${cy - 8}" text-anchor="middle" font-family="var(--mono)" font-size="10.5"
            letter-spacing="2.4" fill="currentColor" opacity=".45">CIRCULA</text>
      <text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="17" font-weight="700" fill="${flow.color}">${esc(flow.label)}</text>
    </svg>`;
  }

  /* --------------------------------------------------------------- CAUSAL */
  CH.causal = () => `<section class="chapter">
    <div class="wide">
      <div class="chead" style="--acc:${D.palette.naranja}">
        <div class="rule-acc"></div>
        <span class="eyebrow">LENTE CAUSAL</span>
        <h2>${D.causal.length} relaciones con polaridad, retardo y nivel de evidencia</h2>
        <p class="lead">Las variables están agrupadas por eje en sectores radiales: eso hace legible qué relaciones son internas a un eje y cuáles cruzan de un subsistema a otro. Las relaciones <strong>documentadas</strong> se dibujan sólidas; las <strong>hipótesis</strong>, tenues. El modelo no finge que todas las flechas valen lo mismo.</p>
      </div>
      ${axisFilters()}
      ${graphShell('LENTE CAUSAL', 'Distribución radial por eje', {
        tall: true,
        legend: `<span><i class="solid"></i>Relación documentada</span>
                 <span style="opacity:.55"><i class="solid"></i>Hipótesis a validar</span>
                 <span><i class="dashed"></i>Polaridad negativa (−)</span>
                 <span><b>+</b> misma dirección</span>
                 <span>Círculo = stock · Rombo = flujo</span>`
      })}
      <div class="rule"></div>
      <div class="tblwrap">
        <table class="tbl">
          <thead><tr><th>Origen</th><th>Destino</th><th>Polaridad</th><th>Retardo</th><th>Nivel</th><th>Evidencia</th></tr></thead>
          <tbody>${D.causal.map(r => `<tr>
            <td><b>${esc(varById[r.s]?.label || r.s)}</b></td>
            <td>${esc(varById[r.t]?.label || r.t)}</td>
            <td class="n" style="color:${r.p === '+' ? D.palette.verde : D.palette.rojo}">${r.p}</td>
            <td>${esc(r.delay)}</td>
            <td><span class="lvl lvl-${r.level}">${esc(r.level)}</span></td>
            <td style="font-size:11.5px;color:var(--muted)">${r.ev.map(e => esc(srcById[e]?.inst || e)).join(' · ')}</td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>
  </section>`;

  /* ------------------------------------------------------------ NUTRICIÓN */
  CH.nutricion = () => {
    const N = D.nutrition;
    const kpis = D.indicators.filter(i => i.axis === 'nutricion');
    return `<section class="chapter">
      <div class="wrap">
        <div class="chead" style="--acc:${D.palette.rojo}">
          <div class="rule-acc"></div>
          <span class="eyebrow">${esc(N.kicker)}</span>
          <h2>${esc(N.title)}</h2>
          <p class="lead">${esc(N.lead)}</p>
        </div>

        <div class="kpis">${kpis.map(kpiCard).join('')}</div>

        <div class="rule"></div>

        <span class="eyebrow" style="margin-bottom:16px">EL CIRCUITO EN SEIS PASOS</span>
        <div class="steps">
          ${N.circuit.steps.map(s => `<div class="step" style="--acc:${s.color}">
            <b>${esc(s.n)}</b><h4>${esc(s.t)}</h4><p>${esc(s.d)}</p></div>`).join('')}
        </div>

        <div class="rule"></div>

        <div class="prose">
          <span class="lvl lvl-dato">Lectura empírica</span>
          ${N.empirical.map(b => `<h3>${esc(b.h)}</h3><p>${esc(b.p)}</p>${srcTags(b.src)}`).join('')}
        </div>

        ${interpBlock(N.interpretive)}

        <div class="rule"></div>

        <span class="eyebrow" style="margin-bottom:14px">TENSIONES DE DISEÑO DEL EJE</span>
        <div class="tens">
          ${N.tensions.map(t => `<div class="ten">
            <span class="pair">${esc(t.a)}<em>vs</em>${esc(t.b)}</span>
            <p>${esc(t.t)}</p></div>`).join('')}
        </div>
      </div>
    </section>`;
  };

  /* ----------------------------------------------------------- CORRUPCIÓN */
  CH.corrupcion = () => {
    const C = D.corruption;
    return `<section class="chapter">
      <div class="wrap">
        <div class="chead" style="--acc:${D.palette.rojo}">
          <div class="rule-acc"></div>
          <span class="eyebrow">${esc(C.kicker)}</span>
          <h2>${esc(C.title)}</h2>
          <p class="lead">${esc(C.lead)}</p>
        </div>

        <div class="kpis">
          ${C.indicators.map(i => `<div class="kpi" style="--acc:${D.palette.rojo}">
            <b style="font-size:20px">${esc(i.value)}</b>
            <span>${esc(i.label)}</span>
            <small>${esc(i.note)}</small></div>`).join('')}
        </div>

        <div class="rule"></div>

        <span class="eyebrow" style="margin-bottom:16px">TRES MARCOS, TRES NIVELES DEL MISMO FENÓMENO</span>
        <div class="lens3">
          ${C.lenses.map(l => `<article class="lensc" style="--acc:${l.color}">
            <span class="who">${esc(l.author)}</span>
            <h4>${esc(l.work)}</h4>
            <p class="work">Marco conceptual · documento aportado al proyecto</p>
            <p class="thesis">${esc(l.thesis)}</p>
            <ul>${l.keys.map(k => `<li>${esc(k)}</li>`).join('')}</ul>
            <div class="est"><span class="lvl lvl-${l.level}">${esc(l.level)}</span><br>${esc(l.estimate)}</div>
          </article>`).join('')}
        </div>

        <div class="rule"></div>

        <div class="chead" style="--acc:${D.palette.rojo}">
          <span class="eyebrow">EL BUCLE</span>
          <h2 style="font-size:26px">${esc(C.loop.title)}</h2>
          <p class="lead" style="font-size:15px">${esc(C.loop.desc)}</p>
        </div>

        ${graphShell('BUCLE DE CORRUPCIÓN SISTÉMICA', 'Seis nodos · un lazo reforzador · un lazo balanceador', {
          legend: `<span><i class="solid" style="color:${D.palette.rojo}"></i>Lazo reforzador (R): se cierra solo</span>
                   <span><i class="dashed" style="color:${D.palette.verde}"></i>Lazo balanceador (B): requiere sostenimiento</span>
                   <span>Toca un nodo o una arista para leer su función</span>`
        })}

        <div class="rule"></div>

        <div class="callout" style="border-left:3px solid ${D.palette.rojo}">
          <span class="eyebrow" style="color:${D.palette.rojo}">${esc(C.linkage.title).toUpperCase()}</span>
          <div style="margin-top:14px">${C.linkage.body.map(p => `<p style="font-size:14.6px;line-height:1.75">${esc(p)}</p>`).join('')}</div>
        </div>

        ${interpBlock(C.interpretive)}

        <div class="rule"></div>

        <div class="callout">
          <span class="lvl lvl-estimacion">Nota sobre las fuentes</span>
          <p style="margin-top:12px;font-size:13.4px">${esc(C.note)}</p>
          <p style="font-size:13.4px;margin-bottom:0">Las cifras que las obras discuten se presentan aquí como <strong>órdenes de magnitud atribuidos al autor</strong>, no como dato verificado por este proyecto. Antes de citarlas en un trabajo académico deben contrastarse contra la edición impresa correspondiente. Esa exigencia vale especialmente para las estimaciones históricas de costo, donde la metodología del autor importa tanto como el número.</p>
        </div>
      </div>
    </section>`;
  };

  /* ----------------------------------------------------------- TERRITORIO */
  CH.territorio = () => {
    const T = D.territory;
    const max = {};
    T.regions[0].rows.forEach((r, i) => {
      max[i] = Math.max(...T.regions.map(reg => reg.rows[i][1]));
    });
    return `<section class="chapter">
      <div class="wrap">
        <div class="chead" style="--acc:${D.palette.azul}">
          <div class="rule-acc"></div>
          <span class="eyebrow">LENTE TERRITORIO</span>
          <h2>Tres entornos operativos, no tres paisajes</h2>
          <p class="lead">La misma política nacional produce resultados distintos según el entorno donde aterriza. Comparar Costa, Sierra y Selva en las mismas siete variables muestra dónde la integración territorial es real y dónde es nominal.</p>
        </div>

        <div class="regions">
          ${T.regions.map(reg => `<article class="region" style="--acc:${reg.color}">
            <h4 style="color:${reg.color}">${esc(reg.label)}</h4>
            <p>${esc(reg.note)}</p>
            ${reg.rows.map((row, i) => `<div class="bar">
              <div class="bar-h"><span>${esc(row[0])}</span><b>${row[1].toFixed(1).replace('.', ',')}${esc(row[2])}</b></div>
              <div class="bar-t"><div class="bar-f" data-w="${(row[1] / (max[i] || 100) * 100).toFixed(1)}"></div></div>
            </div>`).join('')}
          </article>`).join('')}
        </div>

        <div class="rule"></div>

        <div class="prose">
          <span class="lvl lvl-dato">Lectura empírica</span>
          ${T.reading.map(p => `<p>${esc(p)}</p>`).join('')}
          ${srcTags(['inei_servicios', 'inei_pobreza', 'inei_censos', 'mincul_lenguas', 'bm_peru'])}
        </div>
      </div>
    </section>`;
  };

  /* ------------------------------------------------------------ IDENTIDAD */
  CH.identidad = () => {
    const I = D.identity;
    const kpis = D.indicators.filter(i => i.axis === 'identidad');
    return `<section class="chapter">
      <div class="wrap">
        <div class="chead" style="--acc:${D.palette.verde}">
          <div class="rule-acc"></div>
          <span class="eyebrow">LENTE IDENTIDAD</span>
          <h2>La identidad no es el adorno del sistema. Es una condición de acceso.</h2>
          <p class="lead">${esc(I.lead)}</p>
        </div>

        <div class="kpis">${kpis.map(kpiCard).join('')}</div>

        <div class="rule"></div>

        <div class="prose">
          <span class="lvl lvl-dato">Lectura empírica</span>
          ${I.blocks.map(b => `<h3>${esc(b.h)}</h3><p>${esc(b.p)}</p>${srcTags(b.src)}`).join('')}
        </div>

        <div class="rule"></div>

        <div class="callout" style="border-left:3px solid ${D.palette.verde}">
          <span class="eyebrow" style="color:${D.palette.verde}">POR QUÉ ESTE EJE CIERRA EL MODELO</span>
          <p style="margin-top:12px;font-size:14.6px;line-height:1.75">Los otros cuatro ejes pueden describirse desde fuera: territorio, mercado, institución y cuerpo tienen métricas externas. La identidad no. Es el único eje que solo existe en primera persona y que, sin embargo, determina cuánto de los otros cuatro le toca a cada quien. Por eso el modelo lo coloca al final del recorrido y no al principio: es donde se acumula el resultado de todo lo demás, y desde donde vuelve a salir como demanda de reconocimiento, organización o desafección.</p>
        </div>
      </div>
    </section>`;
  };

  /* ------------------------------------------------------------- HISTORIA */
  CH.historia = () => `<section class="chapter">
    <div class="wrap">
      <div class="chead" style="--acc:${D.palette.amarillo}">
        <div class="rule-acc"></div>
        <span class="eyebrow">LENTE HISTORIA</span>
        <h2>Los mismos ciclos, con otros contenidos</h2>
        <p class="lead">La línea de tiempo no busca narrar el país: busca mostrar que las fases se repiten. Cada hito está anclado a un eje y a una fuente. Léase de arriba abajo buscando el patrón, no el dato aislado.</p>
      </div>
      <div class="tl">
        ${D.history.map(h => {
          const a = axisById[h.axis];
          return `<div class="tlrow" style="--acc:${a.color}">
            <span class="yr">${esc(h.year)}</span>
            <div>
              <h4>${esc(h.title)}</h4>
              <p>${esc(h.note)}</p>
              <div class="cite" style="margin-top:9px">
                <span class="srctag" style="border-color:${a.color};color:${a.color}">${esc(a.label)}</span>
                <span class="srctag">${esc(srcById[h.src]?.inst || h.src)}</span>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  </section>`;

  /* ------------------------------------------------------------ SIMULADOR */
  CH.simulador = () => {
    const P = D.simulation.params;
    return `<section class="chapter">
      <div class="wide">
        <div class="chead" style="--acc:${D.palette.verde}">
          <div class="rule-acc"></div>
          <span class="eyebrow">LABORATORIO DE ESCENARIOS</span>
          <h2>Genera un escenario válido al azar y observa la dinámica</h2>
          <p class="lead">El botón <strong>Escenario aleatorio</strong> no sortea seis números independientes: muestrea tres factores latentes —institucional, comunitario y de exposición externa— y deriva de ellos parámetros correlacionados. Por eso ningún escenario aleatorio resulta incoherente. El <strong>Monte Carlo</strong> corre cientos de escenarios y muestra la banda de resultados y qué palanca pesa más.</p>
        </div>

        <div class="presets" id="presets">
          ${D.simulation.presets.map(p => `<button class="pchip ${p.id === S.preset ? 'on' : ''}" data-preset="${p.id}">${esc(p.label)}</button>`).join('')}
        </div>

        <div class="simgrid">
          <aside class="simpanel">
            <span class="eyebrow" style="margin-bottom:14px">PARÁMETROS DE ENTRADA</span>
            ${P.map(p => `<label class="sl" style="--acc:${p.color}" title="${esc(p.desc)}">
              <span class="sl-h"><span>${esc(p.label)}</span><output id="o_${p.id}">${S.params[p.id]}</output></span>
              <input type="range" id="s_${p.id}" min="0" max="100" value="${S.params[p.id]}" data-param="${p.id}">
            </label>`).join('')}

            <div class="seedrow">
              <label for="seed">Semilla</label>
              <input id="seed" type="number" value="${S.seed}">
            </div>

            <div class="simbtns">
              <button class="btn btn-key" id="btnRun">${ico('play')} Ejecutar ${D.simulation.periods} periodos</button>
              <button class="btn" id="btnRandom">${ico('dice')} Escenario aleatorio válido</button>
              <button class="btn" id="btnMC">${ico('shuffle')} Monte Carlo · 240 escenarios</button>
              <button class="btn" id="btnCsv">${ico('down')} Exportar serie (CSV)</button>
            </div>

            <p style="font-size:11px;color:var(--muted);margin:16px 0 0;line-height:1.6">Índices normalizados 0–100 · línea neutra 50 · ${D.simulation.periods} periodos.</p>
          </aside>

          <div>
            <div id="simOut"></div>

            <div class="callout" style="margin-top:18px">
              <span class="lvl lvl-hipotesis">Advertencia del modelo</span>
              <p style="margin-top:12px;font-size:13.2px;margin-bottom:0">${esc(D.simulation.disclaimer)}</p>
            </div>

            <div class="rule"></div>

            <div class="prose">
              <h3>Cómo interpretar la salida</h3>
              <p>Los valores no son porcentajes de nada real. Son posiciones relativas dentro de un espacio normalizado donde 50 significa «ni tenso ni distendido». Lo que tiene sentido leer es <strong>el movimiento</strong>: hacia dónde va cada serie, si se estabiliza o sigue derivando, y cuál de los tres bloques —institucional, social-territorial o nutricional-cultural— domina la tensión final.</p>
              <p>En el Monte Carlo, la <strong>banda</strong> muestra el rango entre el percentil 10 y el 90 de cientos de escenarios coherentes: si la banda es angosta, la estructura del sistema pesa más que las condiciones iniciales; si es ancha, las palancas importan. El <strong>análisis de sensibilidad</strong> ordena los parámetros por correlación con la tensión final: un valor negativo grande significa que subir esa palanca reduce tensión de forma consistente en todo el espacio de escenarios, no solo en el caso que estés mirando.</p>
              <p>Esa distinción es la que separa un tablero decorativo de un instrumento: no importa qué pasa en un escenario, importa qué pasa en la distribución.</p>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  };

  /* ------------------------------------------------------------ EVIDENCIA */
  CH.evidencia = () => {
    const cats = [...new Set(D.sources.map(s => s.cat))];
    return `<section class="chapter">
      <div class="wrap">
        <div class="chead">
          <div class="rule-acc" style="background:var(--bone)"></div>
          <span class="eyebrow">LENTE EVIDENCIA</span>
          <h2>Arquitectura de fuentes y método</h2>
          <p class="lead">Un explorador que no declara de dónde salió cada afirmación es una infografía. Aquí cada fuente lleva su rol —calibración, evidencia o marco conceptual— porque no cumplen la misma función: una serie oficial calibra, una obra teórica no.</p>
        </div>

        <div class="grid3" style="margin-bottom:26px">
          <div class="card" style="border-top:3px solid ${D.palette.azul}">
            <span class="eyebrow" style="color:${D.palette.azul}">CALIBRACIÓN</span>
            <p style="margin-top:10px;font-size:13px;margin-bottom:0">Series oficiales con desagregación y periodicidad. Son las únicas que pueden fijar magnitudes.</p>
          </div>
          <div class="card" style="border-top:3px solid ${D.palette.verde}">
            <span class="eyebrow" style="color:${D.palette.verde}">EVIDENCIA</span>
            <p style="margin-top:10px;font-size:13px;margin-bottom:0">Estudios, registros y declaratorias que sostienen un hecho puntual pero no una serie.</p>
          </div>
          <div class="card" style="border-top:3px solid ${D.palette.rojo}">
            <span class="eyebrow" style="color:${D.palette.rojo}">CONCEPTUAL</span>
            <p style="margin-top:10px;font-size:13px;margin-bottom:0">Obras que aportan el mecanismo causal. Nunca se usan como coeficiente numérico.</p>
          </div>
        </div>

        ${cats.map(c => `
          <span class="eyebrow" style="margin:26px 0 12px">${esc(c).toUpperCase()}</span>
          <div class="srcgrid">
            ${D.sources.filter(s => s.cat === c).map(s => {
              const inner = `<div class="inst">${esc(s.inst)}</div>
                             <div class="nm">${esc(s.name)}</div>
                             <div class="use">${esc(s.use)}</div>
                             <span class="rl">${esc(s.role)}</span>`;
              return s.url
                ? `<a class="src" href="${esc(s.url)}" target="_blank" rel="noopener">${inner}</a>`
                : `<div class="src">${inner}</div>`;
            }).join('')}
          </div>`).join('')}

        <div class="rule"></div>

        <span class="eyebrow" style="margin-bottom:14px">GLOSARIO OPERATIVO</span>
        <div class="gloss">
          ${D.glossary.map(g => `<div class="gl"><b>${esc(g.t)}</b><span>${esc(g.d)}</span></div>`).join('')}
        </div>

        <div class="rule"></div>

        <div class="prose">
          <h3>Reglas del proyecto</h3>
          <p><strong>1. Versionado no destructivo.</strong> La V1 y la V2 siguen accesibles y sin modificaciones de contenido. La V3 no las reemplaza: agrega una lectura de circulación que las anteriores no tenían.</p>
          <p><strong>2. Nivel de evidencia obligatorio.</strong> Ninguna afirmación circula sin etiqueta. Un dato oficial, un mecanismo documentado, una hipótesis del modelo, una estimación de autor y una lectura interpretativa son cinco cosas distintas y se muestran distinto.</p>
          <p><strong>3. La interpretación no se esconde ni se disfraza.</strong> Las lecturas de sentido —sobre el cuerpo como archivo, sobre la corrupción como pacto silencioso— están dentro del explorador porque el fenómeno las tiene. Están marcadas en rojo y declaradas como no rigurosas porque mezclarlas con la evidencia sería deshonesto.</p>
          <p><strong>4. Simulación identificada.</strong> El laboratorio produce índices normalizados y ningún pronóstico. Sus coeficientes son heurísticos hasta ser calibrados con series oficiales.</p>
          <p><strong>5. Todo texto es descargable.</strong> El análisis debe poder salir de la interfaz y sobrevivir sin ella.</p>
        </div>
      </div>
    </section>`;
  };

  /* ============================================================== GRAFOS */

  function cyStyle() {
    const dark = !document.documentElement.classList.contains('light');
    const text  = dark ? '#EDEAE3' : '#101014';
    const panel = dark ? '#0E0E11' : '#F5F3EE';
    const line  = dark ? '#3A3A46' : '#B8B2A2';
    return [
      { selector: 'node', style: {
        'font-family': 'Inter, sans-serif', 'font-size': '10.5px', 'font-weight': 600,
        'text-wrap': 'wrap', 'text-max-width': '96px', 'color': text, 'label': 'data(label)',
        'text-valign': 'bottom', 'text-margin-y': '8px',
        'background-color': 'data(color)', 'background-opacity': dark ? 0.14 : 0.12,
        'border-width': 2, 'border-color': 'data(color)',
        'text-background-color': panel, 'text-background-opacity': dark ? 0.72 : 0.82, 'text-background-padding': '2px',
        'width': 44, 'height': 44, 'transition-property': 'border-width, opacity', 'transition-duration': '160ms'
      }},
      { selector: 'node[kind="flujo"]', style: { 'shape': 'diamond', 'width': 50, 'height': 50 } },
      { selector: 'node[type="axis"]', style: {
        'width': 84, 'height': 84, 'border-width': 4, 'font-size': '12.5px', 'font-weight': 700,
        'background-opacity': dark ? 0.2 : 0.16,
        'label': 'data(label)', 'text-valign': 'bottom', 'text-margin-y': '10px'
      }},
      { selector: 'node[type="phase"]', style: {
        'shape': 'round-rectangle', 'width': 92, 'height': 34, 'border-width': 1,
        'border-style': 'dashed', 'font-size': '9.5px', 'text-valign': 'center', 'text-margin-y': 0,
        'background-color': dark ? '#16161B' : '#E4E0D6'
      }},
      { selector: 'node[type="loop"]', style: { 'width': 62, 'height': 62, 'border-width': 3, 'font-size': '10.5px' } },
      { selector: 'edge', style: {
        'width': 1.4, 'line-color': line, 'target-arrow-color': line, 'target-arrow-shape': 'triangle',
        'curve-style': 'bezier', 'control-point-step-size': 52, 'arrow-scale': .72,
        'font-size': '9px', 'font-family': 'JetBrains Mono, monospace', 'label': 'data(label)', 'color': text,
        'text-opacity': .62,
        'text-background-color': panel, 'text-background-opacity': .9, 'text-background-padding': '2px'
      }},
      { selector: 'edge[polarity="-"]', style: { 'line-style': 'dashed' } },
      { selector: 'edge[level="hipotesis"]', style: { 'opacity': .42, 'width': 1.1 } },
      { selector: 'edge[kind="ring"]', style: { 'line-style': 'dotted', 'target-arrow-shape': 'none', 'opacity': .3, 'width': 1 } },
      { selector: 'edge[kind="member"]', style: { 'line-style': 'dotted', 'target-arrow-shape': 'none', 'opacity': .22, 'width': 1 } },
      { selector: 'edge.flowing', style: { 'line-dash-pattern': [7, 6] } },
      { selector: '.dim', style: { 'opacity': .1 } },
      { selector: ':selected', style: { 'border-width': 6, 'opacity': 1 } }
    ];
  }

  /* -------- elementos y posiciones deterministas por lente ------------- */

  function elementsSistema() {
    const els = [];
    const R = 210, RR = 380, cx = 0, cy = 0;

    D.axes.filter(a => S.axes.has(a.id)).forEach((a) => {
      const i = D.axes.indexOf(a);
      const ang = -Math.PI / 2 + i * (2 * Math.PI / D.axes.length);
      els.push({
        data: { id: a.id, label: a.label, type: 'axis', color: a.color, number: a.number },
        position: { x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang) }
      });
    });

    D.cycle.forEach((c, i) => {
      const ang = -Math.PI / 2 + (i + 0.5) * (2 * Math.PI / 4);
      els.push({
        data: { id: 'ph_' + c.id, label: c.name.toUpperCase(), type: 'phase', color: c.color },
        position: { x: cx + RR * Math.cos(ang), y: cy + RR * Math.sin(ang) }
      });
    });
    D.cycle.forEach((c, i) => {
      const nx = D.cycle[(i + 1) % D.cycle.length];
      els.push({ data: { id: `ring_${i}`, source: 'ph_' + c.id, target: 'ph_' + nx.id, kind: 'ring', label: '' } });
    });

    D.axisRelations.forEach((r, i) => {
      if (!S.axes.has(r.source) || !S.axes.has(r.target)) return;
      els.push({ data: {
        id: `ar_${i}`, source: r.source, target: r.target,
        label: `${r.loop} ${r.polarity}`, polarity: r.polarity, kind: 'axisrel', desc: r.label
      }});
    });
    return els;
  }

  function elementsCausal() {
    const els = [];
    const active = D.axes.filter(a => S.axes.has(a.id));

    /* Distribución radial ponderada.
       Cada eje ocupa un sector angular proporcional a su número de variables
       —el eje social tiene ocho y necesita más arco que los demás— y dentro del
       sector las variables alternan entre dos radios, de modo que dos vecinas
       nunca quedan a la misma distancia del centro y sus etiquetas no chocan.
       Es determinista: el mapa se ve igual en cada carga, que es lo que permite
       memorizarlo. Un layout de fuerza reparte peor y cambia cada vez. */
    const R0 = 240, R1 = 352;
    const total = active.reduce((s, a) => s + D.variables.filter(v => v.axis === a.id).length, 0) || 1;
    let cursor = -Math.PI / 2;

    active.forEach(a => {
      const vars = D.variables.filter(v => v.axis === a.id);
      const n = vars.length;
      const sec = 2 * Math.PI * n / total;
      const spread = sec * 0.86;
      vars.forEach((v, vi) => {
        const ang = cursor + (sec - spread) / 2 + (n === 1 ? spread / 2 : spread * vi / (n - 1));
        const r = vi % 2 === 0 ? R0 : R1;
        els.push({
          data: { id: v.id, label: v.label, type: 'var', color: a.color, kind: v.kind, axis: a.id },
          position: { x: r * Math.cos(ang), y: r * Math.sin(ang) }
        });
      });
      cursor += sec;
    });

    const allowed = new Set(els.map(e => e.data.id));
    D.causal.forEach((r, i) => {
      if (!allowed.has(r.s) || !allowed.has(r.t)) return;
      els.push({ data: {
        id: `c_${i}`, source: r.s, target: r.t, label: r.p, polarity: r.p,
        level: r.level, delay: r.delay, kind: 'causal'
      }});
    });
    return els;
  }

  function elementsCorruption() {
    const L = D.corruption.loop;
    const els = [];
    const R = 230;
    L.nodes.forEach((n, i) => {
      const ang = -Math.PI / 2 + i * (2 * Math.PI / L.nodes.length);
      els.push({
        data: { id: n.id, label: n.label, type: 'loop', color: n.color, desc: n.d },
        position: { x: R * Math.cos(ang), y: R * Math.sin(ang) }
      });
    });
    L.edges.forEach((e, i) => {
      els.push({ data: {
        id: `le_${i}`, source: e.s, target: e.t, label: `${e.loop}${e.p}`,
        polarity: e.p, kind: 'loopedge'
      }});
    });
    return els;
  }

  function mountGraph(kind) {
    const host = $('#cy');
    if (!host || typeof cytoscape === 'undefined') {
      if (host) host.innerHTML = `<div class="loading"><div class="lb"></div><br>No se pudo cargar la librería de grafos.<br><small>Revisa la conexión y recarga la página.</small></div>`;
      return;
    }
    stopAnim();

    const els = kind === 'sistema' ? elementsSistema()
              : kind === 'causal'  ? elementsCausal()
              : elementsCorruption();

    S.cy = cytoscape({
      container: host,
      elements: els,
      style: cyStyle(),
      minZoom: 0.28, maxZoom: 2.4, wheelSensitivity: 0.18,
      layout: S.forceLayout
        ? { name: 'cose', animate: false, padding: 70, nodeRepulsion: 13000, idealEdgeLength: 130, componentSpacing: 100, nodeDimensionsIncludeLabels: true, numIter: 1400 }
        : { name: 'preset', padding: 74, fit: true }
    });

    S.cy.on('tap', 'node', e => inspectNode(e.target.data(), kind));
    S.cy.on('tap', 'edge', e => inspectEdge(e.target.data(), kind));
    S.cy.on('tap', e => { if (e.target === S.cy) { $('#inspector') && ($('#inspector').innerHTML = emptyInspector()); S.cy.elements().removeClass('dim'); } });

    setTimeout(() => S.cy && S.cy.fit(undefined, kind === 'causal' ? 44 : 70), 30);
    if (S.animate) startAnim();
    applyQuery();
  }

  /* animación del sentido del flujo sobre las aristas causales */
  function startAnim() {
    stopAnim();
    if (!S.cy) return;
    const eds = S.cy.edges('[kind="causal"], [kind="axisrel"], [kind="loopedge"]');
    if (!eds.length) return;
    eds.addClass('flowing');
    let off = 0, last = 0;
    const tick = (ts) => {
      if (!S.cy) return;
      if (ts - last > 55) {
        off = (off - 2) % 26;
        eds.style('line-dash-offset', off);
        last = ts;
      }
      S.anim = requestAnimationFrame(tick);
    };
    S.anim = requestAnimationFrame(tick);
  }
  function stopAnim() {
    if (S.anim) cancelAnimationFrame(S.anim);
    S.anim = null;
  }

  /* ------------------------------------------------------------ INSPECTOR */
  function inspectNode(d, kind) {
    const host = $('#inspector');
    if (!host) return;

    if (d.type === 'axis') {
      const a = axisById[d.id];
      const vars = D.variables.filter(v => v.axis === a.id);
      const inds = D.indicators.filter(i => i.axis === a.id).slice(0, 4);
      host.innerHTML = `
        <span class="nodebadge"><i style="background:${a.color}"></i>EJE ${a.number}</span>
        <h3>${esc(a.label)}</h3>
        <p style="color:var(--muted);font-size:12.5px;margin-top:-4px">${esc(a.long)}</p>
        <p>${esc(a.role)}</p>
        <div class="iblock"><h4>Entradas → procesos → salidas</h4>
          <p style="font-size:12.4px"><b style="color:var(--heading)">Entra:</b> ${a.inputs.map(esc).join(' · ')}</p>
          <p style="font-size:12.4px"><b style="color:var(--heading)">Procesa:</b> ${a.processes.map(esc).join(' · ')}</p>
          <p style="font-size:12.4px;margin-bottom:0"><b style="color:var(--heading)">Sale:</b> ${a.outputs.map(esc).join(' · ')}</p>
        </div>
        <div class="iblock"><h4>Variables del eje (${vars.length})</h4>
          <div class="meta">${vars.map(v => `<div><b>${esc(v.trend)}</b><span>${esc(v.label)}</span></div>`).join('')}</div>
        </div>
        ${inds.length ? `<div class="iblock"><h4>Indicadores con fuente</h4><div class="mini">
          ${inds.map(i => `<div><b>${nf(i.value)}${esc(i.unit === 'personas' ? ' personas' : i.unit)}</b> — ${esc(i.label)}<small>${esc(i.year)} · ${esc(srcById[i.src]?.inst || '')}</small></div>`).join('')}
        </div></div>` : ''}`;
      focusNeighborhood(d.id);
      return;
    }

    if (d.type === 'phase') {
      const c = D.cycle.find(x => 'ph_' + x.id === d.id);
      if (!c) return;
      host.innerHTML = `<span class="nodebadge"><i style="background:${c.color}"></i>FASE ${c.n}</span>
        <h3>${esc(c.name)}</h3><p style="color:var(--heading)">${esc(c.short)}</p><p>${esc(c.body)}</p>
        <div class="iblock"><h4>Señal de entrada a la fase</h4><p style="margin-bottom:0">${esc(c.signal)}</p></div>`;
      return;
    }

    if (d.type === 'loop') {
      const n = D.corruption.loop.nodes.find(x => x.id === d.id);
      if (!n) return;
      const out = D.corruption.loop.edges.filter(e => e.s === d.id);
      const inn = D.corruption.loop.edges.filter(e => e.t === d.id);
      const nm = id => D.corruption.loop.nodes.find(x => x.id === id)?.label || id;
      host.innerHTML = `<span class="nodebadge"><i style="background:${n.color}"></i>NODO DEL BUCLE</span>
        <h3>${esc(n.label)}</h3><p>${esc(n.d)}</p>
        <div class="iblock"><h4>Sale hacia</h4><div class="mini">
          ${out.length ? out.map(e => `<div><b>${esc(nm(e.t))}</b><small>lazo ${e.loop} · polaridad ${e.p}</small></div>`).join('') : '<div>Sin salidas.</div>'}
        </div></div>
        <div class="iblock"><h4>Recibe de</h4><div class="mini">
          ${inn.length ? inn.map(e => `<div><b>${esc(nm(e.s))}</b><small>lazo ${e.loop} · polaridad ${e.p}</small></div>`).join('') : '<div>Sin entradas.</div>'}
        </div></div>`;
      focusNeighborhood(d.id);
      return;
    }

    const v = varById[d.id];
    if (!v) return;
    const a = axisById[v.axis];
    const outs = D.causal.filter(r => r.s === v.id);
    const ins  = D.causal.filter(r => r.t === v.id);
    const srcs = new Set(v.evidence || []);
    [...outs, ...ins].forEach(r => (r.ev || []).forEach(e => srcs.add(e)));

    host.innerHTML = `
      <span class="nodebadge"><i style="background:${a.color}"></i>${esc(v.kind)} · ${esc(a.label)}</span>
      <h3>${esc(v.label)}</h3><p>${esc(v.desc)}</p>
      <div class="iblock"><h4>Posición en el grafo</h4>
        <div class="meta">
          <div><b>${ins.length}</b><span>entradas causales</span></div>
          <div><b>${outs.length}</b><span>salidas causales</span></div>
          <div><b>${esc(v.trend)}</b><span>tendencia conceptual</span></div>
          <div><b>${esc(v.kind)}</b><span>tipo de variable</span></div>
        </div>
      </div>
      ${outs.length ? `<div class="iblock"><h4>Empuja hacia</h4><div class="mini">
        ${outs.map(r => `<div><b>${esc(varById[r.t]?.label || r.t)}</b><small>polaridad ${r.p} · retardo ${esc(r.delay)} · ${esc(r.level)}</small></div>`).join('')}
      </div></div>` : ''}
      ${ins.length ? `<div class="iblock"><h4>Recibe presión de</h4><div class="mini">
        ${ins.map(r => `<div><b>${esc(varById[r.s]?.label || r.s)}</b><small>polaridad ${r.p} · retardo ${esc(r.delay)} · ${esc(r.level)}</small></div>`).join('')}
      </div></div>` : ''}
      <div class="iblock"><h4>Fuentes vinculadas</h4><div class="mini">
        ${[...srcs].map(id => srcById[id]).filter(Boolean).slice(0, 8).map(s => s.url
          ? `<a href="${esc(s.url)}" target="_blank" rel="noopener"><b>${esc(s.inst)}</b>${esc(s.name)}<small>${esc(s.role)}</small></a>`
          : `<div><b>${esc(s.inst)}</b>${esc(s.name)}<small>${esc(s.role)} · documento de trabajo, no redistribuido</small></div>`).join('')}
      </div></div>`;
    focusNeighborhood(d.id);
  }

  function inspectEdge(d, kind) {
    const host = $('#inspector');
    if (!host) return;

    if (d.kind === 'axisrel') {
      const r = D.axisRelations.find(x => x.source === d.source && x.target === d.target);
      if (!r) return;
      host.innerHTML = `<span class="nodebadge">LAZO ${esc(r.loop)}</span>
        <h3>${esc(axisById[r.source].label)} → ${esc(axisById[r.target].label)}</h3>
        <p>${esc(r.label)}.</p>
        <div class="iblock"><h4>Lectura</h4>
        <p style="margin-bottom:0">Polaridad <b style="color:var(--heading)">${esc(r.polarity)}</b>. ${r.loop.startsWith('R')
          ? 'Pertenece a un lazo reforzador: la relación se alimenta a sí misma a través del circuito y crece hasta topar con un límite.'
          : 'Pertenece a un lazo balanceador: la relación corrige la desviación, pero solo mientras sea sostenida activamente.'}</p></div>`;
      return;
    }

    if (d.kind === 'loopedge') {
      const e = D.corruption.loop.edges.find(x => x.s === d.source && x.t === d.target);
      if (!e) return;
      const nm = id => D.corruption.loop.nodes.find(x => x.id === id)?.label || id;
      host.innerHTML = `<span class="nodebadge">LAZO ${esc(e.loop)}</span>
        <h3>${esc(nm(e.s))} → ${esc(nm(e.t))}</h3>
        <p>Polaridad <b style="color:var(--heading)">${esc(e.p)}</b>.</p>
        <div class="iblock"><h4>Función en el bucle</h4><p style="margin-bottom:0">${e.loop === 'R'
          ? 'Tramo del lazo reforzador. Cada vuelta amplifica la siguiente: el sistema no necesita voluntad para sostenerlo.'
          : 'Tramo del lazo balanceador. Corrige, pero se apaga si la integridad y el control patrimonial dejan de financiarse y coordinarse.'}</p></div>`;
      return;
    }

    const r = D.causal.find(x => x.s === d.source && x.t === d.target);
    if (!r) return;
    const srcs = (r.ev || []).map(id => srcById[id]).filter(Boolean);
    host.innerHTML = `
      <span class="nodebadge">RELACIÓN CAUSAL</span>
      <h3>${esc(varById[r.s]?.label)} → ${esc(varById[r.t]?.label)}</h3>
      <p>Un aumento del origen empuja al destino <b style="color:var(--heading)">${r.p === '+' ? 'en la misma dirección' : 'en dirección contraria'}</b>, con retardo <b style="color:var(--heading)">${esc(r.delay)}</b>.</p>
      <p><span class="lvl lvl-${r.level}">${esc(r.level)}</span></p>
      <div class="iblock"><h4>Qué significa ese nivel</h4>
        <p style="margin-bottom:0">${r.level === 'documentada'
          ? 'El mecanismo está sostenido por las fuentes citadas. La dirección es defendible; la magnitud sigue sin calibrar.'
          : 'Es una relación plausible dentro del modelo, no una relación verificada. Se muestra tenue a propósito y no debe citarse como hallazgo.'}</p></div>
      <div class="iblock"><h4>Fuentes</h4><div class="mini">
        ${srcs.map(s => s.url
          ? `<a href="${esc(s.url)}" target="_blank" rel="noopener"><b>${esc(s.inst)}</b>${esc(s.name)}</a>`
          : `<div><b>${esc(s.inst)}</b>${esc(s.name)}</div>`).join('')}
      </div></div>`;
  }

  function focusNeighborhood(id) {
    if (!S.cy) return;
    const n = S.cy.getElementById(id);
    if (!n || !n.length) return;
    const keep = n.closedNeighborhood();
    S.cy.elements().addClass('dim');
    keep.removeClass('dim');
  }

  function applyQuery() {
    if (!S.cy) return;
    const q = S.query.trim().toLowerCase();
    if (!q) { S.cy.elements().removeClass('dim'); return; }
    const hits = [
      ...D.axes.map(x => ({ id: x.id, t: `${x.label} ${x.role} ${x.long}` })),
      ...D.variables.map(x => ({ id: x.id, t: `${x.label} ${x.desc}` })),
      ...D.corruption.loop.nodes.map(x => ({ id: x.id, t: `${x.label} ${x.d}` }))
    ].filter(x => x.t.toLowerCase().includes(q)).map(x => x.id);
    S.cy.elements().addClass('dim');
    hits.forEach(id => {
      const n = S.cy.getElementById(id);
      if (n && n.length) n.removeClass('dim');
    });
    const first = hits.map(id => S.cy.getElementById(id)).find(n => n && n.length);
    if (first) S.cy.animate({ center: { eles: first }, zoom: 1.05 }, { duration: 260 });
  }

  /* =========================================================== SIMULADOR */
  function renderSim(mode) {
    const host = $('#simOut');
    if (!host) return;

    const series = Sim.run(S.params, { periods: D.simulation.periods });
    const sum = Sim.summary(series);
    S.lastSeries = series;

    const outs = D.simulation.outputs;
    const metrics = outs.map(o => {
      const v = sum.values[o.id];
      return `<div class="metric" style="--acc:${o.color}">
        <span>${esc(o.label)}</span><b>${v}</b>
        <i>${o.type === 'proteccion' ? 'protección' : 'tensión'}</i>
      </div>`;
    }).join('');

    let mcBlock = '';
    if (S.mc) {
      const mc = S.mc;
      mcBlock = `
        <div class="chartbox">
          <div class="ch-h">
            <strong>Monte Carlo · ${mc.n} escenarios aleatorios válidos</strong>
            <span>Banda percentil 10–90 del índice de tensión · mediana en trazo lleno</span>
          </div>
          ${fanChart(mc)}
          <div class="chleg">
            <span><i style="background:${D.palette.rojo}"></i>Mediana</span>
            <span><i style="background:${D.palette.rojo};opacity:.28"></i>Rango P10–P90</span>
            <span>Media final: <b style="color:var(--heading)">${mc.mean.toFixed(1)}</b> · mín ${mc.min.toFixed(1)} · máx ${mc.max.toFixed(1)}</span>
          </div>
        </div>

        <div class="chartbox">
          <div class="ch-h">
            <strong>Sensibilidad · qué palanca pesa más</strong>
            <span>Correlación de Pearson entre cada parámetro y la tensión final</span>
          </div>
          ${sensChart(mc)}
          <div class="chleg"><span>Negativo = subir esa palanca reduce tensión en todo el espacio de escenarios. Positivo = la aumenta.</span></div>
        </div>

        <div class="metrics">
          <div class="metric" style="--acc:${D.palette.verde}"><span>Escenarios de tensión contenida</span><b>${Math.round(mc.thirds.baja / mc.n * 100)}<span style="font-size:12px">%</span></b><i>&lt; 48</i></div>
          <div class="metric" style="--acc:${D.palette.amarillo}"><span>Escenarios de tensión media</span><b>${Math.round(mc.thirds.media / mc.n * 100)}<span style="font-size:12px">%</span></b><i>48 – 68</i></div>
          <div class="metric" style="--acc:${D.palette.rojo}"><span>Escenarios de alta tensión</span><b>${Math.round(mc.thirds.alta / mc.n * 100)}<span style="font-size:12px">%</span></b><i>&gt; 68</i></div>
        </div>`;
    }

    host.innerHTML = `
      <div class="diag">
        <span class="lvl lvl-hipotesis">Salida del modelo · no es una medición</span>
        <b>${esc(sum.level)} — ${sum.tension}/100</b>
        <span>La tensión dominante del escenario es <strong style="color:var(--heading)">${esc(sum.dominant)}</strong>.
        ${sum.settling
          ? 'Las series se están estabilizando: el sistema encontró un equilibrio con este juego de parámetros.'
          : `Las series siguen derivando (${sum.drift > 0 ? '+' : ''}${sum.drift} por periodo en el último tramo): el escenario aún no encontró equilibrio en ${D.simulation.periods} periodos.`}</span>
      </div>

      <div class="metrics">${metrics}</div>

      <div class="chartbox">
        <div class="ch-h">
          <strong>Trayectoria de ${D.simulation.periods} periodos</strong>
          <span>Índices normalizados · línea neutra en 50</span>
        </div>
        ${lineChart(series)}
        <div class="chleg">
          ${['captura', 'confianza', 'estres', 'carga', 'cultura'].map(k => {
            const o = outs.find(x => x.id === k);
            return `<span><i style="background:${o.color}"></i>${esc(o.label)}</span>`;
          }).join('')}
        </div>
      </div>

      ${mcBlock}`;

    if (mode === 'mc') host.querySelector('.chartbox:nth-of-type(2)')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function lineChart(series) {
    const W = 820, H = 280, pl = 34, pr = 12, pt = 14, pb = 24;
    const keys = ['captura', 'confianza', 'estres', 'carga', 'cultura'];
    const outs = Object.fromEntries(D.simulation.outputs.map(o => [o.id, o]));
    const n = series.captura.length;
    const X = i => pl + i * (W - pl - pr) / Math.max(1, n - 1);
    const Y = v => H - pb - v * (H - pt - pb) / 100;

    const grid = [0, 25, 50, 75, 100].map(v =>
      `<line x1="${pl}" y1="${Y(v)}" x2="${W - pr}" y2="${Y(v)}" stroke="currentColor" stroke-opacity="${v === 50 ? .22 : .08}" ${v === 50 ? 'stroke-dasharray="4 4"' : ''}/>
       <text x="${pl - 7}" y="${Y(v) + 3.5}" text-anchor="end" font-family="JetBrains Mono,monospace" font-size="9" fill="currentColor" opacity=".4">${v}</text>`).join('');

    const lines = keys.map(k => {
      const pts = series[k].map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
      return `<polyline points="${pts}" fill="none" stroke="${outs[k].color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="${X(n - 1).toFixed(1)}" cy="${Y(series[k][n - 1]).toFixed(1)}" r="3.2" fill="${outs[k].color}"/>`;
    }).join('');

    const ticks = [0, Math.floor(n / 2), n - 1].map(i =>
      `<text x="${X(i)}" y="${H - 6}" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="currentColor" opacity=".4">t${i + 1}</text>`).join('');

    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Trayectoria de índices normalizados">${grid}${lines}${ticks}</svg>`;
  }

  function fanChart(mc) {
    const W = 820, H = 240, pl = 34, pr = 12, pt = 14, pb = 24;
    const n = mc.periods;
    const X = i => pl + i * (W - pl - pr) / Math.max(1, n - 1);
    const Y = v => H - pb - v * (H - pt - pb) / 100;

    const grid = [0, 25, 50, 75, 100].map(v =>
      `<line x1="${pl}" y1="${Y(v)}" x2="${W - pr}" y2="${Y(v)}" stroke="currentColor" stroke-opacity="${v === 50 ? .22 : .08}" ${v === 50 ? 'stroke-dasharray="4 4"' : ''}/>
       <text x="${pl - 7}" y="${Y(v) + 3.5}" text-anchor="end" font-family="JetBrains Mono,monospace" font-size="9" fill="currentColor" opacity=".4">${v}</text>`).join('');

    const up = mc.band.p90.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`);
    const dn = mc.band.p10.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).reverse();
    const area = `<polygon points="${[...up, ...dn].join(' ')}" fill="${D.palette.rojo}" opacity=".2"/>`;
    const med = `<polyline points="${mc.band.p50.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')}"
                  fill="none" stroke="${D.palette.rojo}" stroke-width="2.4" stroke-linecap="round"/>`;

    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Banda de escenarios Monte Carlo">${grid}${area}${med}</svg>`;
  }

  function sensChart(mc) {
    const rows = mc.sensitivity;
    const W = 820, rowH = 32, H = rows.length * rowH + 20;
    const labelW = 230, mid = labelW + (W - labelW - 40) / 2, half = (W - labelW - 40) / 2;

    const bars = rows.map((r, i) => {
      const y = 12 + i * rowH;
      const w = Math.abs(r.r) * half;
      const x = r.r < 0 ? mid - w : mid;
      return `<text x="0" y="${y + 13}" font-size="11.5" fill="currentColor" opacity=".8">${esc(r.label)}</text>
        <rect x="${x.toFixed(1)}" y="${y + 4}" width="${w.toFixed(1)}" height="15" fill="${r.r < 0 ? D.palette.verde : D.palette.rojo}" opacity=".85"/>
        <text x="${(r.r < 0 ? x - 7 : x + w + 7).toFixed(1)}" y="${y + 15.5}" text-anchor="${r.r < 0 ? 'end' : 'start'}"
              font-family="JetBrains Mono,monospace" font-size="10.5" fill="currentColor" opacity=".7">${r.r > 0 ? '+' : ''}${r.r.toFixed(2)}</text>`;
    }).join('');

    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Análisis de sensibilidad">
      <line x1="${mid}" y1="6" x2="${mid}" y2="${H - 6}" stroke="currentColor" stroke-opacity=".22"/>
      ${bars}
    </svg>`;
  }

  function syncSliders() {
    D.simulation.params.forEach(p => {
      const s = $('#s_' + p.id), o = $('#o_' + p.id);
      if (s) s.value = S.params[p.id];
      if (o) o.textContent = S.params[p.id];
    });
  }

  /* ============================================================ MARKDOWN */
  function mdHeader(title) {
    return `# ${title}\n\n> Explorador Socio-Técnico del Perú — V${D.meta.version} «${D.meta.codename}»\n> ${D.meta.author}\n> Generado el ${new Date().toLocaleDateString('es-PE')}\n\n`;
  }

  const MD = {
    panorama: () => mdHeader('Panorama del sistema')
      + `## Tesis\n\n${D.meta.thesis}\n\n## Los cinco ejes\n\n`
      + D.axes.map(a => `### Eje ${a.number} — ${a.label}\n_${a.long}_\n\n${a.role}\n\n- **Entradas:** ${a.inputs.join(', ')}\n- **Procesos:** ${a.processes.join(', ')}\n- **Salidas:** ${a.outputs.join(', ')}\n- **Pregunta guía:** ${a.question}\n`).join('\n')
      + `\n## El ciclo\n\n` + D.cycle.map(c => `### Fase ${c.n} — ${c.name}\n**${c.short}**\n\n${c.body}\n\n_Señal:_ ${c.signal}\n`).join('\n')
      + `\n## Advertencia metodológica\n\n${D.meta.disclaimer}\n`,

    sistema: () => mdHeader('Lente Sistema')
      + `## Relaciones entre ejes\n\n| Origen | Destino | Polaridad | Lazo | Descripción |\n|---|---|---|---|---|\n`
      + D.axisRelations.map(r => `| ${axisById[r.source].label} | ${axisById[r.target].label} | ${r.polarity} | ${r.loop} | ${r.label} |`).join('\n')
      + `\n\n## Cómo leer el grafo\n\nUna arista **+** empuja en la misma dirección; una arista **−**, en dirección contraria. Un circuito con número par de **−** es un lazo reforzador (se alimenta solo); con número impar, balanceador (corrige).\n\nLa asimetría estructural del sistema es que los reforzadores se cierran solos mientras los balanceadores requieren decisión sostenida. Un sistema con reforzadores automáticos y balanceadores voluntarios tiende, por defecto, a acumular tensión.\n`,

    circulacion: () => mdHeader('Lente Circulación')
      + `## Qué circula\n\n` + D.flows.map(f => `### ${f.label}\n- **Velocidad:** ${f.speed}\n- **Unidad:** ${f.unit}\n- **Recorrido:** ${f.path.map(id => axisById[id].label).join(' → ')}\n\n${f.desc}\n\n_Ancla empírica:_ ${f.anchor}\n`).join('\n')
      + `\n## La regla de circulación\n\nDonde un flujo entra más rápido de lo que el stock receptor puede absorber, el excedente no desaparece: se convierte en tensión almacenada en otro eje.\n\nEl mercado alimentario entra más rápido de lo que la regulación absorbe y el excedente se almacena en el cuerpo como doble carga. La migración entra más rápido de lo que el saneamiento absorbe y se almacena como informalidad. La renta pública entra más rápido de lo que el control patrimonial absorbe y se almacena como captura. Es el mismo mecanismo, tres veces.\n`,

    causal: () => mdHeader('Lente Causal')
      + `## Variables (${D.variables.length})\n\n| Variable | Eje | Tipo | Tendencia | Descripción |\n|---|---|---|---|---|\n`
      + D.variables.map(v => `| ${v.label} | ${axisById[v.axis].label} | ${v.kind} | ${v.trend} | ${v.desc} |`).join('\n')
      + `\n\n## Relaciones causales (${D.causal.length})\n\n| Origen | Destino | Polaridad | Retardo | Nivel | Evidencia |\n|---|---|---|---|---|---|\n`
      + D.causal.map(r => `| ${varById[r.s]?.label} | ${varById[r.t]?.label} | ${r.p} | ${r.delay} | ${r.level} | ${r.ev.map(e => srcById[e]?.inst || e).join(', ')} |`).join('\n') + '\n',

    nutricion: () => {
      const N = D.nutrition;
      return mdHeader(N.title)
        + `_${N.kicker}_\n\n${N.lead}\n\n## Indicadores\n\n`
        + D.indicators.filter(i => i.axis === 'nutricion').map(i => `- **${nf(i.value)}${i.unit}** — ${i.label} (${i.year}, ${srcById[i.src]?.inst}). ${i.note}`).join('\n')
        + `\n\n## ${N.circuit.title}\n\n` + N.circuit.steps.map(s => `${s.n}. **${s.t}** — ${s.d}`).join('\n')
        + `\n\n## Lectura empírica\n\n` + N.empirical.map(b => `### ${b.h}\n\n${b.p}\n\n_Fuentes: ${b.src.map(s => srcById[s]?.inst).join(', ')}_\n`).join('\n')
        + `\n## ${N.interpretive.title}\n\n> ${N.interpretive.warning}\n\n` + N.interpretive.body.map(p => p).join('\n\n')
        + `\n\n## Tensiones de diseño\n\n` + N.tensions.map(t => `- **${t.a} vs ${t.b}:** ${t.t}`).join('\n') + '\n';
    },

    corrupcion: () => {
      const C = D.corruption;
      return mdHeader(C.title)
        + `_${C.kicker}_\n\n${C.lead}\n\n> ${C.note}\n\n## Tres marcos\n\n`
        + C.lenses.map(l => `### ${l.author} — _${l.work}_\n\n**Tesis:** ${l.thesis}\n\n` + l.keys.map(k => `- ${k}`).join('\n') + `\n\n_Nivel: ${l.level}._ ${l.estimate}\n`).join('\n')
        + `\n## ${C.loop.title}\n\n${C.loop.desc}\n\n**Nodos:**\n\n` + C.loop.nodes.map(n => `- **${n.label}** — ${n.d}`).join('\n')
        + `\n\n**Aristas:**\n\n| Origen | Destino | Polaridad | Lazo |\n|---|---|---|---|\n`
        + C.loop.edges.map(e => { const nm = id => C.loop.nodes.find(x => x.id === id)?.label || id; return `| ${nm(e.s)} | ${nm(e.t)} | ${e.p} | ${e.loop} |`; }).join('\n')
        + `\n\n## ${C.linkage.title}\n\n` + C.linkage.body.join('\n\n')
        + `\n\n## ${C.interpretive.title}\n\n> ${C.interpretive.warning}\n\n` + C.interpretive.body.join('\n\n') + '\n';
    },

    territorio: () => mdHeader('Lente Territorio')
      + D.territory.regions.map(r => `## ${r.label}\n\n${r.note}\n\n| Variable | Valor |\n|---|---|\n` + r.rows.map(row => `| ${row[0]} | ${nf(row[1])}${row[2]} |`).join('\n') + '\n').join('\n')
      + `\n## Lectura\n\n` + D.territory.reading.join('\n\n') + '\n',

    identidad: () => mdHeader('Lente Identidad')
      + `${D.identity.lead}\n\n## Indicadores\n\n`
      + D.indicators.filter(i => i.axis === 'identidad').map(i => `- **${nf(i.value)}${i.unit === 'personas' ? ' personas' : i.unit}** — ${i.label} (${i.year}, ${srcById[i.src]?.inst}). ${i.note}`).join('\n')
      + `\n\n## Lectura empírica\n\n` + D.identity.blocks.map(b => `### ${b.h}\n\n${b.p}\n\n_Fuentes: ${b.src.map(s => srcById[s]?.inst).join(', ')}_\n`).join('\n'),

    historia: () => mdHeader('Lente Historia')
      + `| Año | Hito | Eje | Fuente | Nota |\n|---|---|---|---|---|\n`
      + D.history.map(h => `| ${h.year} | ${h.title} | ${axisById[h.axis].label} | ${srcById[h.src]?.inst || h.src} | ${h.note} |`).join('\n') + '\n',

    simulador: () => {
      const series = S.lastSeries || Sim.run(S.params, { periods: D.simulation.periods });
      const sum = Sim.summary(series);
      let md = mdHeader('Laboratorio de escenarios')
        + `> ${D.simulation.disclaimer}\n\n## Parámetros del escenario\n\n`
        + D.simulation.params.map(p => `- **${p.label}:** ${S.params[p.id]}`).join('\n')
        + `\n\nSemilla: ${S.seed}\n\n## Resultado\n\n**${sum.level} — ${sum.tension}/100.** Tensión dominante: ${sum.dominant}.\n\n| Indicador | Valor final |\n|---|---|\n`
        + D.simulation.outputs.map(o => `| ${o.label} | ${sum.values[o.id]} |`).join('\n');
      if (S.mc) {
        md += `\n\n## Monte Carlo (${S.mc.n} escenarios)\n\nMedia de tensión final: ${S.mc.mean.toFixed(1)} (mín ${S.mc.min.toFixed(1)}, máx ${S.mc.max.toFixed(1)}).\n\n| Parámetro | Correlación con la tensión final |\n|---|---|\n`
          + S.mc.sensitivity.map(s => `| ${s.label} | ${s.r > 0 ? '+' : ''}${s.r.toFixed(3)} |`).join('\n') + '\n';
      }
      return md + '\n';
    },

    evidencia: () => mdHeader('Arquitectura de evidencia')
      + `| Institución | Fuente | Categoría | Rol | Uso |\n|---|---|---|---|---|\n`
      + D.sources.map(s => `| ${s.inst} | ${s.name} | ${s.cat} | ${s.role} | ${s.use} |`).join('\n')
      + `\n\n## Glosario\n\n` + D.glossary.map(g => `- **${g.t}:** ${g.d}`).join('\n') + '\n'
  };

  function dossier() {
    const order = ['panorama', 'sistema', 'circulacion', 'causal', 'nutricion', 'corrupcion', 'territorio', 'identidad', 'historia', 'simulador', 'evidencia'];
    let out = `# ${D.meta.title} — V${D.meta.version} «${D.meta.codename}»\n\n**${D.meta.subtitle}**\n\n${D.meta.author}\n\nGenerado el ${new Date().toLocaleDateString('es-PE')}\n\n---\n\n`;
    out += `## Índice\n\n` + order.map((id, i) => `${i + 1}. ${lensById[id].label}`).join('\n') + '\n\n---\n\n';
    order.forEach(id => {
      out += MD[id]().replace(/^> Explorador[\s\S]*?\n\n/m, '') + '\n\n---\n\n';
    });
    out += `## Licencia\n\n${D.meta.license}\n`;
    return out;
  }

  function csvIndicators() {
    const head = 'id,eje,indicador,valor,unidad,anio,fuente,nota';
    const rows = D.indicators.map(i =>
      [i.id, axisById[i.axis].label, i.label, i.value, i.unit, i.year, srcById[i.src]?.inst || i.src, i.note]
        .map(x => `"${String(x).replace(/"/g, '""')}"`).join(','));
    return [head, ...rows].join('\n');
  }

  function csvCausal() {
    const head = 'origen,destino,polaridad,retardo,nivel,evidencia';
    const rows = D.causal.map(r =>
      [varById[r.s]?.label, varById[r.t]?.label, r.p, r.delay, r.level, r.ev.map(e => srcById[e]?.inst || e).join(' | ')]
        .map(x => `"${String(x).replace(/"/g, '""')}"`).join(','));
    return [head, ...rows].join('\n');
  }

  /* ========================================================== MENÚ DESCARGA */
  function buildMenu() {
    const menu = $('#dlMenu');
    const cur = lensById[S.lens];
    menu.innerHTML = `
      <div class="dd-head"><span class="eyebrow">TEXTOS</span></div>
      <button data-dl="chapter">Capítulo actual — ${esc(cur.label)}<small>Markdown con textos, tablas y fuentes</small></button>
      <button data-dl="dossier">Dossier completo<small>Los once capítulos en un solo archivo</small></button>
      <div class="dd-sep"></div>
      <div class="dd-head"><span class="eyebrow">DATOS</span></div>
      <button data-dl="model">Modelo completo (JSON)<small>Ejes, variables, relaciones, fuentes</small></button>
      <button data-dl="ind">Indicadores (CSV)<small>${D.indicators.length} cifras con fuente y año</small></button>
      <button data-dl="cau">Relaciones causales (CSV)<small>${D.causal.length} relaciones con nivel de evidencia</small></button>
      <button data-dl="sim">Serie del simulador (CSV)<small>Escenario activo, ${D.simulation.periods} periodos</small></button>
      <div class="dd-sep"></div>
      <button data-dl="print">${'Imprimir o guardar como PDF'}<small>Usa el diálogo de impresión del navegador</small></button>`;

    menu.onclick = e => {
      const b = e.target.closest('[data-dl]');
      if (!b) return;
      const k = b.dataset.dl;
      const stamp = new Date().toISOString().slice(0, 10);
      if (k === 'chapter') download(`explorador-v3-${S.lens}-${stamp}.md`, MD[S.lens]());
      if (k === 'dossier') download(`explorador-v3-dossier-${stamp}.md`, dossier());
      if (k === 'model')   download(`explorador-v3-modelo-${stamp}.json`, JSON.stringify(D, null, 2), 'application/json');
      if (k === 'ind')     download(`explorador-v3-indicadores-${stamp}.csv`, csvIndicators(), 'text/csv;charset=utf-8');
      if (k === 'cau')     download(`explorador-v3-relaciones-${stamp}.csv`, csvCausal(), 'text/csv;charset=utf-8');
      if (k === 'sim') {
        const series = S.lastSeries || Sim.run(S.params, { periods: D.simulation.periods });
        download(`explorador-v3-simulacion-${stamp}.csv`, Sim.toCSV(series, S.params, { seed: S.seed }), 'text/csv;charset=utf-8');
      }
      if (k === 'print') window.print();
      menu.classList.add('hidden');
      $('#dlBtn').setAttribute('aria-expanded', 'false');
    };
  }

  /* =============================================================== RENDER */
  function buildRail() {
    const rail = $('#rail');
    const sp = rail.querySelector('.rail-sp');
    LENSES.forEach(l => {
      const b = document.createElement('button');
      b.className = 'railbtn' + (l.id === S.lens ? ' active' : '');
      b.style.setProperty('--acc', l.acc);
      b.dataset.lens = l.id;
      b.innerHTML = `${ico(l.icon)}<span>${esc(l.label)}</span>`;
      b.onclick = () => go(l.id);
      rail.insertBefore(b, sp);
    });
  }

  function go(lens, push = true) {
    if (!CH[lens]) lens = 'panorama';
    S.lens = lens;
    stopAnim();
    if (S.cy) { try { S.cy.destroy(); } catch (e) {} S.cy = null; }

    $$('.railbtn').forEach(b => b.classList.toggle('active', b.dataset.lens === lens));
    $('#stage').innerHTML = CH[lens]();
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    if (push) history.replaceState(null, '', '#' + lens);
    buildMenu();
    bindChapter();
  }

  function bindChapter() {
    /* filtros de eje + búsqueda */
    $$('[data-axis]').forEach(b => b.onclick = () => {
      const id = b.dataset.axis;
      if (S.axes.has(id)) { if (S.axes.size > 1) S.axes.delete(id); } else S.axes.add(id);
      b.classList.toggle('on', S.axes.has(id));
      mountGraph(S.lens);
    });
    const sb = $('#gSearch');
    if (sb) sb.oninput = e => { S.query = e.target.value; applyQuery(); };

    /* controles del grafo */
    const bind = (sel, fn) => { const el = $(sel); if (el) el.onclick = fn; };
    bind('#gFit', () => S.cy && S.cy.fit(undefined, 70));
    bind('#gCenter', () => { if (S.cy) { S.cy.center(); S.cy.zoom(0.85); } });
    bind('#gAnim', e => {
      S.animate = !S.animate;
      $('#gAnim').classList.toggle('on', S.animate);
      S.animate ? startAnim() : (stopAnim(), S.cy && S.cy.edges().removeClass('flowing'));
    });
    bind('#gForce', () => {
      S.forceLayout = !S.forceLayout;
      $('#gForce').classList.toggle('on', S.forceLayout);
      toast(S.forceLayout ? 'Distribución por fuerza' : 'Distribución determinista');
      mountGraph(S.lens);
    });

    /* montaje por capítulo */
    if (S.lens === 'sistema' || S.lens === 'causal' || S.lens === 'corrupcion') mountGraph(S.lens);

    if (S.lens === 'circulacion') {
      $$('[data-flow]').forEach(b => b.onclick = () => {
        S.flow = b.dataset.flow;
        go('circulacion', false);
      });
    }

    if (S.lens === 'territorio') {
      requestAnimationFrame(() => $$('.bar-f').forEach(el => el.style.width = el.dataset.w + '%'));
    }

    if (S.lens === 'simulador') {
      $$('[data-param]').forEach(inp => {
        inp.oninput = () => {
          S.params[inp.dataset.param] = Number(inp.value);
          $('#o_' + inp.dataset.param).textContent = inp.value;
        };
        inp.onchange = () => renderSim();
      });
      $$('[data-preset]').forEach(b => b.onclick = () => {
        const p = D.simulation.presets.find(x => x.id === b.dataset.preset);
        if (!p) return;
        S.preset = p.id;
        S.params = { ...p.v };
        $$('.pchip').forEach(x => x.classList.toggle('on', x === b));
        syncSliders();
        renderSim();
      });
      const seed = $('#seed');
      if (seed) seed.onchange = () => { S.seed = Number(seed.value) || 1; };
      $('#btnRun').onclick = () => { renderSim(); toast('Escenario ejecutado'); };
      $('#btnRandom').onclick = () => {
        S.seed = Math.floor(Math.random() * 9e8) + 1;
        $('#seed').value = S.seed;
        S.params = Sim.randomScenario(S.seed);
        S.preset = null;
        $$('.pchip').forEach(x => x.classList.remove('on'));
        syncSliders();
        renderSim();
        toast('Escenario aleatorio válido · semilla ' + S.seed);
      };
      $('#btnMC').onclick = () => {
        const btn = $('#btnMC');
        btn.textContent = 'Calculando…';
        setTimeout(() => {
          S.mc = Sim.monteCarlo(240, S.seed, D.simulation.periods);
          renderSim('mc');
          btn.innerHTML = `${ico('shuffle')} Monte Carlo · 240 escenarios`;
          toast('240 escenarios evaluados');
        }, 30);
      };
      $('#btnCsv').onclick = () => {
        const series = S.lastSeries || Sim.run(S.params, { periods: D.simulation.periods });
        download(`explorador-v3-simulacion-${new Date().toISOString().slice(0, 10)}.csv`,
          Sim.toCSV(series, S.params, { seed: S.seed }), 'text/csv;charset=utf-8');
      };
      renderSim();
    }
  }

  /* ================================================================ INIT */
  function init() {
    /* tema */
    const saved = localStorage.getItem('v3-theme');
    if (saved === 'light') document.documentElement.classList.add('light');
    syncThemeIcon();

    $('#themeBtn').onclick = () => {
      document.documentElement.classList.toggle('light');
      localStorage.setItem('v3-theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
      syncThemeIcon();
      if (S.cy) { S.cy.style(cyStyle()); if (S.animate) startAnim(); }
    };

    /* menú de descarga */
    $('#dlBtn').onclick = e => {
      e.stopPropagation();
      const m = $('#dlMenu');
      m.classList.toggle('hidden');
      $('#dlBtn').setAttribute('aria-expanded', String(!m.classList.contains('hidden')));
    };
    document.addEventListener('click', e => {
      if (!e.target.closest('.dd')) {
        $('#dlMenu').classList.add('hidden');
        $('#dlBtn').setAttribute('aria-expanded', 'false');
      }
    });

    $('#footNote').innerHTML = esc(D.meta.disclaimer);

    buildRail();
    const hash = location.hash.replace('#', '');
    go(CH[hash] ? hash : 'panorama', false);

    window.addEventListener('hashchange', () => {
      const h = location.hash.replace('#', '');
      if (h && CH[h] && h !== S.lens) go(h, false);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAnim();
      else if (S.animate && S.cy) startAnim();
    });
  }

  function syncThemeIcon() {
    const light = document.documentElement.classList.contains('light');
    const use = $('#themeBtn use');
    if (use) use.setAttribute('href', light ? '#i-moon' : '#i-sun');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', light ? '#EDEAE3' : '#08080A');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
