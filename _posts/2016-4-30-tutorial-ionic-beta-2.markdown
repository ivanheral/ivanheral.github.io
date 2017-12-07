---
layout: post
title:  "Tutorial. App (Citymapper) con Ionic 2 Beta"
date:   2016-4-30 10:00:00 +0100
comments: true
author: ivanheral
categories: tutorial
urlimage: /files/images/desarrollo/ionic.jpg
---

Hoy vamos hacer una app cutre inspirada en Citymapper (por si os hace ilusión y tal) usando la versión beta 25 de Ionic 2. El primer paso será instalar <strong>Ionic 2 Beta</strong> y <strong>Cordova 4.2.0</strong>, algo bastante obvio y que haremos con estos sencillos comandos:
<pre>
<code class="language-bash">
sudo npm install -g ionic@beta 
sudo npm install -g cordova@4.2.0
</code>
</pre>

Ahora creamos un proyecto predefinido para comprender mejor como funciona este sistema para generar apps multiplataforma <strong>(Android/IOS)</strong>:
<pre>
<code class="language-bash">
/* Creamos un proyecto predeterminado Ionic con la etiqueta --v2 */
ionic start cutePuppyPics --v2

/* Ejecutamos este comando dentro de la carpeta cutePuppyPics para subsanar algun bug */
npm install node-sass@3.4.2

/* Lanzamos la app y esperamos a que se muestre en el navegador */
ionic serve
</code>
</pre>

Enhorabuena, acabas de configurar tu entorno de trabajo, pero lo mejor será que nos remanguemos las mangas para hacer nuestra App. Para no tener que perder el tiempo en engorrosas explicaciones pasare a entregaros el código en cuestión que es como mejor se aprende y así comprendamos un poco como funciona Ionic:

{% include url.html id="https://www.dropbox.com/s/4zeal5sznfruevc/Citymapper.tar.gz?dl=0" text="App Ionic 2 Beta" %}

Nuestro objetivo es hacer una app que tire del servicio de Google Maps API para que nos busque rutas a un destino que no interese, por eso tenemos que incluir el script de Google Maps en <strong>www/index.html</strong>. Es importante tener conocimientos de ES6 y JQuery respectivamente para entenderlo mejor. En la ruta app/pages se encuentran las páginas del proyecto: home, la página encargada de las búsquedas y Map, donde tendremos la posibilidad de ver el mapa correctamente. Pero ahora lo que nos importa es configurar el fichero <strong>app/app.js</strong>, he dejado algunas anotaciones:

<pre>
<code class="language-js">
/* Fichero  app/app.js */

import 'es6-shim';
import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
/* Importaremos nuestras dos paginas */
import {HomePage} from './pages/home/home';
import {Map} from './pages/map/map';

@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  config: {} 
})
export class MyApp {
  static get parameters() {
    return [[Platform]];
  }

  constructor(platform) {
   /* Nuestra vista principal sera Home */
    this.rootPage = HomePage;
    platform.ready().then(() => {
      StatusBar.styleDefault();
    });
  }
}
</code>
</pre>

<strong>app/pages/home/home.html:</strong> este fichero contiene un <strong>ion-navbar</strong> con su objeto *navbar y su variable {{city}}, en <strong>ion-content</strong> hemos creado un row con 4 columnas (25% de ancho) formado 
por 4 items que actuaran como link para la página <strong>Map</strong> gracias a la función <strong>itemTapped</strong> que explicaremos más adelante. Un div para el mapa y un ion-list que actúa como formulario con su input (modelo search para recoger lo que tecleemos) y su botón. Para finalizar, tendremos un div con su identificador panel. Veamos el contenido de <strong>app/pages/home/home.js</strong>:

<pre>
<code class="language-js">
/* Importamos los elementos que nos interesa:
Geolocation: plugin de cordova
Alert: para las alertas
NavController y NavParams: paso de parametros a otra pagina
*/
import {
    Page, Geolocation, Alert, NavController, NavParams
}
from 'ionic-angular';


/* Importamos la pagina Map para invocarla con itemTapped */
import {
    Map
}
from '../map/map';

@
Page({
    templateUrl: 'build/pages/home/home.html'
})

export class HomePage {
    static get parameters() {
        return [[NavController], [NavParams]];
    }

/* Variables globales en el constructor */
    constructor(nav) {
        /* Obligatorio */
        this.nav = nav;
        /* var para el mapa de Google Maps API */
        this.map = null;
        /* var para el destino */
        this.destination = "";
        /* var para el origen */
        this.origin = null;
        /* var para la busqueda en el input */
        this.search = null;
        /* enumerable con los tipos de transporte */
        this.icons = ['car', 'walk', 'bus', 'bicycle'];
        /* enumerable con los tipos de modo de transporte */
        this.modes = ['DRIVING', 'WALKING', 'TRANSIT', 'BICYCLING'];
        /* lista vacia para guardar los items */ 
        this.items = [];
        /* Muy obligatorio */
        this.render = new google.maps.DirectionsRenderer();
        
        /* Lanzamos una funcion nada mas cargar la pagina Home */
        this.initMap();
    }
    
