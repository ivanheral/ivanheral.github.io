---
layout: post
title:  "Tutorial. Grafo social Twitter con Riot y D3"
date:   2016-7-30 15:00:00 +0100
comments: true
author: ivanheral
categories: tutorial
urlimage: /files/images/desarrollo/riot.jpg
---

Sin que sirva de precedente, crearemos un generador de grafos interactivo de la red social twitter con la librería gráfica D3 y un framework tan peculiar y desconocido como Riot. 

Tendremos un formulario para añadir usuarios de twitter dibujando un bonito grafo de nodos y links. Los nodos representaran a los usuarios y los links representaran la conexiones que tienen entre ellos (follow - follower). Podremos ir agregando uno a uno y ver como nuestro grafo va creciendo de tamaño de forma interactiva. 

{% include elem.html gif="uvqSTLjUe9u2Q" title="Este tutorial nos permitirá comprender las relaciones que se producen en el mundo sin movernos de casa" %}

<strong>1º objetivo:</strong> Obtener la informacion que nos hace falta mediante la API de twitter. Usaremos node.js (express & cors) y <a href="https://www.npmjs.com/package/twitter" target="_blank">twitter</a>. Lo importante ahora mismo es mostrar la estructura de carpetas y ficheros que usaremos para llegar la idea a buen puerto:

<pre>
    <code class="language-files">
Riotjs/ /* Carpeta raiz */
--- app/ /* Carpeta app */
-------- app.js
-------- routes.js
-------- twitter.js
-------- tags/ /* Carpeta tags de Riot.js */
-------------- app.tag
-------------- more_options.tag
-------------- index.js
--- public/ /* Carpeta public */
-------- index.html
--- package.json
--- webpack.config.js
--- server.js
    </code>    
</pre>

<strong>package.json:</strong> Aquí tendremos todo lo necesario para que funcione nuestro invento. Usaremos express, cors y twitter para crear los servicios. El resto nos permitirá trabajar con Riot.js y D3: he pensado en <a href="https://github.com/esnunes/riotjs-loader">riotjs-loader</a> & webpack para contruir nuestro bundle:
<pre>
    <code class="language-json">
{
  "name": "riot-webpack",
  "version": "1.0.0",
  "description": "",
  "main": "bundle.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack-dev-server --inline --hot",
    "bundle": "webpack"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "d3": "3.5.17",
    "riot": "~2.6.2",
    "twitter": "^1.4.0"
  },
  "devDependencies": {
    "babel-core": "^6.13.2",
    "babel-loader": "^6.2.4",
    "riotjs-loader": "^3.0.0",
    "superagent": "^2.3.0",
    "webpack": "^1.13.1",
    "webpack-dev-server": "^1.14.1",
    "cors": "^2.8.1",
    "express": "^4.14.0"
  }
}
    </code>    
</pre>

He decidido usar superagent para conectar correctamente con los servicios por que se adapta bastante bien a Riot. Ok, lanzamos este comando para instalarlo todo:
<pre>
    <code class="language-bash">
npm install
    </code>    
</pre>

{% include title.html title="Node.js" %}

<strong>server.js:</strong> Este fichero se encargara de arrancar nuestros servicios usando express y cors en el puerto 4500. En las carpetas app tendremos el cliente twitter con las keys (os presto las mías) y las rutas:
<pre>
    <code class="language-js">
var express = require("express"),
    app = express(),
    cors = require("cors"),
    client = require('./app/twitter');

var router = express.Router();
app.use(cors());
app.use('/', router);
/* Routes */
require('./app/routes')(router, client);
app.listen(4500);
exports = module.exports = app;
    </code>    
</pre>

<strong>app/twitter.js:</strong> Las claves que comente anteriormente para poder acceder a la api de twitter y que almacenaremos en la variable <strong>client</strong>:
<pre>
    <code class="language-js">
