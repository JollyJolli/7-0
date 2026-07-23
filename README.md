# ⚽ Bot 7A0 — Director Técnico Automático

Bot para automatizar el armado de un equipo en el juego web **7a0 — Sete a Zero**.

El bot analiza las opciones disponibles, obtiene las fuerzas reales en el modo **De memoria**, administra los tres re-sorteos, selecciona jugadores según fuerza y necesidad táctica, decide el mejor puesto disponible y completa automáticamente los once jugadores.

Cuando el equipo llega a `11/11`, pulsa **Simular el Mundial** y continúa a la siguiente etapa.

> Este proyecto no es oficial ni está afiliado con 7a0.

---

## Características

- Pulsa automáticamente **Tirar**.
- Detecta la selección y el Mundial sorteados.
- Funciona en modo **Clásico**.
- Funciona en modo **De memoria**.
- Recupera las fuerzas ocultas desde las páginas públicas de los planteles.
- Relaciona los nombres mostrados en el draft con los nombres del plantel.
- Prioriza fuerza, necesidad de posición y versatilidad.
- Evita desperdiciar posiciones difíciles de cubrir.
- Administra un máximo de tres re-sorteos.
- Decide entre:
  - `Otra selección`
  - `Otro Mundial`
- Incluye un panel flotante.
- Incluye notificaciones dentro de la página.
- Muestra tablas y explicaciones detalladas en la consola.
- Guarda planteles en caché para reducir consultas.
- Se recupera automáticamente de errores temporales.
- Al completar el XI, entra automáticamente a **Simular el Mundial**.
- No utiliza bibliotecas externas.

---

# Instalación rápida

Abre la página del juego:

```text
https://7a0.com.br/es/play
```

Abre las herramientas de desarrollador:

```text
F12
```

También puedes usar:

```text
Ctrl + Shift + J
```

En macOS:

```text
Cmd + Option + J
```

Pega en la consola el cargador incluido en la sección **Cargador remoto**.

El cargador descarga y ejecuta la última versión de:

```text
https://raw.githubusercontent.com/JollyJolli/7-0/refs/heads/main/main.js
```

Cada vez que actualices `main.js` en GitHub, el cargador utilizará la versión nueva.

---

# Cargador remoto

```javascript
fetch(
  "https://raw.githubusercontent.com/JollyJolli/7-0/refs/heads/main/main.js?" +
  Date.now(),
  { cache: "no-store" }
)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.text();
  })
  .then(code => {
    (0, eval)(
      `${code}\n//# sourceURL=bot7a0-main.js`
    );
  })
  .catch(error => {
    console.error(
      "❌ No se pudo cargar el Bot 7A0:",
      error
    );
  });
```

> El cargador ejecuta el contenido actual del repositorio. Solo debe utilizarse cuando confíes en el código y en las personas con permiso para modificarlo.

---

# Flujo automático

El bot repite este proceso:

```text
Tirar
  ↓
Detectar selección y Mundial
  ↓
Leer jugadores disponibles
  ↓
Obtener fuerzas reales si está en modo De memoria
  ↓
Calcular la mejor decisión
  ↓
Re-sortear o elegir un jugador
  ↓
Elegir el mejor puesto compatible
  ↓
Colocar al jugador
  ↓
Repetir hasta llegar a 11/11
  ↓
Simular el Mundial
```

El motor comprueba el estado de la página aproximadamente cada:

```javascript
350 milisegundos
```

También utiliza un `MutationObserver` para reaccionar cuando React modifica la interfaz.

---

# Elementos utilizados de la página

El bot no depende de una API privada del juego. Trabaja principalmente con el HTML visible y con las páginas públicas de los planteles.

## Contenedor principal

```css
.play-reserve
```

Se utiliza como raíz del `MutationObserver`.

Cuando no existe, el bot observa:

```javascript
document.body
```

---

## Detección del modo de juego

Para determinar si está activo el modo **De memoria**, revisa:

```css
.play-controls .eyebrow
```

También busca botones activos mediante:

```css
.chip.is-active
button.is-active
```

El modo memoria se considera activo cuando aparece un texto como:

```text
De memoria
```

o:

```text
Almanaque
```

---

## Resultado de la tirada

El nombre de la selección se obtiene desde:

```css
.rr-sel
```

La bandera se encuentra en:

```css
.rr-flag
```

El bot elimina la bandera de una copia del elemento antes de leer el nombre del país.

El Mundial se obtiene desde:

```css
.rr-copa
```

Ejemplo:

```html
<div class="rr-sel">
  <span class="rr-flag">🇪🇸</span>
  España
