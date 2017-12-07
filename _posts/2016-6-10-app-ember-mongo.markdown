---
layout: post
title:  "Tutorial. Todo App con Ember y Mongo"
date:   2016-6-10 15:00:00 +0100
comments: true
author: ivanheral
categories: tutorial
urlimage: /files/images/desarrollo/ember.jpg
---

Hoy he decidido revivir una serie de posts publicados a mediados de abril del años pasado (<a href="http://ryanchristiani.com/working-with-ember-data-node-express-and-mongodb/">1</a>,<a href="programwitherik.com/how-to-setup-your-ember-project-with-mongo-and-node/">2</a>,<a href="programwitherik.com/how-to-add-records-with-mongo-and-ember/">3</a>,<a href="programwitherik.com/how-to-edit-or-delete-with-mongo-and-ember/">4</a>). Fueron unos 4 posts escritos por <a href="www.twitter.com/RChristiani">Ryan Christiani</a> y <a href="www.twitter.com/ErikCH">Erik Hanchett</a> muy interesanter sobre como utiliar Mongo con el framework Ember 1.X. Lamentablemente dejaron de funcionar tras el lanzamiento de la version 2.0 del framework Ember dejando inservibles los post mencionados. Hoy reviviremos estos post y aprenderemos a realizar una especie de Todo-App que nos permita listar, añadir, modicar y borrar notas en Mongo usando este simpatico pero en ocasiones cambiante framework.

{% include title.html title="1º Parte: La Api" %}

Ok. Primero contruiremos una api que haga peticiones de la base de datos. Es importante instalar mongo y nodejs con un simple <strong>sudo apt-get install nodejs && mongo</strong>, recomiendo instalar Robomongo 0.8.5 para visualizar los registros. Lo siguiente sera crear una carpeta de nombre Tutorial-Ember (por ejemplo) y dentro creamos una de nombre Api que tendra la siguiente estructura de archivos y carpetas. A continuacion, enumeramos la estructura de ficheros que tendra: 

<pre>
    <code class="language-bash">
carpeta api
   - note.js
   
carpeta app
   - routes.js 
      
carpeta models      
   - note.js 
    
package.json
server.json    
    </code>    
</pre>

<strong>package.json:</strong> Usaremos express y moongose principalmente. Morgan para visualizar en la terminal si funcionan correctamente las peticiones todo correctamente. Cors y body-parser para otras cosas, no quiero profundizar al respecto XD:

<pre>
<code class="language-json">
{
  "name": "Server",
  "version": "0.0.0",
  "devDependencies": {
    "body-parser": "^1.15.2",
    "cors": "^2.7.1",
    "express": "^4.14.0",
    "mongoose": "^4.5.2",
    "morgan": "^1.7.0"
  }
}
</code>    
</pre>

<strong>models/note.js:</strong> Vamos a crear un registro de notas/cuentos donde almacenaremos 3 campos: el titulo, el contenido y el autor en formato string: 
<pre>
<code class="language-js">
// models/note.js
mongoose = require('mongoose');
/* Usaremos un modelo 'note' con tres campos strings */
var noteSchema = new mongoose.Schema({
	title: 'string',
	content: 'string',
	author: 'string'
});

module.exports = mongoose.model('note',noteSchema);
</code>    
</pre>

<strong>app/routes.js:</strong> Aqui tendremos configuradas las 2 rutas bien diferenciadas. En api/notes tenemos un GET que recupere todas las notas y POST para agregar una nota. En /api/notes/:note_id tendremos las opciones de modificar y borrar mediante DELETE y PATCH:
<pre>
<code class="language-js">
// app/router.js