var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: '20WaLvRtAfgNaidtVj75bEyQq'
    , consumer_secret: '3hwKEd3Q39OiAPtGKomjOU1u5SL45i6yDic5BfttLPxmhMdrYL'
    , access_token_key: '1072055204-FqweRykJv3h8KAtmG8IE3PSOqnGroEXEasp8eEG'
    , access_token_secret: 'o8VC0TDlclmRAMPUWMFygh2DSaFASh8C0GHYNu6PzkX6O'
});

module.exports = client;
    </code>    
</pre>

<strong>app/routes.js:</strong> Aquí estarán las rutas, en nuestro caso solo tendremos dos. Una para obtener la información de perfil de cada usuario que queramos agregar en nuestro grafo y otra para comprobar si están relacionados con los otros usuarios anteriores:

<pre>
    <code class="language-js">
// app/router.js
module.exports = function (router, client) {

/* Aqui iran los dos servicios */

}
    </code>    
</pre>

<strong>1º servicio:</strong> Necesitamos informacion del usuario que incluyamos en nuestro grafo. Tendremos que usar <a href="https://dev.twitter.com/rest/reference/get/users/show">users/show</a> de la API twitter para extraer su identificador, su nick/nombre y la url de su avatar/imagen:
<pre>
    <code class="language-js">
    router.route('/user/:name').get(function (req, res) {
    /* Usamos de parametro name (example: localhost:4500/user/ivanheral) */
        var params = {
            screen_name: req.params.name
        };
        client.get('users/show', params, function (error, user) {
            if (!error) {
               console.log({
                    "id": user.id_str,
                    "screen_name": user.screen_name
                    , "name": user.name
                    , "img": user.profile_image_url
                });
            /* Devolvemos un json con el id, nick, nombre y imagen del usuario de twitter */
            res.json({
                    "id": user.id_str,
                    "screen_name": user.screen_name
                    , "name": user.name
                    , "img": user.profile_image_url
                });
            }
        });
    });
        </code>    
</pre>


<strong>2º servicio:</strong> Necesitamos comprobar si dos usuarios de twitter se siguen mutuamente. Bastara con usar <a href="https://dev.twitter.com/rest/reference/get/friendships/show">users/show</a> de la API twitter para comprobar si podemos conectar ambos usuarios con un link: 
<pre>
    <code class="language-js">
    router.route('/links/:user_1/:user_2/:x/:y').get(function (req, res) {
        /* Usamos los nombres user_1 y user_2 en params */
        var params = {
            source_screen_name : req.params.user_1
            , target_screen_name: req.params.user_2
        };
        client.get('friendships/show', params, function (error, tweets, response) {
            if (!error) {
                /* Condicion que comprueba si se siguen mutuamente */
                if (tweets.relationship.target.following && tweets.relationship.target.followed_by) {
                    /* Exito! Devuelvo true y la posicion que tienen en nuestro acumulado particular */
                    res.json({"relation": true, "pos_x":req.params.x, "pos_y":req.params.y});
                } else res.json({"relation": false});
            }
        });
    });
        </code>    
</pre>

Ok, con esto bastaria para tener montado nuestro particular servidor. Ya solo tendriamos que lanzarlo con un <strong>node server</strong> y probar en nuestro navegador escribiendo esta url: <strong>localhost:4500/user/perezreverte</strong> para ver si funciona correctamente.

{% include title.html title="Webpack" %}

<strong>webpack.config.js:</strong> Este es el fichero webpack con la configuración pertinente. El comando <strong>npm run bundle</strong> construira nuestro bundle.js mientras que <strong>npm run start</strong> nos permitirá lanzarlo en caliente mientras modificamos el proyecto:
<pre>
    <code class="language-js">
