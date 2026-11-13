import json,sys
T={}
T["frase"]=("**En una frase: lo que más se ve casi siempre está hecho con alguien más y publicado junto con esa cuenta.** "
 "Los 10 reels más vistos del corte son publicaciones compartidas, y una compartida rinde 3 veces lo normal de su cuenta en reel y 2 veces en foto o carrusel. Entre más grande es la otra cuenta, más sube. "
 "**Lo que se graba pesa menos**: gente en pantalla da 1.2 veces lo normal y el objeto solo queda en lo normal o abajo. "
 "**Piso ikpali tiene 56 seguidores y 11 publicaciones**: 8 son fotos sueltas, 7 muestran un objeto solo, ninguna es reel y solo una está compartida.")
T["kpis"]=[
 {"v":"10 de 10","l":"reels más vistos del corte que están compartidos con otra cuenta"},
 {"v":"3.2","l":"veces lo normal de su cuenta rinde un reel compartido","s":"6.2 si el socio es al menos 4 veces más grande"},
 {"v":"64%","l":"de lo que publican las tiendas son carruseles","s":"26% reels y 9% fotos sueltas"},
 {"v":"0","l":"reels de Piso ikpali en el periodo","s":"las demás tiendas publicaron 94"},
 {"v":"7 de 11","l":"publicaciones de Piso ikpali que muestran un objeto solo"},
]
T["posicion"]=[
 {"t":"Lo que ya funciona","x":"**La [publicación compartida con MOT](i:5) es la única con respuesta visible**: 256 likes y 20 comentarios. MOT tiene 5,490 seguidores y Piso ikpali 56, así que esa respuesta viene de la audiencia de MOT. **El ritmo ya está**: 11 publicaciones entre el 14 de octubre y el 5 de noviembre, unas 3 por semana, lo mismo que las tiendas más activas. Y en el adelanto hay cuatro publicaciones de obra ([la lámpara](i:0), [la escalera](i:3), [el cuarto vacío](i:6), [el papel tapiz](i:9)): algo haciéndose, que es el tema de los reels que más circulan."},
 {"t":"Dónde se cae","x":"**8 de las 11 son fotos sueltas y 7 muestran un objeto solo.** La foto suelta es el formato que menos usan las tiendas (9%) y el que menos respuesta tiene: el carrusel le gana en 6 de las 9 cuentas donde hay de los dos. El objeto solo queda abajo de lo normal de su cuenta en 45 de 67 publicaciones, y dentro de una misma cuenta pierde contra todo lo demás en 8 de 9. **Los likes están ocultos** en las 10 propias, que entre todas suman 7 comentarios."},
 {"t":"El hueco más grande","x":"**Ningún reel y una sola compartida.** Son las dos formas de llegar a gente que no sigue la cuenta. Las tiendas chicas sacan cientos de reproducciones por reel propio: B Artesanal, con 863 seguidores, 209 de mediana; PisoTres, con 3,595, 894. Piso ikpali está montando una tienda en este momento, y ese material, compartido con cada marca que llega, es lo que el corte muestra que circula."},
 {"t":"Su lugar en el mapa","x":"56 seguidores, contra una mediana de 36.8 mil entre los cinco pares directos que publicaron. **A este tamaño los porcentajes no sirven**: se cuenta en seguidores ganados y en comentarios. De las 21 cuentas, 4 no publicaron en los 90 días (Taxonomía, Escalina, Casa Mandarine y Casa Cler, que cerró). Solo 2 pares directos publicaron todas las semanas, Onora y Utilitario Mexicano; Originario volvió en octubre."},
]
T["notas"]={
 "mezcla":"Cuántas publicaciones hizo cada tienda en los 90 días y de qué formato. Pasa el cursor sobre un nombre para ver sus seguidores.",
 "semanas":"Publicaciones de todas las tiendas por semana. La franja con contorno es Piso ikpali, que empezó a publicar el 14 de octubre.",
 "horas":"Cada cuadro es una publicación propia. Entre más arriba, más rindió contra lo normal de su cuenta; la línea es lo normal. **No hay una hora ganadora**: lo único claro es que antes de las 9 de la mañana casi todo queda abajo. Las marcas con contorno bajo el eje son las horas a las que ha publicado Piso ikpali.",
 "dias":"Lo mismo por día de la semana. **Ningún día destaca.**",
 "alcance":"Mediana de reproducciones de los reels propios de cada tienda. Sirve para saber qué es mucho y qué es poco para cada una.",
 "colab":"Cada cuadro es una publicación compartida. Hacia la derecha, el socio es más grande que la cuenta; hacia arriba, la publicación rindió más que lo normal de esa cuenta. **Casi todo lo que está a la derecha de la línea vertical está arriba de la horizontal.**",
}
T["palanca"]=("**La palanca es con quién se publica.** Una publicación compartida rinde 3 veces lo normal de su cuenta en reel y 2 veces en foto o carrusel, y sube con el tamaño de la otra cuenta: 6 veces cuando el socio es al menos cuatro veces más grande, casi igual que una propia cuando es mucho más chico. "
 "**Después, de qué trata**: las piezas sobre una persona o sobre cómo se hace algo son las que más se comparten (19 de 32) y las que más rinden; los avisos, las que menos. "
 "**El formato casi no cambia la respuesta**: dentro de una misma cuenta, reel y carrusel reciben lo mismo. Lo que sí queda abajo es el reel de menos de 15 segundos (0.87) y la foto suelta (0.85).")
