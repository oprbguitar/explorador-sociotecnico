# Registro de fuentes — Explorador Socio-Técnico del Perú V2

## Criterio

Para alimentar el sistema se separan cuatro funciones: **calibración cuantitativa**, **contexto territorial**, **evidencia cultural/histórica** y **fundamento teórico**. No todas las fuentes deben alimentar ecuaciones numéricas.

## Fuentes prioritarias

| Fuente | Institución | Dominio | Uso en V2 | Integración recomendada |
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

## Fuentes históricas y teóricas

- José Matos Mar: útil para formular mecanismos sobre migración, urbanización, redes e informalidad.
- Aníbal Quijano: útil para hipótesis sobre modernización, poder, jerarquías e identidad.
- Néstor García Canclini: útil para hibridación, consumo cultural y recombinación de prácticas.
- Repositorios y publicaciones del Ministerio de Cultura/BDPI: historia, cultura, lengua y localización de pueblos indígenas u originarios.
- Archivo General de la Nación y BNP Digital: fuentes primarias y patrimonio documental para reconstrucciones históricas.
- UNESCO Patrimonio Cultural Inmaterial: registro institucional de prácticas culturales vivas y su reconocimiento internacional.
- FAOSTAT y OMS: fuentes secundarias internacionales para contraste longitudinal y validación; no deben desplazar a las fuentes nacionales cuando exista medición peruana equivalente.

Estas fuentes **no deben transformarse automáticamente en coeficientes numéricos**. Su función es justificar estructura causal, construir hipótesis y contextualizar resultados.

## Pipeline futuro

1. Descargar o consultar una fuente oficial.
2. Conservar copia cruda con fecha de recuperación.
3. Transformar a esquema común de observaciones.
4. Registrar unidad, periodo, territorio y fuente.
5. Validar consistencia temporal y geográfica.
6. Solo después vincular la serie a una variable del simulador.
7. Registrar versión del modelo y parámetros de calibración.

## Control de vigencia

Cada observación debe tener `period` y `retrieved_at`. La interfaz no debe mostrar un número como “actual” si su periodo no está registrado. Para indicadores con rezago estadístico se mostrará explícitamente el último periodo disponible.
