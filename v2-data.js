const SocioTechnicalV2 = {
  meta: {
    version: '2.0-alpha',
    title: 'Explorador Socio-Técnico del Perú',
    methodologicalNote: 'La V2 separa evidencia, datos observados y simulación. El simulador utiliza índices normalizados y coeficientes heurísticos hasta ser calibrado con series oficiales.'
  },

  axes: [
    { id: 'regional', label: 'Regional', number: '01', color: '#00b0b9', role: 'Territorio, urbanización, servicios, movilidad y desigualdad espacial.' },
    { id: 'global', label: 'Influencias Globales', number: '02', color: '#6366f1', role: 'Mercados, conectividad, tecnología, cadenas globales y exposición externa.' },
    { id: 'social', label: 'Accionar Social', number: '03', color: '#eab308', role: 'Informalidad, organización, redes, conflictividad y adaptación social.' },
    { id: 'nutrition', label: 'Nutrición Globalizada', number: '04', color: '#ef4444', role: 'Transición alimentaria, doble carga nutricional, UPF y sistemas alimentarios.' },
    { id: 'identity', label: 'Identidad', number: '05', color: '#22c55e', role: 'Lengua, pertenencia, discriminación, hibridación y continuidad cultural.' }
  ],

  territories: [
    { id: 'costa', label: 'Costa', note: 'Alta concentración urbana, mercados integrados y fuerte exposición a cadenas globales.' },
    { id: 'sierra', label: 'Sierra', note: 'Persistencia de brechas territoriales, diversidad lingüística y patrones alimentarios diferenciados.' },
    { id: 'selva', label: 'Selva', note: 'Alta diversidad sociocultural, dispersión territorial y retos de acceso a servicios.' }
  ],

  variables: [
    { id: 'urban_pressure', axis: 'regional', label: 'Presión urbana', kind: 'stock', unit: 'índice', trend: '↑', description: 'Presión acumulada sobre vivienda, servicios e infraestructura.' },
    { id: 'migration', axis: 'regional', label: 'Movilidad / migración interna', kind: 'flow', unit: 'índice', trend: '↔', description: 'Flujo territorial que redistribuye población, demanda y redes sociales.' },
    { id: 'service_capacity', axis: 'regional', label: 'Capacidad de servicios', kind: 'stock', unit: 'índice', trend: '↑', description: 'Capacidad institucional e infraestructural para absorber presión territorial.' },
    { id: 'global_market', axis: 'global', label: 'Penetración de mercados', kind: 'flow', unit: 'índice', trend: '↑', description: 'Intensidad de integración a cadenas y patrones globales de consumo.' },
    { id: 'connectivity', axis: 'global', label: 'Conectividad digital', kind: 'stock', unit: 'índice', trend: '↑', description: 'Acceso acumulado a redes digitales, plataformas y circulación de información.' },
    { id: 'informality', axis: 'social', label: 'Informalidad', kind: 'stock', unit: '% / índice', trend: '↑', description: 'Peso de arreglos económicos y sociales fuera de la formalidad institucional.' },
    { id: 'community_networks', axis: 'social', label: 'Redes comunitarias', kind: 'stock', unit: 'índice', trend: '↔', description: 'Capacidad de organización y respuesta social no estatal.' },
    { id: 'social_conflict', axis: 'social', label: 'Conflictividad social', kind: 'flow', unit: 'eventos / índice', trend: '↔', description: 'Manifestación observable de tensiones distributivas, territoriales e institucionales.' },
    { id: 'upf', axis: 'nutrition', label: 'Exposición a ultraprocesados', kind: 'flow', unit: 'índice', trend: '↑', description: 'Exposición relativa a productos ultraprocesados y patrones alimentarios estandarizados.' },
    { id: 'double_burden', axis: 'nutrition', label: 'Doble carga nutricional', kind: 'stock', unit: 'índice', trend: '↑', description: 'Coexistencia de déficits nutricionales y exceso de peso en una misma población.' },
    { id: 'food_diversity', axis: 'nutrition', label: 'Diversidad alimentaria', kind: 'stock', unit: 'índice', trend: '↓', description: 'Diversidad efectiva de alimentos y continuidad de sistemas alimentarios locales.' },
    { id: 'language_identity', axis: 'identity', label: 'Continuidad lingüística', kind: 'stock', unit: 'índice', trend: '↔', description: 'Persistencia y transmisión de lenguas indígenas u originarias.' },
    { id: 'cultural_resilience', axis: 'identity', label: 'Resiliencia cultural', kind: 'stock', unit: 'índice', trend: '↔', description: 'Capacidad de sostener, adaptar y recombinar prácticas culturales frente a presiones externas.' },
    { id: 'discrimination', axis: 'identity', label: 'Discriminación percibida', kind: 'flow', unit: 'índice', trend: '↑', description: 'Experiencia o percepción de exclusión asociada a origen, lengua, rasgos o pertenencia.' }
  ],

  axisRelations: [
    { source: 'global', target: 'regional', polarity: '+', loop: 'R1', label: 'Integración → concentración' },
    { source: 'regional', target: 'social', polarity: '+', loop: 'R1', label: 'Presión → adaptación informal' },
    { source: 'social', target: 'identity', polarity: '+', loop: 'R2', label: 'Redes → reconfiguración' },
    { source: 'global', target: 'nutrition', polarity: '+', loop: 'R3', label: 'Mercados → transición alimentaria' },
    { source: 'nutrition', target: 'identity', polarity: '-', loop: 'B1', label: 'Estandarización ↔ tradición' },
    { source: 'identity', target: 'social', polarity: '+', loop: 'R2', label: 'Pertenencia → redes' }
  ],

  causalRelations: [
    { source: 'migration', target: 'urban_pressure', polarity: '+', delay: 'corto', evidence: ['inei_censos'] },
    { source: 'service_capacity', target: 'urban_pressure', polarity: '-', delay: 'medio', evidence: ['inei_censos'] },
    { source: 'urban_pressure', target: 'informality', polarity: '+', delay: 'medio', evidence: ['inei_enaho', 'matos_mar'] },
    { source: 'community_networks', target: 'cultural_resilience', polarity: '+', delay: 'medio', evidence: ['matos_mar', 'bdpi'] },
    { source: 'global_market', target: 'upf', polarity: '+', delay: 'corto', evidence: ['ins_observate'] },
    { source: 'upf', target: 'double_burden', polarity: '+', delay: 'largo', evidence: ['ins_observate', 'endes'] },
    { source: 'food_diversity', target: 'double_burden', polarity: '-', delay: 'largo', evidence: ['endes', 'sien'] },
    { source: 'connectivity', target: 'global_market', polarity: '+', delay: 'corto', evidence: ['enapres_cultura'] },
    { source: 'global_market', target: 'cultural_resilience', polarity: '-', delay: 'largo', evidence: ['garcia_canclini', 'quijano'] },
    { source: 'language_identity', target: 'cultural_resilience', polarity: '+', delay: 'medio', evidence: ['bdpi'] },
    { source: 'discrimination', target: 'social_conflict', polarity: '+', delay: 'medio', evidence: ['bdpi'] },
    { source: 'cultural_resilience', target: 'community_networks', polarity: '+', delay: 'medio', evidence: ['bdpi', 'matos_mar'] }
  ],

  sources: [
    {
      id: 'endes', category: 'Nutrición y salud', institution: 'INEI', name: 'Encuesta Demográfica y de Salud Familiar (ENDES)',
      coverage: 'Nacional y subnacional; serie periódica', update: 'Continua/anual', type: 'Cuantitativa oficial',
      url: 'https://encuestas.inei.gob.pe/endes/',
      use: 'Anemia, nutrición materno-infantil, salud y variables demográficas. Fuente de calibración prioritaria.'
    },
    {
      id: 'sien', category: 'Nutrición y salud', institution: 'INS/CENAN', name: 'SIEN-HIS / Sistema de Información del Estado Nutricional',
      coverage: 'Establecimientos de salud MINSA; local, regional y nacional', update: 'Registro continuo', type: 'Vigilancia oficial',
      url: 'https://observateperu.ins.gob.pe/node/108',
      use: 'Seguimiento de estado nutricional de niños y gestantes; útil para series temporales y alertas territoriales.'
    },
    {
      id: 'ins_observate', category: 'Nutrición y salud', institution: 'INS/CENAN', name: 'Observatorio de Nutrición y Estudio del Sobrepeso y Obesidad',
      coverage: 'Perú', update: 'Informes periódicos', type: 'Vigilancia / evaluación',
      url: 'https://observateperu.ins.gob.pe/',
      use: 'Sobrepeso, obesidad, determinantes, políticas alimentarias y exposición a patrones de consumo.'
    },
    {
      id: 'inei_enaho', category: 'Sociedad y economía', institution: 'INEI', name: 'Encuesta Nacional de Hogares (ENAHO)',
      coverage: 'Nacional y departamental', update: 'Continua/anual', type: 'Cuantitativa oficial',
      url: 'https://www.inei.gob.pe/',
      use: 'Pobreza, empleo, informalidad, servicios, ingresos y brechas territoriales.'
    },
    {
      id: 'inei_censos', category: 'Historia territorial', institution: 'INEI', name: 'Censos Nacionales y perfiles sociodemográficos',
      coverage: '1940–2017 y nuevos productos censales', update: 'Censal', type: 'Histórica cuantitativa',
      url: 'https://www.inei.gob.pe/',
      use: 'Urbanización, distribución territorial, lengua, vivienda y transformaciones de largo plazo.'
    },
    {
      id: 'bdpi', category: 'Cultura e identidad', institution: 'Ministerio de Cultura', name: 'Base de Datos Oficial de Pueblos Indígenas u Originarios (BDPI)',
      coverage: '55 pueblos; información territorial, lingüística y sociodemográfica', update: 'Actualización continua', type: 'Oficial cultural / geográfica',
      url: 'https://bdpi.cultura.gob.pe/',
      use: 'Pueblos, localidades, lenguas, territorio, indicadores sociales e historia cultural.'
    },
    {
      id: 'enapres_cultura', category: 'Cultura e identidad', institution: 'Ministerio de Cultura / INEI', name: 'ENAPRES Cultura / acceso a bienes y servicios culturales',
      coverage: 'Perú', update: 'Periódica', type: 'Cuantitativa cultural',
      url: 'https://www.datosabiertos.gob.pe/group/ministerio-de-cultura-mincul',
      use: 'Acceso y consumo de bienes/servicios culturales para operacionalizar exposición, participación y cambio cultural.'
    },
    {
      id: 'datos_cultura', category: 'Cultura e identidad', institution: 'Ministerio de Cultura', name: 'Plataforma Nacional de Datos Abiertos — datasets culturales',
      coverage: 'Perú', update: 'Según dataset', type: 'Datos abiertos',
      url: 'https://www.datosabiertos.gob.pe/group/ministerio-de-cultura-mincul',
      use: 'Patrimonio, lenguas, puntos de cultura, lectura, museos y otros activos culturales descargables.'
    },
    {
      id: 'worldbank_urban', category: 'Historia territorial', institution: 'Banco Mundial / Naciones Unidas', name: 'Urban population (% of total population) — Peru',
      coverage: '1960–actualidad disponible', update: 'Anual', type: 'Serie internacional comparable',
      url: 'https://data.worldbank.org/indicator/SP.URB.TOTL.IN.ZS?locations=PE',
      use: 'Serie complementaria para urbanización de largo plazo; debe contrastarse con definiciones censales del INEI.'
    },
    {
      id: 'matos_mar', category: 'Marco histórico-social', institution: 'Bibliografía especializada', name: 'José Matos Mar — desborde popular y transformación urbana',
      coverage: 'Perú contemporáneo', update: 'Fuente histórica', type: 'Teórica / histórica',
      url: 'https://iep.org.pe/',
      use: 'Fundamenta mecanismos sobre migración, ciudad, informalidad, redes y reconfiguración social. No se usa como serie numérica.'
    },
    {
      id: 'quijano', category: 'Marco histórico-social', institution: 'Bibliografía especializada', name: 'Aníbal Quijano — colonialidad del poder',
      coverage: 'Perú / América Latina', update: 'Fuente teórica', type: 'Teórica',
      url: 'https://biblioteca.clacso.edu.ar/',
      use: 'Marco para relaciones entre modernización, jerarquías, identidad y poder. Sirve para formular hipótesis causales.'
    },
    {
      id: 'garcia_canclini', category: 'Marco histórico-social', institution: 'Bibliografía especializada', name: 'Néstor García Canclini — culturas híbridas',
      coverage: 'América Latina', update: 'Fuente teórica', type: 'Teórica',
      url: 'https://www.sigloxxieditores.com.mx/',
      use: 'Marco para hibridación, consumo cultural y recombinación de prácticas tradicionales y modernas.'
    }
  ],

  history: [
    { year: '1940', title: 'Base censal histórica', source: 'inei_censos', note: 'Punto de referencia para observar urbanización y redistribución territorial de largo plazo.' },
    { year: '1961–1993', title: 'Aceleración urbana y migratoria', source: 'inei_censos', note: 'Los censos permiten reconstruir la expansión urbana y las brechas urbano-rurales.' },
    { year: '1984', title: 'Desborde popular', source: 'matos_mar', note: 'Marco interpretativo para redes informales, migración y transformación del Estado y la ciudad.' },
    { year: '2007–2017', title: 'Nueva comparación intercensal', source: 'inei_censos', note: 'Permite evaluar continuidad del proceso de concentración, servicios, lengua e identidad.' },
    { year: '2024–2026', title: 'Vigilancia social, nutricional y cultural', source: 'endes', note: 'ENDES, ENAHO, SIEN/INS y datos culturales permiten alimentar observaciones más frecuentes.' }
  ],

  simulation: {
    disclaimer: 'Simulación experimental normalizada. No constituye predicción ni estimación oficial. Los coeficientes son heurísticos y deben calibrarse con series INEI/INS/MINCUL antes de uso analítico.',
    defaults: { migration: 58, market: 68, capacity: 48, resilience: 57 },
    calibrationSources: ['inei_censos', 'inei_enaho', 'endes', 'sien', 'ins_observate', 'bdpi', 'enapres_cultura']
  }
};