var notes = require('../api/note');
module.exports = function (router) {

    /* Ruta de listado de nota (get) y salvado de nuevas notas (post) */ 
    router.route('/api/notes').get(function (req, res) {
            notes.getAllNotes(req, res)
        })
        .post(function (req, res) {
            notes.addNote(req, res)
        });
        
    /* Ruta de borrado (delete) y modificado (patch) */     
    router.route('/api/notes/:note_id').get(function (req, res) {
            notes.getIdNote(req, res)
        })
        .delete(function (req, res) {
            notes.deleteNote(req, res)
        })
        .patch(function (req, res) {
            notes.saveNote(req, res)
        });
};
</code>    
</pre>

<strong>api/note.js:</strong> Aqui estan las 4 funcionalidades que enlazan a la ruta correspondiente. <strong>getAllNotes</strong> devuetve un listado de todas las notas en la variable note. <strong>getIdNote</strong> busca la nota por el identificador que recibe como parametro de la ruta. <strong>deleteNote</strong> borra en funcion del identificador recibido y <strong>addNote</strong> añade una nota: 
<pre>
<code class="language-js">
var Note = require('../models/note');

/* Enviara la lista de notas en una variable 'note' */
module.exports.getAllNotes = function (req, res) {
    Note.find({}, function (err, docs) {
        if (err) res.send(err)
        console.log(docs);
        res.send({
            note: docs
        });
    });
};

/* Buscara la nota gracias a req.params.note_id y nos devolvera
la nota en una variable 'note' */
module.exports.getIdNote = function (req, res) {
    Note.findById(req.params.note_id, function (err, docs) {
        if (err) res.send(err);
        console.log(docs);
        res.send({
            note: docs
        });
    });
};

/* Eliminado de nota */
module.exports.deleteNote = function (req, res) {
    Note.findById(req.params.note_id, function (err, elem) {
        if (err) res.send(err);
        elem.remove(function (err, docs) {
            if (err) res.send(err);
            console.log(docs);
            res.send({
                note: docs
            });
        });
    });
};

/* Salvar nota */
module.exports.addNote = function (req, res) {
    var note = new Note(req.body.note);
    note.save(function (err, elem) {
        if (err) res.send(err);
        console.log(elem);
        res.send({
            note: elem
        });
    });
};

/* Modificar nota ($set: req.body.note) */
module.exports.saveNote = function (req, res) {
    Note.findByIdAndUpdate(req.params.note_id, {
        $set: req.body.note
    }, function (err, elem) {
        if (err) res.send(err);
        console.log(elem);
        res.send({
            note: elem
        });
    });
};
</code>    
</pre>

<strong>server.js:</strong> Finalmente terminamos con el servidor. El servidor se ejecutara por el puerto 4500. La cosa quedaria como muestro a continuacion:

<pre>
<code class="language-js">
/* Variables */
var express = require("express")
    , app = express();

var morgan = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var router = express.Router();


/* Conectamos a la BBDD  de Mongo */
mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/emberData');


app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(cors());


/* USAR RUTAS */
app.use('/', router);
require('./app/routes')(router);

/* Puerto */
app.listen(4500);
console.log("Node server running on http://localhost:4500");

exports = module.exports = app;
</code>    
</pre>

Bueno, ahora toca probar nuestra API. Abrimos una terminal en la carpeta Api y ejecutamos <strong>npm install</strong>. Despues lanzamos <strong>node server</strong> y dejamos que funcione en el puerto 4500. Solo nos queda probar si funciona ejecutando los siguientes comandos en otra terminal estando siempre pendiente de los mensajes que puedan salir en la terminal con el mensaje <strong>Node server running on http://localhost:4500</strong>:
<pre>
<code class="language-bash">
// ADD note
curl -d '{"note":{"title":"Oliver Twist","content":"Oliver es un niño huérfano.","author": "Charles Dickens"}}' -H "Content-Type: application/json" http://localhost:4500/api/notes

// GET ALL
curl http://localhost:4500/api/notes

// DELETE note
curl -X DELETE -H "Content-Type: application/json" http://localhost:4500/api/notes/(_id reemplazar por el identificador correcto)