T["jugadas"]=[
 {"titulo":"Publicar compartido con cada marca","fact":"Muy alta","imp":"Alto",
  "porque":"**Los 10 reels más vistos del corte están compartidos.** Un reel compartido rinde 3.2 veces lo normal de su cuenta (32 reels, 25 arriba) y una foto o carrusel compartido, 2.1 veces (41, 32 arriba). **Sube con el tamaño del socio**: con uno al menos cuatro veces más grande, 6.2 veces en reel (13 de 13 arriba) y 20 veces en foto o carrusel (8 de 8); con uno de tamaño parecido, 3 veces en reel y 2.2 en foto; con uno mucho más chico, casi lo mismo que una propia (1.1 y 1.4). Para Piso ikpali, con 56 seguidores, **toda marca en consigna es la cuenta grande**.",
  "como":"Una publicación compartida por cada marca, empezando por las de más seguidores. Tiene que ser una pieza que la marca quiera en su perfil: su objeto ya puesto en la tienda, o ella llegando a entregarlo. [La de MOT](i:5) ya lo probó: es la única publicación de Piso ikpali con respuesta visible.",
  "limite":"La respuesta es de la audiencia de la otra cuenta: cuánta se queda solo se sabe anotando los seguidores antes y después. El grupo de socio grande en reel sale de 3 cuentas (Cooperativa 1050°, B Artesanal y MUMEDI). Y [el reel más visto de todos](i:73) (203,808) se compartió con cuentas de tamaño parecido: ahí pesó lo que se ve.",
  "ej":[5,171,274]},
 {"titulo":"Grabar el montaje con quien llega","fact":"Muy alta hasta el 5 de diciembre","imp":"Alto si se comparte",
  "porque":"**Las piezas de proceso y las que son sobre una persona son las que se comparten**: 19 de 32, contra 54 de 226 de las de producto. Los reels de proceso rinden 5.1 veces lo normal de su cuenta (7 reels) y los que son sobre una persona, 2.3 (9), casi todos compartidos con quien aparece. Los dos más vistos del corte son esto: [un taller tallando un banco de corcho](i:73) (203,808 reproducciones) y [el montaje de la ofrenda de Originario](i:16) (94,080). Las tiendas casi no graban proceso por su cuenta: entre los reels propios hay uno solo, [el altar de Onora](i:23). **Mostrar gente ayuda aunque no se comparta**: 1.2 veces lo normal (16 reels propios, 11 arriba), y en ninguna de las 10 cuentas el reel propio más visto es de objeto solo.",
  "como":"La tienda se está montando y abre el 5 de diciembre. Grabar a cada marca llegando con sus piezas, el acomodo, la instalación de una lámpara. De 20 a 45 segundos. Cada reel se comparte con la marca que aparece. Las cuatro publicaciones de obra del adelanto ya son este registro, en foto.",
  "limite":"Proceso y compartido vienen juntos: no se puede separar cuánto pesa cada uno. La ventana se cierra con la apertura.",
  "ej":[73,16,281]},
 {"titulo":"Presentar a quien hace las piezas","fact":"Alta","imp":"Medio",
  "porque":"Los reels propios sobre una persona rinden 1.3 veces lo normal (4 reels, 3 arriba) y, contando los compartidos, 2.3 (9). En foto, alguien mirando a cámara rinde 1.3 (6 publicaciones propias, 5 arriba). **En Vena, dos diseñadoras, [María](i:334) y [Paola](i:339), cuentan sus favoritos de la tienda en una selfie compartida con ellas: 2.5 y 1.7 veces lo normal.** El reel propio más visto de Casa T'HŌ son [sus fundadoras contando el origen del nombre](i:198) (4,398).",
  "como":"Una serie: quien hizo la pieza, en la tienda o en su taller, diciendo qué es y cómo la hizo, con subtítulos. En foto, la persona con sus favoritos de la tienda. Siempre compartido con ella.",
  "limite":"Son pocas piezas: 4 reels propios y 6 fotos. [El reel de Onora con el artesano Gabino Méndez](i:28) quedó en lo normal de su cuenta, no arriba.",
  "ej":[198,334,279]},
 {"titulo":"En foto: el cuarto y lo que está pasando, no el objeto suelto","fact":"Alta, con la tienda montada","imp":"Medio",
  "porque":"En foto y carrusel, **el objeto solo queda abajo de lo normal en 45 de 67 publicaciones** y pierde contra el resto dentro de la misma cuenta en 8 de 9. Lo que queda arriba: las publicaciones de evento (1.3 veces, 10 de 14 arriba), el espacio (1.1, 8 de 12) y las portadas con título (1.2, 13 de 20). **El carrusel le gana a la foto suelta** en 6 de 9 cuentas.",
  "como":"Con la tienda montada: carruseles que abren con el cuarto o con un título, y los acercamientos como segunda o tercera imagen. Lo que está pasando (la apertura, una marca nueva, una visita) es la publicación; el producto va adentro.",
  "limite":"Las portadas con título que rinden son de evento o de lista, como [\"5 marcas que tienes que conocer\"](i:311). Las que son un aviso de horario quedan abajo: no es el diseño, es lo que anuncian.",
  "ej":[311,242,12]},
 {"titulo":"El reel de apertura, compartido con ffaayyeett","fact":"Alta","imp":"Incierto",
  "porque":"El caso más parecido a Piso ikpali es PisoTres, una tienda dentro de un espacio más grande. **[Su reel de la venta de garage](i:136), compartido con la cuenta del espacio donde está, llegó a 51,580 reproducciones: 58 veces lo normal de la tienda.** Una voz dice en los primeros segundos qué es, dónde y cada cuándo, sobre tomas del lugar y de alguien acomodando prendas. Es un caso, no una regla: los reels de evento rinden 1.15 veces lo normal (12 propios, 7 arriba) y los avisos con placa, 0.8 (4, 1 arriba).",
  "como":"Un reel para el 5 de diciembre con voz: Piso ikpali, diseño doméstico mexicano, dentro de ffaayyeett, Lafayette 64, sábado 5 de diciembre de 11 a 4. Con tomas del cuarto y de gente, no una placa. Compartido con ffaayyeett y con las marcas que aparezcan.",
  "limite":"Un solo caso fuerte, y no se puede saber si tuvo pauta.",
  "ej":[136,135,128]},
]
T["dejar"]=[
 {"t":"La foto suelta de un objeto como base del perfil","x":"Es 7 de 11 en Piso ikpali. La foto suelta es el formato con menos respuesta (0.85 veces lo normal) y el objeto solo queda abajo en 45 de 67 publicaciones."},
 {"t":"Los avisos como publicación","x":"Horarios, promociones y recordatorios rinden la mitad de lo normal en foto y carrusel (0.54, 8 publicaciones) y 0.8 en reel. Caben en historias."},
 {"t":"Los reels de menos de 15 segundos","x":"0.87 veces lo normal de su cuenta: de 21, solo 6 quedaron arriba."},
 {"t":"Los likes ocultos, si quieren medir","x":"Con los likes ocultos, desde fuera solo se ven los comentarios. Es decisión de marca: Onora, LAGO y Vena también ocultan la mayoría. La alternativa es pasar los números de Insights en cada corte."},
]
T["estrategia"]={
 "intro":"Esto no es un plan de contenidos. Son las preguntas que conviene resolver antes de hacerlo, con lo que el corte alcanza a contestar y qué tan seguro es cada dato. **Certeza alta**: el patrón se repite en varias cuentas y se sostiene quitando la que más pesa. **Media**: apunta en una dirección, con pocas piezas. **Baja**: el corte no alcanza, y lo que se propone es un punto de partida para medir con los números propios.",
 "preguntas":[
  {"q":"¿Cuánto video y cuánta foto?","r":"De cada 10 publicaciones: 3 reels, 6 carruseles y, cuando mucho, 1 foto suelta.","certeza":"media","graf":"formato",
   "x":"Las tiendas publican 64% carruseles, 26% reels y 9% fotos sueltas. **El formato casi no cambia la respuesta**: dentro de una misma cuenta el reel recibe más likes y comentarios que el carrusel en 5 de 8, un empate. La foto suelta sí queda abajo (0.85 veces lo normal; el carrusel le gana en 6 de 9 cuentas). **El reel tiene otra función**: es el formato que llega a gente que no sigue la cuenta. Las cuentas chicas sacan de 200 a 900 reproducciones por reel propio, varias veces los 56 seguidores de Piso ikpali. Hoy Piso ikpali está al revés: 73% fotos sueltas y ningún reel.",
   "nota":"El 3 de 10 es lo que hacen las tiendas activas, no un número que el corte pruebe. Se ajusta con los primeros reels propios."},
  {"q":"¿Con música o sin música? ¿Con voz?","r":"No hace diferencia. Que el audio lo decida la pieza.","certeza":"media","graf":"audio",
   "x":"En reels propios, los que llevan música con licencia rinden 1.0 veces lo normal (25 reels) y los de audio original sin voz, 1.13 (25). Dentro de una misma cuenta la música solo gana en 1 de 6. La voz tampoco cambia el resultado por sí sola (1.0, 7 reels propios). Donde sí aparece es en las piezas compartidas sobre una persona o un proceso: 17 de los 24 reels con voz están compartidos. **La voz sirve para decir qué es y dónde, no para subir vistas.**",
   "nota":"Son 57 reels propios. Si el siguiente corte trae más reels con voz, esto se puede afinar."},
  {"q":"¿Cuánto debe durar un reel?","r":"Entre 15 y 60 segundos. Nunca menos de 15.","certeza":"media","graf":"dur",
   "x":"Los de menos de 15 segundos rinden 0.87 veces lo normal y solo 6 de 21 quedaron arriba. De 15 a 30 segundos, 1.14 (14 de 26 arriba). De 30 a 60, 1.29 (4 de 7).",
   "nota":"Los de más de un minuto son 3: no alcanzan para decir nada."},
  {"q":"¿Qué poner en pantalla?","r":"Gente haciendo algo y el cuarto. El objeto solo, adentro del carrusel, no de portada.","certeza":"alta","graf":"pant",
   "x":"**En reel**, con gente en pantalla (en escena, manos o a cámara) el resultado es 1.2 veces lo normal y 11 de 16 quedan arriba; con objeto solo, 4 de 13. **En foto y carrusel**, el objeto solo queda abajo en 45 de 67 y pierde dentro de la misma cuenta en 8 de 9. Arriba quedan el espacio (1.1), las portadas con título (1.2) y alguien mirando a cámara (1.3).",
   "nota":"La certeza es alta para el objeto solo (67 publicaciones en 14 cuentas). Para lo demás hay menos piezas."},
  {"q":"¿De qué hablar?","r":"De lo que está pasando y de quién hace las piezas. El producto, dentro de eso.","certeza":"media","graf":"pilar",
   "x":"El producto es 64% de lo que publican las tiendas y rinde justo lo normal (0.97 en foto, 1.0 en reel): **es la base, no lo que destaca**. Arriba quedan las publicaciones de evento (1.3 en foto, 10 de 14 arriba) y, en reel, las de proceso (5.1) y las que son sobre una persona (2.3), que casi siempre van compartidas. Abajo, los avisos (0.54 en foto, 0.8 en reel).",
   "nota":"Proceso y persona tienen pocas piezas propias: lo que se sabe de ellas viene sobre todo de las compartidas."},
  {"q":"¿Con quién publicar?","r":"Con cada marca, y primero con las más grandes.","certeza":"alta","graf":"socio",
   "x":"Es el patrón más fuerte del corte y se repite en reel y en foto. Con un socio al menos cuatro veces más grande: 6.2 veces lo normal en reel (13 de 13 arriba) y 20 veces en foto o carrusel (8 de 8). Con uno de tamaño parecido: 3 veces en reel y 2.2 en foto o carrusel. Con uno mucho más chico: 1.1 y 1.4, casi lo mismo que una propia. **Para una cuenta de 56 seguidores todos los socios son grandes.**",
   "nota":"La respuesta es prestada: hay que medir cuántos seguidores se quedan después de cada una."},
  {"q":"¿Cuántas veces a la semana?","r":"De 2 a 3, que es el ritmo que ya llevan.","certeza":"baja","graf":None,
   "x":"Las 11 tiendas más activas publican entre 1.6 y 3.3 veces por semana. El corte no muestra que publicar más dé más respuesta: MUMEDI publica 3.3 veces por semana y Originario 0.7, y la respuesta por seguidor de Originario es seis veces mayor (0.73% contra 0.12%). **Sostener el ritmo importa más que subirlo.**",
   "nota":"Con un solo corte no se puede ver qué pasa cuando una cuenta cambia de ritmo."},
  {"q":"¿Qué día y a qué hora?","r":"Casi no importa. Mejor entre 3 de la tarde y 9 de la noche; nunca antes de las 9 de la mañana.","certeza":"baja","graf":"hora",
   "x":"Por día de la semana no hay patrón: todos quedan entre 0.84 y 1.10. Por hora, antes de las 9 de la mañana solo 3 de 15 piezas quedaron arriba de lo normal. De 3 de la tarde a 9 de la noche quedaron arriba 39 de 72, contra 47 de 108 de 9 a 3. Dentro de una misma cuenta la tarde le gana a la mañana en 6 de 9.",
   "nota":"La diferencia es chica. No vale la pena mover una publicación por la hora."},
  {"q":"¿Texto largo o corto? ¿Hashtags?","r":"Que el texto diga qué es, de quién y dónde. Los hashtags no mueven nada.","certeza":"baja","graf":"texto",
   "x":"Las publicaciones con texto de más de 300 caracteres quedan arriba de lo normal en 54 de 101; las de 80 a 300, en 30 de 80. Con o sin hashtags el resultado es el mismo (1.0). El número de imágenes de un carrusel tampoco cambia nada.",
   "nota":"El texto largo suele venir con piezas de evento o de persona, así que puede ser el tema y no el largo."},
 ],
 "mezcla":{"t":"Mezcla de partida","x":"De cada 10 publicaciones. **Al menos 5 de las 10, compartidas con una marca. Ningún aviso en el perfil.**","reel":3,"carrusel":6,"foto":1},
 "semana":{"t":"Una semana tipo, de aquí a la apertura","items":[
   {"t":"1 reel de 20 a 45 segundos","x":"Una marca llegando con sus piezas o alguien montando. Compartido con la marca que aparece."},
   {"t":"1 carrusel de lo que está pasando","x":"Abre con el cuarto o con un título; los objetos van adentro. Compartido si aparece una marca."},
   {"t":"1 carrusel de una marca","x":"Quién es, qué hace y sus piezas ya en la tienda. Compartido con ella."},
   {"t":"Avisos en historias","x":"Horarios, recordatorios y cuenta regresiva, fuera del perfil."}]},
 "nosabe":["No hay alcance de fotos ni de historias: Instagram solo publica las reproducciones de los reels.","No se sabe qué piezas tuvieron pauta.","La respuesta de una publicación compartida es de las dos audiencias juntas.","Son 90 días que incluyen Día de Muertos.","Ninguna tienda del radar tiene el tamaño de Piso ikpali: la más chica tiene 863 seguidores."],
}
T["medir"]=[
 {"t":"Seguidores antes y después","x":"Anotar los seguidores el día de cada publicación compartida y una semana después. Hoy son 56. Es la única forma de saber cuánta de la respuesta de la otra cuenta se queda."},
 {"t":"Reproducciones a los 7 días","x":"De cada reel, las reproducciones a la semana de publicado. Con tres reels ya hay una mediana propia contra la cual comparar el cuarto."},
 {"t":"Comentarios","x":"Hoy las 10 publicaciones propias suman 7. Con los likes ocultos es lo único que se ve desde fuera."},
 {"t":"El siguiente corte","x":"La semana después de la apertura del 5 de diciembre, con las mismas cuentas, para ver qué de esto se movió."},
]
T["metodo"]=[
 "Cuentas: 21 tiendas de diseño y objeto en México, en tres círculos, más @piso.ikpali. Cuatro no publicaron en el periodo.",
 "Material: todas las publicaciones de cada cuenta del 15 de agosto al 12 de noviembre de 2026 (hasta 40 por cuenta; solo MUMEDI llegó al tope). Son 366 piezas: 231 carruseles, 94 reels y 41 fotos sueltas.",
 "Cada reel se revisó con cuatro cuadros repartidos en su duración. De carruseles y fotos se etiquetó la portada, que es lo que se ve en el inicio de Instagram; las demás imágenes se muestran en Evidencia.",
 "Qué hay en pantalla y de qué trata se asignaron viendo la imagen. Después cada lectura se cotejó contra el texto de la publicación para corregir hechos.",
 "La voz se detectó transcribiendo de forma automática el audio de cada reel: 24 de 94 tienen voz hablada en español. La transcripción puede traer errores.",
 "Compartida: la publicación tiene coautores o la publicó otra cuenta. De cada socio (101 cuentas) se tomaron los seguidores para comparar su tamaño con el de la tienda.",
 "Lo normal de su cuenta: cada reel se divide entre la mediana de reproducciones de los reels propios de su cuenta, y cada foto o carrusel entre la mediana de likes más comentarios de las fotos y carruseles propios. Solo en cuentas con tres propias o más.",
 "Todo se compara con medianas, no con promedios, para que una pieza viral no mueva la lectura.",
 "Las horas son de la Ciudad de México. Las piezas con menos de un día de publicadas no entran en las medianas.",
 "Cada afirmación se volvió a calcular dentro de una misma cuenta y quitando la serie o la cuenta que más pesa. Las que no se sostuvieron se bajaron de tono o se quitaron.",
]
T["limites"]=[
 "Muestras chicas. Varias comparaciones se sostienen en menos de 10 piezas; cada una dice en cuántas.",
 "Lo más visto junta dos cosas, proceso con gente y publicación compartida. Este corte no alcanza para separar cuánto pesa cada una.",
 "No se distingue alcance orgánico de pagado: una pieza con pauta se ve igual que una sin pauta.",
 "Onora, LAGO, Vena y Piso ikpali ocultan los likes en la mayoría de sus publicaciones: 95 de las 366 piezas no tienen likes visibles y no entran en las comparaciones de respuesta.",
 "Reel contra foto solo se puede comparar en likes y comentarios. De las fotos no hay reproducciones ni alcance.",
 "El periodo incluye Día de Muertos. En las propias no movió el resultado (1.09 contra 1.0).",
 "Es una sola foto de 90 días: no se ve qué pasa cuando una cuenta cambia lo que hace.",
 "Siete reels solo aparecen en la pestaña de reels de su cuenta, no en el perfil; vienen del corte anterior.",
]
T["terminos"]=[
 {"k":"Lo normal de su cuenta","re":"veces lo normal(?: de su cuenta| de la tienda)?|lo normal(?: de su cuenta)?|contra su cuenta","x":"Cada pieza se compara con lo que esa misma cuenta saca normalmente (la mediana de sus publicaciones propias). 1.0 es lo normal, 2.0 el doble y 0.5 la mitad. Así una cuenta grande no se confunde con un contenido que funciona."},
 {"k":"Compartida","re":"compartid[oa]s?","x":"Publicación hecha junto con otra cuenta; Instagram le dice colaboración. Sale en el perfil de las dos y la ven los seguidores de las dos."},
 {"k":"Socio","re":"socios?","x":"La otra cuenta de una publicación compartida."},
 {"k":"Propia","re":"(?<=reels? |publicaci[oó]n(?:es)? |carruseles |una )propi[oa]s?","x":"Publicación que la cuenta hizo sola, sin compartirla con otra."},
 {"k":"Reel","re":"reels?","x":"Video vertical de Instagram. Es el formato que Instagram le enseña a gente que no sigue la cuenta, y el único del que se sabe cuántas veces se vio."},
 {"k":"Carrusel","re":"carrusel(?:es)?","x":"Publicación con varias imágenes que se deslizan."},
 {"k":"Foto suelta","re":"fotos? sueltas?","x":"Publicación de una sola imagen."},
 {"k":"Reproducciones","re":"reproducciones","x":"Cuántas veces se vio un reel. Solo existe para video."},
 {"k":"Mediana","re":"medianas?","x":"El valor de en medio: la mitad de las piezas queda arriba y la mitad abajo. Se usa en lugar del promedio para que una pieza viral no mueva todo."},
 {"k":"Respuesta por seguidor","re":"respuesta por seguidor","x":"Likes más comentarios de una publicación, entre los seguidores de la cuenta."},
 {"k":"Respuesta","re":"respuesta","x":"Likes más comentarios de una publicación."},
 {"k":"Objeto solo","re":"objetos? solos?|objeto suelto","x":"La pieza sin nadie y sin espacio alrededor."},
 {"k":"En escena","re":"en escena","x":"Alguien haciendo algo, sin hablarle al lente: montar, tallar, acomodar, atender."},
 {"k":"A cámara","re":"a cámara","x":"Alguien le habla al lente o, en foto, lo mira de frente."},
 {"k":"Manos","re":"(?<=, )manos(?= o)","x":"Solo manos usando o sosteniendo una pieza."},
 {"k":"Modelo","re":"\\bXXmodeloXX\\b","x":"Alguien posando con el producto."},
 {"k":"Espacio","re":"el espacio(?= \\()","x":"La tienda, un set montado o un lugar."},
 {"k":"Portada con título","re":"portadas? con título","x":"La primera imagen de la publicación lleva un texto grande encima."},
 {"k":"Proceso","re":"proceso","x":"Piezas que enseñan cómo se hace o se monta algo."},
 {"k":"Persona","re":"sobre una persona","x":"Piezas sobre quien diseña, hace o fundó: su historia o su trabajo."},
 {"k":"Evento","re":"de evento","x":"Algo que pasa en una fecha: una apertura, una charla, un taller, una exposición."},
 {"k":"Aviso","re":"avisos?","x":"Horarios, promociones, vacantes y recordatorios."},
 {"k":"Producto","re":"de producto","x":"Piezas que enseñan lo que se vende."},
 {"k":"Historias","re":"historias","x":"Publicaciones que duran 24 horas y salen arriba del inicio de Instagram, no en el perfil."},
 {"k":"Perfil","re":"perfil","x":"La cuadrícula con todas las publicaciones de una cuenta."},
 {"k":"Pauta","re":"pauta","x":"Publicidad pagada para que una publicación llegue a más gente. Desde fuera no se distingue."},
 {"k":"Insights","re":"Insights","x":"Las estadísticas privadas que Instagram le da al dueño de cada cuenta: alcance, guardados, de dónde llegó la gente."},
 {"k":"Likes ocultos","re":"likes (?:están )?ocultos","x":"La cuenta eligió no mostrar cuántos likes tiene cada publicación. Desde fuera solo se ven los comentarios."},
 {"k":"Música con licencia","re":"música con licencia","x":"Una canción del catálogo de Instagram puesta encima del video."},
 {"k":"Audio original","re":"audio original","x":"El sonido que trae el video: ambiente, voz o música propia."},
 {"k":"Par directo","re":"pares directos|par directo","x":"Tienda de diseño y objeto en CDMX con oferta parecida a la de Piso ikpali."},
 {"k":"Audiencia","re":"\\bXXaudienciaXX\\b","x":"Tienda que compite por la misma gente con otra oferta: moda, galería, museo."},
 {"k":"Corte","re":"\\bXXcorteXX\\b","x":"Esta revisión: todo lo que publicaron las tiendas en 90 días, visto y medido una sola vez."},
]
json.dump(T,open(sys.argv[1]+"/corte/textos3.json","w"),ensure_ascii=False,indent=1)
s=json.dumps(T,ensure_ascii=False); print("ok",len(s),"| guiones largos:",s.count("—"),s.count("–"))