</div>

<div class="rr-copa">
  Mundial 1986
</div>
```

Resultado interpretado:

```javascript
{
  nation: "España",
  year: 1986
}
```

---

## Botón Tirar

El bot busca el botón mediante varios selectores:

```css
button.roll-btn
.roll-panel button.btn-primary
.roll-panel button
```

Después verifica que:

- Sea visible.
- No esté deshabilitado.
- Contenga textos como:
  - `Tirar`
  - `Roll`
  - `Tira de nuevo`

---

## Lista de jugadores

Los jugadores disponibles se obtienen desde:

```css
.draft-pool .pool-row
```

Dentro de cada jugador se utilizan:

```css
.pool-name
.pool-num
.pool-pos
.pool-force
```

Ejemplo:

```html
<button class="pool-row">
  <span class="pool-num">#10</span>
  <span class="pool-name">Messi</span>
  <span class="pool-pos">MEI/ED</span>
  <span class="pool-force">99</span>
</button>
```

El bot ignora un jugador cuando:

```javascript
button.disabled === true
```

o tiene la clase:

```css
.not-selectable
```

También excluye temporalmente el jugador que ya está marcado con:

```css
.is-selected
```

---

## Posiciones disponibles

Todos los puestos vacíos se leen desde:

```css
.pitch .disc.empty
```

La posición del puesto se encuentra en:

```css
.disc-circle
```

Cuando un jugador ha sido seleccionado, React marca los puestos compatibles con:

```css
.pitch .disc.empty.slot-pickable
```

El bot solamente intenta colocar el jugador en esos puestos.

---

## Box score y progreso

El progreso se obtiene principalmente desde:

```css
.box-head .eyebrow
```

Ejemplo:

```text
Box score · 7/11
```

El overall visible se obtiene desde:

```css
.box-head > .num
```

La tabla del equipo se obtiene desde:

```css
.boxscore tbody tr
```

En cada fila:

- Primera celda: posición.
- Segunda celda: jugador.
- Tercera celda: fuerza.

El bot también puede contar las filas que ya no tienen la clase:

```css
.empty
```

---

## Re-sorteos

El contador visible se obtiene desde:

```css
.reroll-label
```

Ejemplo:

```text
¿No te gustó? Re-sortea · 2 restantes
```

Los botones se obtienen desde:

```css
.reroll-btn
```

El bot diferencia los botones por su texto:

```text
Otra selección
Otro Mundial
```

---

## Simular el Mundial

Cuando el equipo llega a `11/11`, el bot busca elementos `button` o `a` cuyo texto contenga:

```text
Simular el Mundial
Jugar Mundial
Simulate
```

Después resalta el botón y lo pulsa automáticamente.

---

# Modo Clásico

En modo Clásico, la fuerza aparece directamente en:

```css
.pool-force
```

El bot convierte el contenido a número:

```javascript
Number(element.textContent)
```

Ejemplo:

```html
<span class="pool-force">88</span>
```

Resultado:

```javascript
88
```

No es necesario consultar la página del plantel.

---

# Modo De memoria

En el modo De memoria, la página sustituye las fuerzas por:

```text
?
```

Ejemplo:

```html
<span class="pool-force">?</span>
```

El bot obtiene entonces la información desde una página pública con esta estructura:

```text
/{idioma}/copas/{año}/{código}
```

Ejemplos:

```text
/es/copas/2022/arg
/es/copas/1986/esp
/es/copas/1982/bra
```

---

## Construcción de la URL

Primero se detecta el idioma de la ruta actual.

Idiomas reconocidos:

```text
en
es
fr
pl
it
de
tr
```

Ejemplo:

```text
/es/play
```

Produce el prefijo:

```text
/es
```

Después se construye una dirección como:

```javascript
`${localePrefix()}/copas/${year}/${code}`
```

---

## Mapa de países

El código contiene un mapa de nombres a códigos:

```javascript
"argentina": "arg"
"brasil": "bra"
"espana": "esp"
"alemania": "ger"
"francia": "fra"
"paises bajos": "ned"
```

Los nombres se normalizan antes de buscarse.

La normalización:

- Convierte a minúsculas.
- Elimina tildes.
- Elimina símbolos.
- Elimina espacios repetidos.
- Convierte `España` en `espana`.
- Convierte `Países Bajos` en `paises bajos`.

---

## Detección automática del código

Cuando un país no aparece en el mapa, el bot consulta:

```text
/{idioma}/copas/{año}
```

Después examina enlaces que coincidan con:

```css
a[href*="/copas/AÑO/"]
```

Compara el texto del enlace con el nombre de la selección sorteada y extrae el último segmento de la URL.

Ejemplo:

```html
<a href="/es/copas/2022/arg">
  Argentina
