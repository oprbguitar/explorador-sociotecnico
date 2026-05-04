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
        { id: 1, name: 'EXPANSION', desc: 'Aumenta integración con mercados, conectividad, migración y circulación de normas.' },
        { id: 2, name: 'SATURACION', desc: 'Servicios, cuerpos, identidades y territorios absorben más presión que capacidad de ajuste.' },
        { id: 3, name: 'CRISIS', desc: 'Aparecen conflicto, malestar, doble carga nutricional, desconfianza o ruptura ecológica.' },
        { id: 4, name: 'RECONFIGURACION', desc: 'Surgen regulaciones, redes comunitarias, hibridaciones, retornos locales o nuevos arreglos.' }
    ],

    initSourcesData: function() {
        this.addEvidence({
            source: 'deep-research-report (1).md',
            type: 'Síntesis',
            status: '[VALIDADO]',
            axes: ['eje_regional', 'eje_social', 'eje_identidad'],
            content: 'INEI reporta pobreza monetaria diferenciada (30.9% Sierra, 30.0% Selva, 25.2% Costa). La informalidad laboral es del 70.9%.',
            tensions: ['Territorio vs Centralismo']
        });
        this.addEvidence({
            source: 'deep-research-report (2).md',
            type: 'Síntesis',
            status: '[VALIDADO]',
            axes: ['eje_nutricion', 'eje_regional'],
            content: 'ENDES 2024 muestra anemia infantil de 43.1% en Sierra y 44.1% en Selva frente a 27.0% en Costa. Transición alimentaria y doble carga.',
            tensions: ['UPF vs Tradición']
        });
        this.addEvidence({
            source: 'Ingeniería Social_ Ejes y Tensiones.pdf',
            type: 'Teórico',
            status: '[SÍNTESIS]',
            axes: ['eje_social', 'eje_identidad'],
            content: 'La obra de Matos Mar "Desborde popular y crisis del Estado" y Quijano sobre colonialidad del poder explican la informalidad no como margen, sino como sistema operativo.',
            tensions: []
        });
    },

    addEvidence: function(evidence) {
        this.state.evidences.push({
            id: 'ev_' + Date.now() + Math.floor(Math.random()*1000),
            timestamp: new Date().toISOString(),
            ...evidence
        });
    },

    getEvidenceForAxis: function(axisId) {
        return this.state.evidences.filter(e => e.axes.includes(axisId));
    }
};

SystemCore.initSourcesData();
