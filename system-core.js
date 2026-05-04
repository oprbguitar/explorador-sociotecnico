// Core Framework Definitions for Socio-Technical Guide

const SystemCore = {
    state: {
        mode: 'CONSTRUCTOR',
        activeLevel: 1,
        evidences: [],
        currentCycleStage: null,
    },

    axes: [
        {
            id: 'eje_regional',
            name: '1 REGIONAL',
            shortName: 'Regional',
            role: 'Desigualdades territoriales y entornos operativos (Costa / Sierra / Selva)',
            inputs: ['Geografía', 'Agua y saneamiento', 'Infraestructura'],
            processes: ['Adaptación territorial', 'Concentración urbana', 'Intercambio costa-sierra-selva'],
            outputs: ['Desigualdad territorial', 'Migración', 'Perfiles productivos', 'Acceso diferencial a servicios'],
            stateVariables: [
                { name: 'Pobreza por región natural', type: 'Stock', trend: '↑', impact: 'Alta' },
                { name: 'Agua por red pública', type: 'Flujo', trend: '↑', impact: 'Alta' },
                { name: 'Saneamiento', type: 'Stock', trend: '↑', impact: 'Alta' },
                { name: 'Pueblos y lenguas', type: 'Flujo', trend: '↑', impact: 'Media' }
            ],
            color: '#00b0b9', // Teal/cyan for Regional (from image)
            icon: 'mountain'
        },
        {
            id: 'eje_global',
            name: '2 INFLUENCIAS GLOBALES',
            shortName: 'Influencias Globales',
            role: 'Presiones macroeconómicas, geopolíticas y flujos de capital',
            inputs: ['Inversión extranjera', 'Mercado global', 'Conectividad', 'Tecnologías importadas'],
            processes: ['Adaptación de mercados', 'Dependencia tecnológica', 'Norma como compuertas'],
            outputs: ['Vulnerabilidad externa', 'Modernización asimétrica', 'Políticas estandarizadas'],
            stateVariables: [
                { name: 'Inversión extranjera directa', type: 'Flujo', trend: '↑', impact: 'Alta' },
                { name: 'Penetración de internet', type: 'Stock', trend: '↑', impact: 'Media' },
                { name: 'Apertura comercial', type: 'Estado', trend: '↔', impact: 'Alta' }
            ],
            color: '#6366f1', // Indigo for Global
            icon: 'globe'
        },
        {
            id: 'eje_social',
            name: '3 ACCIONAR SOCIAL',
            shortName: 'Accionar Social',
            role: 'Informalidad, movilización, redes como sistema operativo',
            inputs: ['Descontento social', 'Organización civil', 'Redes informales'],
            processes: ['Movilización', 'Estrategias de supervivencia', 'Desborde popular'],
            outputs: ['Informalidad laboral (70.9%)', 'Redes comunitarias', 'Nuevos pactos sociales'],
            stateVariables: [
                { name: 'Tasa de informalidad', type: 'Stock', trend: '↑', impact: 'Alta' },
                { name: 'Conflictividad social', type: 'Flujo', trend: '↑', impact: 'Alta' },
                { name: 'Aprobación del gobierno', type: 'Stock', trend: '↓', impact: 'Alta' }
            ],
            color: '#eab308', // Yellow/Orange for Social
            icon: 'users'
        },
        {
            id: 'eje_nutricion',
            name: '4 NUTRICIÓN GLOBALIZADA',
            shortName: 'Nutrición Globalizada',
            role: 'Doble carga, transición alimentaria, el cuerpo como sensor',
            inputs: ['Cadenas de ultraprocesados (UPF)', 'Sistemas alimentarios locales'],
            processes: ['Estandarización de dietas', 'Transición nutricional', 'Pérdida de agrobiodiversidad'],
            outputs: ['Anemia infantil (35.3%)', 'Obesidad central', 'Marca país gastronómica'],
            stateVariables: [
                { name: 'Consumo de UPF', type: 'Flujo', trend: '↑', impact: 'Alta' },
                { name: 'Doble carga nutricional', type: 'Stock', trend: '↑', impact: 'Alta' },
                { name: 'Diversidad alimentaria', type: 'Flujo', trend: '↓', impact: 'Media' }
            ],
            color: '#ef4444', // Red for Nutrition
            icon: 'utensils'
        },
        {
            id: 'eje_identidad',
            name: '5 IDENTIDAD',
            shortName: 'Identidad',
            role: 'Heterogeneidad, acceso diferencial, nodo dinámico del "Yo"',
            inputs: ['Narrativas mediáticas', 'Origen étnico y lengua', 'Migración'],
            processes: ['Hibridación cultural (García Canclini)', 'Reconfiguración de fronteras (Barth)', 'Alienación'],
            outputs: ['Proyectos de vida urbanos', 'Identidad mestiza tensionada', 'Desigualdad racializada'],
            stateVariables: [
                { name: 'Población originaria/lengua', type: 'Stock', trend: '↔', impact: 'Media' },
                { name: 'Percepción de discriminación', type: 'Flujo', trend: '↑', impact: 'Alta' },
                { name: 'Cohesión identitaria', type: 'Estado', trend: '↓', impact: 'Alta' }
            ],
            color: '#22c55e', // Green for Identity (from image)
            icon: 'fingerprint'
        }
    ],

    relations: [
        { source: 'eje_global', target: 'eje_regional', type: 'directa', loop: 'R', description: 'Desigualdades territoriales' },
        { source: 'eje_regional', target: 'eje_social', type: 'mediada', loop: 'R', description: 'Migración y desborde popular' },
        { source: 'eje_social', target: 'eje_identidad', type: 'directa', loop: 'R', description: 'Reconfiguración del mestizaje' },
        { source: 'eje_nutricion', target: 'eje_identidad', type: 'directa', loop: 'B', description: 'Tensión entre tradición e imposición externa' },
        { source: 'eje_global', target: 'eje_nutricion', type: 'directa', loop: 'R', description: 'Homogeneización cultural y UPFs' },
        { source: 'eje_regional', target: 'eje_nutricion', type: 'directa', loop: 'R', description: 'Transición alimentaria por migración' }
    ],

    cycleStages: [
        { id: 1, name: 'EXPANSION', desc: 'Aumenta integración con mercados, conectividad, migración y circulación de normas.', output: 'Acumulación de inputs externos' },
        { id: 2, name: 'SATURACION', desc: 'Servicios, cuerpos, identidades y territorios absorben más presión que capacidad de ajuste.', output: 'Estrés sistémico y cuellos de botella' },
        { id: 3, name: 'CRISIS', desc: 'Aparecen conflicto, malestar, doble carga nutricional, desconfianza o ruptura ecológica.', output: 'Umbral crítico superado' },
        { id: 4, name: 'RECONFIGURACION', desc: 'Surgen regulaciones, redes comunitarias, hibridaciones, retornos locales o nuevos arreglos.', output: 'Nuevo piso de normalidad informal' }
    ],

    initSourcesData: function() {
        this.addEvidence({
            source: 'deep-research-report (1).md (Sec: Regional Heterogeneity)',
            type: 'Síntesis Analítica',
            status: '[VALIDADO]',
            axes: ['eje_regional'],
            content: 'El INEI proyectó 26 ciudades con más de 100,000 habitantes en 2024. Lima Metropolitana alcanzó 10.29 millones (30.2% de la población nacional). La pobreza monetaria sigue siendo fuertemente territorial: 30.9% en la Sierra, 30.0% en la Selva y 25.2% en la Costa. Además, la población pobre tiene mayor porcentaje de hablantes de lengua nativa (19.0% vs 15.0%).',
            tensions: ['Desigualdad territorial histórica', 'Centralismo demográfico']
        });
        
        this.addEvidence({
            source: 'deep-research-report (1).md (Sec: Migration & Informality)',
            type: 'Síntesis Teórica-Empírica',
            status: '[VALIDADO]',
            axes: ['eje_social', 'eje_regional'],
            content: 'La informalidad laboral alcanzó el 70.7% (Abril 2024 - Marzo 2025). Ciudades como Juliaca, Pucallpa y Ayacucho lideran estas tasas, mientras que Lima mantiene un 56.9%. Usando el marco de José Matos Mar (Desborde popular), la informalidad no es un residuo, sino la forma en que el sistema opera en realidad.',
            tensions: ['Estado vs. Redes informales', 'Supervivencia urbana']
        });
        
        this.addEvidence({
            source: 'deep-research-report (2).md (Sec: Food Transition)',
            type: 'Dato Epidemiológico',
            status: '[VALIDADO]',
            axes: ['eje_nutricion', 'eje_regional', 'eje_global'],
            content: 'Perú enfrenta una "doble carga nutricional". Mientras la anemia infantil (6-35 meses) persiste altísima en la Sierra (43.1%) y Selva (44.1%) comparada con la Costa (27.0%), el consumo de productos ultraprocesados (UPF) ya representa el 27% de la ingesta energética en niños y es consumido por el 86%.',
            tensions: ['Desnutrición vs. Obesidad', 'Patrones tradicionales vs. UPF']
        });

        this.addEvidence({
            source: 'Ingeniería Social_ Ejes y Tensiones.pdf',
            type: 'Marco Conceptual',
            status: '[SÍNTESIS]',
            axes: ['eje_identidad', 'eje_global'],
            content: 'La hibridación (García Canclini) y la transculturación (Fernando Ortiz) explican cómo las formas globales (comida rápida, redes digitales) son apropiadas localmente. Sin embargo, Aníbal Quijano advierte que esta mezcla ocurre dentro de una matriz colonial de poder desigual.',
            tensions: ['Hibridación vs. Colonialidad del poder']
        });
        
        this.addEvidence({
            source: 'Evaluación Sistémica de Fuentes',
            type: 'Hipótesis del Sistema',
            status: '[ABIERTO]',
            axes: ['eje_identidad', 'eje_nutricion'],
            content: 'Se detecta un vacío de investigación en cómo la subjetividad individual (Eje 5) se reconfigura específicamente bajo el consumo de plataformas digitales y su relación cruzada con el consumo de ultraprocesados en entornos rurales.',
            tensions: ['Identidad algorítmica vs. Identidad territorial']
        });
    },

    addEvidence: function(evidence) {
        this.state.evidences.push({
            id: 'ev_' + Date.now() + Math.floor(Math.random()*1000),
            timestamp: new Date().toISOString(),
            ...evidence
        });
    },

    metodologia: [
        { 
            fuente: 'Tesis INEI & Documentos Demográficos', 
            tipo: 'Empírica Cuantitativa', 
            aporte: 'Validación del Eje Regional. Permitió estructurar las variables de Estado y Flujo poblacional, demostrando matemáticamente cómo la concentración en 26 ciudades fuerza el desborde de servicios.',
            enlace: './fuentes/deep-research-report (1).md',
            detalles_extensos: 'El análisis poblacional del INEI proyecta cómo la masa migratoria presiona directamente los sistemas de saneamiento y vivienda, sirviendo como la "Entrada" principal al Lazo Reforzador de la informalidad urbana.'
        },
        { 
            fuente: 'José Matos Mar (Desborde Popular)', 
            tipo: 'Teórica Histórica', 
            aporte: 'Proveyó el mecanismo causal (Lazo Reforzador) entre la migración andina y la creación de redes informales urbanas (Eje Accionar Social).',
            enlace: './fuentes/Ingeniería Social_ Ejes y Tensiones.pdf',
            detalles_extensos: 'Matos Mar argumenta que la informalidad no es una falla temporal, sino el nuevo sistema operativo del Perú urbano, donde las masas migrantes asimilan funciones que el Estado fue incapaz de proveer.'
        },
        { 
            fuente: 'Aníbal Quijano (Colonialidad del Poder)', 
            tipo: 'Teórica Decolonial', 
            aporte: 'Configuró el Eje Identidad. Explicó por qué la asimilación global no es horizontal, sino que opera bajo sistemas de jerarquización racializados que tensionan el Yo mestizo.',
            enlace: './fuentes/Ingeniería Social_ Ejes y Tensiones.pdf',
            detalles_extensos: 'El marco de Quijano fundamenta por qué el Eje Identitario choca constantemente con las Influencias Globales: el sistema-mundo moderno clasifica a la población mediante el constructo mental de la "raza".'
        },
        { 
            fuente: 'Datos ENDES (Salud Nutricional)', 
            tipo: 'Empírica Epidemiológica', 
            aporte: 'Fundamentó el Eje de Nutrición Globalizada al demostrar cuantitativamente la "Doble Carga Nutricional": coexistencia de desnutrición crónica (sierra/selva) y obesidad explosiva por UPFs.',
            enlace: './fuentes/deep-research-report (2).md',
            detalles_extensos: 'Muestra estadísticamente el ciclo de Saturación: mientras un 43% de niños en la sierra sufre anemia, el 86% a nivel nacional ya consume ultraprocesados (UPF), desplazando dietas de agrobiodiversidad.'
        },
        { 
            fuente: 'García Canclini (Culturas Híbridas)', 
            tipo: 'Teórica Cultural', 
            aporte: 'Determinó el concepto de "Reconfiguración". Permitió entender que la crisis de identidad en Perú no termina en colapso, sino en "hibridación" (mezcla de la tradición con la modernidad tecnológica).',
            enlace: './fuentes/Ingeniería Social_ Ejes y Tensiones.pdf',
            detalles_extensos: 'Justifica teóricamente la última fase del ciclo sistémico (Reconfiguración): las identidades tradicionales no desaparecen, sino que se intersectan con flujos globales, generando estrategias de supervivencia híbridas.'
        }
    ],

    getEvidenceForAxis: function(axisId) {
        return this.state.evidences.filter(e => e.axes.includes(axisId));
    }
};

SystemCore.initSourcesData();
