---
layout: post
title:  "Tutorial. Corazón animado con SVG"
date:   2016-3-21 11:00:00 +0100
comments: true
author: ivanheral
categories: tutorial
urlimage: //media1.giphy.com/media/OJVQOfitCNNkI/giphy_s.gif
---
Hoy he decidido hablar un poco de como animar un elemento SVG. Para ello he creado uno con inkscape, tranquilos esta limpiado y optimizado para que ocupe poco. Os dejo un enlace del ejemplo que usaremos:

{% include url.html id="https://www.dropbox.com/s/gzqiqryxi4nnh3h/Heart.zip?dl=0" text="Ejemplo SVG" %}

Si editáis el Heart.svg podréis ver que consta de tres elementos con sus respectivos identificadores: <strong>line_path</strong> (un path que dibuja el recorrido del pulso), <strong>heart_path</strong> (otro path que dibuja la forma del corazón) y <strong>pulse</strong> (un circulo que representa el pulso).

Ahora pasaremos a animarlos para que cobren algo de vida desde la hoja de estilos <strong>style.css</strong>:

<strong>heart_path:</strong> Este elemento tendrá dos animaciones, dash (que se ejecutara una sola vez con forwards dibujando el contorno del corazon) y pulse_heart (que aumentara y disminuirá el tamaño simulando el bombeo de sangre). Tranform y perspective me ayudan a centrar el elemento y disminuiré un 15% el tamaño del path con scale: 
<pre>
<code class="language-css">
#heart_path {
    animation: dash 2s ease forwards, pulse_heart 2s ease-out infinite;
    -webkit-animation: dash 2s ease forwards, pulse_heart 2s ease-out infinite;
    transform-origin: 50% 50%;
    -ms-transform-origin: 50% 50%;
    -webkit-transform-origin: 50% 50%;
    perspective: 0px;
    -webkit-perspective: 0px;
    -webkit-transform: scale(0.85, 0.85);
    transform: scale(0.85, 0.85);
}
</code>
</pre>

<strong>pulse:</strong> En este caso lanzamos la animación heart cada 2 segundos de forma lineal, ningún misterio en ese sentido:
<pre>
<code class="language-css">
#pulse {
    -webkit-animation: heart 2s infinite linear;
    animation: heart 2s infinite linear;
}
</code>
</pre>


<strong>line_path:</strong> Parecido al anterior, cada 2.5 segundos se ejecutara la animación dash exclusivamente una vez para dibujar la linea del pulso:
<pre>
<code class="language-css">
#line_path {
    animation: dash 2.5s ease forwards;
    -webkit-animation: dash 2.5s ease forwards;
}
</code>
</pre>

No he hablado mucho con respecto a los timings de las animaciones (ease, ease-out, linear, cubic...)  o  las iteraciones de una animación pero os dejo el siguiente enlace por si queréis trastear:

{% include url.html id="http://www.w3schools.com/css/css3_animations.asp" text="animaciones CSS" %}

Bueno, pasemos ahora a las animaciones. <strong>Pulse_heart:</strong> esta animación esta asignada al elemento <strong>heart_path</strong> con un intervalo de 2 segundos, aumentara el corazón a escala 1:1 al 90% (1.8 segundos) y se volverá a reducir cuando alcance el 100% (2 segundos):
<pre>
<code class="language-css">
@keyframes pulse_heart {
    0% {
        transform: scale(0.85, 0.85);
    }
    90% {
        transform: scale(1, 1);
    }
    100% {
        transform: scale(0.85, 0.85);
    }
}
</code>
</pre>

La animación <strong>dash</strong> permite dibujar los paths line_path aplicándoles el estilo <strong>stroke-dasharray='100'</strong> y modificando el valor <strong>stroke-dashoffset</strong> como se muestra a continuación:
<pre>
<code class="language-css">
@keyframes dash {
    0% {
        stroke-dashoffset: 95;
    }
    100% {
        stroke-dashoffset: 0;
    }
}
</code>
</pre>


Ahora nos queda el mas complicado, <strong>heart</strong>. Nuestro circulo <strong>pulse</strong> recorre 6 tramos así que dividiremos 100% por 6 y en cada tramo aplicaremos los translate que sean pertinentes indicando mediante coordenadas (x,y) hacia donde queremos que se posicione nuestro circulo. Para estas cosas suelo usar inkscape:  
<pre>
<code class="language-css">
@keyframes heart {
    0% {
        transform: translate(0px, 0px);
    }
    16.6666666667% {
        transform: translate(5.687px, 0);
    }
    33.3333333333% {
        transform: translate(8.844px, -7.937px);
    }
    50% {
        transform: translate(12.594px, 3.531px);
    }
    66.6666666667% {
        transform: translate(16.25px, -5.583px);
    }
    83.3333333333% {
        transform: translate(18.719px, 0px);
    }
    100% {
        transform: translate(28.187px, 0px);
    }
}
</code>
</pre>