    /*FUNCIONES */

}
</code>
</pre>
  
<strong>initMap:</strong> función encargada de geolocalizar nuestra posición y dibujar el mapa en home:

<pre>
<code class="language-js">
initMap() {
    let options = {
        timeout: 10000,
        enableHighAccuracy: true
    };
    navigator.geolocation.getCurrentPosition(
        (position) => {
            /* Guardamos nuestro origen en la variable origin */
           
            this.origin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            let mapOptions = {
                center: this.origin,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                draggable: false
            }
            /* Dibujamos el mapa en id="map" de home.html */
            this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            
            /* Lanzamos la funcion */
            this.searchCity();
        }, (error) => {
           /* Si fallamos con la geolocalizacion pasamos a mostrar un mensaje de error */
            let not_geo = Alert.create({
                title: 'Wrong!',
                subTitle: 'You have internet?',
                buttons: ['OK']
            });
            /* Agregamos el error a nav */
            this.nav.present(not_geo);
        }, options
    );
}    
</code>
</pre>

<strong>searchCity:</strong> función encargada de solicitar un json a Google Maps API y extraer nuestra ciudad en función de la variable origin:

<pre>
<code class="language-js">
searchCity() {
    /* ok, peticion del servicio */
    let url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + this.origin.lat() + ", " + this.origin.lng();
    
    /* Usamos jquery  */      
    $.getJSON(url, function (json) {
        $("ion-navbar ion-buttons").append(json.results[0].address_components[3].long_name);
    })
    
    /* Esto no debia estar aqui... simplemente creo 4 items.
       Podeis comprobar el FOR home.html y sacar una conclusion
       de todo esto.     
    */
    for (let i = 0; i < 4; i++) {
        this.items.push({
            mode: this.modes[i],
            icon: this.icons[i]
            });
        }
}
</code>
</pre>
      
<strong>Destination:</strong> función que salva la búsqueda realizada en el input. La variable destination guardara nuestro destino en formato completo.

<pre>
<code class="language-js">
Destination() {
    /* La variable para guardar */    
    let dat_aux = null;
       
       /* 
       Ajax no asincrono (lo se...). Hago una solicitud en funcion de la busqueda (this.search) y 
       la ciudad guardada en $("ion-navbar ion-buttons").html() 
       */
        $.ajax({
        url: "http://maps.googleapis.com/maps/api/geocode/json?address=" + this.search + ", " + $("ion-navbar ion-buttons").html(),
        async: false,
        dataType: 'json'
    }).done(function (res) {
        dat_aux = res;
    });
       
        /* Guardamos el resultado en destination */
        this.destination = "";
        if (dat_aux.results[0].geometry.location_type != "APPROXIMATE")
        this.destination = dat_aux.results[0].formatted_address;
        
        /* Calculamos la ruta idonea */
        this.calculateRoute();
}
</code>
</pre>    

<strong>calculateRoute:</strong> función encargada de hacer una petición a Google Maps Api con rutas alternativas exclusivamente de autobuses. Dibuja las rutas pertinentes y muestra las indicaciones en función de cada una de ellas:   

<pre>
<code class="language-js">
calculateRoute() {
    if (this.destination != "" || this.destination != "APPROXIMATE") {
        $(".show_alternative").css("display", "block");
        let directionsDisplay = null;
        
        /* Esto me ayuda a refrescar */
        directionsDisplay = this.render;
        let directionsService = new google.maps.DirectionsService();

        document.getElementById("panel").innerHTML = "";
        directionsDisplay.setMap(this.map);
        directionsDisplay.setPanel(panel);
            directionsService.route({
            /* Introduzco mi origen */
            origin: this.origin,
            /* Introduzco mi destino */
            destination: this.destination,
            travelMode: google.maps.TravelMode.TRANSIT,
            /* Ver rutas alternativas */
            provideRouteAlternatives: true,
            /* Solo recorridos por BUS */
            transitOptions: {
                modes: [google.maps.TransitMode.BUS]
            }
            }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                /* Pintamos el mapa y el panel */
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(map);
            } else {
                /* Borramos todo si el resultado es infructuoso */
                directionsDisplay.setMap(null);
                directionsDisplay.setPanel(null);
            }
        });
    }
}
</code>
</pre>

