# Explorador Socio-Técnico del Perú — Arquitectura V3 «Circulación»

## Objetivo

La V3 no reemplaza a la V1 ni a la V2. Añade una lectura que las anteriores no tenían:
en lugar de describir los cinco ejes y sus relaciones, describe **lo que circula entre
ellos** y a qué velocidad. De ahí el nombre.

Las tres versiones conviven en el mismo repositorio y se alcanzan desde el selector
superior de cualquiera de ellas.

## Principios

1. **Versionado no destructivo.** `index.html` (V1) y `v2.html` (V2) conservan su
   contenido. El único cambio en ellas es el enlace a la V3 en el selector de versión.
2. **Una sola fuente de verdad.** Todo el contenido analítico —ejes, variables,
   relaciones, indicadores, textos largos, fuentes, glosario y parámetros del
   simulador— vive en `v3-data.js`. La interfaz se genera a partir de ahí.
3. **Nivel de evidencia obligatorio.** Ninguna afirmación se muestra sin declarar si es
   `dato`, `documentada`, `hipotesis`, `estimacion` o `interpretacion`. Los cinco niveles
   tienen tratamiento visual distinto y no se mezclan.
4. **Interpretación separada, no eliminada.** Las lecturas de sentido existen porque el
   fenómeno las tiene, pero se aíslan en bloques marcados en rojo con una advertencia
   explícita de que no son rigurosas.
5. **Layout determinista antes que layout de fuerza.** Los grafos usan posiciones
   calculadas. Un `cose` reparte peor y cambia en cada carga, lo que impide memorizar
   el mapa. El layout de fuerza queda disponible como alternativa manual.
6. **Cero dependencias externas en tiempo de ejecución.** Cytoscape se sirve desde
   `vendor/`. La página funciona sin CDN.
7. **Todo texto es exportable.** El análisis debe poder salir de la interfaz y
   sobrevivir sin ella, en Markdown, JSON o CSV.

## Archivos

| Archivo | Rol |
|---|---|
| `v3.html` | Estructura, sprite de iconos SVG, carga de scripts |
| `v3.css` | Sistema visual: paleta básica, tema claro/oscuro, responsive, impresión |
| `v3-data.js` | Base de conocimiento completa (`window.V3`) |
| `v3-sim.js` | Motor estocástico sin DOM (`window.V3Sim`) |
| `v3-app.js` | Enrutado por capítulos, grafos, inspector, exportación |
| `vendor/cytoscape.min.js` | Cytoscape 3.26.0 (MIT), servido localmente |

## Modelo de datos (`v3-data.js`)

```
V3
├── meta            versión, tesis, advertencia, autoría, licencia
├── palette         los cinco colores básicos permitidos
├── axes[5]         ejes con rol, entradas, procesos, salidas y pregunta guía
├── cycle[4]        fases: expansión, saturación, crisis, reconfiguración
├── flows[5]        qué circula, su velocidad, su recorrido y su ancla empírica
├── variables[24]   stocks y flujos, con eje, tendencia y evidencia asociada
├── axisRelations   relaciones entre ejes, con polaridad y lazo (R/B)
├── causal[41]      relaciones entre variables: polaridad, retardo, nivel, evidencia
├── indicators[28]  cifras publicadas, con unidad, año, fuente y nota
├── nutrition       módulo: circuito, lecturas empíricas, interpretación, tensiones
├── corruption      módulo: tres marcos, bucle de seis nodos, vínculo y lectura
├── territory       Costa / Sierra / Selva en siete variables comparables
├── identity        bloques temáticos con fuente
├── history[16]     hitos anclados a eje y fuente
├── glossary[14]    términos operativos del modelo
├── sources[27]     fichas con institución, cobertura, rol y uso
└── simulation      parámetros, salidas, presets y advertencia
```

## Grafos y distribución

Tres lentes usan Cytoscape con posiciones calculadas a mano:

**Sistema.** Los cinco ejes se colocan en un pentágono de radio 210 y las cuatro fases
del ciclo en un anillo exterior de radio 380, desfasadas medio sector para que queden
entre los ejes. El anillo comunica que cualquier relación entre ejes se lee distinto
según la fase en la que esté el sistema.

**Causal.** Distribución radial ponderada. Cada eje recibe un sector angular
proporcional a su número de variables —el eje social tiene ocho y necesita más arco—
y dentro del sector las variables alternan entre dos radios (240 y 352), de modo que
dos vecinas nunca quedan a la misma distancia del centro y sus etiquetas no colisionan.

**Bucle de corrupción.** Seis nodos en hexágono regular. Las aristas del lazo reforzador
se dibujan sólidas y las del balanceador, punteadas.

En las tres, las aristas animan su `line-dash-offset` para mostrar el sentido del flujo.
La animación se detiene cuando la pestaña pierde visibilidad y puede apagarse desde la
barra del grafo.

## Motor de simulación (`v3-sim.js`)

Nueve estados, seis parámetros, índices normalizados 0–100 con línea neutra en 50.
Cada estado se aproxima a un objetivo dependiente de los parámetros y de los otros
estados, con tasa de ajuste propia (el retardo).

**Estado inicial no neutro.** Arranca en un punto que ancla de forma ordinal el retrato
cualitativo de los indicadores —informalidad alta, confianza baja, carga nutricional
elevada— porque partir de 50 en todo produce trayectorias planas que no enseñan la
dinámica. Son anclas del modelo, no mediciones.

**Escenario aleatorio válido.** No se sortean seis números independientes. Se muestrean
tres factores latentes por Box–Muller —institucional, comunitario y de exposición
externa— y de ellos se derivan los seis parámetros con correlación realista, truncados
a su rango admisible. Así, capacidad estatal e integridad co-mueven, igual que cohesión
comunitaria y resiliencia cultural, y ningún escenario aleatorio resulta incoherente.

**Monte Carlo.** 240 escenarios válidos, banda de percentiles 10/50/90 del índice de
tensión por periodo, distribución de resultados por tercios y análisis de sensibilidad
por correlación de Pearson entre cada parámetro y la tensión final.

El generador es `mulberry32` con semilla visible y editable: cualquier resultado es
reproducible.

## Exportación

| Formato | Contenido |
|---|---|
| Markdown | Capítulo actual o dossier completo con los once capítulos |
| JSON | Modelo completo tal como lo consume la aplicación |
| CSV | Indicadores con fuente · relaciones causales con nivel · serie del simulador |
| PDF | Vía diálogo de impresión, con hoja de estilos dedicada |

## Qué falta

- Calibrar los coeficientes del simulador contra series oficiales. Hoy son heurísticos
  y así están declarados.
- Desagregación territorial de las variables del grafo causal: la lente Territorio usa
  datos reales, pero el modelo causal aún opera a nivel nacional.
- Ampliar el módulo de corrupción con series verificables de la Contraloría cuando se
  disponga de la fuente primaria; hoy el módulo es deliberadamente estructural.
- Series temporales para los indicadores: hoy son cortes, no trayectorias.