var webpack = require('webpack');
/* compilamos el fichero app/app.js en public/bundle.js */
module.exports = {
    context: __dirname + '/app'
    , entry: './app.js'
    , output: {
        path: __dirname + '/public'
        , filename: 'bundle.js'
    }
    /* importante incluir riot, d3 y superagent en nuestro bundle */
    , plugins: [
    new webpack.ProvidePlugin({
            riot: 'riot', d3: 'd3'
            , request: 'superagent'
        })
  ]
    , module: {
        preLoaders: [
            {
                test: /\.tag$/, exclude: /node_modules/
                , loader: 'riotjs-loader'
      }
    ]
    }
    /* servidor */
    , devServer: {
        contentBase: './public'
    }
};
        </code>    
</pre>

<strong>public/index.html:</strong> la estructura es muy sencilla con estilos bootstrap. Lo único a destacar es la etiqueta <strong>app</strong> que sera indispensable para montar los componentes de Riot:
<pre>
    <code class="language-html">
&lt;!DOCTYPE html&gt;
&lt;html lang=""&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;meta name="description" content=""&gt;
    &lt;meta name="author" content=""&gt;
    &lt;title&gt;Social Graph Twitter&lt;/title&gt;
    &lt;link rel="shortcut icon" href=""&gt;
    &lt;link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"&gt;
    &lt;link rel="stylesheet" href="style.css"&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;app&gt;&lt;/app&gt;
    &lt;script src="bundle.js"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;    
</code>
</pre>

<strong>app/app.js:</strong> La columna vertebral del proyecto donde incluimos riot, superagent y los tags. Finalmente montamos el 1º componente <strong>social-twitter</strong> en la etiqueta <strong>app</strong> de <strong>public/index.html</strong>

<pre>
    <code class="language-js">
var riot = require('riot');
var request = require('superagent');
require('./tags');

riot.mount('app','social-twitter')
        </code>    
</pre>

<strong>tags/index.js:</strong>Capitan Obvius al rescate!, fichero que no necesita mucha explicación al respecto, simplemente incluyo todos los tags que se encuentran en la carpeta del mismo nombre para que <strong>app.js</strong> los incluya con un simple <strong>require('./tags')</strong>:
<pre>
    <code class="language-js">
require('./more_options.tag')
require('./app.tag')
        </code>    
</pre>

<strong>tags/app.tag:</strong> Esto es lo que vendría a ser nuestro primer componente de Riot mencionado anteriormente como <strong>social-twitter</strong>. Por una parte tenemos los estilos propios (css) junto al html (un formulario con una función <strong>add</strong>) y finalmente el javascript (ES6) que ira al final del todo. En el siguiente paso iré incluyendo lo necesario para que funcione:
<pre>
    <code class="language-html">
