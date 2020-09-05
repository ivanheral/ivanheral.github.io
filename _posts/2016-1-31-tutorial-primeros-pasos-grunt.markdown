---
layout: post
title:  "Tutorial. Primeros pasos con Grunt"
date:   2016-1-31 13:00:00 +0100
comments: true
author: ivanheral
categories: tutorial
urlimage: /files/images/desarrollo/grunt.jpg
---

Hoy inicio un serie de tutoriales hablando de <strong>Grunt</strong>, una herramienta en javascript que mediante unos plugins nos permitirá automatizar todas aquellas tareas repetitivas que nos hacen un perder un tiempo valioso. Para poder usarlo necesitamos el gestor de paquetes <strong>npm</strong> y <strong>grunt-cli</strong> - este ultimo instalado de manera global - con el siguiente comando:
<pre>
    <code class="language-bash">
sudo apt-get install npm && npm install -g grunt-cli   
    </code>    
</pre>

Ahora instalaremos Grunt y un plugin grunt-cssano, cuyo cometido es reducir el tamaño de los ficheros CSS. Todo este proceso se dividirá en dos partes para evitar malos entendidos, la instalación y su posterior configuración.

<strong>1º La instalación.</strong> Creamos una carpeta en nuestro escritorio  de nombre <strong>grunt_tutorial</strong>, en su interior generamos un fichero de nombre <strong>package.json</strong> donde alojaremos Grunt y el plugin grunt-cssnano dentro de la etiqueta <strong>devDependencies</strong>. La versión de Grunt va precedida de un <strong>~</strong> para puntualizar que queremos usar una versión concreta (0.4.5) mientras que con <strong>*</strong> forzaremos la ultima versión disponible de grunt-cssnano.
<pre>
    <code class="language-json">
{
    "name": "grunt",
    "version": "1.0.0",
    "description": "Grunt",
    "devDependencies": {
        "grunt": "~0.4.5",
        "grunt-cssnano": "*"
    }
} 
    </code>    
</pre>

Abrimos una terminal en la carpeta <strong>grunt_tutorial</strong> y ejecutamos el siguiente comando para instalar todo el contenido de <strong>devDependencies</strong> en la carpeta node_modules y, de ese modo, comenzar a usar Grunt:
<pre>
    <code class="language-bash">
npm install
    </code>    
</pre>

<strong>2º La configuración.</strong> Creamos <strong>Gruntfile.js</strong> en <strong>grunt_tutorial</strong>, su estructura se divide en tres partes fundamentalmente. La zona de variables globales, la zona intermedia donde configuraremos los plugins y la zona final donde registraremos los plugins que consideremos oportuno usar.
<pre>
    <code class="language-js">
module.exports = function (grunt) {

    /* zona de variables */

    grunt.initConfig({
    
    /* configuracion de plugins */
    
    });

    /* registro de tareas */
};
    </code>    
</pre>

Así quedaría la configuración de nuetro plugin cssnano. Tenemos un subproceso "default" que tratara el fichero /css/style.css  para reducirlo de tamaño y guardarlo en /css/result.css. En resumen, la variable <strong>src</strong> fija el puntero donde esta el fichero, mientras que <strong>dest</strong> apunta al lugar donde queremos dejar el fichero ya tratado.
<pre>
    <code class="language-js">
module.exports = function (grunt) {

    grunt.initConfig({

        cssnano: {
        /* Creamos un subtarea default */
            default: {
               /* archivos que tratar */
                files: [{
                    expand: false,
                    src: 'css/style.css',
                    dest: 'css/result.css'
    }]
            }
        }
        
    });
    /* Registro del plugin. Muy importante */
    grunt.loadNpmTasks('grunt-cssnano');
};
    </code>    
</pre>

Tan solo nos quedaría probar si funciona. Dentro de la carpeta <strong>grunt_tutorial</strong> creamos una carpeta de nombre CSS en cuyo interior pondremos un fichero style.css para respetar la variable <strong>src</strong> y escribiremos dentro lo siguiente:
<pre>
    <code class="language-css">
