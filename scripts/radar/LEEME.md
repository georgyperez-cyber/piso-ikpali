# Scripts del corte del radar

Los pasos con los que se armó el corte del 13 de noviembre de 2026. Corren en la sesión de Claude, no en el sitio. Las rutas apuntan a la carpeta de trabajo de esa sesión: se ajustan al empezar un corte nuevo.

1. `build3.py`: toma el censo de publicaciones de 90 días (Apify, instagram-scraper en modo posts), lo une con las piezas ya etiquetadas, baja portadas y videos y arma las tiras: 4 cuadros de cada reel y las imágenes 2 a 5 de cada carrusel.
2. `tr3.py`: transcribe el audio de cada reel con faster-whisper.
3. Ver cada pieza nueva, etiquetarla (qué hay en pantalla, de qué trata) y escribir su lectura. No es script.
4. `an3.py`: el análisis. Calcula lo normal de cada cuenta, el tamaño de cada socio y todas las comparaciones. Se puede correr solo para ver los resultados.
5. `textos3.py`: los textos del corte (panorama, jugadas, estrategia, método y glosario).
6. `gen3.py`: escribe `src/lib/radar/corte-AAAA-MM-DD.json`, copia la media a `public/radar-media` e imprime el cotejo de cifras y de las lecturas que dicen "la más vista" para revisarlas contra los datos.
