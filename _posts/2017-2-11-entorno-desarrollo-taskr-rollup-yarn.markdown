---
layout: post
title:  "Tutorial. Entorno con Taskr, Rollup y Yarn"
date:   2017-2-11 15:00:00 +0100
comments: true
author: ivanheral
categories: tutorial
urlimage: /files/images/desarrollo/yarn.png
---

¿Cansado de utilizar grunt/gulp para tus proyectos web? ¿Has intentado dar el salto a webpack pero te ha parecido engorroso y poco intuitivo? No te preocupes. Hoy te presentamos <strong>Taskr</strong>, una alternativa que te permitirá realizar proyectos sencillos con una curva de aprendizaje muy baja.

<strong>Taskr</strong> es un generador de tareas/rutinas que se caracteriza por su sencillez y velocidad con respecto a otras alternativas. Estaba un poco abandonado, aunque en estos últimos meses ha podido resurgir de sus cenizas gracias a la ayuda  de <a href="http://github.com/lukeed">lukeed</a> y otros tantos.

Antes que nada, necesitaremos una versión actualizada de node (mínimo 6.9), es importante recalcar esto para evitarnos sorpresas inesperadas cuando arranquemos con esto. En este tutorial os explicaremos como usarlo de manera rápida y clara para un proyecto de <strong>AngularJs</strong> como ejemplo. Sin más preámbulos, comenzamos.

{% include elem.html gif="5iAHCEdbyEZCo" title="Es un pájaro, es un avión, no... Es Taskr!" %}

Lo primero que tendremos que hacer es crearnos una carpeta llamada Taskr, en ella generaremos un <strong>package.json</strong> y un <strong>bower.json</strong> con los comandos <strong>npm init</strong> y <strong>bower init</strong> respectivamente. En estos ficheros instalaremos todo aquello que sea necesario para montar nuestra web, es importante recalcar que tendreis que instalar npm y bower previamente. 

A continuación, crearemos una carpeta <strong>src</strong> en la carpeta Taskr donde alojaremos las carpetas divididas según el tipo de ficheros que contengan: javascript, css, html, imagenes y vendors. Más adelante explicaremos que ficheros contendrán dichas carpetas con sus correspondientes rutas para no liarnos.

Ahora pasaremos a generar nuestro <strong>taskfile.js</strong> en <strong>src</strong>, este fichero actuara como archivo de configuración cuando ejecutemos el comando <strong>taskr</strong>. En este fichero se escribirán las tareas que necesitemos. La estructura de ficheros y carpetas quedaría del siguiente modo: 
<pre>
    <code class="language-files">
Taskr/ /* Carpeta raiz */
--- src/ /* Carpeta src */
-------- /css /* Los estilos */
-------- /html /* Los htmls */
-------- /img /* Las imagenes */
-------- /js /* Los javascripts */
-------- /vendors /* Librerias externas */
--- package.json
--- bower.json
--- taskfile.js
    </code>    
</pre>

Bueno, ahora pasamos al quid de la cuestión. Nuestra aplicación de ejemplo estará basada en <strong>AngularJs</strong> como ya he dicho anteriormente con las siguientes características: tendrá dos páginas y estará en español/ingles. Por si esto no fuera suficiente, incluiremos librerías externas como leaflet para que muestren un mapa y darle un poco de vidilla. Todo esto lo instalaremos con los siguientes comandos desde la carpeta <strong>Taskr</strong>:
<pre>
    <code class="language-bash">
/* Instalamos angular y otros componentes relacionados con npm */
npm install --save angular angular-ui-router angular-translate 

/* Instalamos leaflet y su directiva para angular con bower. Escoger la 1.0.0 */
bower install --save leaflet angular-leaflet-directive
    </code>    
</pre>

Ahora toca lo más importante. Instalamos Taskr junto a los siguientes plugins para echar a rodar el proyecto -> <strong>@taskr/esnext:</strong> nos permitirá usar sintaxis ES6/7 en nuestro taskfile.js y crear tareas asíncronas. <strong>@taskr/clear:</strong> plugin para realizar borrados de ficheros. <strong>@taskr/watch:</strong> plugin que nos permite lanzar tareas cuando se produzcan modificaciones. Este sería el comando para empezar a “volar”:
<pre>
<code class="language-bash">
/* Instalamos taskr y algunos de sus plugins  */
npm install --save-dev taskr @taskr/esnext @taskr/clear @taskr/watch
</code>    
</pre>