<strong>itemTapped:</strong> función predefinida que nos permite trasladar datos de una página a otra en pocos pasos:

<pre>
<code class="language-js">
itemTapped(event, item) {
   /* Si no hay destino mostramos alerta */
    if (this.destination == "") {
        let alert = Alert.create({
            title: 'Wrong!',
            subTitle: 'Are you going somewhere?!',
            buttons: ['OK']
        });
        this.nav.present(alert);
    } else {
        /* 
        Agregamos 4 variables (item - pulsado -, origin, destination y search - busqueda -) 
        Con un simple push se mostrara la pagina Map a nivel visual
        */
        this.nav.push(Map, {
            item: item,
            origin: this.origin,
            destination: this.destination,
            search: this.search
        })
    }
}
</code>
</pre>
 
<strong>app/pages/map/map.js:</strong> Esas 4 variables antes mencionadas son transferidas gracias a navParams, tan solo tengo que aplicar <strong>get</strong> junto al nombre que 
le di en home para recuperar sus valores y con ello bastaría para poder emplearlas en <strong>Map</strong>:

<pre>
<code class="language-js">
constructor(nav, navParams) {
    this.nav = nav;
    this.selectedItem = navParams.get('item');
    this.origin = navParams.get('origin');
    this.destination = navParams.get('destination');
    this.search = navParams.get('search');
    /* Lanzamos otra vez initMap definida en map.js */
    this.initMap();
}
</code>
</pre>
  
<strong>calculateRoute:</strong> función del mismo nombre que la pudisteis ver en <strong>home.js</strong> pero con algunos matices. Aquí suprimo los marcadores y ruta original que emplea Google Maps Api por un polyline de color verde y mostramos información adicional gracias a jquery.   

<pre>
<code class="language-js">  
 calculateRoute() {
    let renderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true
        , suppressPolylines: true
    });
    let directions = new google.maps.DirectionsService();
    renderer.setMap(this.map);
    let request = {
        origin: this.origin
        , destination: this.destination
        , travelMode: google.maps.TravelMode[this.selectedItem.mode]
    };

    let polyline = new google.maps.Polyline({
        path: []
        , strokeColor: '#37ab2e'
        , strokeWeight: 5
    });
    
    /* Mostramos la busqueda realizada con jquery */
    $("ion-row.info ion-col.search").html(this.search);

    let distance = null;
    directions.route(request, function (response, status) {

    if (status == google.maps.DirectionsStatus.OK) {
        renderer.setDirections(response);
        let legs = response.routes[0].legs;
        distance = legs[0].distance.text;
        /* Mostramos la distancia que se recorrera con jquery */
        $("ion-row.info ion-col.distance").html(distance);

        for (let i = 0; i < legs.length; i++) {
            let steps = legs[i].steps;
                for (let j = 0; j < steps.length; j++) {
                        let step = steps[j].path;

                        $("ion-list.steps").append("<span>" + steps[j].instructions.toString() + "</span>");

                        for (let k = 0; k < step.length; k++) {
                            polyline.getPath().push(step[k]);
                        }
                    }
                }
            }
        });
        polyline.setMap(this.map);
    }
 </code>
</pre>

{% include elem.html video="C2g6wECxfTM" title="Ejemplo practico de como nos queda a nivel visual" %}

Supongo que tendré que darle un repaso a todo esto. Entre las faltas de ortografía y los fallos del código acabare por sacarle tiempo y dejar bonito el post. De todas formas como ejemplo puede valer perfectamente para comprender como función Ionic Framework aunque no he comentado nada al respecto de <strong>SASS</strong> aunque podéis echarle un vistazo a <strong>app.score.scss</strong>, <strong>app.variables.scss</strong> y los *.scss de las paginas creadas. Tampoco he mencionado nada al respecto de cómo compilar todo esto para Android/IOS así que lo único que puedo hacer es remitiros a la página web del proyecto para dejaros un poco con la curiosidad:
  
{% include url.html id="http://ionicframework.com/" text="Ionic Framework" %}


<strong>Actualizacion:</strong> Este tutorial se realizo con el único objetivo de trastear un poco con Ionic usando Google Maps pero sin API Key para evitar líos. Lo lógico es crear servicios al margen de los controladores e injectarlos pero dio la casualidad que no había mucha información al respecto. Os dejo este tutorial <a href="http://gonehybrid.com/build-your-first-mobile-app-with-ionic-2-angular-2-part-5">link</a> de Ashteya Biharisingh que explica un poco mejor el tema. Dejo copia de código por si las moscas:

{% include url.html id="https://www.dropbox.com/s/1e03ztj05skxxn1/ionic2-tutorial-github.zip?dl=0" text="Ejemplo servicio GitHub" %}