</a>
```

Código detectado:

```text
arg
```

Esta consulta adicional solamente es necesaria cuando el código no se encuentra en el mapa interno.

---

## Lectura del plantel

Una página pública de plantel contiene filas como:

```html
<li class="squad-row">
  <span class="squad-num">10</span>
  <span class="squad-name">Messi</span>
  <span class="squad-pos">Mediapunta</span>
  <span class="squad-force">99</span>
</li>
```

El bot utiliza:

```css
.squad-row
.squad-num
.squad-name
.squad-pos
.squad-force
```

Cada jugador se convierte en un objeto:

```javascript
{
  name: "Messi",
  force: 99,
  pos: "Mediapunta",
  number: "10"
}
```

La página se descarga usando:

```javascript
fetch(url, {
  credentials: "same-origin",
  cache: "force-cache"
});
```

No se envían credenciales a dominios externos durante esta consulta, porque las páginas de planteles pertenecen al mismo sitio de 7a0.

---

# Relación entre jugadores

El nombre del draft y el nombre de la página pública no siempre son idénticos.

Ejemplos posibles:

```text
E. Martínez
Emiliano Martínez
```

```text
J. Álvarez
Julián Álvarez
```

```text
Ronaldo
Ronaldo Nazário
```

Por eso, el bot utiliza un sistema de puntuación de coincidencias.

## Coincidencia exacta

Cuando los nombres normalizados son iguales:

```javascript
poolName === rosterName
```

Se asigna una puntuación de:

```text
1000
```

---

## Un nombre contiene al otro

Cuando uno de los nombres contiene completamente al otro, se asigna una puntuación elevada.

Esto ayuda con nombres abreviados.

---

## Palabras compartidas

Se separan los nombres en palabras y se comprueba cuántas coinciden.

Ejemplo:

```text
Emiliano Martínez
E. Martínez
```

Comparten:

```text
Martínez
```

---

## Apellido

Cuando la última palabra coincide, se añade una bonificación importante.

---

## Inicial

Cuando la primera letra del nombre coincide, se añade una bonificación menor.

---

## Dorsal

Cuando ambos jugadores tienen el mismo dorsal, se añade una bonificación adicional.

Esto ayuda a distinguir jugadores con apellidos similares.

---

## Puntuación mínima

Una relación solamente se acepta cuando la puntuación es al menos:

```text
300
```

Así se reduce el riesgo de asignar la fuerza de un jugador equivocado.

---

# Caché

El bot utiliza tres cachés en memoria:

```javascript
cachePlantel
cacheCodigo
cacheAnio
```

También guarda los planteles en:

```javascript
localStorage
```

Formato de la clave:

```text
bot7a0:v3:AÑO:CÓDIGO
```

Ejemplo:

```text
bot7a0:v3:1986:esp
```

Cada entrada contiene:

```javascript
{
  at: 1780000000000,
  players: [...]
}
```

La duración predeterminada es:

```javascript
cacheDias: 30
```

Durante esos treinta días, el bot puede reutilizar el plantel sin descargar nuevamente la página.

Para limpiar la caché:

```javascript
bot7a0.limpiarCache();
```

---

# Compatibilidad de posiciones

El juego muestra posiciones como:

```text
POR
LD
LI
DFC
MD
MI
VOL
MC
MEI
EI
ED
DC
```

El bot utiliza una tabla de compatibilidad táctica.

Ejemplo:

```javascript
POR: ["POR"]

