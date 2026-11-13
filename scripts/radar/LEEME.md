# Scripts del corte del radar

Los tres pasos con los que se armó el corte del 12 de noviembre de 2026. Corren en la sesión de Claude, no en el sitio. Las rutas apuntan a la carpeta de trabajo de esa sesión: se ajustan al empezar un corte nuevo.

1. `1-piezas-y-media.py`: junta la corrida de perfiles y la de reels de Apify en una lista de piezas, baja portadas y videos y arma la tira de 4 cuadros de cada reel.
2. `2-transcribir.py`: transcribe el audio de cada reel con faster-whisper.
3. `3-generar-corte.py`: calcula las tablas, une las etiquetas y los textos, escribe `src/lib/radar/corte-AAAA-MM-DD.json` y copia la media a `public/radar-media`. Al final imprime el cotejo de todas las cifras que citan los textos.

Entre el paso 2 y el 3 va el trabajo que no es script: ver cada pieza, etiquetarla y escribir la lectura.
