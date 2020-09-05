---
layout: post
title:  "Tutorial. Buscador de gifs con Giphy y Vue.js"
date:   2016-8-12 15:00:00 +0100
comments: true
author: ivanheral
categories: tutorial
urlimage: /files/images/desarrollo/vuejs.jpg
---

Bueno chicos, hoy realizaremos un buscador de gifs usando exclusivamente Vue.js, un framework que a diferencia de jQuery nos permite poner javascript en el propio DOM evitándonos selecciones innecesarias. Para hacerlo más interesante he contado con la colaboración de la Api Giphy, bastante popular tras su integración en twitter.

{% include elem.html giphy="xTiTnJ0uuZEwVlYQog" title="API Giphy nos permite obtener gifs de manera muy cómoda. Mas info: api.giphy.com" %}

Lo primero será crear una carpeta con tan solo 3 archivos. El primero sera <strong>bower.json</strong> que contendrá las dependencias <strong>vue</strong> (sin esto no vamos a ningún sitio), <strong>vue-resource</strong> para hacer las peticiones a la API Giphy y <strong>Font-awesome</strong> para usar su iconografía:

<pre>
    <code class="language-json">
{
  "name": "Vuejs - Tutorial",
  "description": "Giphy with Vuejs",
  "main": "",
  "license": "MIT",
  "homepage": "",
  "ignore": [
    "**/.*",
    "node_modules",
    "bower_components",
    "test",
    "tests"
  ],
  "dependencies": {
    "vue-resource": "^0.9.3",
    "vue": "^1.0.26",
    "font-awesome": "fontawesome#^4.6.3"
  }
}
    </code>    
</pre>
Pasamos al <strong>package.json</strong>. Me habría gustado haberlo unificado todo en el bower pero vue-infinite-scroll no se encontraba disponible. Aquí instalaremos nuevamente <strong>vue</strong>, <strong>firebase</strong> y <strong>vuefire</strong> (estos dos últimos para crear un histórico de búsquedas):

