// Core Framework Definitions for Socio-Technical Guide

const SystemCore = {
    state: {
        mode: 'CONSTRUCTOR', // CONSTRUCTOR, ANALISTA DOCUMENTAL, GUIA INTERACTIVA
        activeLevel: 1, // 1: Orientación, 2: Análisis, 3: Profundidad Teórica
        evidences: [],
        currentCycleStage: null,
    },

    axes: [
        {
            id: 'eje_regional',
            name: '1. Eje Regional',
            role: 'Distribución y tensión territorial (Costa / Sierra / Selva)',
            inputs: ['Recursos geográficos', 'Migración interna', 'Políticas centralistas'],
            processes: ['Asimilación cultural', 'Extracción de recursos', 'Resistencia local'],
            outputs: ['Desigualdad estructural', 'Identidades híbridas', 'Conflictos socioambientales'],
            stateVariables: ['Grado de centralismo', 'Integración física'],
            color: '#10b981' // Green
        },
        {
            id: 'eje_global',
            name: '2. Eje de Influencias Globales',
            role: 'Presiones macroeconómicas y geopolíticas',
            inputs: ['Inversión extranjera', 'Tratados comerciales', 'Tecnologías importadas'],
            processes: ['Adaptación de mercados', 'Dependencia tecnológica'],
            outputs: ['Vulnerabilidad externa', 'Modernización asimétrica'],
            stateVariables: ['Nivel de dependencia', 'Apertura de mercado'],
            color: '#3b82f6' // Blue
        },
        {
            id: 'eje_social',
            name: '3. Eje de Accionar Social',
            role: 'Agencia, movimientos y respuesta comunitaria',
            inputs: ['Descontento social', 'Organización civil'],
            processes: ['Movilización', 'Negociación política', 'Protesta'],
            outputs: ['Reformas institucionales', 'Represión', 'Nuevos pactos sociales'],
            stateVariables: ['Nivel de conflictividad', 'Legitimidad institucional'],
            color: '#f59e0b' // Amber
        },
        {
            id: 'eje_nutricion',
            name: '4. Eje de Nutrición Globalizada',
            role: 'Intercambio material y simbólico del consumo',
            inputs: ['Cadenas de suministro global', 'Patrones de consumo', 'Modas'],
            processes: ['Estandarización de dietas', 'Fusión gastronómica'],
            outputs: ['Pérdida de agrobiodiversidad', 'Marca país (Boom gastronómico)'],
            stateVariables: ['Seguridad alimentaria', 'Diversidad de consumo'],
            color: '#ef4444' // Red
        },
        {
            id: 'eje_identidad',
            name: '5. Eje Identitario',
            role: '"Yo" en intersección (Subjetividad y agencia individual)',
            inputs: ['Narrativas mediáticas', 'Educación', 'Tradición familiar'],
            processes: ['Construcción de sentido', 'Alienación', 'Emancipación'],
            outputs: ['Proyectos de vida', 'Salud mental', 'Pertenencia'],
            stateVariables: ['Cohesión identitaria', 'Nivel de agencia individual'],
            color: '#8b5cf6' // Purple
        }
    ],

    relations: [
        { source: 'eje_global', target: 'eje_regional', type: 'directa', loop: 'B', description: 'Inversión extranjera presiona recursos regionales.', time: 'inmediato' },
        { source: 'eje_regional', target: 'eje_social', type: 'mediada', loop: 'R', description: 'Desigualdad regional alimenta accionar social.', time: 'estructural' },
        { source: 'eje_social', target: 'eje_identidad', type: 'directa', loop: 'R', description: 'Movimientos sociales reconfiguran la identidad colectiva e individual.', time: 'tardío' },
        { source: 'eje_nutricion', target: 'eje_identidad', type: 'directa', loop: 'B', description: 'Consumo global estandariza la expresión de identidad.', time: 'inmediato' },
        { source: 'eje_global', target: 'eje_nutricion', type: 'directa', loop: 'R', description: 'Cadenas globales imponen patrones de nutrición.', time: 'inmediato' },
    ],

    cycleStages: [
        { id: 1, name: 'Expansión', desc: 'Integración, crecimiento, acoplamiento.' },
        { id: 2, name: 'Saturación', desc: 'Choques, presiones, resistencias.' },
        { id: 3, name: 'Crisis', desc: 'Conflicto, declive, deslegitimación.' },
        { id: 4, name: 'Reconfiguración', desc: 'Innovación, adaptación, nuevas síntesis.' }
    ],

    addEvidence: function(evidence) {
        this.state.evidences.push({
            id: 'ev_' + Date.now(),
            timestamp: new Date().toISOString(),
            ...evidence
        });
    },

    getEvidenceForAxis: function(axisId) {
        return this.state.evidences.filter(e => e.axes.includes(axisId));
    },

    processSourceText: function(filename, text) {
        // Simulated AI extraction logic based on MODO 2: ANALISTA DOCUMENTAL
        console.log(`Procesando fuente: ${filename}`);
        
        // Simple heuristic extraction for demo purposes
        const hasConflict = text.toLowerCase().includes('conflicto') || text.toLowerCase().includes('tensión');
        const hasIdentity = text.toLowerCase().includes('identidad') || text.toLowerCase().includes('cultura');
        
        let axes = [];
        if (hasConflict) axes.push('eje_social', 'eje_regional');
        if (hasIdentity) axes.push('eje_identidad');
        if (axes.length === 0) axes.push('eje_global'); // fallback

        const snippet = text.substring(0, 150) + "...";

        this.addEvidence({
            source: filename,
            type: 'Síntesis',
            status: '[SÍNTESIS]',
            axes: axes,
            content: `Extracción automática de: ${filename}. Contexto: "${snippet}"`,
            tensions: hasConflict ? ['Tensión detectada en el texto sobre recursos/identidad'] : []
        });

        return {
            filename: filename,
            axesEnriched: axes,
            findings: 1,
            vacios: "Falta validación humana profunda de este documento.",
        };
    }
};