<strong>taskfile.js:</strong> Retomamos con el archivo de configuración para centrarnos en su contenido. Este fichero se dividirá en 3 partes: (1) Declaración de variables, (2) Tarea <strong>default</strong> que se ejecutara al arrancar con el comando <strong>taskr</strong> por terminal y (3) Definición de nuestras propias tareas:

<pre>
    <code class="language-js">
/* (1) Declaración de variables */

/* Tarea default */
export default async function (task) {
/* (2) Arranque de tareas */
}
/* (3) Definición de tareas */
    </code>    
</pre>

A partir de aquí nos centraremos en añadir tareas de forma acumulativa en la parte <strong>(3)</strong> desglosándolas en función del tipo de ficheros que vayamos a tratar (html, css, imagenes, js y vendors).

Después de esto, incluiremos eventos <strong>@taskr/watch</strong> por cada una de estas tareas en la tarea <strong>default</strong>  (parte <strong>(2)</strong>, que no es os olvide). De este modo, nuestras tareas se ejecutarán cada vez que modifiquemos los ficheros que nosotros fijemos, ya sea mediante rutas o por extensiones de ficheros. 
En la parte <strong>(1)</strong> se incluirán aquellos elementos ajenos a taskr y sus plugins pero que son fundamentales para generar nuestro proyecto. Os dejo a continuación las tareas que tendremos que añadir para realizar nuestra web de manera correcta según lo descrito anteriormente:

{% include title.html title="Browser-sync" %}

Nuestra 1º tarea será montar todo nuestro proyecto en una carpeta denominada dist para posteriormente desplegarla y poder trabajar con ella en caliente. Esto no se conseguiría si no fuera por la inestimable ayuda de <strong>browser-sync</strong> y <strong>connect-history-api-fallback</strong>, así que pasamos a instalarlos:
<pre>
    <code class="language-bash">
/* Instalamos browser-sync y connect-history-api-fallback */
npm install --save-dev browser-sync connect-history-api-fallback
    </code>    
</pre>

<strong>Tarea serve.</strong> Ahora toca modificar nuestro <strong>taskfile.js</strong>. Definiremos unas variables para agregar browser-sync y connect-history-api-fallback. Declararemos una tarea <strong>serve</strong> para poder inicializar nuestro servidor de "pruebas" en la carpeta dist por el puerto 3000. Finalmente añadiremos la tarea <strong>serve</strong> en la tarea <strong>default</strong> de <strong>taskfile.js</strong> para que arranque con <strong>task.start</strong>:
<pre>
    <code class="language-js">
/* (1) Declaración de variables */
var bs = require('browser-sync');
var historyApiFallback = require('connect-history-api-fallback');

export default async function (task) {
/* (2) Arranque de tareas */
    await task.start('serve')
}

/* (3) Definición de tareas */
export async function serve(task) {
    bs({
        server: 'dist'
        , middleware: [historyApiFallback()]
    });
}
    </code>    
</pre>

{% include title.html title="Imagenes" %}

<strong>Tarea copyImg.</strong> Copiaremos nuestras imágenes de <strong>src/img</strong> a <strong>dist/img</strong>, ningún misterio al respecto. La tarea se llamará <strong>copyImg</strong> que se encargará de borrar con <strong>clear</strong> cualquier imagen de dist, recolectar todas las imágenes de <strong>src/img</strong> con <strong>source</strong> y finalmente duplicarlas a la carpeta <strong>dist/img</strong> con <strong>target</strong>.

Añadiremos la tarea <strong>copyImg</strong> en la tarea <strong>default</strong> de <strong>taskfile.js</strong> y usaremos el evento <strong>task.watch</strong> para que se vuelva a ejecutar cada vez que detecte modificaciones en <strong>src/img</strong>:

<pre>
    <code class="language-js">
export default async function (task) {
/* (2) Arranque de tareas */
    await task.watch('src/img/**/*.*', 'copyImg')
}

/* (3) Definición de tarea copyImg */
export async function copyImg(task) {
    await task.clear(['dist/img/**/*.*']).source('src/img/**/*.*').target('dist/img')
}
    </code>    
</pre>

{% include title.html title="Css" %}

Ahora toca un tema peliagudo como son los estilos. Necesitaremos dos plugins de Taskr: <strong>@taskr/sass</strong> (para usar precompiladores como sass) y <strong>taskr-autoprefixer</strong> (para añadir autoprefixer). También instalaremos <strong>bootstrap-sass</strong> para tener algo de chicha y poder trabajar:

<pre>
    <code class="language-bash">
/* Instalamos @taskr/sass, taskr-autoprefixer y bootstrap */
npm install --save-dev @taskr/sass taskr-autoprefixer bootstrap-sass
    </code>    
</pre>

<strong>src/css/app.sass:</strong> A continuación crearemos un fichero <strong>app.sass</strong> en la ruta <strong>src/css</strong> con los módulos necesarios para que nuestra web se muestre correctamente. Importaremos bootstrap desde <strong>node_modules</strong> y copiaremos el contenido del fichero <strong>bower_components/leaflet/dist/leaflet.css</strong> (previamente instalado con bower) en <strong>src/css/modules</strong> con el nombre <strong>leaflet.scss</strong>. Finalmente nuestro fichero app.sass quedaría del siguiente modo:
<pre>
    <code class="language-sass">
@import '../../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss'
@import 'modules/leaflet.scss'
    </code>    
</pre>

<strong>Tarea copyStyles.</strong> Esta tarea compilara el fichero <strong>src/css/app.sass</strong> gracias a los plugins <strong>@taskr/sass</strong> y <strong>taskr-autoprefixer</strong> dejando el resultado en la carpeta dist. 

Solo falta añadir un <strong>@taskr/watch</strong> en la tarea <strong>default</strong> de <strong>taskfile.js</strong> para que se vuelva a construir nuestro <strong>css</strong> cuando detecte modificaciones en algún fichero scss de <strong>src/css</strong> o en <strong>src/css/app.sass</strong>. Nuestro browser-sync (bs) se encargará de refrescar el <strong>app.css</strong> de dist cada vez que se ejecute <strong>copyStyles</strong>:
<pre>
    <code class="language-js">
export default async function (task) {
/* (2) Arranque de tareas */
    await task.watch(['src/css/**/*.scss', 'src/css/app.sass'], 'copyStyles')
}

/* (3) Definición de tarea copyStyles */
export async function copyStyles(task) {
    await task.source('src/css/app.sass').sass().autoprefixer().target('dist')
    /* reload */
    bs.reload('app.css')
}
    </code>    
</pre>

{% include title.html title="Vendors" %}

Pasamos a las librerías externas. Necesitaremos el plugin <strong>@taskr/browserify</strong> para empaquetar todas estas librerías en un solo fichero <strong>vendors.js</strong> siendo posteriormente trasladado a la carpeta dist:
<pre>
    <code class="language-bash">
/* Instalamos @taskr/browserify */
npm install --save-dev @taskr/browserify
    </code>    
</pre>

<strong>src/vendors/vendors.js:</strong> Aquí indicaremos la ruta de los ficheros que necesitamos obligatoriamente para dibujar nuestro mapa con <strong>leaflet</strong> y que previamente instalamos con <strong>bower</strong>: 
<pre>
    <code class="language-js">
require('../../bower_components/leaflet/dist/leaflet.js');
require('../../bower_components/angular-leaflet-directive/dist/angular-leaflet-directive.js');
    </code>    
</pre>

<strong>Tarea copyVendors.</strong> Esta tarea cogerá el fichero <strong>src/vendors/vendors.js</strong>, lo empaquetara y lo entregara en dist. Añadiremos un <strong>@taskr/watch</strong> que lance <strong>copyVendors</strong> cada vez que modifiquemos el fichero <strong>src/vendors/vendors.js</strong>. 
Nuestro browser-sync (bs) se encargará de refrescar <strong>vendors.js</strong> de la carpeta dist cada vez que se ejecute <strong>copyVendors</strong>: 

<pre>
    <code class="language-js">
export default async function (task) {
/* (2) Arranque de tareas */
    await task.watch('src/vendors/vendors.js', 'copyVendors')
}

/* (3) Definición de tareas */
export async function copyVendors(task) {
    await task.source('src/vendors/vendors.js').browserify().target('dist')
    /* reload */
    bs.reload('vendors.js')
}
    </code>    
</pre>

{% include title.html title="Javascript" %}

Usaremos nuevamente el plugin @taskr/browserify para empaquetar toda nuestra app con <strong>AngularJs</strong> pero con el añadido de usar babel para pasar nuestro código de ES6 a ES5. Necesitaremos instalar los siguientes paquetes:
<pre>
    <code class="language-bash">
/* Instalamos babelify y babel-preset-es2015 */
npm install --save-dev babelify babel-preset-es2015
    </code>    