<pre>
    <code class="language-json">
{
  "name": "vuejs",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "dependencies": {
    "firebase": "^2.4.1",
    "vue": "^1.0.26",
    "vue-infinite-scroll": "^0.2.3",
    "vuefire": "^1.2.0"
  },
  "devDependencies": {},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
    </code>    
</pre>

Y finalmente el <strong>index.html</strong>, un fichero con los scripts & estilos necesarios ya configurados para solo preocuparnos de los <strong>estilos</strong>,  el <strong>DOM</strong> y el <strong>script</strong> como veréis a continuación: 

<pre>
<code class="language-html">
&lt;html lang="" id="giphy"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title&gt;SEARCH GIFS&lt;/title&gt;
    &lt;link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"&gt;
    &lt;link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.min.css"&gt;
    /* Aqui pondremos los estilos */
&lt;/head&gt;
&lt;body&gt;
    /* Aqui tendremos el DOM */
    &lt;script src="bower_components/vue/dist/vue.min.js"&gt;
    &lt;script src="bower_components/vue-resource/dist/vue-resource.min.js"&gt;
    &lt;script src="node_modules/vue-infinite-scroll/vue-infinite-scroll.js"&gt;
    &lt;script src="node_modules/firebase/lib/firebase-web.js"&gt;
    &lt;script src="node_modules/vuefire/dist/vuefire.min.js"&gt;
    /* Aqui ira el script de Vue.js */
&lt;/body&gt;
&lt;/html&gt;
</code>  
</pre>

Con estos tres ficheros ya tendremos todo lo necesario para tener montado nuestro entorno. Tan solo nos queda descargarnos los componentes con un simple comando:

<pre>
    <code class="language-bash">
npm install && bower install
    </code>    
</pre>

Nuestro buscador de gifs tendrá un input para buscar por palabras, un select para limitar el número de gifs que se muestran, un botón para buscar y finalmente, otro para reproducir/pausar todos los gifs. Debajo del formulario se colocarán pequeños botones indicándonos las búsquedas realizadas junto a un grid donde se visualizarán los gifs en formato 16:9. Teniendo en cuenta todo esto, nuestro DOM tendrá el siguiente aspecto:

<pre>
<code class="language-html">
&lt;div class="container form"&gt;
/* Formulario de busqueda */
    &lt;form class="row"&gt;
        &lt;div class="form-group col-xs-12 col-sm-6 col-md-3"&gt;
            &lt;input type="text" class="form-control" placeholder="SEARCH"&gt;
        &lt;/div&gt;
        &lt;div class="form-group col-xs-12 col-sm-6 col-md-3"&gt;
            &lt;select class="form-control"&gt;
                &lt;option&gt;32&lt;/option&gt;
                &lt;option&gt;64&lt;/option&gt;
                &lt;option&gt;128&lt;/option&gt;
            &lt;/select&gt;
        &lt;/div&gt;
        &lt;div class="form-group col-xs-6 col-md-3"&gt;
            &lt;a class="btn btn-block btn-primary">SEARCH&lt;/a&gt;
        &lt;/div&gt;
        &lt;div class="form-group col-xs-6 col-md-3"&gt;
            &lt;a class="btn btn-block btn-primary"&gt;
            &lt;i class="fa fa-play"&gt;&lt;/i&gt;&lt;/a&gt;
        &lt;/div&gt;
    &lt;/form&gt;
    &lt;div class="col-xs-12 row record"&gt;               
        &lt;button class="btn btn-default"&gt;Star Wars X&lt;/button&gt;
    &lt;/div&gt;
&lt;/div&gt;
/* Gifs encontrados */
&lt;div class="container grid"&gt;
    &lt;div class='col-xs-6 col-sm-6 col-md-3 col-lg-3'&gt;
        &lt;a>&lt;img>&lt;/a&gt;
    &lt;/div&gt;
&lt;/div&gt;
&lt;/code&gt;  
&lt;/pre&gt;
</code>
</pre>

Ahora es cuando tendremos que darle de vidilla y conseguir que cumpla con su cometido de encontrarnos esos gifs que tanto ansiamos. Por ejemplo, el input, la variable/modelo <strong>word</strong> recogerá el valor que contiene el input en todo momento: 

<pre>
<code class="language-html">
/* AFTER */
&lt;div class="form-group col-xs-12 col-sm-6 col-md-3"&gt;  
    &lt;input type="text" class="form-control" placeholder="SEARCH"&gt;   
&lt;/div&gt;  

/* BEFORE with Vue.js */

&lt;div class="form-group col-xs-12 col-sm-6 col-md-3"&gt;  
    &lt;input type="text" v-model="word" class="form-control" placeholder="SEARCH"&gt;   
&lt;/div&gt;
&lt;/code&gt;  
&lt;/pre&gt;
</code>
</pre>

Pasamos al <strong>select</strong>. Tendrá 4 elementos (32,64,128,256) almacenados en una variable <strong>limits</strong> en forma de lista que detectaran cualquier cambio almacenando el valor de la opción selecciona en <strong>selected</strong>:

<pre>
<code class="language-html">
/* AFTER */
&lt;div class="form-group col-xs-12 col-sm-6 col-md-3"&gt;
    &lt;select class="form-control"&gt;
        &lt;option&gt;32&lt;/option&gt;
        &lt;option&gt;64&lt;/option&gt;
        &lt;option&gt;128&lt;/option&gt;
    &lt;/select&gt;
&lt;/div&gt;

/* BEFORE with Vue.js */

&lt;div class="form-group col-xs-12 col-sm-6 col-md-3"&gt;
    &lt;select class="form-control" v-model="selected"&gt;
        &lt;option v-for="item in limits"&gt;
            {% raw %}{{item}}{% endraw %}
        &lt;/option&gt;
    &lt;/select&gt;
&lt;/div&gt;
</code>  
</pre>

El botón de búsqueda SEARCH lanzara el método <strong>search</strong> cada vez que sea clickeado. No tiene ningún misterio al respecto:

<pre>
<code class="language-html">
/* AFTER */
&lt;div class="form-group col-xs-6 col-md-3"&gt;
    &lt;a class="btn btn-block btn-primary">SEARCH&lt;/a&gt;
&lt;/div&gt;

/* BEFORE with Vue.js */

&lt;div class="form-group col-xs-6 col-md-3"&gt;
    &lt;a class="btn btn-block btn-primary" v-on:click="search"&gt;
        SEARCH
    &lt;/a&gt;
&lt;/div&gt;
</code>  
</pre>

El botón de reproducir/pausar gifs. Por cada click, se ejecutará la funcion <strong>play_gifs</strong> que modificara la variable <strong>play</strong> el icono del mismo según la variable <strong>play</strong>:

<pre>
<code class="language-html">
/* AFTER */
&lt;div class="form-group col-xs-6 col-md-3"&gt;
    &lt;a class="btn btn-block btn-primary"&gt;
        &lt;i class="fa fa-play"&gt;&lt;/i&gt;
    &lt;/a&gt;
&lt;/div&gt;

/* BEFORE with Vue.js */

&lt;div class="form-group col-xs-6 col-md-3"&gt;
    &lt;a class="btn btn-block btn-primary" v-on:click="play_gifs"&gt;
        &lt;i v-bind:class="{ 'fa fa-pause': play, 'fa fa-play': !play}"&gt;
        &lt;/i&gt;
    &lt;/a&gt;
&lt;/div&gt;
</code>  
</pre>


Finalmente llegamos al grid, que consta de un bucle de <strong>gifs</strong>( variable - lista) que contendrá imágenes con javascript. Por un lado contralaremos la reproducción de los gifs según se posicione el cursor encima de estos con <strong>mouseenter</strong> y <strong>mouseleave</strong>. ¿Os acordáis de la variable <strong>play</strong>? pues es la encargada de cambiar el <strong>src</strong> y alternar entre la imagen y el gif animado:  

<pre>
<code class="language-html">
/* BEFORE with Vue.js */
&lt;div class="container grid"&gt;
            &lt;div v-for="gif in gifs" class='col-xs-6 col-sm-6 col-md-3 col-lg-3'&gt;
                &lt;img v-on:mouseenter="entrar(gif)" 
                     v-on:mouseleave="salir(gif)" 
                     :src="play ? gif.images.fixed_height_small.url 
                     : gif.images.fixed_height_small_still.url"&gt;
            &lt;/div&gt;
        &lt;/div&gt;
</code>  
</pre>

{% include elem.html giphy="UFGj6EYw5JhMQ" title="Bueno, dejémonos de rodeos y pongámonos a programar de verdad." %}


Ahora pasamos al javascript: html tenía un identificador <strong>giphy</strong> que necesitara <strong>el</strong> para posicionarse, las variables se colocan en <strong>data</strong> y la funciones en <strong>methods</strong>:

<pre>
<code class="language-javascript">
new Vue({
    /* seleccionas el DOM */
    el: '#giphy', 
    /* las variables mencionadas anteriormente. Se ha incluido aux
    para salvaguardar una url cuando hagamos hover sobre un gif */
    data: {
        word: ''
        , gifs: []
        , selected: 32
        , limits: [32, 64, 128]
        , gifs: []
        , play: false
        , aux: ''
    },
    
    /* En cuanto cargamos la web, mostramos gifs */
    ready: function () {
        this.getGifs();
    },
    
    methods: {
    /* toggle que modifica la variable booleana play */
    play_gifs: function () {
        this.play = !this.play;
    }, 
    
    /* Si el cursor pasa por encima de un gif modifica la url */
    entrar: function (gif) {
        this.aux = gif.images.fixed_height_small_still.url;
        gif.images.fixed_height_small_still.url = gif.images.fixed_height_small.url;
    },
    
    /* Si el cursor sale de un gif restaura el gif en pausa */
    salir: function (gif) {
        gif.images.fixed_height_small_still.url = this.aux;
    },
    
    /* funcion de busqueda */
    search: function() {
        this.getGifs();
    },
    
    getGifs: function () {    
        /* Si la palabra no es vacia, buscamos gifs gracias a la variable word y limitado por limit */
        if (this.word != "") 
        {
            this.$http.get("http://api.giphy.com/v1/gifs/search?q=" + this.word + "&api_key=dc6zaTOxFJmzC&limit=" + this.selected.toString()).then((response) => {
            this.$set('gifs', response.data.data);
            }, (response) => {});
        }
        else 
        {
            /* En caso contrario, mostramos los gifs que sean trending topic */
            this.$http.get("http://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC&limit=" + this.selected.toString()).then((response) => {
            this.$set('gifs', response.data.data);
            }, (response) => {});
        }
    }
    }
})
</code>  
</pre>

{% include elem.html video="puDJSDoaY-w" title="Ha quedado chulo aunque se podría mejorar." %}

Lamentablemente me he dejado en el tintero el uso de componentes como son la modal o el uso de firebase pero lo actualizare cuando disponga de algo de tiempo. Os dejo una copia del proyecto por si interesa. 

{% include url.html id="https://www.dropbox.com/s/rm527w0o64jk5dl/Vuejs%20-%20Tutorial.zip?dl=0" text="Resultado Final" %}