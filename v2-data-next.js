const SocioTechnicalV2 = {
  meta: {
    version: '2.1-experimental',
    title: 'Explorador Socio-Técnico del Perú',
    methodologicalNote: 'La V2.1 separa evidencia, hipótesis y simulación. El laboratorio usa índices normalizados y coeficientes heurísticos hasta ser calibrado con series oficiales.'
  },

  axes: [
    { id: 'regional', label: 'Regional', number: '01', color: '#00b0b9', role: 'Territorio, urbanización, servicios, movilidad, capacidad estatal y desigualdad espacial.' },
    { id: 'global', label: 'Influencias Globales', number: '02', color: '#6366f1', role: 'Mercados, conectividad, tecnología, cadenas globales, capitales y exposición externa.' },
    { id: 'social', label: 'Accionar Social', number: '03', color: '#eab308', role: 'Informalidad, organización, instituciones, confianza, poder, conflictividad y adaptación social.' },
    { id: 'nutrition', label: 'Nutrición Globalizada', number: '04', color: '#ef4444', role: 'Transición alimentaria, doble carga nutricional, UPF, estrés y sistemas alimentarios.' },
    { id: 'identity', label: 'Identidad', number: '05', color: '#22c55e', role: 'Lengua, pertenencia, discriminación, hibridación, cohesión y continuidad cultural.' }
  ],

  territories: [
    { id: 'costa', label: 'Costa', note: 'Alta concentración urbana, mercados integrados y fuerte exposición a cadenas globales.' },
    { id: 'sierra', label: 'Sierra', note: 'Persistencia de brechas territoriales, diversidad lingüística y patrones alimentarios diferenciados.' },
    { id: 'selva', label: 'Selva', note: 'Alta diversidad sociocultural, dispersión territorial y retos de acceso, regulación y provisión de servicios.' }
  ],

  variables: [
    { id: 'urban_pressure', axis: 'regional', label: 'Presión urbana', kind: 'stock', unit: 'índice', trend: '↑', description: 'Presión acumulada sobre vivienda, servicios, infraestructura y gobernanza territorial.', evidence: ['inei_censos'] },
    { id: 'migration', axis: 'regional', label: 'Movilidad / migración interna', kind: 'flow', unit: 'índice', trend: '↔', description: 'Flujo territorial que redistribuye población, demanda, redes y oportunidades.', evidence: ['inei_censos', 'matos_mar'] },
    { id: 'service_capacity', axis: 'regional', label: 'Capacidad estatal y de servicios', kind: 'stock', unit: 'índice', trend: '↔', description: 'Capacidad pública para proveer servicios, regular, responder territorialmente y absorber presión.', evidence: ['inei_enaho', 'crabtree_durand_capture'] },

    { id: 'global_market', axis: 'global', label: 'Penetración de mercados', kind: 'flow', unit: 'índice', trend: '↑', description: 'Intensidad de integración a cadenas, capitales y patrones globales de consumo.', evidence: ['faostat', 'worldbank_urban'] },
    { id: 'connectivity', axis: 'global', label: 'Conectividad digital', kind: 'stock', unit: 'índice', trend: '↑', description: 'Acceso acumulado a redes digitales, plataformas y circulación de información.', evidence: ['enapres_cultura'] },
    { id: 'illicit_flows', axis: 'global', label: 'Riesgo de flujos ilícitos', kind: 'flow', unit: 'índice', trend: '↔', description: 'Exposición sistémica a circulación, ocultamiento e integración de activos ilícitos en redes económicas legales e ilegales.', evidence: ['buscaglia_lavado'] },

    { id: 'informality', axis: 'social', label: 'Informalidad', kind: 'stock', unit: '% / índice', trend: '↑', description: 'Peso de arreglos económicos y sociales fuera de la formalidad institucional.', evidence: ['inei_enaho', 'matos_mar'] },
    { id: 'community_networks', axis: 'social', label: 'Redes comunitarias', kind: 'stock', unit: 'índice', trend: '↔', description: 'Capacidad de organización, apoyo mutuo y respuesta social no estatal.', evidence: ['matos_mar', 'bdpi', 'mate_normal'] },
    { id: 'social_conflict', axis: 'social', label: 'Conflictividad social', kind: 'flow', unit: 'eventos / índice', trend: '↔', description: 'Manifestación observable de tensiones distributivas, territoriales, políticas e institucionales.', evidence: ['crabtree_durand_capture'] },
    { id: 'systemic_corruption', axis: 'social', label: 'Corrupción sistémica', kind: 'stock', unit: 'índice', trend: '↔', description: 'Persistencia de redes de patronazgo, impunidad y prácticas corruptas con efectos acumulativos sobre instituciones y desarrollo.', evidence: ['quiroz_corrupcion'] },
    { id: 'political_capture', axis: 'social', label: 'Captura política', kind: 'stock', unit: 'índice', trend: '↔', description: 'Concentración de influencia privada sobre decisiones, reglas e instituciones públicas.', evidence: ['crabtree_durand_capture', 'quiroz_corrupcion'] },
    { id: 'institutional_trust', axis: 'social', label: 'Confianza institucional', kind: 'stock', unit: 'índice', trend: '↓', description: 'Legitimidad y confianza social acumulada en instituciones democráticas y capacidad pública.', evidence: ['crabtree_durand_capture'] },
    { id: 'institutional_integrity', axis: 'social', label: 'Integridad y controles', kind: 'stock', unit: 'índice', trend: '↔', description: 'Capacidad de prevención, fiscalización, coordinación, investigación patrimonial-financiera y rendición de cuentas.', evidence: ['buscaglia_lavado', 'quiroz_corrupcion'] },
    { id: 'social_stress', axis: 'social', label: 'Estrés social acumulado', kind: 'stock', unit: 'índice', trend: '↑', description: 'Carga biopsicosocial asociada a desigualdad, baja agencia, aislamiento, inseguridad y tensiones sociopolíticas.', evidence: ['mate_normal', 'crabtree_durand_capture'] },

    { id: 'upf', axis: 'nutrition', label: 'Exposición a ultraprocesados', kind: 'flow', unit: 'índice', trend: '↑', description: 'Exposición relativa a productos ultraprocesados y patrones alimentarios estandarizados.', evidence: ['ins_observate', 'faostat'] },
    { id: 'double_burden', axis: 'nutrition', label: 'Doble carga nutricional', kind: 'stock', unit: 'índice', trend: '↑', description: 'Coexistencia de déficits nutricionales y exceso de peso en una misma población.', evidence: ['endes', 'sien', 'who_peru'] },
    { id: 'food_diversity', axis: 'nutrition', label: 'Diversidad alimentaria', kind: 'stock', unit: 'índice', trend: '↓', description: 'Diversidad efectiva de alimentos y continuidad de sistemas alimentarios locales.', evidence: ['endes', 'faostat'] },

    { id: 'language_identity', axis: 'identity', label: 'Continuidad lingüística', kind: 'stock', unit: 'índice', trend: '↔', description: 'Persistencia y transmisión de lenguas indígenas u originarias.', evidence: ['bdpi'] },
    { id: 'cultural_resilience', axis: 'identity', label: 'Resiliencia cultural', kind: 'stock', unit: 'índice', trend: '↔', description: 'Capacidad de sostener, adaptar y recombinar prácticas culturales frente a presiones externas.', evidence: ['bdpi', 'unesco_ich', 'garcia_canclini'] },
    { id: 'discrimination', axis: 'identity', label: 'Discriminación percibida', kind: 'flow', unit: 'índice', trend: '↑', description: 'Experiencia o percepción de exclusión asociada a origen, lengua, rasgos o pertenencia.', evidence: ['bdpi', 'mate_normal'] }
  ],

  axisRelations: [
    { source: 'global', target: 'regional', polarity: '+', loop: 'R1', label: 'Integración → concentración' },
    { source: 'regional', target: 'social', polarity: '+', loop: 'R1', label: 'Presión → adaptación y tensión social' },
    { source: 'social', target: 'identity', polarity: '+', loop: 'R2', label: 'Redes → reconfiguración' },
    { source: 'global', target: 'nutrition', polarity: '+', loop: 'R3', label: 'Mercados → transición alimentaria' },
    { source: 'nutrition', target: 'identity', polarity: '-', loop: 'B1', label: 'Estandarización ↔ tradición' },
    { source: 'identity', target: 'social', polarity: '+', loop: 'R2', label: 'Pertenencia → redes' },
    { source: 'global', target: 'social', polarity: '+', loop: 'R4', label: 'Capitales y mercados → poder e instituciones' }
  ],

  causalRelations: [
    { source: 'migration', target: 'urban_pressure', polarity: '+', delay: 'corto', evidence: ['inei_censos'], evidenceLevel: 'apoyada' },
    { source: 'service_capacity', target: 'urban_pressure', polarity: '-', delay: 'medio', evidence: ['inei_censos', 'crabtree_durand_capture'], evidenceLevel: 'apoyada' },
    { source: 'urban_pressure', target: 'informality', polarity: '+', delay: 'medio', evidence: ['inei_enaho', 'matos_mar'], evidenceLevel: 'hipótesis' },
    { source: 'community_networks', target: 'cultural_resilience', polarity: '+', delay: 'medio', evidence: ['matos_mar', 'bdpi'], evidenceLevel: 'apoyada' },
    { source: 'global_market', target: 'upf', polarity: '+', delay: 'corto', evidence: ['ins_observate', 'faostat'], evidenceLevel: 'apoyada' },
    { source: 'upf', target: 'double_burden', polarity: '+', delay: 'largo', evidence: ['ins_observate', 'endes', 'who_peru'], evidenceLevel: 'hipótesis' },
    { source: 'food_diversity', target: 'double_burden', polarity: '-', delay: 'largo', evidence: ['endes', 'sien', 'faostat'], evidenceLevel: 'hipótesis' },
    { source: 'connectivity', target: 'global_market', polarity: '+', delay: 'corto', evidence: ['enapres_cultura'], evidenceLevel: 'hipótesis' },
    { source: 'global_market', target: 'cultural_resilience', polarity: '-', delay: 'largo', evidence: ['garcia_canclini', 'quijano'], evidenceLevel: 'hipótesis' },
    { source: 'language_identity', target: 'cultural_resilience', polarity: '+', delay: 'medio', evidence: ['bdpi'], evidenceLevel: 'apoyada' },
    { source: 'discrimination', target: 'social_conflict', polarity: '+', delay: 'medio', evidence: ['bdpi', 'mate_normal'], evidenceLevel: 'hipótesis' },
    { source: 'cultural_resilience', target: 'community_networks', polarity: '+', delay: 'medio', evidence: ['bdpi', 'matos_mar'], evidenceLevel: 'apoyada' },

    { source: 'systemic_corruption', target: 'political_capture', polarity: '+', delay: 'medio', evidence: ['quiroz_corrupcion', 'crabtree_durand_capture'], evidenceLevel: 'apoyada' },
    { source: 'political_capture', target: 'institutional_trust', polarity: '-', delay: 'medio', evidence: ['crabtree_durand_capture'], evidenceLevel: 'apoyada' },
    { source: 'institutional_integrity', target: 'systemic_corruption', polarity: '-', delay: 'medio', evidence: ['quiroz_corrupcion', 'buscaglia_lavado'], evidenceLevel: 'apoyada' },
    { source: 'political_capture', target: 'service_capacity', polarity: '-', delay: 'largo', evidence: ['crabtree_durand_capture'], evidenceLevel: 'hipótesis' },
    { source: 'illicit_flows', target: 'systemic_corruption', polarity: '+', delay: 'corto', evidence: ['buscaglia_lavado'], evidenceLevel: 'apoyada' },
    { source: 'institutional_integrity', target: 'illicit_flows', polarity: '-', delay: 'corto', evidence: ['buscaglia_lavado'], evidenceLevel: 'apoyada' },
    { source: 'informality', target: 'illicit_flows', polarity: '+', delay: 'medio', evidence: ['buscaglia_lavado'], evidenceLevel: 'hipótesis' },
    { source: 'political_capture', target: 'social_conflict', polarity: '+', delay: 'medio', evidence: ['crabtree_durand_capture'], evidenceLevel: 'hipótesis' },
    { source: 'institutional_trust', target: 'social_stress', polarity: '-', delay: 'medio', evidence: ['crabtree_durand_capture', 'mate_normal'], evidenceLevel: 'hipótesis' },
    { source: 'community_networks', target: 'social_stress', polarity: '-', delay: 'medio', evidence: ['mate_normal'], evidenceLevel: 'hipótesis' },
    { source: 'social_stress', target: 'double_burden', polarity: '+', delay: 'largo', evidence: ['mate_normal', 'endes'], evidenceLevel: 'hipótesis' },
    { source: 'social_stress', target: 'cultural_resilience', polarity: '-', delay: 'medio', evidence: ['mate_normal', 'garcia_canclini'], evidenceLevel: 'hipótesis' }
  ],

  sources: [
    { id: 'endes', category: 'Nutrición y salud', institution: 'INEI', name: 'Encuesta Demográfica y de Salud Familiar (ENDES)', coverage: 'Nacional y subnacional; serie periódica', update: 'Continua/anual', type: 'Cuantitativa oficial', role: 'calibración', url: 'https://encuestas.inei.gob.pe/endes/', use: 'Anemia, nutrición materno-infantil, salud y variables demográficas. Fuente de calibración prioritaria.' },
    { id: 'sien', category: 'Nutrición y salud', institution: 'INS/CENAN', name: 'SIEN-HIS / Sistema de Información del Estado Nutricional', coverage: 'Establecimientos de salud MINSA; local, regional y nacional', update: 'Registro continuo', type: 'Vigilancia oficial', role: 'calibración', url: 'https://observateperu.ins.gob.pe/node/108', use: 'Seguimiento de estado nutricional de niños y gestantes; útil para series temporales y alertas territoriales.' },
    { id: 'ins_observate', category: 'Nutrición y salud', institution: 'INS/CENAN', name: 'Observatorio de Nutrición y Estudio del Sobrepeso y Obesidad', coverage: 'Perú', update: 'Informes periódicos', type: 'Vigilancia / evaluación', role: 'calibración', url: 'https://observateperu.ins.gob.pe/', use: 'Sobrepeso, obesidad, determinantes, políticas alimentarias y exposición a patrones de consumo.' },
    { id: 'inei_enaho', category: 'Sociedad y economía', institution: 'INEI', name: 'Encuesta Nacional de Hogares (ENAHO)', coverage: 'Nacional y departamental', update: 'Continua/anual', type: 'Cuantitativa oficial', role: 'calibración', url: 'https://www.inei.gob.pe/', use: 'Pobreza, empleo, informalidad, servicios, ingresos y brechas territoriales.' },
    { id: 'inei_censos', category: 'Historia territorial', institution: 'INEI', name: 'Censos Nacionales y perfiles sociodemográficos', coverage: '1940–2017 y nuevos productos censales', update: 'Censal', type: 'Histórica cuantitativa', role: 'calibración', url: 'https://www.inei.gob.pe/', use: 'Urbanización, distribución territorial, lengua, vivienda y transformaciones de largo plazo.' },
    { id: 'bdpi', category: 'Cultura e identidad', institution: 'Ministerio de Cultura', name: 'Base de Datos Oficial de Pueblos Indígenas u Originarios (BDPI)', coverage: '55 pueblos; información territorial, lingüística y sociodemográfica', update: 'Actualización continua', type: 'Oficial cultural / geográfica', role: 'calibración', url: 'https://bdpi.cultura.gob.pe/', use: 'Pueblos, localidades, lenguas, territorio, indicadores sociales e historia cultural.' },
    { id: 'enapres_cultura', category: 'Cultura e identidad', institution: 'Ministerio de Cultura / INEI', name: 'ENAPRES Cultura / acceso a bienes y servicios culturales', coverage: 'Perú', update: 'Periódica', type: 'Cuantitativa cultural', role: 'calibración', url: 'https://www.datosabiertos.gob.pe/group/ministerio-de-cultura-mincul', use: 'Acceso y consumo de bienes/servicios culturales para operacionalizar exposición, participación y cambio cultural.' },
    { id: 'datos_cultura', category: 'Cultura e identidad', institution: 'Ministerio de Cultura', name: 'Plataforma Nacional de Datos Abiertos — datasets culturales', coverage: 'Perú', update: 'Según dataset', type: 'Datos abiertos', role: 'evidencia', url: 'https://www.datosabiertos.gob.pe/group/ministerio-de-cultura-mincul', use: 'Patrimonio, lenguas, puntos de cultura, lectura, museos y otros activos culturales descargables.' },
    { id: 'worldbank_urban', category: 'Historia territorial', institution: 'Banco Mundial / Naciones Unidas', name: 'Urban population (% of total population) — Peru', coverage: '1960–actualidad disponible', update: 'Anual', type: 'Serie internacional comparable', role: 'calibración', url: 'https://data.worldbank.org/indicator/SP.URB.TOTL.IN.ZS?locations=PE', use: 'Serie complementaria para urbanización de largo plazo; debe contrastarse con definiciones censales del INEI.' },
    { id: 'faostat', category: 'Nutrición y salud', institution: 'FAO', name: 'FAOSTAT — Food and Diet / Food Balances', coverage: 'Perú; series de oferta alimentaria desde 1961 y dominios dietarios recientes', update: 'Periódica', type: 'Serie internacional / API', role: 'calibración', url: 'https://www.fao.org/faostat/en/', use: 'Disponibilidad alimentaria, nutrientes, oferta y dietas. Útil para reconstruir la transición alimentaria de largo plazo y contrastar series nacionales.' },
    { id: 'who_peru', category: 'Nutrición y salud', institution: 'OMS', name: 'Global Health Observatory / NLiS — Peru', coverage: 'Perú; indicadores internacionalmente comparables', update: 'Según indicador', type: 'Serie internacional / validación', role: 'validación', url: 'https://data.who.int/countries/604', use: 'Validación externa de obesidad, malnutrición y otros indicadores de salud. Complementa ENDES e INS; no los sustituye.' },
    { id: 'agn_history', category: 'Historia territorial', institution: 'Archivo General de la Nación', name: 'Repositorio Histórico Digital del AGN', coverage: 'Fondos documentales del Perú; múltiples siglos y series archivísticas', update: 'Catálogo en expansión', type: 'Archivo histórico oficial', role: 'evidencia', url: 'https://fondosdocumentales.agn.gob.pe/', use: 'Fuentes primarias para estudiar transformación del Estado, territorio, propiedad, sociedad y memoria. Se usa como evidencia contextual, no como coeficiente automático.' },
    { id: 'bnp_digital', category: 'Cultura e identidad', institution: 'Biblioteca Nacional del Perú', name: 'BNP Digital', coverage: 'Libros, manuscritos, fotografía, audiovisuales y patrimonio bibliográfico peruano', update: 'Colección en expansión', type: 'Patrimonio documental oficial', role: 'evidencia', url: 'https://bibliotecadigital.bnp.gob.pe/home', use: 'Memoria visual y documental, prensa, fotografía, literatura e historia cultural para enriquecer Identidad e Historia.' },
    { id: 'unesco_ich', category: 'Cultura e identidad', institution: 'UNESCO', name: 'Patrimonio Cultural Inmaterial — Perú', coverage: 'Elementos peruanos inscritos en listas de patrimonio cultural inmaterial', update: 'Lista internacional actualizada', type: 'Registro internacional oficial', role: 'evidencia', url: 'https://ich.unesco.org/en/state/peru-PE?info=elements-on-the-lists', use: 'Cronología y evidencia institucional de prácticas culturales vivas.' },
    { id: 'matos_mar', category: 'Marco histórico-social', institution: 'Bibliografía especializada', name: 'José Matos Mar — desborde popular y transformación urbana', coverage: 'Perú contemporáneo', update: 'Fuente histórica', type: 'Teórica / histórica', role: 'conceptual', url: 'https://iep.org.pe/', use: 'Fundamenta mecanismos sobre migración, ciudad, informalidad, redes y reconfiguración social. No se usa como serie numérica.' },
    { id: 'quijano', category: 'Marco histórico-social', institution: 'Bibliografía especializada', name: 'Aníbal Quijano — colonialidad del poder', coverage: 'Perú / América Latina', update: 'Fuente teórica', type: 'Teórica', role: 'conceptual', url: 'https://biblioteca.clacso.edu.ar/', use: 'Marco para relaciones entre modernización, jerarquías, identidad y poder.' },
    { id: 'garcia_canclini', category: 'Marco histórico-social', institution: 'Bibliografía especializada', name: 'Néstor García Canclini — culturas híbridas', coverage: 'América Latina', update: 'Fuente teórica', type: 'Teórica', role: 'conceptual', url: 'https://www.sigloxxieditores.com.mx/', use: 'Marco para hibridación, consumo cultural y recombinación de prácticas tradicionales y modernas.' },

    { id: 'quiroz_corrupcion', category: 'Institucionalidad y poder', institution: 'Alfonso W. Quiroz / IEP-IDL', name: 'Historia de la corrupción en el Perú', coverage: 'Perú, larga duración histórica', update: 'Obra histórica', type: 'Histórica / académica', role: 'conceptual', url: '', use: 'Sustenta la lectura de corrupción como fenómeno sistémico, cíclico y acumulativo, vinculado a patronazgo, impunidad, gobernabilidad, instituciones y desarrollo. Documento aportado por el usuario; no se redistribuye.' },
    { id: 'crabtree_durand_capture', category: 'Institucionalidad y poder', institution: 'John Crabtree y Francisco Durand', name: 'Perú: élites del poder y captura política', coverage: 'Perú contemporáneo con perspectiva histórica', update: 'Obra 2017', type: 'Política / histórica', role: 'conceptual', url: '', use: 'Sustenta captura política, desconexión Estado-sociedad, debilidad representativa, asimetrías de poder y crisis de confianza. Documento aportado por el usuario; no se redistribuye.' },
    { id: 'buscaglia_lavado', category: 'Institucionalidad y poder', institution: 'Edgardo Buscaglia', name: 'Lavado de dinero y corrupción política', coverage: 'Comparada internacional', update: 'Obra especializada', type: 'Crimen organizado / institucional', role: 'conceptual', url: '', use: 'Aporta mecanismos sobre flujos ilícitos, facilitadores, controles patrimoniales y financieros, coordinación investigativa, debida diligencia y vulnerabilidades institucionales. Documento aportado por el usuario; no se redistribuye.' },
    { id: 'mate_normal', category: 'Salud, estrés y cultura', institution: 'Gabor Maté con Daniel Maté', name: 'The Myth of Normal: Trauma, Illness & Healing in a Toxic Culture', coverage: 'Marco internacional biopsicosocial', update: 'Obra 2022', type: 'Salud / cultura / conceptual', role: 'conceptual', url: '', use: 'Aporta un marco para estrés social, desigualdad, baja agencia, aislamiento y conexión social como determinantes del bienestar. No es evidencia específica del Perú ni calibra coeficientes. Documento aportado por el usuario; no se redistribuye.' }
  ],

  history: [
    { year: '1750–1820', title: 'Corrupción colonial y reforma frustrada', source: 'quiroz_corrupcion', note: 'Patronazgo, privilegios, contrabando y límites de la modernización administrativa aparecen como antecedentes de larga duración.' },
    { year: '1821–1899', title: 'República, redes y ciclos de corrupción', source: 'quiroz_corrupcion', note: 'La obra de Quiroz reconstruye ciclos de patronazgo, deuda, renta pública y corrupción con costos institucionales y económicos.' },
    { year: '1900–2000', title: 'Modernización, autoritarismo y persistencias', source: 'quiroz_corrupcion', note: 'Cambian los mecanismos, pero persisten incentivos informales, redes, impunidad y captura de instituciones.' },
    { year: '1940', title: 'Base censal histórica', source: 'inei_censos', note: 'Punto de referencia para observar urbanización y redistribución territorial de largo plazo.' },
    { year: '1961–1993', title: 'Aceleración urbana y migratoria', source: 'inei_censos', note: 'Los censos permiten reconstruir la expansión urbana y las brechas urbano-rurales.' },
    { year: '1984', title: 'Desborde popular', source: 'matos_mar', note: 'Marco interpretativo para redes informales, migración y transformación del Estado y la ciudad.' },
    { year: '1990–2017', title: 'Captura política y Estado desconectado', source: 'crabtree_durand_capture', note: 'Se incorporan asimetrías de poder, representación limitada, presión privada y crisis de confianza institucional.' },
    { year: '2000–actualidad', title: 'Flujos ilícitos y controles transnacionales', source: 'buscaglia_lavado', note: 'La lente institucional incorpora coordinación penal, patrimonial y financiera, debida diligencia e inteligencia financiera como contrapesos.' },
    { year: '2007–2017', title: 'Nueva comparación intercensal', source: 'inei_censos', note: 'Permite evaluar continuidad del proceso de concentración, servicios, lengua e identidad.' },
    { year: '2010–2025', title: 'Patrimonio cultural vivo y memoria digital', source: 'unesco_ich', note: 'UNESCO, BDPI, AGN y BNP Digital amplían la lectura de continuidad cultural.' },
    { year: '2022–actualidad', title: 'Carga biopsicosocial y cultura', source: 'mate_normal', note: 'Se añade como marco conceptual la relación entre desigualdad, aislamiento, agencia, estrés social y bienestar; no como dato específico del Perú.' },
    { year: '2024–2026', title: 'Vigilancia social, nutricional y cultural', source: 'endes', note: 'ENDES, ENAHO, SIEN/INS y datos culturales permiten alimentar observaciones periódicas y territoriales.' }
  ],

  simulation: {
    disclaimer: 'Escenario sistémico experimental. No predice corrupción, lavado, salud ni resultados políticos. Todas las entradas y salidas son índices normalizados 0–100. Los signos causales se apoyan en fuentes cuando existe fundamento; las magnitudes y coeficientes son heurísticos y deben calibrarse con series oficiales antes de cualquier uso analítico.',
    periods: 24,
    defaults: { migration: 55, market: 65, capacity: 48, integrity: 42, community: 58, resilience: 57 },
    initial: { urban: 40, informal: 58, corruption: 46, capture: 44, illicit: 38, trust: 42, stress: 49, burden: 38, culture: 58 },
    calibrationSources: ['inei_censos', 'inei_enaho', 'endes', 'sien', 'ins_observate', 'bdpi', 'enapres_cultura', 'faostat', 'who_peru'],
    conceptualSources: ['quiroz_corrupcion', 'crabtree_durand_capture', 'buscaglia_lavado', 'mate_normal', 'matos_mar', 'quijano', 'garcia_canclini'],
    presets: [
      { id: 'baseline', label: 'Base exploratoria', values: { migration: 55, market: 65, capacity: 48, integrity: 42, community: 58, resilience: 57 } },
      { id: 'institutional', label: 'Fortalecimiento institucional', values: { migration: 55, market: 65, capacity: 72, integrity: 78, community: 62, resilience: 62 } },
      { id: 'capture', label: 'Alta vulnerabilidad institucional', values: { migration: 62, market: 75, capacity: 32, integrity: 24, community: 42, resilience: 42 } },
      { id: 'community', label: 'Resiliencia comunitaria', values: { migration: 58, market: 60, capacity: 55, integrity: 58, community: 82, resilience: 82 } }
    ]
  }
};