</pre>

Pasaremos a enumerar los 4 ficheros que contendrá <strong>src/js</strong> para completar el armazón de nuestra aplicación:

<strong>src/js/app.js.</strong> Este fichero importara angular y sus módulos (<strong>app.modules.js</strong>) junto a los dos controladores (<strong>header</strong> y <strong>home</strong>). Tan solo nos quedara configurar las traducciones y las rutas: 
<pre>
    <code class="language-js">
import * as App from './app.modules.js'
import * as Home from './controllers/home-controller.js'
import * as Header from './controllers/header-controller.js'
let app = angular.module('app', ['app.map', 'app.header', 'ui.router', 'pascalprecht.translate', 'leaflet-directive'])
router.$inject = ['$stateProvider', '$urlRouterProvider']

function router($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/map/ivan')
    var mapState = {
        url: '/map/:id'
        , views: {
            '@': {
                templateUrl: './views/map.html'
            }
        }
    }
    var aboutState = {
        url: '/about'
        , views: {
            '@': {
                templateUrl: './views/about.html'
            }
        }
    }
    $stateProvider.state('map', mapState)
    $stateProvider.state('about', aboutState)
}
translation.$inject = ['$translateProvider']

function translation($translateProvider) {
    $translateProvider.translations('es', {
        MAP: 'Mapa'
        , ABOUT: 'Sobre mi'
        , BUTTON_LANG_EN: 'ingles'
        , BUTTON_LANG_ES: 'español'
    })
    $translateProvider.translations('en', {
        MAP: 'Map'
        , ABOUT: 'About me'
        , BUTTON_LANG_EN: 'english'
        , BUTTON_LANG_ES: 'spanish'
    })
    $translateProvider.preferredLanguage('es')
}
app.config(router).config(translation)
    </code>    
</pre>

<strong>src/js/app.modules.js:</strong> Aquí importaremos angular, angular-ui-router y angular-translate. Este fichero nos servirá también para registrar los módulos que empleemos. <strong>app.map</strong> será el modulo del controlador para visualizar el mapa y <strong>app.header</strong> se encargara de permitirnos cambiar el idioma:
<pre>
    <code class="language-js">
import angular from 'angular'
import router from 'angular-ui-router'
import translate from 'angular-translate'

/* register Modules */
angular.module('app.map', [])
angular.module('app.header', [])
    </code>    
</pre>


<strong>src/js/controllers/header-controller.js.</strong> Este es el modulo <strong>app.header</strong> con un constructor <strong>headerController</strong> que tiene una función para cambiar el idioma:

<pre>
    <code class="language-js">
angular.module('app.header').controller('headerController', ['$scope', '$translate', function ($scope, $translate) {
    $scope.changeLanguage = function (key) {        
        $translate.use(key);          
    };
}]);
    </code>    
</pre>

<strong>src/js/controllers/home-controller.js.</strong> Este es el modulo <strong>app.map</strong> con un constructor <strong>homeController</strong> que tiene un centro con sus coordenadas y un <strong>id</strong> para visualizar el parámetro <strong>id</strong> de la url <strong>map/:id</strong>:

<pre>
    <code class="language-js">
angular.module('app.map').controller('homeController', ['$scope', '$stateParams', function ($scope, $stateParams) {
    
    $scope.center = {
        lat: 51.505,
        lng: -0.09,
        zoom: 8
    };
    
    let self = this;
    self.id = $stateParams.id;
}]);
    </code>    
</pre>

<strong>Tarea babel.</strong> Esta tarea compilara el fichero <strong>src/js/app.js</strong> gracias al plugin <strong>@taskr/browserify</strong> dejando el resultado en la carpeta dist. Solo falta añadir un <strong>@taskr/watch</strong> en la tarea <strong>default</strong> de <strong>taskfile.js</strong> para que se vuelva a construir nuestro <strong>app.js</strong> cuando detecte modificaciones en algún fichero js de <strong>src/js</strong>. Nuestro browser-sync (bs) se encargará de refrescar el <strong>app.js</strong>. 

Usaremos una variable <strong>is_js</strong> para controlar modificaciones masivas de ficheros javascript, de esta forma nos aseguramos que construye la app una sola vez ante múltiples guardados simultáneos:
<pre>
    <code class="language-js">
/* (1) Declaración de variables */
var is_js = 0;

export default async function (task) {
/* (2) Arranque de tareas */
    await task.watch('src/js/**/*.js', 'babel')
}