&lt;social-twitter&gt;
&lt;style&gt;
.options {background: #ddd;}
form {padding: 5px 5px;}
&lt;/style&gt;
&lt;div class='container options'&gt;
&lt;form class='form-inline'&gt;
  &lt;div class='form-group'&gt;
    &lt;input name='user' class='form-control'&gt;
  &lt;button type='submit' class='btn btn-primary' onclick={add}>ADD USER TWITTER&lt;/button&gt;
  &lt;/div&gt;
  &lt;options nodes_list={nodes} links_list={links}>&lt;/options&gt;
&lt;/form&gt;
&lt;/div&gt;

/* codigo javascript que explicare por pasos a continuación */

&lt;/social-twitter&gt;
        </code>    
</pre>

{% include title.html title="D3" %}

Ok, comenzamos con javascript. Definimos el ancho y alto que tendrá nuestro componente svg para visualizar nuestro grafo (1800/820px en nuestro caso). Ahora mismo esta calibrado para monitores FullHD pero podéis modificar <strong>public/style.css</strong> para adecuarlo a vuestro monitor:
<pre>
    <code class="language-js">
let self = this
let width = 1800
, height = 820
        </code>    
</pre>

Incluimos las dimensiones a nuestra etiqueta <strong>app</strong> para que tenga constancia de sus dimensiones:
<pre>
    <code class="language-js">
self.svg = d3.select('app')
.append('div')
.attr('class','container graph')
.append('svg').attr('width', width)
.attr('height', height)
        </code>    
</pre>

Aplicamos force layout a nuestro d3 indicándole algunas propiedades como pueden ser la gravedad hacia el centro o la distancia entre nodos:
<pre>
    <code class="language-js">
self.force = d3.layout.force().
gravity(0.1).distance(100).
charge(-100).size([width, height])
        </code>    
</pre>

¿Como interpreta force layout & d3 la información? pues... os pongo un ejemplo. Alex de la Iglesia y Nacho vigalondo se siguen mutuamente en twitter. Por lo tanto, la variable <strong>links</strong> contendra un link con source y target apuntando a 0 y 1 que son las posiciones de la lista de nodos que tendremos en la variable <strong>nodes</strong>:
<pre>
    <code class="language-json">
{
    "nodes": [{
        "id": "5793642"
        , "name": "Nacho Vigalondo"
        , "img": "http://pbs.twimg.com/profile_images/782341301551325184/pTkWiFy2_normal.jpg"
        , "screen_name": "vigalondo"
        , "index": 0
    }, {
        "id": "43310939"
        , "name": "De la Iglesia"
        , "img": "http://pbs.twimg.com/profile_images/752006649255198720/-3MXvi1k_normal.jpg"
        , "screen_name": "alexdelaIglesia"
        , "index": 1
    }]
    , "links": [{
        "source": 0
        , "target": 1
    }]
}
    </code>    
</pre>

Teniendo en cuenta lo anterior, pasamos a crear una lista de nodos y links para acumular los usuarios y relaciones que obtengamos tras escribirlos en el formulario:
<pre>
    <code class="language-js">
self.nodes = []
self.links = []
        </code>    
</pre>

Incluimos dos funciones que aplicaremos a los nodos para poder fijarlos en el area como si fueran chinchetas. Con doble click volveran a su posicion original: 
<pre>
    <code class="language-js">
this.dblclick = function(d) {
  d3.select(this).classed('fixed', d.fixed = false);
}

this.dragstart = function(d) {
  d3.select(this).classed('fixed', d.fixed = true);
}
</code>
</pre>

Aplicamos force a los nodos y links. Editamos los nodos para que se muestren con la imagen y nombre del usuario correspondiente. A los links se les aplicara los estilos de la clase link y los nodos dispondran las funciones anteriormente mencionadas:
<pre>
    <code class="language-js">
self.force.nodes(self.nodes).links(self.links)
self.link = self.svg.selectAll('.link').data(self.links).enter().append('line').attr('class', 'link')
self.node = self.svg.selectAll('.node').data(self.nodes).enter().append('g').attr('class', 'node').call(self.force.drag).on('dragstart', this.dragstart).on('dblclick', this.dblclick)

self.node.append('image').attr('xlink:href', function (d) {
                return d.img
            }).attr('x', -12).attr('y', -12).attr('width', 24).attr('height', 24).append('text').attr('x', 0).attr('dy', '26px').attr('text-anchor', 'middle').text(function (d) {
        return d.name})   
        </code>
</pre>


Mediante tick conseguiremos que nuestros nodos cobren vida y se muevan libremente:
<pre>
    <code class="language-js">
self.force.on('tick', function () {
        self.link.attr('x1', function (d) {
            return d.source.x;
        }).attr('y1', function (d) {
            return d.source.y;
        }).attr('x2', function (d) {
            return d.target.x;
        }).attr('y2', function (d) {
            return d.target.y;
        });
        self.node.attr('transform', function (d) {
            return 'translate(' + d.x + ',' + d.y + ')'
        });
})
</code>
</pre>

Esta función se encargara de refrescar los nodos & links cada vez que añadamos un nuevo usuario. Les aplicara todas las propiedades necesarias para que funcionen del mismo modo que el resto:
<pre>
    <code class="language-js">
self.start=function(e) {
    self.link = self.link.data(self.force.links())
    self.node = self.node.data(self.force.nodes())
    self.link.enter().insert('line', '.node').attr('class', 'link')
    var aux = self.node.enter().insert('g').attr('class', 'node')
    aux.append('image').attr('xlink:href', function (d) {
            return d.img
        }).attr('x', -12).attr('y', -12).attr('width', 24).attr('height', 24)
    aux.append('text').attr('x', 0).attr('dy', '26px').attr('text-anchor', 'middle').text(function (d) {
        return d.name
    })
    self.link.exit().remove()
    self.node.exit().remove()
    self.node.call(self.force.drag).on('dragstart', this.dragstart).on('dblclick', this.dblclick)
    self.force.nodes(self.nodes).links(self.links).start()    
}
</code>
</pre>

Finalmente terminamos con la logica del componente <strong>social-twitter</strong>, concretamente la funcion add que se ejecuta al pulsar el boton <strong>ADD USER TWITTER</strong>:
<pre>
    <code class="language-js">
self.add=function(e) {
/* Obtenemos el nick del usuario de twitter */
self.add_aux(self.user.value)
}    
    
self.add_aux=function(name) {
/* usamos superagent y tiramos del servicio */
request.get( 'http://localhost:4500/user/'+name, function(err,res) {
    
    /* Lo guardamos todo en la variable new_node */
    var new_node = {
        id: res.body.id,
        name: res.body.name,
        img: res.body.img,
        screen_name: res.body.screen_name
    }

    /* Agregamos el nodo en nodes */
    self.nodes.push(new_node)
    
    /* En cuanto agregamos el 1º nodo... refrescamos! */
    if (self.nodes.length==1) {self.start()}
    /* Vaya... tenemos que actualizar nuestras variables nodes y links */
    self.update()
    
    /* Comprobamos si el nuevo nodo tiene relaciones con los que
    estaban anteriormente agregados */
    for(i=0; i<self.nodes.length-1; i++) {
        let size = self.nodes.length-1
        request.get( 'http://localhost:4500/links/'+self.nodes[i].screen_name+'/'+self.nodes[self.nodes.length-1].screen_name+'/'+i+'/'+size, 
        function(err,res) {
        /* Si hay relacion, agregamos link */
        if (res.body!=null && res.body.relation) {
                self.links.push({
                    source: parseInt(res.body.pos_x)
                    , target: parseInt(res.body.pos_y)
                }) 
                /* Relacion encontrada! toca refrescar */
                self.start()
            }
        })
    }
})
/* clear */
self.user.value = ''
}
</code>
</pre>
Y aqui termina el tutorial por mi parte, solo teneis que lanzar desde la carpeta Riotjs un <strong>node server</strong> y abrir <strong>Public/index.html</strong> para cacharrear un poco (se me olvido que teneis que lanzar un <strong>npm run bundle</strong> para que funcione correctamente). Quedaría explicar el 2º componente de nombre <strong>more_options</strong>, componente hijo de <strong>social-twitter</strong> y responsable del guardado, carga y reseteo de nuestras creaciones. Es mejor descargarse el codigo que dejo al final del post como siempre digo.  

{% include elem.html video="Ita5o7g3RkQ" title="Ejemplo de la versión final con opción para guardar, cargar y resetear grafos" %}

<strong>Advertencias:</strong> Es importante recalcar que las peticiones a la API Twitter son limitadas. Recomiendo salvar vuestras creaciones cada 15-20 usuarios para no perder el progreso. Otra recomendacion es que os hagais usuario de twitter para solicitar unas keys y access tokens en <a href="https://apps.twitter.com/">https://apps.twitter.com/</a>. Ahora mismo os presto mis permisos pero probablemente acabe petando si mucha gente le da por usarlo.

{% include url.html id="https://www.dropbox.com/s/esyc3jln6yo8hd0/Riotjs.zip?dl=0" text="Codigo del Tutorial" %}