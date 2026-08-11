# Explorador Socio-Técnico del Perú — Arquitectura V2

## Objetivo

La V2 amplía el proyecto sin sustituir la V1. La V1 conserva la experiencia visual original; la V2 introduce múltiples lentes sobre una misma base conceptual y documental, inspirándose en patrones de herramientas como ContextFlow, exploradores de knowledge graphs y software de dinámica de sistemas.

## Principios

1. **Versionado no destructivo:** `index.html` continúa siendo V1. La V2 vive en `v2.html` y archivos separados.
2. **Una base, múltiples lentes:** Sistema, Variables, Causal, Territorio, Historia, Nutrición, Evidencia y Simulación reutilizan las mismas entidades.
3. **Separación entre dato y modelo:** una fuente oficial no equivale a una hipótesis causal; una hipótesis causal no equivale a una predicción.
4. **Polaridad causal explícita:** las aristas usan `+` o `-`; los loops se identifican a nivel de circuito cuando corresponda.
5. **Trazabilidad:** variables y relaciones pueden vincularse a fuentes concretas.
6. **Simulación identificada:** la simulación inicial usa índices 0–100 y coeficientes heurísticos; no debe interpretarse como pronóstico.

## Archivos

- `index.html`: V1 original; solo incorpora acceso a V2.
- `system-core.js`: modelo V1, sin cambios en esta primera implementación.
- `app.js`: lógica V1, sin cambios en esta primera implementación.
- `v2.html`: interfaz V2.
- `v2.css`: sistema visual V2.
- `v2-data.js`: entidades, variables, relaciones, fuentes e hitos.
- `v2.js`: lentes, Cytoscape, inspector y simulador normalizado.
- `docs/SOURCE_REGISTRY.md`: fuentes recomendadas y estrategia de alimentación.

## Modelo V2

### Ejes

- Regional
- Influencias Globales
- Accionar Social
- Nutrición Globalizada
- Identidad

### Variables

Cada variable contiene `id`, `axis`, `label`, `kind`, `unit`, `trend` y `description`.

### Relaciones

`causalRelations` usa `source`, `target`, `polarity`, `delay` y `evidence`. La polaridad describe la dirección causal local; no se usa R/B como propiedad de una arista individual.

### Fuentes

`source` representa procedencia y función analítica. Se distinguen fuentes cuantitativas oficiales, vigilancia administrativa, datos culturales e históricos y bibliografía teórica.

## Evolución recomendada

La siguiente iteración debe incorporar un pipeline ETL separado (`data/observations/*.json`) con el esquema mínimo:

```json
{
  "variable_id": "informality",
  "value": 0,
  "unit": "%",
  "period": "YYYY",
  "territory": "PE",
  "source_id": "inei_enaho",
  "source_url": "...",
  "retrieved_at": "YYYY-MM-DD",
  "quality": "official"
}
```

Después de disponer de series consistentes, los coeficientes del simulador deben calibrarse y documentarse. Hasta entonces la V2 etiqueta el módulo como experimental y no predictivo.
