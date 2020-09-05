---
layout: post
title:  "Retrospectiva y situación del blog"
date:   2019-9-11 15:00:00 +0100
comments: true
author: ivanheral
categories: opinion
urlimage: //media1.giphy.com/media/KyGiMJokZEQvu/giphy_s.gif
---

¿Qué tal?, me habéis pillado un poco con las manos en la masa, rematando algunos detallitos para retomar todo esto. Ahora mismo me encuentro haciendo acopio de provisiones mientras pongo a punto el blog con las pilas cargadas. Estaba escuchando "Both sides Now" de Bing Crosby, darme un momento para quitarme los auriculares y tomar asiento mientras os cuento en qué situación me encuentro ahora, bueno mejor dicho mi blog que seguramente es quien os ha traído hasta aquí y lo que motiva a continuar.

Si la memoria no me falla, comencé con el blog durante las primeras cabalgatas de Manuela Carmena. Lo recuerdo porque estaba maquetándola y no podía quitar la mirada del esperpéntico espectáculo que estaba contemplando. Gracias Carmena por recordarme la fecha fatídica, contigo empezó todo. Era mi side-project particular, que ha desaparecido y resurgido de sus cenizas en innumerables ocasiones.

La idea era muy sencilla, publicar un post cada 10 días. En ese momento lo veía factible porque tenía un trabajo casi de funcionario, pero con el tiempo la cosa se fue complicando un poquito. Decidí trabajar más y ya no tenía tiempo libre ni para limpiarme el culo. Me di cuenta que iba con la lengua fuera para alcanzar el objetivo y tiré la toalla. Se suponía que sería un sitio para escribir mis críticas de cine que ya no me publicaban en ningún lado, pero la cosa no fue por esa dirección y os contare un poco lo que paso.

En el primer mes ya me di cuenta que tenía que diversificar el contenido en 4 temáticas: cine, opinión, tutoriales y random. Realmente no me preguntéis por qué escogí esos temas porque a día de hoy no lo tengo muy claro. Supongo que englobaban las cosas que me gustaba tratar en su momento, aunque tengo que decir que continuarán siendo mis temas predilectos en esta nueva etapa.

En los primeros meses, me centre demasiado en los tutoriales. Eran fáciles de preparar y me ayudaban a desconectar del alrededor, pero con el tiempo me di cuenta que no me sentía cómodo planteándolos incluso continuando publicando cosas. Luego me sentía estúpido perdiendo mi tiempo libre en hacerlos de manera totalmente gratuita y eso acabo por deprimirme por completo. No me extraña 

Me temo, muy a mi pesar, que en esta nueva etapa no haré nuevos manuales de esos. Dedicare mi tiempo – el poco que tengo - a escribir posts de opinión o random (según se tercie) porque es lo que me motiva actualmente y porque me salen solos de pura desidia. Tenéis mejores tutoriales en otros blogs, no tenéis que buscar mucho para encontrarlos.

¿Como se encuentra el blog? bueno, pues mejor que yo, os lo puedo asegurar. En estos dos años le he insuflado mejoras con commits con nombres tan sugerentes como "changes" o mal comentados fruto de la vagancia. Aquí dentro me siento como en mi propia casa, es un lugar lleno de paz y serenidad donde cada elemento tiene su razón de ser. Todo este ordenado hasta límites insospechables, cada línea de código ha sido estudiada – de manera torpe en muchas ocasiones - hasta el milímetro. 
Actualmente todo funciona gracias a 220 líneas de texto - lo que suele tener el libro de vuestro youtuber favorito - de JavaScript, menos de 5kb. Las variables, la lógica de búsqueda de posts, la animación de las ventanas modales… todo organizadito, limpio y nítido. Vamos, una jodida maravilla para los ojos de un picateclas como yo. Aquí tenéis una gráfica de la cantidad de código que se carga cuando entráis en él y de paso os comentare que lo hace especial:

{% include chart.html id="dashboard_div" title="Estoy usando una librería chart que ocupa 500kb para enseñaros lo optimizado que esta el blog (Risas enlatadas.)" %}

El diseño es propio, pero tiene reminiscencias de twitter (el diseño antiguo, no el horrible de ahora), médium o el país. He ido pillando remaches de aquí y de allá hasta conseguir algo que me convenciera a la vista. Posiblemente he llegado al medio centenar de diseños hasta dar con la tecla correcta que me convenciera.

Dispone de un sistema de “lazy-loading” artesanal que carga los gifs/imágenes según los visualizamos para ahorrar datos a la gente que entra por aquí. Si ya me sabe mal robarles tiempo leyendo mis tontunas como para ir robándoles gigas de su tarifa de datos. Solo tenéis que hacer scroll para que se cargue el contenido multimedia.

Otra particularidad que tiene este sitio web es que la transición entre el post que lees y la portada no implica uno carga de los assets nuevamente. Yo lo suelto por si te interesa saberlo, ya sé que es una tontuna, pero me interesa ser lo más transparente posible. Tampoco te tienes que preocupar por las cookies, pero si un día quedamos y te entra el antojo pues te puedo traer unas que hace mi abuela que están muy buenas. 

Del mismo modo, disqus - el sistema de comentarios - no se carga si no hay intención de leer el post, ver los comentarios, aunque tampoco tenéis que preocuparos por eso, no he caído en la cuenta que nadie escribe comentarios por aquí XD. Es muy probable que si estas leyendo este párrafo. Si has llegado hasta este párrafo es muy probable que disqus se te haya cargado, así que mil perdones por los datos que te he robado sin avisar.

Otra idea acertada ha sido mejorar el soporte con gifs de páginas webs tan importantes como giphy, gfycat y coubs. Se ha optimizado la incorporación de vídeos de youtube, tweets y gráficos. Todo ello con el único fin de mejorar la UX o como carajos se llame ahora, vamos, lo que ves por los ojos. Soy todo oídos a cualquier mejora en cuanto a diseño o programación siempre que no me tenga que rascar el bolsillo. También estoy abierto a cualquier aportación económica.

{% include elem.html gfycat="FlatPowerfulBlackbear" title="Pulsar en la imagen y no me digáis que no es precioso. Se encuentra en fase beta, pero intentare mejorarlo un poquito" %}


Continuare usando Jekyll, aunque uno de mis próximos objetivos será eliminarlo por completo y tener la tenue sensación de que el blog me pertenece al 100%. Tendré que hacer algo con los markdowns y los json para migrar todo esto de manera satisfactoria.

Posiblemente me las esté dando de fanfarrón, pero no he visto blog más optimizado como el mío a nivel nacional. No he localizado ninguno parecido, de eso estoy más que seguro y eso que he investigado los blogs de muchos brogrammers patrios. La gente está muy obsesionada con los frameworks de javascript para hacer blogs, espero que algún día abran los ojos.

Y eso es todo, la próxima semana ya empezare con la rutina que me ha recomendado mi psicólogo de publicar mis vivencias por aquí. Así que ya podéis decir a amigos y familiares que el gilipollas de iván ha vuelto. No sé, supongo que nos llevaremos bien, ahora necesito desconectar nuevamente. Me pondré los auriculares y continuare fregando este destartalado sitio escuchando versionados de "Both Sides Now". Mira que bien, ahora toca escuchar la versión de Frank Sinatra: "And ice crean castles un the air…"