LD: ["LD", "MD", "DFC"]

LI: ["LI", "MI", "DFC"]

DFC: ["DFC", "LD", "LI", "VOL"]

MC: ["MC", "VOL", "MEI", "MD", "MI"]

MEI: ["MEI", "MC", "EI", "ED", "DC"]

DC: ["DC", "MEI", "EI", "ED"]
```

Esto significa que para un puesto `MC`, el bot considera útiles jugadores cuya posición visible sea:

```text
MC
VOL
MEI
MD
MI
```

La página continúa teniendo la última palabra: el bot solamente pulsa puestos marcados por el propio juego como:

```css
.slot-pickable
```

---

# Escasez de posiciones

Cada posición tiene un valor de escasez:

```javascript
POR: 5
LD: 3.8
LI: 3.8
DFC: 3.1
VOL: 3
MC: 2.7
MD: 2.7
MI: 2.7
MEI: 2.6
EI: 2.3
ED: 2.3
DC: 2
```

Las posiciones con valores mayores se consideran más difíciles de completar.

El portero tiene la prioridad más alta:

```javascript
POR: 5
```

Los delanteros centro son considerados relativamente fáciles de encontrar:

```javascript
DC: 2
```

---

# Puntuación inteligente de jugadores

El bot no elige simplemente al jugador con mayor fuerza.

Calcula una puntuación táctica:

```text
fuerza
+ necesidad × 4.1
+ versatilidad × 1.7
+ bonificación de estrella
```

En código:

```javascript
tactical =
  force +
  need.value * 4.1 +
  versatility * 1.7 +
  eliteBonus;
```

---

## Fuerza

Es la fuerza visible en modo Clásico o la recuperada desde el plantel público en modo De memoria.

Si no se consigue identificar una fuerza, se utiliza temporalmente:

```javascript
68
```

Esto permite que el bot continúe sin bloquearse, aunque la opción desconocida normalmente perderá frente a jugadores identificados.

---

## Necesidad

La necesidad de un puesto se calcula con:

```text
escasez
+ bonificación si es el último puesto de ese tipo
+ 3 dividido entre la oferta disponible
```

En código conceptual:

```javascript
need =
  rarity +
  lastSlotBonus +
  3 / supply;
```

### Oferta

La oferta es la cantidad de jugadores actuales que podrían cubrir el puesto.

Cuando pocos jugadores pueden ocupar una posición, su necesidad aumenta.

---

## Versatilidad

La versatilidad depende de la cantidad de puestos restantes que el jugador podría cubrir.

Se limita para evitar que tenga demasiado peso:

```javascript
Math.min(3, compatibleSlots.length) - 1
```

---

## Bonificación de estrella

Cuando un jugador tiene una fuerza igual o superior a:

```javascript
89
```

recibe una bonificación adicional:

```javascript
4
```

Esto también evita que sea descartado fácilmente mediante un re-sorteo.

---

# Elección del mejor puesto

Después de seleccionar un jugador, puede haber varios puestos compatibles.

El bot calcula qué puesto es más conveniente utilizar:

```text
oferta futura × 3.1
+ cantidad de puestos repetidos × 1.35
- escasez × 2.4
```

En código conceptual:

```javascript
score =
  supply * 3.1 +
  duplicates * 1.35 -
  rarity * 2.4;