/* (3) Definición de tareas */
export async function babel(task) {
    is_js += 1;
    if (is_js == 1) {
        await task.source('src/js/app.js').browserify({
            transform: [require("babelify").configure({
                presets: ['es2015']
            })]
        }).target('dist')
    }
    is_js -= 1;
    if (is_js == 0) bs.reload('app.js')
}
    </code>    
</pre>

{% include title.html title="Html" %}

<strong>Tarea copyHtml.</strong> Copiaremos nuestros htmls de <strong>src/html</strong> a dist. La tarea se llamará <strong>copyHtml</strong> que se encargará de borrar con <strong>clear</strong> cualquier html de dist, recolectar todas los htmls de <strong>src/html</strong> con <strong>source</strong> y finalmente duplicarlas a la carpeta dist con <strong>target</strong>:
<pre>
    <code class="language-js">
export default async function (task) {
/* (2) Arranque de tareas */
    await task.watch('src/html/**/*.html', 'copyHtml')
}

/* (3) Definición de tareas */
export async function copyHtml(task) {
    await task.clear(['dist/**/*.html']).source('src/html/**/*.html').target('dist')
    /* reload */
    bs.reload('**/*.html')
}
    </code>    
</pre>

<strong>src/html/index.html.</strong> Fichero principal que tirara del <strong>app.js</strong> y <strong>vendors.js</strong> creados por las tareas <strong>babel</strong> y <strong>copyVendors</strong>. Se usará un componente <strong>commons/menu.html</strong> para representar un menu de navegacion. Por último, incluiremos el <strong>app.css</strong> creado por <strong>copyStyles</strong> en el index:
<pre>
    <code class="language-html">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;Angular&lt;/title&gt;
    &lt;link rel="stylesheet" href="app.css"&gt;
&lt;/head&gt;
&lt;body ng-app="app"&gt;
    &lt;div class="container"&gt;
        &lt;ng-include src="'./commons/menu.html'"&gt;&lt;/ng-include&gt;
        &lt;ui-view>&lt;/ui-view&gt;
    &lt;/div>
    &lt;script src="app.js"&gt;&lt;/script&gt;
    &lt;script src="vendors.js"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;    
</code>
</pre>

<strong>src/html/views/map.html.</strong> La vista del mapa con su correspondiente etiqueta <strong>leaflet</strong> para representar nuestro mapa:
<pre>
    <code class="language-html">
&lt;div ng-controller="homeController as hd"&gt;
    &lt;h1&gt;{% raw %}{{ 'MAP' | translate }}{% endraw %} - id:{% raw %}{{hd.id}}{% endraw %}&lt;/h1&gt;
        &lt;leaflet lf-center="center" height="480px"&gt;&lt;/leaflet&gt;
&lt;/div&gt;
</code>
</pre>

<strong>src/html/views/about.html.</strong> Una vista muy sencilla que no necesita mucha explicación al respecto:
<pre>
    <code class="language-html">
&lt;h1&gt;{% raw %}{{ 'ABOUT' | translate }}{% endraw %}&lt;/h1&gt; 
</code>
</pre>

<strong>src/html/commons/menu.html.</strong> El menú de navegación para cambiar el idioma y alternar vistas según queramos:
<pre>
    <code class="language-html">
&lt;div ng-controller="headerController"&gt;
    &lt;ol class="breadcrumb"&gt;
        &lt;li&gt;&lt;a ui-sref="map" ui-sref-active="active"&gt;{% raw %}{{ 'MAP' | translate }}{% endraw %}&lt;/a&gt;&lt;/li&gt;
        &lt;li&gt;&lt;a ui-sref="about" ui-sref-active="active">Tutorial&lt;/a>&lt;/li&gt;
        &lt;li&gt;&lt;a ng-click="changeLanguage('en')">{% raw %}{{ 'BUTTON_LANG_EN' | translate }}{% endraw %}&lt;/a&gt;&lt;/li&gt;
        &lt;li&gt;&lt;a ng-click="changeLanguage('es')">{% raw %}{{ 'BUTTON_LANG_ES' | translate }}{% endraw %}&lt;/a&gt;&lt;/li&gt;
    &lt;/ol&gt;
&lt;/div&gt;  
    </code>
</pre>

{% include title.html title="Yarn" %}

