---
layout: post
title:  "Tutorial. Cambiar grid de Bootstrap"
date:   2016-2-6 10:00:00 +0100
comments: true
author: ivanheral
categories: tutorial
urlimage: /files/images/desarrollo/bootstrap.jpg
---
Hoy explicare como modificar el sistema grid de <strong>Bootstrap 4.0.0 alpha 2</strong> para optimizarlo según el tipo de grid que tengamos pensado realizar. Para ello os dejare un entorno de trabajo preconfigurado para explicar de forma sencilla como es el procedimiento de customizarlo. Es una carpeta de nombre Boostrap con sus ficheros <strong>Gruntfile.js</strong> y <strong>package.json</strong> ya configurados, tan solo debéis ejecutar <strong>npm install</strong> dentro de ella como ya explique en mi anterior tutorial de Grunt.

{% include url.html id="https://www.dropbox.com/s/f9azuv1ohzdp5a4/Bootstrap.zip?dl=0" text="Entorno de trabajo" %}


<strong>package.json.</strong> Necesitaremos Grunt junto a los plugins <strong>grunt-sass</strong> (para compilar Bootstrap), 
<strong>grunt-contrib-watch</strong> (para ahorrarnos compilar cada vez que modifiquemos un *.scss) y <strong>load-grunt-tasks</strong> 
(para no perder tiempo en registrar los plugins que utilicemos).
<pre>
    <code class="language-json">
{
    "name": "bootstrap",
    "devDependencies": {
        "grunt": "~0.4.5",
        "grunt-contrib-watch": "*",
        "grunt-sass": "*",
        "load-grunt-tasks": "*"
    }
}
    </code>    
</pre>

<strong>Gruntfile.js.</strong> Este fichero de configuración puede ser un poco mas complicado de entender, 
he dejado comentarios para evitar cualquier tipo de duda al respecto.
<pre>
    <code class="language-js">
module.exports = function (grunt) {
    /* Variable global path_css para indicar la ruta de nuestros *.css */
    var globalConfig = {
        path_css: "css"
    };

    grunt.initConfig({
        /* Renombramos. En config.path_css estara el valor */
        config: globalConfig,
        /* Podemos pasar la variable name de package.json leyendo 
        el fichero */
        pkg: grunt.file.readJSON('package.json'),
        /* Proceso encargado de compilar a css:
            bootstrap-grid.css <<<<- bootstrap-grid.scss.
        */
        sass: {
            grid: {
                files: {
                    "<%= config.path_css %>/<%= pkg.name %>-grid.css": "scss/<%= pkg.name %>-grid.scss"
                }
            }
        },
        /* Si ejecutamos grunt watch y modificamos algun
        fichero *.scss en la carpeta scss lanzara sass:grid */
        watch: {
            default: {
                files: ['scss/**/*.scss'],
                tasks: ['sass:grid'],
            }
        }
    });

    require('load-grunt-tasks')(grunt, {
        scope: 'devDependencies'
    });
    grunt.registerTask('bootstrap-grid', ['sass:grid']);
};
    </code>    
</pre>

Lanzamos el siguiente comando para que cualquier modificación que realicemos en la carpeta 
scss nos de como resultado un bonito <strong>bootstrap-grid.css</strong> en nuestra carpeta <strong>css</strong> del proyecto:
<pre>
    <code class="language-bash">
grunt watch
    </code>    
</pre>

Podemos abrir el <strong>index.html</strong> con cualquier navegador. En el extremo inferior izquierda tenemos un indicador que nos informa en que dispositivo nos encontramos segun la anchura de nuestra ventana. <strong>xs</strong> (telefono diminuto), <strong>sm</strong> (smartphone), <strong>md</strong> (tablets), <strong>lg</strong> (escritorio normal) y <strong>xl</strong> (escritorio enorme), estas son las nomenclaturas que emplearemos en el nuevo <strong>Bootstrap 4.0</strong>.

Si os habéis cansado de trastear pasamos a ver el codigo de <strong>index.html</strong>. Dentro del container comprobareis que hay 3 elementos con sus clases <strong>col-*</strong> (columnas), Bootstrap divide los container en columnas hasta un maximo de 12. Ahora quedémonos con una de estas clases para explicar como funciona este sistema, por ejemplo <strong>col-md-4</strong>, la nomenclatura <strong>md</strong> nos indica que afecta a las tablets y el numero 4 nos alerta de que su anchura en ese tipo de dispositivos es de un ratio de <strong>4/12</strong> ocupando un <strong>33.33%</strong> del container.

<title>Customizar el grid</title>

El <strong>bootstrap-grid.css</strong> que tenemos es el que viene por defecto pero... ¿podemos optimizarlo a nuestro antojo? ¿se puede customizar? si, siempre y cuando tengamos cuidado con las modificaciones que hagamos en la carpeta <strong>scss</strong>. Antes de comenzar debo recalcar que los ficheros <strong>*.scss</strong> que pasare a listar han sido modificados con comentarios en español para facilitar la comprensión de los mismos.

<strong>scss/bootstrap-grid.scss</strong>. En este fichero se encuentran las variables mas importantes para crear nuestro grid:

<pre>
    <code class="language-scss">
/* listado con los limites preestablecidos*/
$grid-breakpoints: (
  // Moviles pequeños
  xs: 0,
  // Smartphone
  sm: 544px,
  // Tablets
  md: 768px,
  // Escritorio normal
  lg: 992px,
  // Escritorio enorme
  xl: 1200px
) !default;

$container-max-widths: (
  sm: 576px,
  md: 720px,
  lg: 940px,
  xl: 1140px
) !default;

$grid-columns:               12 !default;
$grid-gutter-width:          1.875rem !default; // 30px

