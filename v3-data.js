/* =============================================================================
   EXPLORADOR SOCIO-TÉCNICO DEL PERÚ — V3 "CIRCULACIÓN"
   Base de conocimiento única. Todo el contenido analítico vive aquí.

   Estudio y modelo sistémico planteado por Pierre R.

   REGLA METODOLÓGICA DEL PROYECTO
   Cada afirmación lleva un nivel declarado:
     · "dato"        → cifra publicada por una fuente identificable
     · "documentada" → mecanismo sostenido por literatura especializada
     · "hipotesis"   → relación plausible del modelo, aún no verificada
     · "estimacion"  → cifra de autor que debe contrastarse con la edición original
     · "interpretacion" → lectura de sentido; explícitamente NO rigurosa
   La interfaz nunca mezcla estos niveles sin decirlo.
   ========================================================================== */

const V3 = {

  /* ---------------------------------------------------------------- META */
  meta: {
    version: '3.0',
    codename: 'Circulación',
    title: 'Explorador Socio-Técnico del Perú',
    subtitle: 'Cómo circula todo: territorio, mercado, cuerpo, poder e identidad',
    author: 'Estudio y modelo sistémico planteado por Pierre R.',
    updated: '2026',
    license: 'MIT — código. Contenido analítico bajo CC BY 4.0.',
    thesis: 'La sociedad peruana no se explica por una sola causa. Se explica por lo que circula entre sus partes: personas, dinero, alimentos, información, legitimidad. Cuando un flujo se acelera y otro se traba, aparece la tensión. Cuando la tensión se acumula sin corrección, aparece el ciclo.',
    disclaimer: 'Este explorador es un instrumento de análisis, no un sistema de pronóstico. Las cifras provienen de fuentes citadas; las relaciones causales y la simulación son construcciones del modelo. Ninguna salida numérica de la simulación describe una medición real del Perú.'
  },

  /* -------------------------------------------------------------- PALETA */
  palette: {
    azul:     '#2E6BE6',
    amarillo: '#F2C12E',
    naranja:  '#F0731A',
    rojo:     '#E63329',
    verde:    '#17A05C'
  },

  /* ----------------------------------------------------------------- EJES */
  axes: [
    {
      id: 'regional',
      number: '01',
      label: 'Regional',
      long: 'Territorio y entorno operativo',
      color: '#2E6BE6',
      colorName: 'azul',
      glyph: 'M3 18l6-9 4 6 3-4 5 7z',
      role: 'Costa, Sierra y Selva no son paisajes: son entornos operativos con distinta infraestructura, distinto costo de vivir y distinta velocidad de llegada del Estado, del mercado y de la escuela.',
      inputs: ['Geografía y altitud', 'Agua, saneamiento, electricidad', 'Inversión pública', 'Conectividad vial y digital'],
      processes: ['Concentración urbana', 'Migración interna', 'Adaptación productiva', 'Provisión diferencial de servicios'],
      outputs: ['Desigualdad territorial', 'Presión sobre servicios', 'Perfiles productivos regionales', 'Costo de acceso'],
      question: '¿Qué tan caro y lento resulta vivir, producir y ser atendido según dónde se está?'
    },
    {
      id: 'global',
      number: '02',
      label: 'Influencias globales',
      long: 'Acoplamiento con el mundo',
      color: '#F2C12E',
      colorName: 'amarillo',
      glyph: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 4 3 14 0 18M12 3c-3 4-3 14 0 18',
      role: 'El mundo no entra al Perú por una sola puerta. Entra por tres compuertas simultáneas: conectividad, mercado y norma técnica. Cada compuerta tiene su propia velocidad.',
      inputs: ['Cadenas globales de suministro', 'Plataformas digitales y publicidad', 'Capitales e inversión', 'Estándares y umbrales técnicos'],
      processes: ['Traducción selectiva de tendencias', 'Estandarización de consumo', 'Dependencia tecnológica', 'Reprogramación normativa'],
      outputs: ['Nuevos repertorios de consumo', 'Exposición externa', 'Aspiraciones de movilidad', 'Cambios en la forma de medir'],
      question: '¿Qué llega primero: el producto, la imagen o la regulación que lo limita?'
    },
    {
      id: 'social',
      number: '03',
      label: 'Accionar social e institucional',
      long: 'Informalidad, redes y poder',
      color: '#F0731A',
      colorName: 'naranja',
      glyph: 'M7 20a4 4 0 118 0M12 4a4 4 0 110 8 4 4 0 010-8M3 20a3 3 0 015-2M21 20a3 3 0 00-5-2',
      role: 'Cuando la institución formal no cubre, la sociedad no se detiene: se reorganiza. Informalidad, redes familiares y arreglos territoriales son la infraestructura real de coordinación — y también el terreno donde se instalan el patronazgo y la captura.',
      inputs: ['Agravios y desprotección', 'Redes familiares y barriales', 'Recursos organizativos', 'Presión de intereses privados'],
      processes: ['Supervivencia informal', 'Movilización y conflicto', 'Negociación y captura', 'Intermediación política'],
      outputs: ['Empleo informal', 'Conflictividad', 'Reglas capturadas o corregidas', 'Confianza institucional'],
      question: '¿Quién coordina realmente la vida cotidiana cuando el Estado llega tarde?'
    },
    {
      id: 'nutricion',
      number: '04',
      label: 'Nutrición globalizada',
      long: 'El cuerpo como sensor del sistema',
      color: '#E63329',
      colorName: 'rojo',
      glyph: 'M7 3v8a3 3 0 006 0V3M10 11v10M17 3c-1.5 2-2 4-2 6s.5 3 2 3v9',
      role: 'Este es el eje donde el sistema se vuelve medible en el cuerpo. Anemia, desnutrición crónica y obesidad conviviendo en el mismo país no son tres problemas: son la lectura de un mismo circuito que falla en distintos puntos.',
      inputs: ['Cadenas de ultraprocesados', 'Sistemas alimentarios locales', 'Precio y tiempo de cuidado', 'Marketing y regulación'],
      processes: ['Transición nutricional', 'Estandarización de dietas', 'Pérdida de diversidad', 'Compensación calórica barata'],
      outputs: ['Doble carga nutricional', 'Anemia y desnutrición crónica', 'Obesidad y riesgo cardiometabólico', 'Marca país gastronómica'],
      question: '¿Por qué el mismo país exporta identidad culinaria y acumula déficit y exceso al mismo tiempo?'
    },
    {
      id: 'identidad',
      number: '05',
      label: 'Identidad',
      long: 'El "yo" en intersección',
      color: '#17A05C',
      colorName: 'verde',
      glyph: 'M12 3c-4 3-5 7-5 10a5 5 0 0010 0c0-3-1-7-5-10zM12 13v8',
      role: 'La identidad no es el adorno cultural del sistema: es una condición de acceso. Lengua, origen y color median el acceso a servicios, a empleo y a trato. Y a la vez, es el único eje que puede convertir presión externa en recombinación creativa.',
      inputs: ['Lengua y origen', 'Migración y trayectoria', 'Medios y plataformas', 'Trato recibido y discriminación'],
      processes: ['Hibridación cultural', 'Renegociación de fronteras', 'Estrategias de afrontamiento', 'Reconocimiento y disputa'],
      outputs: ['Identidades híbridas', 'Acceso diferencial', 'Cohesión o fragmentación', 'Patrimonio vivo'],
      question: '¿La identidad protege del estrés del sistema o es también el lugar donde el sistema cobra?'
    }
  ],

  /* ------------------------------------------------------- CICLO (EJE 06) */
  cycle: [
    {
      id: 'expansion', n: '01', name: 'Expansión', color: '#F2C12E',
      short: 'Entra más de todo: mercado, conectividad, migración, norma.',
      body: 'El sistema absorbe. Crece la integración con cadenas globales, sube el uso de internet, la migración interna redistribuye población y demanda. En esta fase todos los indicadores de acceso mejoran y la sensación dominante es de progreso. La expansión no es un error del sistema: es su modo normal de crecimiento.',
      signal: 'Los indicadores de acceso suben más rápido que los de capacidad.'
    },
    {
      id: 'saturacion', n: '02', name: 'Saturación', color: '#F0731A',
      short: 'La capacidad de absorber deja de crecer al ritmo de lo que entra.',
      body: 'Servicios, cuerpos, instituciones y territorios reciben más presión que ajuste posible. Aparecen los cuellos de botella: agua que no llega, aulas llenas, tiempo de cuidado que se acorta, expedientes que no se resuelven. La saturación casi nunca se ve como crisis; se ve como "así funciona".',
      signal: 'La brecha entre demanda y capacidad se vuelve estructural, no coyuntural.'
    },
    {
      id: 'crisis', n: '03', name: 'Crisis', color: '#E63329',
      short: 'El umbral se cruza y el sistema lo registra en indicadores duros.',
      body: 'Conflictividad, desaprobación institucional, doble carga nutricional, ruptura ecológica, escándalo. La crisis es el momento en que la tensión acumulada se vuelve visible y nombrable. Es también el único momento en que el sistema acepta discutir su propio diseño.',
      signal: 'Los indicadores de confianza caen mientras los de tensión suben simultáneamente.'
    },
    {
      id: 'reconfiguracion', n: '04', name: 'Reconfiguración', color: '#17A05C',
      short: 'El sistema no vuelve al inicio: fija un nuevo piso.',
      body: 'Emergen regulaciones, redes comunitarias, hibridaciones y arreglos nuevos. Octógonos, ollas comunes, rondas, federaciones, controles patrimoniales. La reconfiguración estabiliza — pero estabiliza sobre un piso distinto, que la siguiente expansión tomará como punto de partida. Ese desplazamiento del piso es la razón por la que el ciclo no es un círculo, sino una espiral.',
      signal: 'Aparece una norma o una red nueva que se vuelve permanente.'
    }
  ],

  /* --------------------------------------------------------- CIRCULACIÓN */
  /* Qué circula por el sistema. Es el corazón de la V3. */
  flows: [
    {
      id: 'personas', label: 'Personas', color: '#2E6BE6', speed: 'lenta', unit: 'movilidad',
      desc: 'Migración interna, urbanización, movilidad diaria. El flujo más lento y el más irreversible: reconfigura demanda, redes y cuerpos a la vez.',
      path: ['regional', 'social', 'nutricion', 'identidad'],
      anchor: 'El Censo 2017 registró que 20,3% de la población residía en un departamento distinto al de nacimiento (INEI).'
    },
    {
      id: 'dinero', label: 'Dinero y mercado', color: '#F2C12E', speed: 'rápida', unit: 'intercambio',
      desc: 'Precios, ingresos, inversión, cadenas de suministro y también flujos ilícitos. Es el flujo que más rápido cambia de dirección y el que menos rastro deja cuando se oculta.',
      path: ['global', 'regional', 'social', 'nutricion'],
      anchor: 'En 2024 el sector informal reunió 6 millones 91 mil unidades productivas y aportó 19,0% del PBI (INEI).'
    },
    {
      id: 'alimentos', label: 'Alimentos', color: '#E63329', speed: 'media', unit: 'energía',
      desc: 'Disponibilidad, precio relativo, densidad energética y prestigio simbólico. Circula desde el mercado global hasta la mesa y termina inscrito en el cuerpo.',
      path: ['global', 'nutricion', 'identidad', 'regional'],
      anchor: 'Perú fue uno de los mercados con crecimiento más rápido en ventas per cápita de ultraprocesados: +107% entre 2000 y 2013 (OPS, 2015).'
    },
    {
      id: 'informacion', label: 'Información', color: '#F0731A', speed: 'inmediata', unit: 'señal',
      desc: 'Plataformas, publicidad, comparación social, aspiración y también la información que el Estado no produce. El flujo más veloz y el más desigual por territorio.',
      path: ['global', 'identidad', 'social', 'nutricion'],
      anchor: 'En el 4T 2024, 80,1% de la población de 6+ años usó internet; 88,2% en Lima Metropolitana frente a 56,7% en el área rural (INEI).'
    },
    {
      id: 'legitimidad', label: 'Legitimidad', color: '#17A05C', speed: 'acumulativa', unit: 'confianza',
      desc: 'Es un stock, no un flujo instantáneo: se acumula durante años y se descarga en meses. Cuando cae, la coordinación social migra hacia arreglos privados, familiares o territoriales.',
      path: ['social', 'regional', 'identidad', 'global'],
      anchor: 'Entre enero y junio de 2024, 11,3% calificó la gestión del gobierno central como buena o muy buena y 81,3% como mala o muy mala (INEI).'
    }
  ],

  /* ------------------------------------------------------------ VARIABLES */
  variables: [
    { id: 'presion_urbana',      axis: 'regional',  label: 'Presión urbana',              kind: 'stock', trend: '↑', desc: 'Presión acumulada sobre vivienda, agua, saneamiento, transporte y gobernanza territorial.', evidence: ['inei_censos','inei_servicios'] },
    { id: 'migracion',           axis: 'regional',  label: 'Movilidad interna',           kind: 'flujo', trend: '↔', desc: 'Redistribución territorial de población, demanda, redes y expectativas.', evidence: ['inei_censos','matos_mar'] },
    { id: 'capacidad_estatal',   axis: 'regional',  label: 'Capacidad estatal y servicios', kind: 'stock', trend: '↔', desc: 'Capacidad efectiva de proveer, regular, fiscalizar y responder en territorio.', evidence: ['inei_servicios','crabtree_durand'] },
    { id: 'brecha_territorial',  axis: 'regional',  label: 'Brecha territorial',          kind: 'stock', trend: '↔', desc: 'Diferencia sostenida de acceso a servicios, ingreso y oportunidad entre Costa, Sierra y Selva.', evidence: ['inei_pobreza','inei_servicios','bm_peru'] },

    { id: 'mercado_global',      axis: 'global',    label: 'Penetración de mercados',     kind: 'flujo', trend: '↑', desc: 'Intensidad de integración a cadenas, capitales y patrones globales de consumo.', evidence: ['fao','ops_upf'] },
    { id: 'conectividad',        axis: 'global',    label: 'Conectividad digital',        kind: 'stock', trend: '↑', desc: 'Acceso acumulado a redes, plataformas y circulación de información y publicidad.', evidence: ['inei_internet','gsma'] },
    { id: 'norma_tecnica',       axis: 'global',    label: 'Norma técnica importada',     kind: 'flujo', trend: '↑', desc: 'Umbrales, estándares y criterios de medición que reprograman lo que cuenta como problema.', evidence: ['ley_30021','endes'] },
    { id: 'flujos_ilicitos',     axis: 'global',    label: 'Flujos ilícitos',             kind: 'flujo', trend: '↔', desc: 'Circulación, ocultamiento e integración de activos de origen ilícito en redes económicas legales.', evidence: ['buscaglia'] },

    { id: 'informalidad',        axis: 'social',    label: 'Informalidad',                kind: 'stock', trend: '↑', desc: 'Peso de arreglos económicos y sociales fuera del formato institucional pleno.', evidence: ['inei_informalidad','matos_mar'] },
    { id: 'redes_comunitarias',  axis: 'social',    label: 'Redes comunitarias',          kind: 'stock', trend: '↔', desc: 'Capacidad de organización, apoyo mutuo y provisión no estatal: comedores, ollas, rondas, federaciones.', evidence: ['renamu','aidesep','matos_mar'] },
    { id: 'conflictividad',      axis: 'social',    label: 'Conflictividad social',       kind: 'flujo', trend: '↔', desc: 'Manifestación observable de tensiones distributivas, territoriales y políticas.', evidence: ['crabtree_durand','bm_peru'] },
    { id: 'corrupcion',          axis: 'social',    label: 'Corrupción sistémica',        kind: 'stock', trend: '↔', desc: 'Persistencia de patronazgo, impunidad y desvío con efectos acumulativos sobre instituciones y desarrollo.', evidence: ['quiroz','crabtree_durand'] },
    { id: 'captura',             axis: 'social',    label: 'Captura política',            kind: 'stock', trend: '↔', desc: 'Concentración de influencia privada sobre decisiones, reglas y designaciones públicas.', evidence: ['crabtree_durand','quiroz'] },
    { id: 'integridad',          axis: 'social',    label: 'Integridad y controles',      kind: 'stock', trend: '↔', desc: 'Prevención, fiscalización, investigación patrimonial-financiera y rendición de cuentas efectiva.', evidence: ['buscaglia','quiroz'] },
    { id: 'confianza',           axis: 'social',    label: 'Confianza institucional',     kind: 'stock', trend: '↓', desc: 'Legitimidad acumulada; funciona como capital que permite coordinar sin coerción.', evidence: ['inei_gobernabilidad','crabtree_durand'] },
    { id: 'estres_social',       axis: 'social',    label: 'Estrés social acumulado',     kind: 'stock', trend: '↑', desc: 'Carga biopsicosocial de desigualdad, baja agencia, inseguridad y aislamiento.', evidence: ['mate','bm_peru'] },

    { id: 'upf',                 axis: 'nutricion', label: 'Exposición a ultraprocesados', kind: 'flujo', trend: '↑', desc: 'Exposición relativa a productos ultraprocesados y entornos alimentarios industrializados.', evidence: ['ops_upf','upf_ninos'] },
    { id: 'doble_carga',         axis: 'nutricion', label: 'Doble carga nutricional',     kind: 'stock', trend: '↑', desc: 'Coexistencia de déficit (anemia, desnutrición crónica) y exceso (sobrepeso, obesidad) en la misma población.', evidence: ['endes','minsa_obesidad'] },
    { id: 'diversidad_alim',     axis: 'nutricion', label: 'Diversidad alimentaria',      kind: 'stock', trend: '↓', desc: 'Diversidad efectiva de la dieta y continuidad de sistemas alimentarios locales.', evidence: ['fao','awajun'] },
    { id: 'tiempo_cuidado',      axis: 'nutricion', label: 'Tiempo de cuidado',           kind: 'stock', trend: '↓', desc: 'Horas efectivamente disponibles para comprar, cocinar y alimentar; variable puente entre economía y cuerpo.', evidence: ['inei_informalidad','mate'] },

    { id: 'lengua',              axis: 'identidad', label: 'Continuidad lingüística',     kind: 'stock', trend: '↔', desc: 'Persistencia y transmisión intergeneracional de lenguas indígenas u originarias.', evidence: ['mincul_lenguas','inei_censos'] },
    { id: 'resiliencia_cultural',axis: 'identidad', label: 'Resiliencia cultural',        kind: 'stock', trend: '↔', desc: 'Capacidad de sostener, adaptar y recombinar prácticas culturales bajo presión externa.', evidence: ['garcia_canclini','unesco_ceviche','mincul_lenguas'] },
    { id: 'discriminacion',      axis: 'identidad', label: 'Discriminación percibida',    kind: 'flujo', trend: '↑', desc: 'Experiencia de exclusión asociada a origen, lengua, rasgos o pertenencia.', evidence: ['bm_peru','quijano'] },
    { id: 'acceso_diferencial',  axis: 'identidad', label: 'Acceso diferencial',          kind: 'stock', trend: '↔', desc: 'Grado en que la identidad opera como condición de acceso a servicios, empleo e ingreso.', evidence: ['inei_pobreza','bm_peru'] }
  ],

  /* -------------------------------------------------- RELACIONES DE EJES */
  axisRelations: [
    { source: 'global',    target: 'regional',  polarity: '+', loop: 'R1', label: 'Integración → concentración territorial' },
    { source: 'regional',  target: 'social',    polarity: '+', loop: 'R1', label: 'Presión → adaptación informal' },
    { source: 'social',    target: 'identidad', polarity: '+', loop: 'R2', label: 'Redes → reconfiguración del "nosotros"' },
    { source: 'identidad', target: 'social',    polarity: '+', loop: 'R2', label: 'Pertenencia → capacidad de organizarse' },
    { source: 'global',    target: 'nutricion', polarity: '+', loop: 'R3', label: 'Mercado → transición alimentaria' },
    { source: 'nutricion', target: 'identidad', polarity: '-', loop: 'B1', label: 'Estandarización ↔ tradición alimentaria' },
    { source: 'identidad', target: 'nutricion', polarity: '+', loop: 'B1', label: 'Patrimonio vivo → defensa de la dieta local' },
    { source: 'global',    target: 'social',    polarity: '+', loop: 'R4', label: 'Capitales → poder e instituciones' },
    { source: 'regional',  target: 'nutricion', polarity: '+', loop: 'R3', label: 'Urbanización → cambio de dieta' },
    { source: 'social',    target: 'regional',  polarity: '-', loop: 'B2', label: 'Control y organización → corrección territorial' }
  ],

  /* ------------------------------------------------- RELACIONES CAUSALES */
  causal: [
    { s: 'migracion',      t: 'presion_urbana',    p: '+', delay: 'corto',  level: 'documentada', ev: ['inei_censos'] },
    { s: 'capacidad_estatal', t: 'presion_urbana', p: '-', delay: 'medio',  level: 'documentada', ev: ['inei_servicios'] },
    { s: 'presion_urbana', t: 'informalidad',      p: '+', delay: 'medio',  level: 'hipotesis',   ev: ['inei_informalidad','matos_mar'] },
    { s: 'brecha_territorial', t: 'migracion',     p: '+', delay: 'largo',  level: 'documentada', ev: ['inei_pobreza','bm_peru'] },
    { s: 'capacidad_estatal', t: 'brecha_territorial', p: '-', delay: 'largo', level: 'documentada', ev: ['inei_servicios'] },

    { s: 'conectividad',   t: 'mercado_global',    p: '+', delay: 'corto',  level: 'hipotesis',   ev: ['inei_internet','gsma'] },
    { s: 'mercado_global', t: 'upf',               p: '+', delay: 'corto',  level: 'documentada', ev: ['ops_upf','fao'] },
    { s: 'conectividad',   t: 'upf',               p: '+', delay: 'corto',  level: 'hipotesis',   ev: ['inei_internet','ops_upf'] },
    { s: 'norma_tecnica',  t: 'upf',               p: '-', delay: 'medio',  level: 'hipotesis',   ev: ['ley_30021'] },
    { s: 'upf',            t: 'doble_carga',       p: '+', delay: 'largo',  level: 'hipotesis',   ev: ['upf_ninos','minsa_obesidad'] },
    { s: 'diversidad_alim',t: 'doble_carga',       p: '-', delay: 'largo',  level: 'hipotesis',   ev: ['awajun','endes'] },
    { s: 'mercado_global', t: 'diversidad_alim',   p: '-', delay: 'largo',  level: 'hipotesis',   ev: ['fao','ops_upf'] },
    { s: 'presion_urbana', t: 'tiempo_cuidado',    p: '-', delay: 'medio',  level: 'hipotesis',   ev: ['inei_informalidad'] },
    { s: 'informalidad',   t: 'tiempo_cuidado',    p: '-', delay: 'medio',  level: 'hipotesis',   ev: ['inei_informalidad','mate'] },
    { s: 'tiempo_cuidado', t: 'doble_carga',       p: '-', delay: 'medio',  level: 'hipotesis',   ev: ['endes','mate'] },
    { s: 'brecha_territorial', t: 'doble_carga',   p: '+', delay: 'largo',  level: 'documentada', ev: ['endes','inei_servicios'] },
    { s: 'migracion',      t: 'doble_carga',       p: '+', delay: 'largo',  level: 'documentada', ev: ['peru_migrant'] },

    { s: 'corrupcion',     t: 'captura',           p: '+', delay: 'medio',  level: 'documentada', ev: ['quiroz','crabtree_durand'] },
    { s: 'captura',        t: 'corrupcion',        p: '+', delay: 'medio',  level: 'documentada', ev: ['crabtree_durand'] },
    { s: 'captura',        t: 'confianza',         p: '-', delay: 'medio',  level: 'documentada', ev: ['crabtree_durand','inei_gobernabilidad'] },
    { s: 'integridad',     t: 'corrupcion',        p: '-', delay: 'medio',  level: 'documentada', ev: ['quiroz','buscaglia'] },
    { s: 'integridad',     t: 'flujos_ilicitos',   p: '-', delay: 'corto',  level: 'documentada', ev: ['buscaglia'] },
    { s: 'flujos_ilicitos',t: 'corrupcion',        p: '+', delay: 'corto',  level: 'documentada', ev: ['buscaglia'] },
    { s: 'informalidad',   t: 'flujos_ilicitos',   p: '+', delay: 'medio',  level: 'hipotesis',   ev: ['buscaglia'] },
    { s: 'captura',        t: 'capacidad_estatal', p: '-', delay: 'largo',  level: 'hipotesis',   ev: ['crabtree_durand'] },
    { s: 'corrupcion',     t: 'capacidad_estatal', p: '-', delay: 'largo',  level: 'documentada', ev: ['quiroz'] },
    { s: 'captura',        t: 'conflictividad',    p: '+', delay: 'medio',  level: 'hipotesis',   ev: ['crabtree_durand'] },
    { s: 'confianza',      t: 'estres_social',     p: '-', delay: 'medio',  level: 'hipotesis',   ev: ['mate','bm_peru'] },
    { s: 'confianza',      t: 'informalidad',      p: '-', delay: 'largo',  level: 'hipotesis',   ev: ['inei_informalidad'] },

    { s: 'redes_comunitarias', t: 'estres_social',      p: '-', delay: 'medio', level: 'hipotesis',   ev: ['mate','renamu'] },
    { s: 'redes_comunitarias', t: 'resiliencia_cultural', p: '+', delay: 'medio', level: 'documentada', ev: ['matos_mar','mincul_lenguas'] },
    { s: 'resiliencia_cultural', t: 'redes_comunitarias', p: '+', delay: 'medio', level: 'documentada', ev: ['mincul_lenguas'] },
    { s: 'estres_social',  t: 'doble_carga',       p: '+', delay: 'largo',  level: 'hipotesis',   ev: ['mate','endes'] },
    { s: 'estres_social',  t: 'resiliencia_cultural', p: '-', delay: 'medio', level: 'hipotesis', ev: ['mate','garcia_canclini'] },
    { s: 'presion_urbana', t: 'estres_social',     p: '+', delay: 'medio',  level: 'hipotesis',   ev: ['bm_peru','mate'] },

    { s: 'lengua',         t: 'resiliencia_cultural', p: '+', delay: 'medio', level: 'documentada', ev: ['mincul_lenguas'] },
    { s: 'mercado_global', t: 'resiliencia_cultural', p: '-', delay: 'largo', level: 'hipotesis',   ev: ['garcia_canclini','quijano'] },
    { s: 'discriminacion', t: 'conflictividad',    p: '+', delay: 'medio',  level: 'hipotesis',   ev: ['bm_peru','quijano'] },
    { s: 'discriminacion', t: 'acceso_diferencial',p: '+', delay: 'medio',  level: 'documentada', ev: ['bm_peru','inei_pobreza'] },
    { s: 'acceso_diferencial', t: 'brecha_territorial', p: '+', delay: 'largo', level: 'hipotesis', ev: ['inei_pobreza','bm_peru'] },
    { s: 'resiliencia_cultural', t: 'diversidad_alim', p: '+', delay: 'medio', level: 'hipotesis', ev: ['awajun','unesco_ceviche'] }
  ],

  /* ------------------------------------------------ INDICADORES (DATOS) */
  /* Cada uno con fuente. group = eje. Todos son "dato". */
  indicators: [
    { id:'i_urb',    axis:'regional', label:'Población urbana',                value:78.9,  unit:'%',  year:'2023', src:'inei_censos',        note:'Perú ya era 78,9% urbano en 2023.' },
    { id:'i_lima',   axis:'regional', label:'Lima Metropolitana',              value:30.2,  unit:'% del país', year:'2024', src:'inei_censos', note:'10,29 millones de personas, 30,2% de la población nacional.' },
    { id:'i_mov',    axis:'regional', label:'Reside fuera de su departamento de nacimiento', value:20.3, unit:'%', year:'2017', src:'inei_censos', note:'Censo 2017. Uno de cada cinco peruanos vive donde no nació.' },
    { id:'i_pob_s',  axis:'regional', label:'Pobreza monetaria — Sierra',      value:30.9,  unit:'%',  year:'2024', src:'inei_pobreza',       note:'Selva 30,0% · Costa 25,2%.' },
    { id:'i_pobx',   axis:'regional', label:'Pobreza extrema — Sierra',        value:9.9,   unit:'%',  year:'2024', src:'inei_pobreza',       note:'Selva 7,9% · Costa 2,6%. La brecha extrema es casi 4x.' },
    { id:'i_agua',   axis:'regional', label:'Agua por red pública — Selva',    value:83.7,  unit:'%',  year:'2024', src:'inei_servicios',     note:'Costa 92,0% · Sierra 90,3%.' },
    { id:'i_sane',   axis:'regional', label:'Saneamiento — Selva',             value:62.2,  unit:'%',  year:'2024', src:'inei_servicios',     note:'Costa 87,7% · Sierra 72,7%. Esta es la brecha material más dura del país.' },

    { id:'i_net',    axis:'global',   label:'Uso de internet (6+ años)',       value:80.1,  unit:'%',  year:'2024 T4', src:'inei_internet',   note:'Lima Metropolitana 88,2% · resto urbano 83,5% · rural 56,7%.' },
    { id:'i_net_r',  axis:'global',   label:'Uso de internet — área rural',    value:56.7,  unit:'%',  year:'2024 T4', src:'inei_internet',   note:'31,5 puntos por debajo de Lima Metropolitana.' },
    { id:'i_upf107', axis:'global',   label:'Crecimiento de ventas per cápita de ultraprocesados', value:107, unit:'%', year:'2000–2013', src:'ops_upf', note:'Perú, tercero de la región tras Uruguay (146%) y Bolivia (130%).' },
    { id:'i_movil',  axis:'global',   label:'Usuarios móviles únicos LATAM',   value:64,    unit:'% pobl.', year:'2024', src:'gsma',        note:'413 millones de usuarios; proyección de 496 millones a 2030.' },

    { id:'i_inf',    axis:'social',   label:'Empleo informal',                 value:70.9,  unit:'% ocupados', year:'2024', src:'inei_informalidad', note:'El sector informal reunió 6 091 000 unidades productivas.' },
    { id:'i_inf_pbi',axis:'social',   label:'Aporte del sector informal al PBI', value:19.0, unit:'%', year:'2024', src:'inei_informalidad', note:'70,9% del empleo produce 19,0% del PBI: la brecha de productividad del arreglo informal.' },
    { id:'i_apr',    axis:'social',   label:'Aprobación del gobierno central', value:11.3,  unit:'% buena/muy buena', year:'2024 I-VI', src:'inei_gobernabilidad', note:'81,3% la calificó como mala o muy mala.' },
    { id:'i_pob_urb',axis:'social',   label:'Pobreza que es urbana',           value:68.7,  unit:'% de los pobres', year:'2021', src:'bm_peru', note:'La pobreza peruana dejó de ser mayoritariamente rural.' },
    { id:'i_comed',  axis:'social',   label:'Comedores populares registrados', value:15140, unit:'organizaciones', year:'2018', src:'renamu', note:'764 618 beneficiarios. Lima 25,0% · Piura 8,4% · Cajamarca 7,7%.' },

    { id:'i_anemia', axis:'nutricion',label:'Anemia en niños de 6 a 35 meses', value:35.3,  unit:'%',  year:'2024', src:'endes',            note:'Rural 44,7% · urbana 31,2%. Directriz de cálculo actualizada en 2024.' },
    { id:'i_an_reg', axis:'nutricion',label:'Anemia — Selva',                  value:44.1,  unit:'%',  year:'2024', src:'endes',            note:'Sierra 43,1% · Costa 27,0%.' },
    { id:'i_dci',    axis:'nutricion',label:'Desnutrición crónica (<5 años)',  value:12.1,  unit:'%',  year:'2024', src:'endes',            note:'Área rural 20,9%.' },
    { id:'i_obes',   axis:'nutricion',label:'Obesidad (15+ años)',             value:25.7,  unit:'%',  year:'2024', src:'minsa_obesidad',   note:'Mujeres 29,9% · hombres 21,1% · urbana 27,9% · rural 15,6%.' },
    { id:'i_upf_e',  axis:'nutricion',label:'UPF en la ingesta energética de niños de 6–35 meses', value:27, unit:'%', year:'2025', src:'upf_ninos', note:'Consumidos por el 86% de los participantes del estudio.' },
    { id:'i_anemuj', axis:'nutricion',label:'Anemia en mujeres de 15 a 49 años', value:26.0, unit:'%', year:'2024', src:'endes',            note:'La doble carga no es solo infantil.' },

    { id:'i_mest',   axis:'identidad',label:'Autoidentificación mestiza',      value:60.2,  unit:'%',  year:'2017', src:'inei_censos',      note:'13 965 254 personas de 12 años a más.' },
    { id:'i_quech',  axis:'identidad',label:'Autoidentificación quechua',      value:22.3,  unit:'%',  year:'2017', src:'inei_censos',      note:'Aimara 2,4% · afrodescendiente 3,6% · blanco 5,9%.' },
    { id:'i_leng',   axis:'identidad',label:'Lenguas indígenas reconocidas',   value:48,    unit:'lenguas', year:'vigente', src:'mincul_lenguas', note:'4 andinas y 44 amazónicas; 55 pueblos indígenas u originarios.' },
    { id:'i_loc',    axis:'identidad',label:'Población en localidades indígenas', value:3628325, unit:'personas', year:'vigente', src:'mincul_lenguas', note:'9 332 localidades: 2 438 005 andinas · 693 857 costeras · 495 772 amazónicas.' },
    { id:'i_lengpob',axis:'identidad',label:'Lengua nativa entre población pobre', value:19.0, unit:'%', year:'2024', src:'inei_pobreza',   note:'Frente a 15,0% entre la población no pobre.' },
    { id:'i_bm_gap', axis:'identidad',label:'Brecha de pobreza indígena y afroperuana', value:7.5, unit:'pp', year:'2021', src:'bm_peru',   note:'Entre 7 y 8 puntos porcentuales por encima de población blanca y mestiza.' }
  ],

  /* -------------------------------------------------- MÓDULO: NUTRICIÓN */
  nutrition: {
    kicker: 'EL CUERPO COMO SENSOR',
    title: 'La nutrición no es un tema de salud. Es el lugar donde el sistema se vuelve legible.',
    lead: 'Si hubiera que elegir un solo indicador para diagnosticar cómo circula todo en el Perú, sería este eje. Un país donde conviven anemia infantil por encima del tercio de los niños y obesidad en uno de cada cuatro adultos no tiene dos problemas nutricionales: tiene un solo circuito que entrega poca densidad de nutrientes y mucha densidad de energía, y lo hace de forma desigual por territorio, por ingreso y por tiempo disponible.',

    empirical: [
      {
        h: 'Déficit y exceso ocurren a la vez, no en secuencia',
        p: 'El modelo clásico de transición nutricional supone una secuencia: primero se resuelve el hambre, luego aparece el exceso. En el Perú los dos estados coexisten en el mismo momento y a veces en el mismo hogar. En 2024 la desnutrición crónica en menores de cinco años fue de 12,1% a nivel nacional y 20,9% en el área rural, mientras la anemia en niños de 6 a 35 meses llegó a 35,3% nacional, 44,7% rural y 31,2% urbana. En paralelo, el Ministerio de Salud reportó 25,7% de obesidad en personas de 15 años a más, con 29,9% en mujeres y 21,1% en hombres. La coexistencia es el hallazgo, no la anomalía.',
        src: ['endes','minsa_obesidad']
      },
      {
        h: 'La geografía del déficit y la geografía del exceso son inversas',
        p: 'La anemia infantil es más alta en Selva (44,1%) y Sierra (43,1%) que en Costa (27,0%). La obesidad adulta es más alta en área urbana (27,9%) que rural (15,6%). Es decir: donde el sistema falla por falta de acceso, el cuerpo registra déficit; donde el sistema funciona en términos de acceso pero entrega un entorno alimentario industrializado, el cuerpo registra exceso. El mismo país produce las dos fallas por dos vías distintas del mismo circuito.',
        src: ['endes','minsa_obesidad']
      },
      {
        h: 'El mercado llegó antes y más rápido que la regulación',
        p: 'Entre 2000 y 2013 el Perú registró un crecimiento de aproximadamente 107% en ventas per cápita de productos ultraprocesados, ubicándose entre los mercados de expansión más rápida de América Latina, sólo detrás de Uruguay (146%) y Bolivia (130%). El etiquetado de advertencia — los octógonos de la Ley 30021 — se hizo exigible recién el 17 de junio de 2019. Entre la aceleración del mercado y la señal correctiva pasaron cerca de dos décadas. Ese desfase temporal es, en términos de sistemas, el retardo que convierte un flujo en un stock.',
        src: ['ops_upf','ley_30021']
      },
      {
        h: 'La penetración no es solo urbana ni solo adulta',
        p: 'Un estudio peruano estimó que en niños de 6 a 35 meses los ultraprocesados aportaban 27% de la ingesta energética total y eran consumidos por 86% de los participantes. Otro trabajo en adultos encontró asociación entre consumo de ultraprocesados y circunferencia de cintura, con la asociación especialmente visible en ámbito rural. La imagen de "comida chatarra = ciudad = clase media" no resiste el dato: el flujo alcanza la primera infancia y el campo.',
        src: ['upf_ninos']
      },
      {
        h: 'Migrar cambia el cuerpo',
        p: 'El estudio PERU MIGRANT y sus análisis de seguimiento encontraron mayor incidencia de obesidad en población urbana y en migrantes rural-urbanos que en residentes rurales, con mayor incidencia de obesidad central entre migrantes. La movilidad interna no solo redistribuye población: reorganiza jornada, transporte, presupuesto y tiempo de cocina. El "desborde" de Matos Mar tiene, en este eje, una expresión metabólica.',
        src: ['peru_migrant','matos_mar']
      },
      {
        h: 'Cambiar la regla de medición cambia el retrato antes que la realidad',
        p: 'La ENDES 2024 recalculó la anemia bajo la directriz adoptada ese año por el MINSA. Es un punto metodológicamente decisivo y fácil de pasar por alto: una sociedad también cambia por cómo es medida. Cuando se compara una serie a través de un cambio de umbral, parte del movimiento observado pertenece al instrumento, no al fenómeno. Todo tablero honesto debe marcar ese corte.',
        src: ['endes']
      },
      {
        h: 'La identidad culinaria coexiste con la transición, no la impide',
        p: 'La gastronomía peruana fue declarada Patrimonio Cultural de la Nación el 16 de octubre de 2007 y las prácticas asociadas al ceviche fueron inscritas por la UNESCO como Patrimonio Cultural Inmaterial en diciembre de 2023. En el mismo periodo, el país registró una de las tasas de crecimiento de ultraprocesados más altas de la región. Prestigio simbólico y entorno alimentario cotidiano operan en capas distintas: el primero se exporta, el segundo se consume.',
        src: ['unesco_ceviche','ops_upf']
      }
    ],

    circuit: {
      title: 'El circuito nutricional en seis pasos',
      steps: [
        { n: '01', t: 'Entra el mercado', d: 'Cadenas globales y publicidad digital amplían disponibilidad y visibilidad de productos densos en energía y baratos por caloría.', color:'#F2C12E' },
        { n: '02', t: 'Se comprime el tiempo', d: 'Urbanización, jornada informal y transporte reducen el tiempo de compra y cocina. La conveniencia deja de ser preferencia y pasa a ser restricción.', color:'#2E6BE6' },
        { n: '03', t: 'Cambia la dieta efectiva', d: 'Sustitución parcial de dieta diversa por dieta industrializada. No es reemplazo total: es superposición con pérdida de diversidad.', color:'#F0731A' },
        { n: '04', t: 'El cuerpo registra', d: 'Déficit de micronutrientes donde falta acceso; exceso calórico donde sobra disponibilidad. Doble carga simultánea.', color:'#E63329' },
        { n: '05', t: 'Aparece la corrección', d: 'Octógonos, vigilancia nutricional, ollas comunes, revalorización de la agrobiodiversidad. Feedback balanceador.', color:'#17A05C' },
        { n: '06', t: 'Se fija un nuevo piso', d: 'La corrección no devuelve el sistema al estado anterior: establece una nueva normalidad alimentaria desde la cual arranca el siguiente ciclo.', color:'#F2C12E' }
      ]
    },

    interpretive: {
      title: 'Lectura interpretativa — el cuerpo como archivo',
      warning: 'Esta sección no es ciencia rigurosa y no debe citarse como tal. Es una lectura de sentido, deliberadamente separada de la evidencia.',
      body: [
        'Hay una manera antigua de leer un cuerpo: como un registro de lo que pasó alrededor de él. En esa clave, la anemia de un niño en la Selva no es un déficit individual de hierro; es la huella de un camino que no se construyó, de un agua que no llegó, de una madre que trabajó demasiadas horas por demasiado poco. Y la obesidad de un adulto en una ciudad costeña no es una falta de voluntad; es la huella de una ciudad que le vendió calorías baratas y le cobró el tiempo.',
        'El eje nutricional funciona entonces como el punto donde lo abstracto se vuelve carne. Las otras cuatro dimensiones del sistema — territorio, mercado, institución, identidad — son discutibles, opinables, disputadas. El cuerpo no discute: registra. Por eso este eje es el mejor sensor del conjunto, y por eso conviene tratarlo con una gravedad que rara vez se le concede.',
        'Hay algo más, y aquí la lectura se vuelve francamente especulativa: comer es el acto en que un sistema entra literalmente dentro de una persona. Un país que pierde diversidad alimentaria no pierde solamente nutrientes; pierde el vocabulario material de su memoria. La papa nativa, el tarwi, la cocona, la quinua no son solo alimentos: son formas de saber que se transmiten cocinando. Cuando el circuito los desplaza, no se borra un producto — se borra un modo de recordar.',
        'La contracara también es cierta, y evita el fatalismo: en el Perú la comida es uno de los pocos terrenos donde la hibridación funcionó como creación y no como pérdida. Chifa, nikkei, criollo. La misma capacidad de recombinar que produjo esas cocinas es la que hoy puede reabsorber el entorno industrializado sin ser absorbida por él. La pregunta abierta no es si la tradición sobrevive; es si sobrevive como práctica cotidiana o solamente como patrimonio declarado.'
      ]
    },

    tensions: [
      { a: 'Acceso', b: 'Calidad', t: 'Ampliar acceso calórico barato reduce hambre y aumenta exceso. Los dos efectos son reales y ocurren juntos.' },
      { a: 'Norma', b: 'Entorno', t: 'El octógono informa, pero no cambia por sí solo precio, disponibilidad ni tiempo. Informar no es rediseñar el entorno.' },
      { a: 'Patrimonio', b: 'Mesa diaria', t: 'El reconocimiento internacional de la cocina peruana no se traduce automáticamente en diversidad de la dieta cotidiana.' },
      { a: 'Medición', b: 'Realidad', t: 'Un cambio de umbral técnico puede mover la serie estadística más rápido que cualquier política.' }
    ]
  },

  /* ------------------------------------------------- MÓDULO: CORRUPCIÓN */
  corruption: {
    kicker: 'ESTUDIO DE LA CORRUPCIÓN',
    title: 'La corrupción como sistema circulatorio, no como escándalo',
    lead: 'Tratar la corrupción como una sucesión de casos individuales es el error analítico más costoso. Los tres marcos que este explorador incorpora —Quiroz sobre la larga duración, Crabtree y Durand sobre la captura, Buscaglia sobre los flujos ilícitos— coinciden en una tesis: la corrupción es un mecanismo de circulación con reglas propias, que se sostiene porque cumple funciones para quienes participan de él y porque los controles llegan siempre después del flujo.',
    note: 'Las tres obras que sostienen este módulo fueron aportadas por el autor del proyecto como documentos de trabajo. No se redistribuyen aquí; se usan como marco conceptual y se citan por su tesis, no por su texto.',

    lenses: [
      {
        id: 'quiroz',
        author: 'Alfonso W. Quiroz',
        work: 'Historia de la corrupción en el Perú',
        color: '#E63329',
        thesis: 'La corrupción peruana es cíclica y acumulativa: no un accidente de ciertos gobiernos, sino una estructura de larga duración que se reactiva con cada auge de renta.',
        keys: [
          'Los ciclos de corrupción tienden a coincidir con los ciclos de renta: guano, deuda externa, boom exportador, privatizaciones. Donde entra un flujo extraordinario de recursos, se forma un circuito extraordinario de desvío.',
          'El costo no es solo el monto desviado. Es el desarrollo que no ocurrió: infraestructura no construida, capacidad estatal no formada, confianza no acumulada. Quiroz insiste en que ese costo de oportunidad es mayor que el robo directo.',
          'Los periodos de reforma anticorrupción existen y funcionan, pero tienden a ser cortos y a revertirse cuando el ciclo de renta se reactiva. La reforma es posible; su persistencia es el problema.',
          'La impunidad no es fallo del sistema judicial: es una salida de equilibrio del sistema político, porque castigar consistentemente rompería las redes que sostienen la gobernabilidad de corto plazo.'
        ],
        estimate: 'Quiroz cuantifica el costo de la corrupción a lo largo de la historia republicana en órdenes de magnitud que sitúan la pérdida anual en el rango de un porcentaje relevante del producto y una fracción importante del gasto público en los picos de ciclo. Las cifras exactas deben verificarse contra la edición impresa antes de citarse.',
        level: 'estimacion'
      },
      {
        id: 'crabtree',
        author: 'John Crabtree y Francisco Durand',
        work: 'Perú: élites del poder y captura política',
        color: '#F0731A',
        thesis: 'El problema central no es el soborno puntual, sino la captura: la capacidad de intereses privados concentrados para fijar las reglas antes de que se apliquen.',
        keys: [
          'La captura opera en tres niveles: la norma (quién escribe la regla), la designación (quién ocupa el cargo que aplica la regla) y la agenda (qué llega siquiera a discutirse). El nivel más eficaz es el tercero, porque es invisible.',
          'La debilidad del sistema de partidos no es un problema paralelo a la captura: es su condición de posibilidad. Sin organizaciones políticas duraderas, la representación se subasta cada elección.',
          'La captura produce una desconexión Estado-sociedad: el Estado responde con eficacia a demandas concentradas y con lentitud a demandas dispersas. Eso explica por qué la capacidad estatal puede ser alta en un sector y nula en otro dentro del mismo país.',
          'La consecuencia medible es la caída de la confianza. Y la confianza es un stock: se pierde rápido y se reconstruye en generaciones.'
        ],
        estimate: 'La lectura de captura es cualitativa y estructural; su verificación empírica pasa por rastrear decisiones normativas concretas, no por un índice agregado.',
        level: 'documentada'
      },
      {
        id: 'buscaglia',
        author: 'Edgardo Buscaglia',
        work: 'Lavado de dinero y corrupción política',
        color: '#F2C12E',
        thesis: 'Sin control patrimonial y financiero, la persecución penal de la corrupción es teatro: se castigan personas y se preservan los flujos.',
        keys: [
          'El eslabón decisivo no es el corrupto, sino el facilitador: notarios, contadores, abogados, sociedades pantalla y sistemas de registro débiles que convierten activos ilícitos en patrimonio legal.',
          'La informalidad económica amplia funciona como medio de dilución: donde una fracción grande de la economía opera sin trazabilidad, ocultar el origen de un activo cuesta menos.',
          'La respuesta eficaz es coordinada y multiagencia: inteligencia financiera, control patrimonial, cooperación internacional y debida diligencia obligatoria. Una sola agencia investigando sola es un control simbólico.',
          'La métrica correcta no es el número de condenas, sino el porcentaje de activos efectivamente recuperados y la reducción del flujo. Si el dinero permanece en el circuito, el sistema no fue tocado.'
        ],
        estimate: 'Marco comparado internacional; su aplicación al Perú es una extrapolación del modelo, no una medición local.',
        level: 'documentada'
      }
    ],

    loop: {
      title: 'El bucle de la corrupción sistémica',
      desc: 'Seis nodos, dos lazos. El lazo reforzador (R) se cierra solo; el lazo balanceador (B) requiere ser sostenido activamente. Esa asimetría es la razón por la que el estado por defecto del sistema es la persistencia.',
      nodes: [
        { id:'renta',    label:'Flujo extraordinario de renta', color:'#F2C12E', d:'Auges exportadores, presupuestos de emergencia, grandes obras, privatizaciones.' },
        { id:'desvio',   label:'Desvío y patronazgo',           color:'#F0731A', d:'Se forma la red: intermediarios, facilitadores, cuotas, favores futuros.' },
        { id:'captura2', label:'Captura de reglas',             color:'#E63329', d:'La red invierte parte de lo obtenido en fijar la norma, la designación y la agenda.' },
        { id:'impunidad',label:'Impunidad',                     color:'#E63329', d:'El control queda por debajo del flujo. Castigar rompería la coalición de gobierno.' },
        { id:'erosion',  label:'Erosión de capacidad y confianza', color:'#2E6BE6', d:'Menos servicios, menos legitimidad, más informalidad. Más terreno para el siguiente ciclo.' },
        { id:'control',  label:'Integridad y control patrimonial', color:'#17A05C', d:'Inteligencia financiera, recuperación de activos, coordinación, transparencia real.' }
      ],
      edges: [
        { s:'renta',    t:'desvio',    p:'+', loop:'R' },
        { s:'desvio',   t:'captura2',  p:'+', loop:'R' },
        { s:'captura2', t:'impunidad', p:'+', loop:'R' },
        { s:'impunidad',t:'desvio',    p:'+', loop:'R' },
        { s:'captura2', t:'erosion',   p:'+', loop:'R' },
        { s:'erosion',  t:'desvio',    p:'+', loop:'R' },
        { s:'control',  t:'impunidad', p:'-', loop:'B' },
        { s:'control',  t:'desvio',    p:'-', loop:'B' },
        { s:'erosion',  t:'control',   p:'-', loop:'B' }
      ]
    },

    linkage: {
      title: 'Por qué la corrupción pertenece al mismo esquema que la nutrición',
      body: [
        'La conexión no es retórica y no depende de indignación. Es una cadena causal explícita, y cada eslabón está en el modelo de este explorador: la captura reduce la capacidad estatal efectiva; menos capacidad estatal significa menos saneamiento, menos vigilancia nutricional, menos control del entorno alimentario y menos presencia donde el territorio es más caro de atender; menos control significa que el circuito nutricional opera sin su feedback correctivo.',
        'Dicho de otro modo: la anemia en la Selva y el desvío en un presupuesto de obra no son dos temas distintos que ocurren en el mismo país. Son dos lecturas del mismo flujo interrumpido. El primero se mide en hemoglobina; el segundo, en expedientes.',
        'La consecuencia metodológica importa más que la moral: si se modelan por separado, cada uno parece tener solución sectorial. Modelados juntos, se ve que una política nutricional sin integridad institucional está financiando su propia filtración, y que una política anticorrupción sin resultado en servicios no recupera confianza aunque produzca condenas.'
      ]
    },

    interpretive: {
      title: 'Lectura interpretativa — la corrupción como pacto silencioso',
      warning: 'Lectura de sentido, no evidencia. Se incluye porque el fenómeno tiene una dimensión que las cifras no capturan, y ocultarla sería otra forma de imprecisión.',
      body: [
        'Toda sociedad tiene un acuerdo no escrito sobre qué se permite mientras no se diga. La corrupción sistémica no vive en la ilegalidad: vive en esa zona previa, donde algo es sabido, tolerado y no nombrado. Por eso los escándalos rara vez cambian el sistema: no revelan un secreto, rompen un silencio. Y el silencio se recompone.',
        'Hay un elemento casi ritual en los ciclos peruanos de indignación: el descubrimiento, la conmoción, la promesa de refundación, el desgaste, el olvido. La estructura se parece a la de una purificación que no purifica, porque el acto simbólico sustituye al cambio estructural. Quiroz describe esto con datos; en clave interpretativa podría decirse que el país celebra periódicamente el funeral de una práctica que sigue viva.',
        'La contraparte también es cierta y es lo que impide la desesperanza: en el Perú la respuesta a la falla institucional casi nunca fue la resignación. Fue construir otra cosa al costado — comedores, rondas, federaciones, ollas, redes. Esa capacidad de reconstruir por fuera es la mayor reserva del sistema y, simultáneamente, lo que le permite al sistema formal seguir fallando sin colapsar. Es una virtud que funciona como amortiguador de un vicio.',
        'La pregunta que este explorador deja abierta no es si la corrupción puede eliminarse. Es más incómoda: cuánto de la capacidad de organización popular que admiramos existe precisamente porque el Estado falló, y qué pasaría con ella si dejara de fallar.'
      ]
    },

    indicators: [
      { label: 'Nivel del análisis', value: 'Estructural', note: 'No se modelan casos ni personas; se modelan mecanismos.' },
      { label: 'Lazos identificados', value: '1 R · 1 B', note: 'El reforzador se cierra solo; el balanceador requiere sostenimiento activo.' },
      { label: 'Variables acopladas', value: '6', note: 'Corrupción, captura, integridad, flujos ilícitos, confianza, capacidad estatal.' },
      { label: 'Fuentes conceptuales', value: '3 obras', note: 'Quiroz · Crabtree y Durand · Buscaglia.' }
    ]
  },

  /* -------------------------------------------------- MÓDULO: TERRITORIO */
  territory: {
    regions: [
      { id:'costa',  label:'Costa',  color:'#F2C12E', pobl:58.0,
        note:'Concentra la población, el mercado integrado y la mayor exposición a cadenas globales. Es donde el sistema funciona mejor en acceso y peor en entorno alimentario.',
        rows:[ ['Población (Censo 2017)',58.0,'%'], ['Pobreza monetaria 2024',25.2,'%'], ['Pobreza extrema 2024',2.6,'%'], ['Agua por red pública 2024',92.0,'%'], ['Saneamiento 2024',87.7,'%'], ['Electricidad 2024',94.3,'%'], ['Anemia 6–35 meses 2024',27.0,'%'] ] },
      { id:'sierra', label:'Sierra', color:'#F0731A', pobl:28.1,
        note:'Persistencia de brecha de ingreso y de anemia con relativamente buena cobertura de agua. Muestra que cobertura no equivale a resultado nutricional.',
        rows:[ ['Población (Censo 2017)',28.1,'%'], ['Pobreza monetaria 2024',30.9,'%'], ['Pobreza extrema 2024',9.9,'%'], ['Agua por red pública 2024',90.3,'%'], ['Saneamiento 2024',72.7,'%'], ['Electricidad 2024',90.8,'%'], ['Anemia 6–35 meses 2024',43.1,'%'] ] },
      { id:'selva',  label:'Selva',  color:'#17A05C', pobl:13.9,
        note:'La brecha más dura del país está aquí y es de saneamiento, no de electricidad. Concentra además la mayor diversidad lingüística: 44 de las 48 lenguas originarias.',
        rows:[ ['Población (Censo 2017)',13.9,'%'], ['Pobreza monetaria 2024',30.0,'%'], ['Pobreza extrema 2024',7.9,'%'], ['Agua por red pública 2024',83.7,'%'], ['Saneamiento 2024',62.2,'%'], ['Electricidad 2024',90.0,'%'], ['Anemia 6–35 meses 2024',44.1,'%'] ] }
    ],
    reading: [
      'Comparar las tres regiones por electricidad da una imagen de país casi integrado: 94,3%, 90,8% y 90,0%. Comparar por saneamiento da otra: 87,7%, 72,7% y 62,2%. La diferencia entre esas dos lecturas es exactamente el punto del eje regional: la integración territorial es real en las capas baratas de infraestructura y frágil en las capas caras.',
      'La región no determina la identidad. El registro oficial de localidades indígenas contabiliza 3 628 325 personas en 9 332 localidades, de las cuales 2 438 005 son andinas, 693 857 costeras y 495 772 amazónicas. Hay más población en localidades indígenas en la Costa que en la Amazonía. Cualquier modelo que asocie "indígena" a "sierra o selva" pierde a más de medio millón de personas de vista.',
      'La pobreza dejó de ser mayoritariamente rural: en 2021, 68,7% de la población pobre vivía en áreas urbanas. Eso desplaza el problema desde la carencia de servicios hacia el costo de vivir, el tiempo y la calidad del empleo. Es también la razón por la que el eje nutricional cambia de forma: en la ciudad el déficit no viene de la ausencia de comida sino de su composición.'
    ]
  },

  /* --------------------------------------------------- MÓDULO: IDENTIDAD */
  identity: {
    lead: 'La identidad peruana no se comporta como una variable cultural: se comporta como una variable de acceso. Es simultáneamente lo que el sistema presiona y lo que permite resistir la presión.',
    blocks: [
      { h:'Una mayoría que no es homogénea', p:'El Censo 2017 registró, entre población de 12 años a más, 60,2% de autoidentificación mestiza, 22,3% quechua, 2,4% aimara, 3,6% afrodescendiente y 5,9% blanca. El propio INEI advirtió que esta variable presentó los índices de calidad más bajos entre las nueve evaluadas del censo. Es decir: la categoría con más peso político del país es también la que peor se deja medir.', src:['inei_censos'] },
      { h:'La identidad se paga', p:'En 2024, la población pobre tenía mayor proporción de lengua nativa que la no pobre (19,0% frente a 15,0%) y mayor proporción de origen nativo autodeclarado (32,1% frente a 27,4%), mientras la población no pobre tenía mayor proporción mestiza (52,1% frente a 42,0%). El Banco Mundial estimó para 2021 que la pobreza entre población indígena y afroperuana era entre 7 y 8 puntos porcentuales mayor. La identidad no explica la pobreza: la acompaña de forma sistemática, que es una afirmación más fuerte y más incómoda.', src:['inei_pobreza','bm_peru'] },
      { h:'Densidad lingüística amazónica', p:'El Perú reconoce 48 lenguas indígenas u originarias —4 andinas y 44 amazónicas— y 55 pueblos indígenas u originarios, 51 de ellos amazónicos. La Amazonía concentra 13,9% de la población y la gran mayoría de la diversidad lingüística del país. Cualquier política de servicios diseñada en una sola lengua opera, allí, como barrera de acceso.', src:['mincul_lenguas'] },
      { h:'Hibridación dentro de un campo desigual', p:'García Canclini permite ver la recombinación cultural como creación, no como pérdida; Quijano advierte que esa recombinación ocurre dentro de una matriz de poder que jerarquiza. Sostener las dos lecturas a la vez es lo que impide caer en el celebracionismo ("todo es mestizaje feliz") y en el fatalismo ("todo es dominación"). El modelo mantiene ambas como fuerzas opuestas explícitas.', src:['garcia_canclini','quijano'] }
    ]
  },

  /* ----------------------------------------------------------- HISTORIA */
  history: [
    { year:'1553', title:'La tripartición se nombra', axis:'regional', src:'inei_censos', note:'La división Costa–Sierra–Selva aparece documentada desde la Crónica del Perú de Cieza de León. No es una categoría estadística moderna: es una lectura territorial de casi cinco siglos.' },
    { year:'1750–1820', title:'Patronazgo colonial y reforma frustrada', axis:'social', src:'quiroz', note:'Privilegios, contrabando y límites de la modernización administrativa como antecedente de larga duración de los ciclos posteriores.' },
    { year:'1821–1899', title:'República, renta y ciclos de desvío', axis:'social', src:'quiroz', note:'Los auges de renta —guano, deuda— coinciden con expansiones del circuito de desvío. Es el patrón que Quiroz identifica como recurrente.' },
    { year:'1940', title:'Base censal histórica', axis:'regional', src:'inei_censos', note:'Punto de referencia para medir urbanización y redistribución territorial de largo plazo.' },
    { year:'1961–1993', title:'Aceleración urbana y migratoria', axis:'regional', src:'inei_censos', note:'La expansión urbana reconfigura demanda, servicios y dieta en una sola generación.' },
    { year:'1980', title:'AIDESEP y la organización amazónica', axis:'identidad', src:'aidesep', note:'Fundada en 1980; articula federaciones y comunidades amazónicas y recibió el Premio Nobel Alternativo en 1986. Evidencia de acción colectiva territorializada.' },
    { year:'1984', title:'Desborde popular', axis:'social', src:'matos_mar', note:'Matos Mar formula la tesis: la informalidad no es residuo del sistema, es la forma en que el sistema opera realmente.' },
    { year:'1993', title:'Transición nutricional en marcha', axis:'nutricion', src:'fao', note:'Popkin formaliza el concepto de transición nutricional; el Perú entra en el proceso con una geografía de partida muy desigual.' },
    { year:'2000–2013', title:'Aceleración del mercado de ultraprocesados', axis:'nutricion', src:'ops_upf', note:'+107% en ventas per cápita. La expansión ocurre casi dos décadas antes de la señal regulatoria.' },
    { year:'2007', title:'Gastronomía como Patrimonio Cultural de la Nación', axis:'identidad', src:'unesco_ceviche', note:'16 de octubre de 2007. El prestigio culinario se institucionaliza mientras el entorno alimentario cotidiano se industrializa.' },
    { year:'2017', title:'Censo con autoidentificación étnica', axis:'identidad', src:'inei_censos', note:'Primera medición censal de autoidentificación étnica; 60,2% mestizo. También la variable con menor calidad medida del censo.' },
    { year:'2019', title:'Octógonos exigibles', axis:'nutricion', src:'ley_30021', note:'17 de junio de 2019. Primera corrección regulatoria fuerte sobre el entorno alimentario industrializado.' },
    { year:'2021', title:'La pobreza se vuelve urbana', axis:'regional', src:'bm_peru', note:'68,7% de la población pobre vive en áreas urbanas. El problema se desplaza de la carencia al costo de vivir.' },
    { year:'2023', title:'El ceviche entra a la lista de la UNESCO', axis:'identidad', src:'unesco_ceviche', note:'Diciembre de 2023. Reconocimiento internacional del patrimonio culinario vivo.' },
    { year:'2024', title:'Doble carga plenamente documentada', axis:'nutricion', src:'endes', note:'Anemia 35,3% en niños de 6–35 meses; obesidad 25,7% en 15+ años. Déficit y exceso conviviendo con nitidez estadística.' },
    { year:'2024', title:'Informalidad al 70,9% y aprobación al 11,3%', axis:'social', src:'inei_informalidad', note:'La coordinación social real ocurre mayoritariamente fuera de la institución formal, con legitimidad institucional en mínimos.' }
  ],

  /* ----------------------------------------------------------- GLOSARIO */
  glossary: [
    { t:'Stock', d:'Variable que acumula: población, confianza, infraestructura, carga nutricional. Cambia lento y guarda memoria del pasado.' },
    { t:'Flujo', d:'Variable que se mueve por unidad de tiempo: migración, ventas, información, ingresos. Cambia rápido y no guarda memoria por sí solo.' },
    { t:'Lazo reforzador (R)', d:'Circuito que amplifica su propia dirección. Crece solo hasta topar con un límite físico o institucional.' },
    { t:'Lazo balanceador (B)', d:'Circuito que corrige la desviación respecto de un objetivo. Requiere ser sostenido activamente: si se abandona, deja de corregir.' },
    { t:'Retardo', d:'Tiempo entre causa y efecto observable. El retardo es lo que hace que un sistema sobrepase su propio objetivo antes de reaccionar.' },
    { t:'Doble carga nutricional', d:'Coexistencia de déficit nutricional y exceso de peso en la misma población, incluso en el mismo hogar.' },
    { t:'Transición nutricional', d:'Desplazamiento de dietas tradicionales hacia entornos alimentarios urbanos, industriales y densos en energía (Popkin).' },
    { t:'Desborde popular', d:'Tesis de Matos Mar: la migración masiva y la urbanización popular exceden los límites institucionales del Estado y crean un orden paralelo funcional.' },
    { t:'Colonialidad del poder', d:'Tesis de Quijano: la dominación colonial no terminó con la independencia; persiste como matriz que organiza trabajo, raza, autoridad y conocimiento.' },
    { t:'Hibridación cultural', d:'Concepto de García Canclini: estructuras y prácticas antes separadas se combinan y generan formas nuevas, no simples copias.' },
    { t:'Captura política', d:'Capacidad de intereses privados concentrados para fijar reglas, designaciones y agenda pública antes de que se apliquen (Crabtree y Durand).' },
    { t:'Facilitador', d:'Actor profesional que convierte activos ilícitos en patrimonio aparentemente legal. Eslabón crítico en el análisis de Buscaglia.' },
    { t:'Autopoiesis', d:'Capacidad de un sistema de producir sus propios elementos y reglas. Explica por qué un sistema puede resistir intervenciones externas bien intencionadas.' },
    { t:'Nivel de evidencia', d:'Etiqueta obligatoria de este explorador: dato, documentada, hipótesis, estimación o interpretación. Ninguna afirmación circula sin ella.' }
  ],

  /* ------------------------------------------------------------ FUENTES */
  sources: [
    { id:'inei_censos', inst:'INEI', name:'Censos Nacionales y perfiles sociodemográficos', cat:'Territorio e identidad', role:'calibración', url:'https://www.inei.gob.pe/', use:'Urbanización, distribución territorial, movilidad interdepartamental, autoidentificación étnica y lengua.' },
    { id:'inei_pobreza', inst:'INEI', name:'Informe técnico de pobreza monetaria', cat:'Sociedad y economía', role:'calibración', url:'https://www.inei.gob.pe/', use:'Pobreza monetaria y extrema por región natural; composición étnica y lingüística de la población pobre.' },
    { id:'inei_servicios', inst:'INEI', name:'Acceso a servicios básicos (agua, saneamiento, electricidad)', cat:'Territorio', role:'calibración', url:'https://www.inei.gob.pe/', use:'Cobertura por región natural; base de la lectura de brecha material.' },
    { id:'inei_informalidad', inst:'INEI', name:'Producción y empleo informal — cuenta satélite', cat:'Sociedad y economía', role:'calibración', url:'https://www.inei.gob.pe/', use:'Empleo informal, unidades productivas del sector informal y su aporte al PBI.' },
    { id:'inei_internet', inst:'INEI', name:'Estadísticas de las Tecnologías de Información y Comunicación en los Hogares', cat:'Global', role:'calibración', url:'https://www.inei.gob.pe/', use:'Uso de internet por ámbito y sexo; base de la brecha digital urbano-rural.' },
    { id:'inei_gobernabilidad', inst:'INEI', name:'Encuesta Nacional de Hogares — módulo de gobernabilidad', cat:'Institucionalidad', role:'calibración', url:'https://www.inei.gob.pe/', use:'Percepción de la gestión del gobierno central; proxy de legitimidad institucional.' },
    { id:'endes', inst:'INEI / MINSA', name:'Encuesta Demográfica y de Salud Familiar (ENDES)', cat:'Nutrición y salud', role:'calibración', url:'https://encuestas.inei.gob.pe/endes/', use:'Anemia, desnutrición crónica y salud materno-infantil; incluye el cambio de directriz de cálculo de anemia en 2024.' },
    { id:'minsa_obesidad', inst:'MINSA', name:'Reportes de sobrepeso y obesidad', cat:'Nutrición y salud', role:'calibración', url:'https://observateperu.ins.gob.pe/', use:'Prevalencia de obesidad en población de 15 años a más por sexo y ámbito.' },
    { id:'ops_upf', inst:'OPS / PAHO', name:'Ultra-processed food and drink products in Latin America', cat:'Nutrición y salud', role:'calibración', url:'https://www.paho.org/', use:'Crecimiento de ventas per cápita de ultraprocesados 2000–2013; posición relativa del Perú en la región.' },
    { id:'fao', inst:'FAO', name:'Panorama de la Seguridad Alimentaria y Nutricional en ALC / FAOSTAT', cat:'Nutrición y salud', role:'calibración', url:'https://www.fao.org/faostat/en/', use:'Transición nutricional, disponibilidad alimentaria y series de largo plazo.' },
    { id:'upf_ninos', inst:'Literatura peruana revisada por pares', name:'Estudios sobre consumo de ultraprocesados en Perú', cat:'Nutrición y salud', role:'evidencia', url:'', use:'Aporte de ultraprocesados a la ingesta energética en primera infancia y asociación con adiposidad en adultos.' },
    { id:'peru_migrant', inst:'PERU MIGRANT Study', name:'Cohorte sobre migración rural-urbana y riesgo cardiometabólico', cat:'Nutrición y salud', role:'evidencia', url:'', use:'Mayor incidencia de obesidad y obesidad central en migrantes rural-urbanos frente a residentes rurales.' },
    { id:'awajun', inst:'Literatura sobre sistemas alimentarios indígenas', name:'Estudios en comunidades awajún y shawi', cat:'Nutrición e identidad', role:'evidencia', url:'', use:'Relación entre diversidad de alimentos tradicionales y calidad de la dieta; percepción indígena del cambio del sistema alimentario.' },
    { id:'ley_30021', inst:'Estado peruano', name:'Ley 30021 y Manual de Advertencias Publicitarias (octógonos)', cat:'Norma', role:'evidencia', url:'', use:'Etiquetado frontal de advertencia exigible desde el 17 de junio de 2019; feedback regulatorio del eje nutricional.' },
    { id:'mincul_lenguas', inst:'Ministerio de Cultura', name:'Base de Datos de Pueblos Indígenas u Originarios (BDPI)', cat:'Cultura e identidad', role:'calibración', url:'https://bdpi.cultura.gob.pe/', use:'48 lenguas, 55 pueblos, 9 332 localidades y su distribución andina, amazónica y costera.' },
    { id:'unesco_ceviche', inst:'UNESCO / Estado peruano', name:'Patrimonio Cultural Inmaterial y declaratorias gastronómicas', cat:'Cultura e identidad', role:'evidencia', url:'https://ich.unesco.org/en/state/peru-PE?info=elements-on-the-lists', use:'Declaratoria de la gastronomía como Patrimonio Cultural de la Nación (2007) e inscripción del ceviche por la UNESCO (2023).' },
    { id:'renamu', inst:'INEI — RENAMU', name:'Registro Nacional de Municipalidades', cat:'Sociedad', role:'evidencia', url:'https://www.inei.gob.pe/', use:'Comedores populares registrados y personas beneficiadas; medida de infraestructura social no estatal.' },
    { id:'aidesep', inst:'AIDESEP', name:'Asociación Interétnica de Desarrollo de la Selva Peruana', cat:'Sociedad e identidad', role:'evidencia', url:'', use:'Organización amazónica de base; caso de acción colectiva territorializada de larga duración.' },
    { id:'gsma', inst:'GSMA Intelligence', name:'The Mobile Economy Latin America', cat:'Global', role:'evidencia', url:'https://www.gsmaintelligence.com/', use:'Usuarios móviles únicos y proyecciones regionales de conectividad.' },
    { id:'bm_peru', inst:'Banco Mundial', name:'Diagnósticos de pobreza y equidad — Perú', cat:'Sociedad y economía', role:'calibración', url:'https://www.worldbank.org/', use:'Urbanización de la pobreza, brechas por identidad étnica y acceso diferencial a servicios.' },
    { id:'matos_mar', inst:'José Matos Mar', name:'Desborde popular y crisis del Estado', cat:'Marco conceptual', role:'conceptual', url:'', use:'Mecanismo causal entre migración, urbanización popular, informalidad y orden paralelo funcional.' },
    { id:'quijano', inst:'Aníbal Quijano', name:'Colonialidad del poder', cat:'Marco conceptual', role:'conceptual', url:'', use:'Matriz de jerarquización que condiciona cómo se distribuyen acceso, reconocimiento y trabajo.' },
    { id:'garcia_canclini', inst:'Néstor García Canclini', name:'Culturas híbridas', cat:'Marco conceptual', role:'conceptual', url:'', use:'Recombinación cultural como creación; base de la fase de reconfiguración del ciclo.' },
    { id:'quiroz', inst:'Alfonso W. Quiroz', name:'Historia de la corrupción en el Perú', cat:'Institucionalidad y poder', role:'conceptual', url:'', use:'Corrupción como fenómeno cíclico, acumulativo y estructural; costo de oportunidad sobre el desarrollo. Documento aportado al proyecto; no se redistribuye.' },
    { id:'crabtree_durand', inst:'John Crabtree y Francisco Durand', name:'Perú: élites del poder y captura política', cat:'Institucionalidad y poder', role:'conceptual', url:'', use:'Captura de normas, designaciones y agenda; desconexión Estado-sociedad y crisis de confianza. Documento aportado al proyecto; no se redistribuye.' },
    { id:'buscaglia', inst:'Edgardo Buscaglia', name:'Lavado de dinero y corrupción política', cat:'Institucionalidad y poder', role:'conceptual', url:'', use:'Flujos ilícitos, facilitadores, control patrimonial y coordinación multiagencia. Documento aportado al proyecto; no se redistribuye.' },
    { id:'mate', inst:'Gabor Maté', name:'The Myth of Normal', cat:'Salud, estrés y cultura', role:'conceptual', url:'', use:'Marco biopsicosocial sobre desigualdad, agencia, aislamiento y estrés como determinantes del bienestar. No es evidencia específica del Perú. Documento aportado al proyecto; no se redistribuye.' }
  ],

  /* --------------------------------------------------------- SIMULACIÓN */
  simulation: {
    disclaimer: 'Escenario sistémico experimental. No predice corrupción, salud, política ni resultados económicos. Todas las entradas y salidas son índices normalizados 0–100 con línea neutra en 50. Los signos causales se apoyan en las fuentes citadas; las magnitudes son heurísticas y deben calibrarse con series oficiales antes de cualquier uso analítico. El estado inicial no es neutro: ancla de forma ordinal el retrato cualitativo que devuelven los indicadores —informalidad alta, confianza institucional baja, carga nutricional elevada— para que las trayectorias muestren movimiento real. Esas anclas son del modelo, no mediciones del Perú.',
    periods: 30,
    params: [
      { id:'migracion',  label:'Presión migratoria y territorial', color:'#2E6BE6', def:55, lo:25, hi:85, desc:'Intensidad del flujo de personas hacia entornos urbanos y su presión sobre servicios.' },
      { id:'mercado',    label:'Integración de mercados',          color:'#F2C12E', def:65, lo:30, hi:92, desc:'Penetración de cadenas globales, publicidad y patrones estandarizados de consumo.' },
      { id:'capacidad',  label:'Capacidad estatal y de servicios', color:'#2E6BE6', def:48, lo:15, hi:88, desc:'Capacidad efectiva de proveer, regular y responder en territorio.' },
      { id:'integridad', label:'Integridad y controles',           color:'#17A05C', def:42, lo:10, hi:90, desc:'Prevención, fiscalización, control patrimonial-financiero y rendición de cuentas.' },
      { id:'comunidad',  label:'Cohesión y redes comunitarias',    color:'#F0731A', def:58, lo:20, hi:92, desc:'Densidad de organización, apoyo mutuo y provisión no estatal.' },
      { id:'resiliencia',label:'Resiliencia cultural y alimentaria', color:'#17A05C', def:57, lo:20, hi:92, desc:'Capacidad de sostener diversidad alimentaria y prácticas culturales bajo presión.' }
    ],
    outputs: [
      { id:'urbana',     label:'Presión urbana',           color:'#2E6BE6', type:'tension' },
      { id:'informal',   label:'Informalidad',             color:'#F0731A', type:'tension' },
      { id:'corrupcion', label:'Corrupción sistémica',     color:'#E63329', type:'tension' },
      { id:'captura',    label:'Captura política',         color:'#E63329', type:'tension' },
      { id:'ilicitos',   label:'Flujos ilícitos',          color:'#F2C12E', type:'tension' },
      { id:'confianza',  label:'Confianza institucional',  color:'#17A05C', type:'proteccion' },
      { id:'estres',     label:'Estrés social',            color:'#F0731A', type:'tension' },
      { id:'carga',      label:'Carga nutricional',        color:'#E63329', type:'tension' },
      { id:'cultura',    label:'Resiliencia cultural',     color:'#17A05C', type:'proteccion' }
    ],
    presets: [
      { id:'base',        label:'Base exploratoria',            v:{ migracion:55, mercado:65, capacidad:48, integridad:42, comunidad:58, resiliencia:57 } },
      { id:'integridad',  label:'Fortalecimiento institucional', v:{ migracion:55, mercado:65, capacidad:74, integridad:80, comunidad:62, resiliencia:64 } },
      { id:'captura',     label:'Alta vulnerabilidad',           v:{ migracion:66, mercado:78, capacidad:28, integridad:20, comunidad:40, resiliencia:38 } },
      { id:'comunidad',   label:'Resiliencia comunitaria',       v:{ migracion:58, mercado:60, capacidad:54, integridad:56, comunidad:86, resiliencia:86 } },
      { id:'apertura',    label:'Apertura sin controles',        v:{ migracion:60, mercado:92, capacidad:46, integridad:26, comunidad:50, resiliencia:44 } }
    ]
  }
};

if (typeof window !== 'undefined') window.V3 = V3;
if (typeof module !== 'undefined' && module.exports) module.exports = V3;