/* Si aparecen 200/204 de color verde es que la cosa va bien
Morgan y los mensajes de la terminal te guiaran. */
</code>    
</pre>

{% include title.html title="2º Parte: El framework" %}

¿Ha funcionado correctamente? si la respuesta es afirmativa entonces pasaremos a la segunda parte. EmberJs es un framework bastante interesante que mediante comandos por terminal nos permitira generar plantillas, rutas y controladores de manera sencilla y rapida. Pero lo primero es instalarlo:
<pre>
<code class="language-bash">
// Instalamos Ember (este tutorial utiliza la version 2.6.2)
sudo npm install -g ember-cli@2.6.2
// En la carpeta Tutorial-Ember abrimos una terminal y lanzamos un nuevo proyecto:
ember new Example
</code>    
</pre>

Estupendo, metamonos dentro de la carpeta Example y abramos una terminal. En el siguiente paso se describen los comandos que nos ahorraran escribir:

<pre>
<code class="language-bash">
// 1º Creamos la ruta MADRE
// g (generate -  generar) & d (deploy - remover)
ember g route application

// 2º Creamos la ruta index y about (Aqui agregaremos y listaremos notas)
ember g route index
ember g route about

// 3º Creamos la ruta note/show (Aqui modificaremos y borraremos notas)
ember g route note/show

// 4º Generamos el modelo note (title,content.author)
ember g model note title:string content:string author:string

// 5º Generamos el serializer para que conecte con el id de Mongo.
ember g serializer application

// 6º Generamos el adaptador para que nuestro proyecto Ember apunte a la Api.
ember g adapter application

// 7º Generamos los controladores donde incluiremos las acciones
ember g controller index
ember g controller note/show

// 8º Instalar Bootstrap 4 (addon)
bower install tether
ember install ember-cli-sass
ember install ember-bootstrap-4
</code>    
</pre>

Ha sido relativamente sencillo pero ahora queda lo realmente dificil, rellenar los ficheros generados, nos centraremos en la carpeta app que se aloja en <strong>Example</strong>. <strong>app/styles/app.scss: </strong>Necesitamos agregar bootstrap en la hoja de estilos del proyecto y renombar a *.scss el fichero de estilos:
<pre>
<code class="language-scss">
@import "bootstrap";

/* ejemplo de estilo propio */

.padding-top {
    padding-top: 2rem;
}
</code>    
</pre>

<strong>Example/app/adapters/application.js:</strong> Fichero para conectar la api con nuestro framework. Le asignamos un nombre, un host para que apunte al puerto de nuestra api y incluimos unos headers para la correcta lectura del json tras las peticiones que hagamos:
<pre>
<code class="language-js">
import JSONAPIAdapter from 'ember-data/adapters/json-api';

export default JSONAPIAdapter.extend({
    namespace: 'api',
    host: 'http://localhost:4500',
    headers: {"Content-Type":"application/json"}
});
</code>    
</pre>

<strong>app/router.js:</strong> Aqui se configuran las rutas. Index apuntara a la url "/" y about apuntara a "/about": 
<pre>
<code class="language-js">
import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('about', {path: "/about"});
  this.route('index', {path: "/"});
  /* En la carpeta note se encuentra el template show que recibira un parametro id */
  this.resource('note', function() {
      this.route('show', {
          path: ":note_id"
      });
    });
});

export default Router;
</code>    
</pre>

<strong>app/serializers/application.js:</strong> Este fichero sera modificado debido a que la libreria <strong>RESTSerializer</strong> funciona correctamente para asignar una clave primaria a los _id de los registros que se extraen de Mongo:
<pre>
<code class="language-js">
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	primaryKey: '_id'
});
</code>    
</pre>


<strong>app/templates/routes/index.js:</strong> Devuelve una variable model con todas las notas registradas en Mongo. 
<pre>
<code class="language-js">
import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		return this.store.findAll('note');
	}
});
</code>    
</pre>