Finalmente tendríamos nuestras animaciones corriendo pero no cantemos victoria. Las incompatibilidades con los distintos navegadores hacen que no se muestren correctamente en todos los navegadores. Por ejemplo, lo que acabamos de realizar se ve correctamente en Firefox y Chrome pero en IE, Opera y Safari puede que no se vea como lo teníamos planteado. Tendremos que duplicar animaciones y transforms con prefijos (<strong>-ms-</strong>, <strong>-webkit-</strong>, <strong>-o-</strong>, <strong>-moz-</strong>...).

El problema mas gordo viene con IE, por eso he decidido usar <strong>Snap.svg</strong> - una libreria JS para animar SVGs -, os muestro como se traduciría nuestro CSS a Snap.svg evitándonos muchos quebraderos de cabeza.


<strong>Inicialización de elementos:</strong> Aqui pasamos a encapsular los elementos en variables para poder manejarlos fácilmente. Usaremos <strong>attr</strong> para inicializar <strong>strokeDashoffset</strong> de cara al dibujado de esos elementos:
<pre>
<code class="language-js">
       /* Seleccionamos el svg a tratar por su identificador svg */
        var svg = Snap("#svg").attr('background', 'red');
        
        /* Asignamos variable a pulse */
        var pulse = svg.select('#pulse');
        
        /* Asignamos variable a heart_path */
        var heart = svg.select('#heart_path').attr({
            strokeDashoffset: 98
        });
        
        /* Asignamos variable a line_path */
        var line = svg.select('#line_path').attr({
            strokeDashoffset: 100
        });
</code>
</pre>
     
     
<strong>Animación de dibujado:</strong> Solo se ejecuta una vez en 2 segundos. Usamos <strong>animate</strong> para animar el cambio del valor de <strong>strokeDashoffset</strong>.  
<pre>
<code class="language-js">
        heart.animate({
            strokeDashoffset: 0
        }, 2000);
        
        line.animate({
            strokeDashoffset: 0
        }, 2000);
        
</code>
</pre>
        
<strong>Animación de aumento del tamaño (heart):</strong> Se ejecuta de forma continuada cada 2 segundos. Usamos una lista <strong>HeartAnim</strong> con dos variables (animation y dur) y creamos una función <strong>animateHeart</strong> que ejecute de forma secuencial cada paso de la animación.         
<pre>
<code class="language-js">   
        /* La s de tranform es de scale */
        var heartAnim = [
            {
                animation: {
                    transform: 's1,1'
                },
                dur: 0
            },

            {
                animation: {
                    transform: 's0.85,0.85'
                },
                dur: 200
            }
            , {
                animation: {
                    transform: 's1,1'
                },
                dur: 1800
            }];

        (function animateHeart(el, i) {

            el.animate(heartAnim[i].animation, heartAnim[i].dur, function () {
                animateHeart(el, ++i in heartAnim ? i : 0);
            })

        })(heart, 0);
        
</code>
</pre>


<strong>Animación movimiento del pulso:</strong> Parecido al anterior Se ejecuta de forma continuada cada 2 segundos. Usamos una lista <strong>pulseAnim</strong> con dos variables (animation y dur) y creamos una función <strong>animateCircle</strong> que ejecute de forma secuencial cada paso de la animación. 
<pre>
<code class="language-js"> 
        /* La t de tranform es de translate */
        var pulseAnim = [
            {
                animation: {
                    transform: 't0,0'
                },
                dur: 0
        },
            {
                animation: {
                    transform: 't5.687,0'
                },
                dur: 326.1
        },

            {
                animation: {
                    transform: 't8.844,-7.937'
                },
                dur: 326.1
        },
            {
                animation: {
                    transform: 't12.594, 3.531'
                },
                dur: 326.1
        },
            {
                animation: {
                    transform: 't16.25,-5.583'
                },
                dur: 326.1
        },
            {
                animation: {
                    transform: 't18.719,0'
                },
                dur: 326.1
        },
            {
                animation: {
                    transform: 't28.187,0'
                },
                dur: 326.1
        }];

        (function animateCircle(el, i) {
            el.animate(pulseAnim[i].animation, pulseAnim[i].dur, function () {
                animateCircle(el, ++i in pulseAnim ? i : 0);
            })
        })(pulse, 0);
</code>
</pre>

Esto de las animaciones SVG es un coñazo, usar prefijos a saco y aprender a usar Snap.svg para no volveros locos (sobretodo si tenéis pendado usar rotate). Últimamente estoy viendo muchas chapuzas con esto, incluso lo que os he mostrado estara plagado de algún gazapo. Por ultimo, os dejo el enlace de Snap.svg: 

{% include url.html id="http://snapsvg.io/" text="Snap.svg" %}