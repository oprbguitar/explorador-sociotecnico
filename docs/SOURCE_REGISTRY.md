# Registro de fuentes — Explorador Socio-Técnico del Perú V2.1

## Criterio

Para alimentar el sistema se separan cinco funciones: **calibración cuantitativa**, **contexto territorial**, **evidencia cultural/histórica**, **fundamento teórico** y **estructura causal institucional**. No todas las fuentes deben alimentar ecuaciones numéricas.

## Fuentes prioritarias de datos y validación

| Fuente | Institución | Dominio | Uso en V2.1 | Integración recomendada |
|---|---|---|---|---|
| ENDES | INEI | Salud/nutrición | Anemia, salud materno-infantil y variables demográficas | Series descargadas y normalizadas |
| ENAHO | INEI | Social/económico | Pobreza, empleo, informalidad, servicios | Microdatos/series procesadas |
| Censos Nacionales | INEI | Historia territorial | Urbanización, lengua, vivienda, estructura territorial | Serie histórica censal |
| SIEN-HIS | INS/CENAN | Nutrición | Estado nutricional de niños y gestantes | Reportes y bases disponibles |
| OBSERVATE Perú | INS/CENAN | Nutrición | Sobrepeso, obesidad y determinantes | Informes y datasets publicados |
| BDPI | Ministerio de Cultura | Identidad/territorio | Pueblos, lenguas, localidades e indicadores sociales | Datos oficiales y capas geográficas |
| ENAPRES Cultura | MINCUL/INEI | Cultura | Acceso y consumo de bienes/servicios culturales | CSV/XLSX de Datos Abiertos |
| Datos Abiertos MINCUL | Ministerio de Cultura | Cultura | Patrimonio, lenguas, puntos de cultura, lectura, museos | CSV/XLSX según dataset |
| Urban population | Banco Mundial/ONU | Urbanización | Serie complementaria 1960–actualidad | API/CSV; contrastar con INEI |
| FAOSTAT | FAO | Alimentación/nutrición | Oferta alimentaria, nutrientes y transición dietaria de largo plazo | API/CSV; contraste longitudinal |
| GHO / NLiS Perú | OMS | Salud/nutrición | Indicadores internacionales comparables de obesidad y malnutrición | Validación externa; complementar ENDES/INS |
| Repositorio Histórico Digital | Archivo General de la Nación | Historia/memoria | Fuentes primarias sobre Estado, territorio y sociedad | Evidencia documental contextual |
| BNP Digital | Biblioteca Nacional del Perú | Cultura/historia | Libros, manuscritos, fotografía, audiovisuales y patrimonio | Evidencia documental y visual |
| Patrimonio Cultural Inmaterial — Perú | UNESCO | Cultura/identidad | Continuidad y reconocimiento de prácticas culturales vivas | Cronología y evidencia institucional |

## Fuentes históricas, institucionales y teóricas

| Fuente | Autor / institución | Aporte al modelo | Función |
|---|---|---|---|
| Desborde popular y transformación urbana | José Matos Mar | Migración, redes, informalidad y reconfiguración urbana | Conceptual/histórica |
| Colonialidad del poder | Aníbal Quijano | Poder, jerarquías, modernización e identidad | Conceptual |
| Culturas híbridas | Néstor García Canclini | Hibridación, consumo cultural y recombinación | Conceptual |
| Historia de la corrupción en el Perú | Alfonso W. Quiroz | Corrupción sistémica, ciclos históricos, patronazgo, impunidad, costos institucionales y desarrollo | Histórica/causal |
| Perú: élites del poder y captura política | John Crabtree y Francisco Durand | Captura política, Estado desconectado, asimetrías de poder, representación y confianza | Política/causal |
| Lavado de dinero y corrupción política | Edgardo Buscaglia | Flujos ilícitos, facilitadores, inteligencia financiera, debida diligencia y coordinación penal-patrimonial-financiera | Comparativa/institucional |
| The Myth of Normal | Gabor Maté con Daniel Maté | Desigualdad, baja agencia, aislamiento, conexión social y estrés desde un marco biopsicosocial | Conceptual internacional |

Los cuatro últimos documentos fueron aportados al proyecto como material de análisis. La aplicación registra metadatos y síntesis conceptuales, pero **no redistribuye los textos fuente**.

### Regla de interpretación

- Quiroz y Crabtree/Durand pueden fundamentar relaciones históricas e institucionales específicas del Perú, pero no convierten por sí solos una relación cualitativa en un coeficiente estadístico.
- Buscaglia aporta mecanismos comparados sobre lavado y controles institucionales; sus magnitudes internacionales no deben transferirse automáticamente al Perú.
- Maté se emplea como marco conceptual biopsicosocial. No es una fuente de calibración peruana ni se usa para atribuir causalidad clínica individual.
- FAOSTAT y OMS son fuentes secundarias internacionales para contraste longitudinal y validación; no desplazan a las fuentes nacionales cuando existe una medición peruana equivalente.

## Niveles de evidencia causal en V2.1

Las relaciones del grafo pueden etiquetarse como:

- `apoyada`: existe fundamento directo suficiente en las fuentes registradas para conservar la dirección causal como relación documentada.
- `hipótesis`: relación plausible que sirve para exploración sistémica y necesita validación empírica adicional antes de tratarse como relación observada.

Los coeficientes del simulador siguen siendo **heurísticos**, incluso cuando el signo de la relación está apoyado documentalmente.

## Pipeline futuro

1. Descargar o consultar una fuente oficial.
2. Conservar copia cruda con fecha de recuperación.
3. Transformar a esquema común de observaciones.
4. Registrar unidad, periodo, territorio y fuente.
5. Validar consistencia temporal y geográfica.
6. Vincular la serie a una variable solo después de la validación.
7. Calibrar parámetros y conservar la versión del modelo.
8. Separar claramente dato observado, indicador derivado, hipótesis y resultado simulado.

## Control de vigencia

Cada observación debe tener `period` y `retrieved_at`. La interfaz no debe mostrar un número como “actual” si su periodo no está registrado. Para indicadores con rezago estadístico se mostrará explícitamente el último periodo disponible.