Habéis podido comprobar que nos hemos centrado en incluir eventos <strong>@taskr/watch</strong> dentro de la tarea default. Eso está muy bien para recargarnos nuestro proyecto cada vez que cambiemos alguna cosa, pero se nos olvida lo más fundamental, construirlo todo nada más arrancarlo.

<strong>Tarea build.</strong> Esta tarea ejecutara en paralelo todas las tareas definidas anteriormente para construirlo todo en la carpeta dist. Usaremos <strong>task.clear</strong> para eliminar cualquier contenido previo de dist y lanzaremos un <strong>task.parallel</strong> para reconstruirlo todo. No debemos olvidarnos de incluir un evento <strong>task.start</strong> en la tarea default para arrancarla desde el inicio:
<pre>
    <code class="language-js">
export default async function (task) {
/* (2) Arranque de tareas */
    await task.start('build')
}

/* (3) Definición de tareas */
export async function build(task) {
    await task.clear(['dist']).parallel(['copyVendors', 'babel', 'copyHtml', 'copyImg', 'copyStyles'])
}
    </code>    
</pre>

Ya casi hemos terminado, solo nos falta añadir algunos scripts en nuestro <strong>package.json</strong>. <strong>start:</strong> para lanzar la tarea default del archivo de configuración <strong>taskfile.js</strong>, <strong>server</strong> para lanzar la web en un navegador y <strong>download</strong> para descargar todos los paquetes necesarios. En este último script se ha reemplazado npm por yarn:
<pre>
    <code class="language-json">
"scripts": {
    "start": "taskr",
    "server": "taskr serve",
    "download": "yarn install && bower install"
  }
      </code>    
</pre>

Yarn es un instalador de paquetes creado por Facebook en octubre de 2016 que se diferencia de <strong>npm</strong> por su alto desempeño alcanzando mejores tiempos que su competidor. Podéis instalarlo con un simple <strong>npm install -g yarn</strong>, os dejo los tiempos que obtuve descargando todos los paquetes con ambos en mi equipo:
<pre>
    <code class="language-bash">
/* Tiempo con npmn sin cache */
50.235s

/* Tiempo con npm con cache */
27.184s

/* Tiempo con yarn sin cache */
17.67s

/* Tiempo con yarn con cache */
9.40s
    </code>    
</pre>

{% include title.html title="Rollup" %}

Para ir terminando podemos incluir una tarea bundle con ayuda de Rollup para disminuir el tamaño nuestra app. Usaremos el plugin <strong>fly-rollup</strong> junto a algunos plugins de Rollup: <strong>uglify</strong> para disminuir su tamaño, <strong>commonjs</strong> para convertir modulos commonjs a ES6 y <strong>node-resolve</strong> para usar modulos de terceros descargados en <strong>node_module</strong>:
<pre>
    <code class="language-bash">
/* Instalamos algunos plugins de rollup */
npm install --save-dev fly-rollup rollup-plugin-babel rollup-plugin-commonjs rollup-plugin-node-resolve rollup-plugin-uglify
    </code>    
</pre>
<strong>Tarea bundle.</strong> Ok, tan solo tendremos que aplicar todos los plugins de Rollup en <strong>src/js/app.js</strong> y dejar el resultado en una nueva carpeta de nombre <strong>bundle</strong>:
<pre>
    <code class="language-js">
export async function bundle(task) {
    await task.source('src/js/app.js').rollup({
        rollup: {
            plugins: [require('rollup-plugin-babel')({
                    presets: [["es2015", {"modules": false}]]
                }),
                require('rollup-plugin-node-resolve')
                ({main: true, jsnext: true, browser: true}),
                require('rollup-plugin-commonjs')(), 
                require('rollup-plugin-uglify')()]
        }
        , bundle: {format: 'iife'}
    }).target('bundle')
}
</code>
</pre>

{% include elem.html video="FPQmuewYj5c" title="Es una gozada ver lo rapido que responde" %}

<strong>Conclusiones:</strong> La verdad es que <strong>Taskr</strong> sorprende gratamente, con un fichero muy pequeño (70 lineas) tenemos montado un entorno para trabajar la mar de sencillo. Más rápido que gulp y más sencillo de comprender que webpack, no se puede pedir más por menos. Lo único que se le puede achacar es su escasez de plugins pero supongo que con el tiempo acabaran apareciendo nuevos. Dejo el código como siempre:

{% include url.html id="https://www.dropbox.com/s/wdemdhqiato4qbz/Taskr.tar.gz?dl=0" text="Código del Tutorial" %}