```

El puesto con mayor puntuación es elegido.

La intención es:

- Usar primero posiciones fáciles de reemplazar.
- Reservar posiciones escasas.
- Mantener más alternativas abiertas para futuras tiradas.
- Reducir el riesgo de quedarse sin portero o laterales.

---

# Sistema de re-sorteos

El juego permite un máximo de tres re-sorteos.

El bot mantiene un contador local:

```javascript
maxRerolls: 3
```

También lee el contador visible de la página.

Para mayor seguridad utiliza el valor menor entre:

```text
contador de la página
contador local
```

Así evita utilizar más re-sorteos de los disponibles.

---

## Umbrales de fuerza

Los umbrales cambian según el progreso:

```javascript
temprano: 81
medio: 79
tarde: 76
```

### Primeros cuatro jugadores

```text
Objetivo: 81+
```

### Del quinto al octavo

```text
Objetivo: 79+
```

### Últimos jugadores

```text
Objetivo: 76+
```

Al final de la plantilla se vuelve más importante completar los puestos que esperar una estrella.

---

## Cuándo no re-sortear

No se re-sortea cuando aparece un jugador con fuerza:

```javascript
89 o superior
```

Tampoco se re-sortea cuando:

- No quedan re-sorteos.
- No se pudieron recuperar suficientes valores.
- La mano actual se considera suficientemente buena.
- Ya se intentó re-sortear exactamente la misma mano y la interfaz no cambió.

---

## Posiciones críticas

El bot considera críticas:

```text
POR
LD
LI
```

Cuando quedan posiciones críticas y ningún jugador disponible puede cubrirlas, puede utilizar un re-sorteo a partir de una fase intermedia de la plantilla.

---

## Otra selección u Otro Mundial

El bot calcula el promedio de los mejores jugadores conocidos.

Cuando el promedio es menor que:

```javascript
79
```

prefiere:

```text
Otra selección
```

Cuando existe calidad pero la plantilla no encaja tácticamente, prefiere:

```text
Otro Mundial
```

Si el botón preferido no está disponible, utiliza el otro.

---

## Protección contra re-sorteos repetidos

El bot crea una firma con:

```text
nombre normalizado + fuerza
```

Si pulsa un re-sorteo y los jugadores no cambian, bloquea otro re-sorteo sobre esa misma mano.

Esto evita gastar los tres re-sorteos debido a una actualización lenta o un clic no procesado.

---

# Panel flotante

El panel se inserta con el identificador:

```css
#b70
```

Las notificaciones utilizan:

```css
#b70t
```

El panel muestra:

- Estado.
- Fase actual.
- Decisión actual.
- Fuente de los valores.
- Progreso del XI.
- Overall.
- Tiradas.
- Jugadores elegidos.
- Consultas realizadas.
- Re-sorteos restantes.

---

## Estados del panel

### Activo

El punto aparece verde.

### Pausado

El punto aparece amarillo.

### Finalizado

El punto aparece dorado.

---

## Botones del panel

### Pausar

Detiene temporalmente los clics automáticos.

### Reanudar

Continúa el proceso.

### Un paso

Ejecuta manualmente una iteración del motor.

### Ver XI

Muestra el equipo actual mediante:

```javascript
console.table()
```

### Detener

Desconecta el temporizador y el observador, pero mantiene el panel.

### Minimizar

Oculta el cuerpo del panel.

### Cerrar

Oculta visualmente el panel, pero el bot continúa funcionando.

---

# Notificaciones

El bot añade notificaciones dentro de la página para eventos como:

- Nueva tirada.
- Sorteo completado.
- Consulta del plantel.
- Elección inteligente.
- Re-sorteo táctico.
- Puesto optimizado.
- Jugador colocado.
- Error recuperable.
- XI completado.
- Entrada al Mundial.

Las notificaciones se eliminan automáticamente después de unos segundos.

Como máximo se mantienen cuatro visibles simultáneamente.

---

# Mensajes de consola

El bot utiliza grupos y tablas de consola.

Ejemplo de tabla de elección:

```text
ranking
jugador
fuerza
posiciones
necesidad
versatilidad
táctica
fuente
```

Ejemplo de tabla de colocación:

```text
puesto
oferta futura
escasez
recomendado
```

Al finalizar muestra un resumen con:

```text
tiradas
elecciones
colocaciones
re-sorteos
consultas
aciertos de caché
errores
overall
tiempo total
```

---

# Comandos

## Pausar

```javascript
bot7a0.pausar();
```

## Reanudar

```javascript
bot7a0.reanudar();
```

## Ejecutar un paso

```javascript
bot7a0.paso();
```

## Mostrar el equipo

```javascript
bot7a0.equipo();
```

## Ver el estado interno

```javascript
bot7a0.estado();
```

## Detener

```javascript
bot7a0.detener();
```

## Intentar entrar al Mundial manualmente

```javascript
bot7a0.jugarMundial();
```

## Limpiar caché

```javascript
bot7a0.limpiarCache();
```

## Eliminar completamente el bot

```javascript
bot7a0.destruir();
```

---

# Configuración

La configuración está dentro del objeto:

```javascript
const C = {
  total: 11,
  maxRerolls: 3,
  intervalo: 350,
  render: 7000,
  pausaTirar: 700,
  pausaElegir: 450,
  pausaColocar: 800,
  pausaMundial: 1100,
  excelente: 89,
  umbral: {
    temprano: 81,
    medio: 79,
    tarde: 76
  },
  cacheDias: 30
};
```

---

## `total`

Cantidad de jugadores necesaria:

```javascript
11
```

## `maxRerolls`

Máximo de re-sorteos:

```javascript
3
```

## `intervalo`

Frecuencia del motor:

```javascript
350
```

Valor expresado en milisegundos.

## `render`

Tiempo máximo para esperar una actualización:

```javascript
7000
```

## `pausaTirar`

Espera después de pulsar Tirar:

```javascript
700
```

## `pausaElegir`

Espera después de seleccionar un jugador:

```javascript
450
```

## `pausaColocar`

Espera después de colocarlo:

```javascript
800
```

## `pausaMundial`

Espera antes de pulsar Simular el Mundial:

```javascript
1100
```

## `excelente`

Fuerza considerada de estrella:

```javascript
89
```

## `cacheDias`

Duración de la caché local:

```javascript
30
```

---

# Ejecución duplicada

Al iniciar, el código intenta destruir una versión anterior:

```javascript
window.bot7a0?.destruir?.({
  silencioso: true
});
```

Esto permite pegar nuevamente el cargador después de actualizar `main.js` sin dejar dos motores funcionando simultáneamente.

---

# Solicitudes de red

El bot puede realizar estas consultas:

## Descargar el script

Realizada por el cargador:

```text
raw.githubusercontent.com
```

## Leer un plantel

Realizada únicamente en modo De memoria:

```text
7a0.com.br/{idioma}/copas/{año}/{código}
```

## Detectar un código de país

Realizada únicamente cuando el país no está en el mapa interno:

```text
7a0.com.br/{idioma}/copas/{año}
```

Los planteles se guardan en caché para evitar consultas repetidas.

---

# Datos almacenados

El bot solamente almacena planteles públicos en:

```javascript
localStorage
```

No almacena:

- Contraseñas.
- Correos.
- Cookies.
- Tokens de sesión.
- Datos personales.
- Historial completo de navegación.

Las claves utilizadas empiezan por:

```text
bot7a0:
```

---

# Qué no hace

El bot no:

- Modifica las fuerzas de los jugadores.
- Cambia valores internos del servidor.
- Fabrica resultados.
- Modifica directamente el marcador.
- Envía una alineación falsa.
- Utiliza endpoints privados.
- Evita las restricciones de posiciones del juego.
- Utiliza más re-sorteos de los disponibles.

Los botones y puestos se pulsan mediante la interfaz normal de la página.

---

# Limitaciones

## Cambios en el HTML

El bot depende de selectores CSS de la página.

Si 7a0 cambia clases como:

```css
.pool-row
.slot-pickable
.reroll-btn
```

será necesario actualizar el código.

---

## Nombres ambiguos

Dos jugadores pueden tener nombres o apellidos similares.

El dorsal reduce el riesgo, pero una coincidencia automática nunca es completamente infalible.

---

## País no reconocido

Cuando un país no aparece en el mapa y tampoco puede detectarse en la página del Mundial, el bot continuará con las fuerzas que tenga disponibles.

---

## Página de plantel no disponible

Si una URL devuelve un error, el bot registra un error recuperable e intenta continuar.

---

## Modo De memoria

La interfaz seguirá mostrando `?`.

El bot utiliza internamente los valores recuperados; no reemplaza necesariamente el texto visible de la página.

---

## Estrategia heurística

El bot no conoce las tiradas futuras.

La elección táctica y la administración de re-sorteos son estimaciones basadas en:

- Fuerza actual.
- Posiciones pendientes.
- Cantidad de alternativas.
- Escasez.
- Progreso del equipo.

No existe garantía de obtener el mayor overall posible en todas las partidas.

---

# Solución de problemas

## El panel no aparece

Comprueba:

```javascript
typeof bot7a0
```

Resultado esperado:

```text
object
```

Vuelve a ejecutar el cargador y revisa si aparece un error de red.

---

## El bot quedó detenido

Ejecuta:

```javascript
bot7a0.reanudar();
```

---

## El panel fue cerrado

El bot puede continuar funcionando aunque el panel no sea visible.

Para volver a verlo sin reiniciar, puedes inspeccionar:

```javascript
document.getElementById("b70")
```

También puedes volver a ejecutar el cargador para reiniciar completamente la interfaz.

---

## Los valores no coinciden

Limpia la caché:

```javascript
bot7a0.limpiarCache();
```

Después vuelve a realizar una tirada.

---

## Hay dos bots funcionando

Ejecuta:

```javascript
bot7a0.destruir();
```

Después vuelve a cargar el script una sola vez.

---

## El juego está muy lento

Aumenta:

```javascript
pausaTirar
pausaElegir
pausaColocar
render
```

---

## No pulsa Simular el Mundial

Ejecuta:

```javascript
bot7a0.jugarMundial();
```

También revisa si el texto del botón cambió.

---

# Desarrollo

Archivo principal:

```text
main.js
```

Repositorio:

```text
JollyJolli/7-0
```

El proyecto está escrito en JavaScript puro y se ejecuta directamente en el navegador.

No requiere:

```text
npm
Node.js
Webpack
Vite
React
TypeScript
```

React es utilizado por la página de 7a0, pero el bot interactúa con el DOM generado y no importa React como dependencia.

---

# Actualizaciones

El cargador añade una marca de tiempo:

```javascript
Date.now()
```

Esto evita que el navegador reutilice una versión antigua de `main.js`.

Al subir cambios a la rama `main`, basta con ejecutar nuevamente el cargador.

---

# Seguridad del cargador remoto

El cargador descarga y ejecuta JavaScript con acceso a la página abierta.

Eso significa que cualquier modificación futura de `main.js` también será ejecutada.

Recomendaciones:

- Mantener protegida la cuenta de GitHub.
- Activar autenticación en dos pasos.
- Revisar los commits antes de ejecutar.
- No aceptar cambios de personas desconocidas sin revisarlos.
- Crear versiones o etiquetas estables cuando el proyecto madure.

---

# Licencia

Añade aquí la licencia que prefieras.

Ejemplo:

```text
MIT
```

Para utilizar MIT, crea también un archivo:

```text
LICENSE
```

---

# Aviso

Este proyecto se proporciona con fines educativos y experimentales.

El sitio 7a0 puede cambiar su interfaz, funcionamiento o reglas en cualquier momento. El autor del bot no controla esos cambios.
