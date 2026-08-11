# Modelo de simulación V2.1 — Explorador Socio-Técnico del Perú

## 1. Propósito

La V2.1 reformula el laboratorio de escenarios para representar, en una misma dinámica experimental, presiones territoriales, mercados, capacidad estatal, integridad institucional, redes comunitarias, nutrición e identidad cultural.

El modelo **no es predictivo**. Las variables de entrada y salida son índices normalizados de 0 a 100. Los signos de algunas relaciones tienen fundamento documental, pero las magnitudes, tasas de ajuste y coeficientes son heurísticos hasta que sean calibrados con series observadas.

## 2. Fuentes conceptuales incorporadas

Se incorporan como fuentes de estructura causal, sin redistribuir sus textos completos:

- Alfonso W. Quiroz, *Historia de la corrupción en el Perú*: corrupción sistémica, ciclos históricos, patronazgo, impunidad, deterioro institucional y costos de desarrollo.
- John Crabtree y Francisco Durand, *Perú: élites del poder y captura política*: captura política, desconexión Estado-sociedad, asimetrías de poder, debilidad representativa y confianza institucional.
- Edgardo Buscaglia, *Lavado de dinero y corrupción política*: flujos ilícitos, facilitadores, coordinación penal-patrimonial-financiera, inteligencia financiera, debida diligencia y controles.
- Gabor Maté con Daniel Maté, *The Myth of Normal*: estrés social, desigualdad, baja agencia, aislamiento y conexión social como marco biopsicosocial. Esta obra no se usa como evidencia específica del Perú.

Las fuentes oficiales previamente registradas —INEI, ENDES, ENAHO, SIEN/INS, MINCUL/BDPI, FAOSTAT, OMS, entre otras— continúan siendo las candidatas para calibración cuantitativa.

## 3. Variables nuevas o reforzadas

La V2.1 mantiene los cinco ejes originales y añade una capa institucional transversal dentro de sus variables:

- **Regional:** movilidad/migración, presión urbana, capacidad estatal y de servicios.
- **Influencias globales:** mercados, conectividad y riesgo de flujos ilícitos.
- **Accionar social:** informalidad, redes comunitarias, conflictividad, corrupción sistémica, captura política, confianza institucional, integridad y controles, estrés social acumulado.
- **Nutrición globalizada:** exposición a ultraprocesados, doble carga nutricional y diversidad alimentaria.
- **Identidad:** continuidad lingüística, resiliencia cultural y discriminación percibida.

## 4. Evidencia causal

Cada relación puede marcarse como:

- `apoyada`: la dirección causal está respaldada por una o más fuentes registradas.
- `hipótesis`: relación plausible para exploración, pero que requiere validación empírica adicional.

La interfaz muestra esta distinción en el inspector y en la leyenda. Esto evita presentar como demostrado lo que todavía es una hipótesis de modelado.

## 5. Entradas del escenario

Seis parámetros controlables, todos 0–100:

1. Presión migratoria / territorial (`migration`).
2. Integración / penetración de mercados (`market`).
3. Capacidad estatal y de servicios (`capacity`).
4. Integridad institucional y controles (`integrity`).
5. Cohesión / redes comunitarias (`community`).
6. Resiliencia cultural y alimentaria (`resilience`).

Se incluyen cuatro presets: Base exploratoria, Fortalecimiento institucional, Alta vulnerabilidad institucional y Resiliencia comunitaria.

## 6. Estados de salida

El laboratorio calcula 24 periodos para nueve estados normalizados:

- presión urbana;
- informalidad;
- corrupción sistémica;
- captura política;
- riesgo de flujos ilícitos;
- confianza institucional;
- estrés social acumulado;
- carga nutricional;
- resiliencia cultural.

## 7. Estructura matemática

En lugar de sumar incrementos constantes indefinidamente, cada estado se aproxima gradualmente a un valor objetivo derivado de las entradas y de otros estados. La forma general es:

`X(t+1) = X(t) + tasa * [objetivo(t) - X(t)]`

Los objetivos actuales están **centrados en 50**: un escenario en el que todas las entradas y estados valen 50 mantiene, por construcción, un punto neutral alrededor de 50. Esto evita que el modelo interprete el cero como un estado “natural” o que los valores iniciales sugieran una medición real del Perú.

- `presión_urbana* = 50 + 0.45(migración-50) + 0.12(mercado-50) - 0.35(capacidad-50)`
- `informalidad* = 50 + 0.22(presión_urbana-50) + 0.18(migración-50) + 0.20(captura-50) - 0.24(capacidad-50) - 0.18(integridad-50)`
- `flujos_ilícitos* = 50 + 0.18(mercado-50) + 0.17(informalidad-50) + 0.22(corrupción-50) + 0.14(captura-50) - 0.30(integridad-50) - 0.10(capacidad-50)`
- `corrupción* = 50 + 0.25(captura-50) + 0.15(informalidad-50) + 0.18(flujos_ilícitos-50) - 0.28(integridad-50) - 0.12(capacidad-50)`
- `captura* = 50 + 0.32(corrupción-50) + 0.12(mercado-50) + 0.10(flujos_ilícitos-50) - 0.27(integridad-50) - 0.13(capacidad-50)`
- `confianza* = 50 + 0.25(capacidad-50) + 0.25(integridad-50) + 0.12(comunidad-50) - 0.24(captura-50) - 0.15(corrupción-50)`
- `estrés* = 50 + 0.20(presión_urbana-50) + 0.15(informalidad-50) + 0.18(50-confianza) + 0.10(captura-50) - 0.20(comunidad-50) - 0.10(capacidad-50)`
- `carga_nutricional* = 50 + 0.25(mercado-50) + 0.18(estrés-50) + 0.10(presión_urbana-50) - 0.20(resiliencia-50) - 0.12(capacidad-50)`
- `resiliencia_cultural* = 50 + 0.25(resiliencia-50) + 0.20(comunidad-50) + 0.15(confianza-50) - 0.16(mercado-50) - 0.12(estrés-50)`

Todos los objetivos y estados se limitan al rango 0–100. Las tasas de aproximación se encuentran entre aproximadamente 0.13 y 0.19 por periodo.

## 8. Interpretación

El resultado es un **escenario comparativo**, no una medición de Perú. Sirve para responder preguntas del tipo: “si mantengo iguales las demás condiciones y elevo la integridad institucional, ¿qué dirección toma la tensión del modelo?”. No debe usarse para afirmar probabilidades, fechas, niveles reales de corrupción, enfermedad o captura política.

La interfaz calcula además una tensión compuesta y señala el dominio interno predominante —institucional, social-territorial o nutricional-cultural— únicamente como ayuda para leer el experimento.

## 9. Próxima calibración

La evolución recomendada es reemplazar progresivamente índices manuales por observaciones con el esquema:

`variable → valor → unidad → periodo → territorio → fuente → fecha de recuperación → calidad`

Prioridades de calibración:

- INEI Censos/ENAHO: migración, urbanización, pobreza, informalidad, servicios.
- ENDES, SIEN/INS y OMS: nutrición y salud.
- MINCUL/BDPI y ENAPRES Cultura: lengua, identidad, acceso y participación cultural.
- Defensoría del Pueblo: conflictividad social.
- Fuentes oficiales de integridad, justicia, control y lavado: indicadores institucionales que permitan sustituir proxies heurísticos.

## 10. Corrección de interacción del grafo

La V2.1 incorpora una zona segura al arrastrar nodos. Las posiciones se limitan al viewport visible del grafo, con márgenes internos amplios para evitar que nodo y etiqueta se superpongan con el borde izquierdo, la barra de controles o el inspector. Los layouts también consideran las dimensiones de las etiquetas (`nodeDimensionsIncludeLabels`) y aumentan repulsión y separación en la lente Simulación.