.class {
    background-color: #f3f3f3;
    width: 100px;
    height: 100px;
    font-color: #000
}    
    </code>    
</pre>

Desde la misma terminal abierta en <strong>grunt_tutorial</strong> podemos lanzar el siguiente comando para probarlo:

<pre>
    <code class="language-bash">
grunt cssnano
    </code>    
</pre>

Si todo ha ido bien obtendremos un result.css en la carpeta css con este aspecto reducido:
<pre>
    <code class="language-css">
.class{background-color:#f3f3f3;width:100px;height:100px;font-color:#000}
    </code>    
</pre>

{% include title.html title="Crear subtareas" %}

Como habéis podido comprobar, nuestra subtarea default esta muy limitada, pero veréis que con unas simples modificaciones podemos mejorarla a nuestro antojo.

<strong>Los CSS de una carpeta.</strong> Activamos expand a true para buscar recursivamente cualquier fichero. Por ultimo, la variable <strong>src</strong> se sustituye por 'css/*.css' para indicar que todos los ficheros con extensión *.css de la carpeta css serán tratados. En la carpeta dest obtendremos el resultado respetando la estructura de carpetas según vaya encontrándolos.
<pre>
    <code class="language-js">
folder: {
        files: [{
        expand: true,
        src: 'css/*.css',
        dest: 'dest'
        }]
}   
    </code>    
</pre>

<strong>Los CSS de carpetas & subcarpetas.</strong> Parecido al caso anterior pero con la salvedad de que la variable <strong>src</strong> contiene dos asteriscos para puntualizar que queremos que busque también en subcarpetas de la ruta css.
<pre>
    <code class="language-js">
subfolder: {
           files: [{
           expand: true,
           src: 'css/**/*.css',
           dest: 'dest'
           }]
}   
    </code>    
</pre>

<strong>Sobrescribir los CSS.</strong> Removiendo la variable dest obtendremos una subtarea que sobrescribe todos los ficheros *.css que estén en la carpeta css y subcarpetas.
<pre>
    <code class="language-js">    
overwrite: {
           files: [{
           expand: true,
           src: 'css/**/*.css'
           }]
}    
    </code>    
</pre>

Así quedaría nuestro fichero <strong>Gruntfile.js</strong> con la subtarea overwrite a modo de ejemplo. Al final del fichero podreis ver un <strong>registerTask</strong>, esa linea nos permite crear una tarea personalizada de nombre "sobrescribir" para ejecutar exclusivamente la subtarea overwrite de cssnano.

<pre>
    <code class="language-js"> 
module.exports = function (grunt) {
    grunt.initConfig({
        cssnano: {
        /* Creamos un subtarea default */
            default: {
               /* archivos que tratar */
                files: [{
                    expand: false,
                    src: 'css/style.css',
                    dest: 'css/result.css'
                    }]
            },
            /* Nueva subtarea */    
            overwrite: {
                files: [{
                expand: true,
                src: 'css/**/*.css'
                }]
            }
        }        
    });
    /* Registramos el plugin */
    grunt.loadNpmTasks('grunt-cssnano');
    /* Registramos una tarea de nombre sobreescribir 
    grunt.registerTask('nombre_personalizado',['cssnano:(subtarea de cssnano)']);
    */
    grunt.registerTask('sobrescribir',['cssnano:overwrite']);    
};
    </code>    
</pre>

Si queremos ejecutar cssnano con todas sus subtareas incluidas (default y overwrite) tendremos que ejecutar:
<pre>
    <code class="language-bash">
grunt cssnano
    </code>    
</pre>

Y si solo queremos ejecutar la subtarea overwrite:
<pre>
    <code class="language-bash">
grunt sobreescribir /* o también grunt cssnano:overwrite */
    </code>    
</pre>

En este tutorial hemos hablado exclusivamente de <strong>grunt-cssnano</strong> pero el listado de plugins para grunt es prácticamente infinito. Si os pica el gusanillo con Grunt podéis trastear con los plugins mas populares pulsando en el enlace de aquí abajo.

{% include url.html id="http://gruntjs.com/plugins" text="Listado de plugins para Grunt" %}