<strong>app/templates/application.hbs:</strong> Esta es la ruta Madre de donde tiraran el resto de vistas. Aqui se ha incluido exclusivamente la cabecera y en outlet se dibujara la vista que se considere oportuno en funcion de la url en la que estemos: 
<pre>
<code class="language-html">
&lt;nav class="navbar navbar-dark navbar-full bg-primary"&gt;
  &lt;button class="navbar-toggler hidden-sm-up" type="button" data-toggle="collapse" data-target="#exCollapsingNavbar2"&gt;
    &#9776;
  &lt;/button&gt;
  &lt;div class="collapse navbar-toggleable-xs" id="exCollapsingNavbar2"&gt;
    &lt;a class="navbar-brand" href="#">Todo App - Ember&lt;/a&gt;
    &lt;ul class="nav navbar-nav"&gt;
      &lt;li class="nav-item active"&gt;
        {% raw %}{{#link-to 'about' class="nav-link"}}ABOUT{{/link-to}}{% endraw %}
      &lt;/li&gt;      
    &lt;/ul&gt;
  &lt;/div&gt;
&lt;/nav&gt;
{% raw %}{{outlet}}{% endraw %}
</code>  
</pre>

<strong>app/templates/index.hbs:</strong> Primer template de nuestra App. Constara de un formulario que tras un submit lanzara la accion save del controlador index. Lo siguiente que vereis es el listado mediante un each que devuelve un item para visualizar las notas: 
<pre>
<code class="language-html">
&lt;div class="container"&gt;
    &lt;div class="row"&gt;    
        &lt;div class="col-xs-12 col-md-3 padding-top"&gt;
            &lt;form {% raw %}{{action 'save' on="submit" }}{% endraw %}&gt;
                &lt;div class="form-group"&gt;
                    &lt;label>Titulo:&lt;/label&gt;{% raw %}{{textarea value=titulo class="form-control"}}{% endraw %} &lt;/div&gt;
                &lt;div class="form-group">
                    &lt;label>Contenido:&lt;/label&gt;{% raw %}{{textarea rows=10 value=contenido class="form-control"}}{% endraw %} &lt;/div&gt;
                &lt;div class="form-group"&gt;
                    &lt;label>Autor:&lt;/label&gt;{% raw %}{{textarea value=autor class="form-control"}}{% endraw %} &lt;/div&gt;
                &lt;button class="btn btn-primary"&gt;añadir&lt;/button&gt;
            &lt;/form&gt;
        &lt;/div&gt;        
        &lt;div class="col-xs-12 col-md-9 padding-top"&gt;
            &lt;div class="row"&gt;               
               {% raw %}{{#each model as |item|}}{% endraw %}
               
                &lt;div class="col-xs-12 col-sm-6 col-md-4"&gt;
                    &lt;div class="card text-xs-right"&gt;                           
                        &lt;img class="img-fluid card-img-top" src="assets/images/ember.jpg"&gt;
                            &lt;div class="card-block"&gt;
                                &lt;h4 class="card-title"&gt;{% raw %}{{item.title}}{% endraw %}&lt;/h4&gt; 
                                &lt;p&gt;{% raw %}{{item.content}}{% endraw %}&lt;/p&gt;
                                &lt;p&gt;{% raw %}{{item.author}}{% endraw %}&lt;/p&gt;
                                {% raw %}{{#link-to 'note.show' item.id class="btn btn-primary" tagName="button" }}
                                ver
                                {{/link-to}}{% endraw %}
                            &lt;/div&gt;                            
                    &lt;/div&gt;
                &lt;/div&gt;                 
                {% raw %}{{/each}}{% endraw %} 
            &lt;/div&gt;          
        &lt;/div&gt;        
    &lt;/div&gt;
&lt;/div&gt;
</code>  
</pre>

<strong>app/controllers/index.js:</strong>El controlador de index dispone de la accion <strong>save</strong> que hemos visto anteriormente en el formulario. Gracias a <strong>createRecord</strong> podemos salvar una nota extrayendo el valor de los textareas. Reseteamos el formulario y guardamos:
<pre>
<code class="language-js">
import Ember from 'ember';

export default Ember.Controller.extend({

actions: {
        save: function () {
            var note = this.store.createRecord('note', {
                title: this.get('titulo'),
                content: this.get('contenido'),
                author: this.get('autor')
            });	    
	        this.set('titulo', "");
            this.set('contenido', "");
            this.set('autor', "");
            note.save();
        }
    }
});
</code>    
</pre>

<strong>app/templates/note/show.hbs:</strong> Esta vista es un formulario que dibuja los campos de la nota escogida con tres posibles acciones mediante botones (borrar, modificar y Index): 
<pre>
<code class="language-html">
&lt;div class="container"&gt;
    &lt;div class="row"&gt;
        &lt;div class="col-xs-12 col-sm-6 padding-top"&gt;
            &lt;form&gt;
                &lt;div class="form-group"&gt;
                    &lt;label&gt;Titulo:&lt;/label&gt;
                    {% raw %}{{textarea value=model.title cols="40" rows="1" class="form-control"}}{% endraw %}
                &lt;/div&gt;
                &lt;div class="form-group"&gt;
                    &lt;label&gt;Contenido:&lt;/label&gt;
                    {% raw %}{{textarea value=model.content cols="40" rows="10" class="form-control"}}{% endraw %}
                &lt;/div&gt;
                &lt;div class="form-group"&gt;
                    &lt;label&gt;Autor:&lt;/label&gt;
                    {% raw %}{{textarea value=model.author cols="40" rows="1" class="form-control"}}{% endraw %}
                &lt;/div&gt;
                &lt;div class="btn-group"&gt;
                    &lt;button type="delete" class="btn btn-danger" {% raw %}{{action 'delete' on='click' }}{% endraw %}&gt;borrar&lt;/button&gt;
                    &lt;button type="submit" class="btn btn-success" {% raw %}{{action 'update' on='click' }}{% endraw %}&gt;modificar&lt;/button&gt;
                    {% raw %}{{#link-to 'index' tagName="button" class="btn btn-primary"}}Index{{/link-to}}{% endraw %}
                &lt;/div&gt;
            &lt;/form&gt;
        &lt;/div&gt;
    &lt;/div&gt;
&lt;/div&gt;
</code>    
</pre>

<strong>Example/app/controllers/note/show.js:</strong> Este controlador tiene dos acciones (borrado y modificado). Tras realizar su cometido, nos reenviaran a la home mediante <strong>transitionToRoute('index')</strong>.
<pre>
<code class="language-js">
import Ember from 'ember';
export default Ember.Controller.extend({
    actions: {
        delete: function () {
            /* Borrado */
            this.get('model').deleteRecord();
            this.get('model').save();
            this.transitionToRoute('index');
        },
        update: function () {
            /* Seleccionamos la nota */
            var note_selected = this.get('model');
            /* Reescribimos */
            note_selected.save();
            this.transitionToRoute('index');
        }
    }
});
</code>    
</pre>

{% include elem.html video="4p8_aYyKtx8" title="Video del resultado final" %}

<strong>Conclusiones del paso de Ember 1.x a 2.x:</strong> En Ember 2.x usan PATCH y no PUT para modificaciones, muy raro. Muchas librerias han sido reemplazadas sin repercutir en el funcionamiento exceptuando serializer. Incluir los headers en el adaptador es mas sencillo que modificar el environment. Ha sido un poco desesperante pero finalmente ha funcionado mejor de lo que esperaba. Dejo el codigo por si le interesa a alguien:

{% include url.html id="http://www.dropbox.com/s/ntrmv8j1226rbhz/Tutorial-Ember.zip?dl=0" text="Codigo del Tutorial" %}