@import "variables";

@import "mixins/clearfix";
@import "mixins/breakpoints";
@import "mixins/grid-framework";
@import "mixins/grid";

@import "grid";
    </code>    
</pre>

OK, nos toca modificar este fichero en función del contenido del <strong>index.html</strong> que visteis anteriormente. Lo primero que haremos es comentar la vista <strong>xl</strong> debido a que no la usamos en el <strong>index.html</strong> que os pase así que podéis eliminarla. Ahora el ancho máximo de los escritorios enormes dependerán del valor de lg en <strong>$container-max-widths</strong>, lo cambiamos por 820px. La cosa quedaría de esta forma:
<pre>
    <code class="language-scss">
$grid-breakpoints: (
  // Moviles pequeños
  xs: 0,
  // Smartphone
  sm: 544px,
  // Tablets
  md: 768px,
  // Escritorio normal
  lg: 992px
) !default;

$container-max-widths: (
  sm: 576px,
  md: 720px,
  lg: 820px
) !default;
    </code>    
</pre>

¿Que pasa con <strong>$grid-columns</strong>? buena pregunta... tenemos que descubrir el valor idóneo según nuestro <strong>index.html</strong> con una  regla muy sencilla:

<strong>$grid-columns = (nº max divisiones par)*(nº max divisiones impar)</strong>

En la vista Tablet veréis que se divide en 3 columnas, mientras que la división par máxima que encontrareis sera un simple 2, multiplicamos 2x3 y obtendréis el 6 como valor óptimo. Reemplazamos:

<pre>
    <code class="language-scss">
$grid-columns:               6 !default;
    </code>    
</pre>

Se me ha olvidado comentar que modificar <strong>$grid-columns</strong> implica cambiar nuestro <strong>index.html</strong>, aquí viene nuestra 2º regla. Para pasar de 12 a 6 hemos tenido que dividir por 2, pues bien, todo <strong>col-X-(num)</strong> pasara a <strong>col-X-(num/2)</strong> y con eso seria suficiente para subsanar el desaguisado.

<strong>scss/mixins/_grid-framework.scss.</strong> La columna vertebral que genera los estilos fundamentales para nuestro grid con <strong>Bootstrap 4</strong>:
<pre>
    <code class="language-scss">
@mixin make-grid-columns(
$columns: $grid-columns, 
$gutter: $grid-gutter-width, 
$breakpoints: $grid-breakpoints) {
  /* Plantilla de las columnas, aqui podremos introducir 
  los estilos que nos interese usar */
  %grid-column {
    position: relative;
    min-height: 1px;
    /* Mis estilos */
    padding: 1em 0;
    background-color: 	#0084b4;
    outline: 1px solid #fff;
    text-align: center;
    color: #fff;
    font-size: 32px;
    /* Fin de mis estilos */
    // bug??
    //padding-left: ($gutter / 2);
    //padding-right: ($gutter / 2);
  }
  @each $breakpoint in map-keys($breakpoints) {
  
    /* Importancia nula */
    @for $i from 1 through $columns {
      .col-#{$breakpoint}-#{$i} {
        @extend %grid-column;
      }
    }
    
    /* Bastante simple, igual te interesa que las columnas 
    floten a la izquierda pero nada mas */
    @include media-breakpoint-up($breakpoint) {
      %grid-column-float-#{$breakpoint} {
        float: left;
      }
      
      /* Importancia nula */
      @for $i from 1 through $columns {
        .col-#{$breakpoint}-#{$i} {
          @if not $enable-flex {
            @extend %grid-column-float-#{$breakpoint};
          }
          @include make-col-span($i, $columns);
        }
      }
      
      /* Podemos eliminar todo esto si no tenemos pensado 
      usar offset, push y pull */
      @each $modifier in (pull, push, offset) {
        @for $i from 0 through $columns {
          .col-#{$breakpoint}-#{$modifier}-#{$i} {
            @include make-col-modifier($modifier, $i, $columns)
          }
        }
      } 
      
    }
  }
}
    </code>    
</pre>

En este fichero reemplazaremos los ".col-" que veis en verde por un "." y en nuestro <strong>index.html</strong> sustituiremos todas las clases <strong>col-(X)-(num)</strong> por <strong>(X)-(num)</strong>, es decir, col-md-4 a md-4 y así con todos.

<strong>scss/mixins/_grid.scss.</strong> De este archivo solo me centrare en la función encargada de encapsular los anchos máximos del container en los diferentes dispositivos:

<pre>
    <code class="language-scss">
@mixin make-container-max-widths($max-widths: $container-max-widths) {
    @each $breakpoint,
    $container-max-width in $max-widths {
        @include media-breakpoint-up($breakpoint) {
            max-width: $container-max-width;
        }
    }
}
    </code>    
</pre>

Imaginar que os pido que el container en los escritorios normales no tenga margen por la izquierda, pues...

<pre>
    <code class="language-scss">
@mixin make-container-max-widths($max-widths: $container-max-widths) {
    @each $breakpoint,
    $container-max-width in $max-widths {
        @include media-breakpoint-up($breakpoint) {
            max-width: $container-max-width;
            /* Si estamos en un escritorio normal... */
            @if ($breakpoint == "lg") 
            {
                /* ...lo pegamos a la izquierda */
                margin-left: 0px;                
            }
            
        }
    }
}
    </code>    
</pre>

Y aquí finalizo el tutorial de hoy, os dejo un link del entorno de trabajo con todas las modificaciones que he realizado y comprobéis el resultado final.


{% include url.html id="https://www.dropbox.com/s/f6i4yf60p5vpk08/Bootstrap_custom.zip?dl=0" text="Codigo del Tutorial" %}