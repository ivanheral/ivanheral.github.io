---
layout: post
title:  "Tutorial. Primeros pasos con Jekyll"
date:   2016-2-29 12:00:00 +0100
comments: true
author: ivanheral
categories: tutorial
urlimage: /files/images/desarrollo/jekyll.jpg
---
En este tutorial explicare como crear un blog estático de la manera mas sencilla y cómoda posible. Lo primero que haremos sera instalar <strong>jekyll</strong> usando este comando en Ubuntu:

<pre>
    <code class="language-bash">
sudo apt-get install ruby ruby-dev && gem install jekyll
    </code>    
</pre>

Tras instalar <strong>ruby</strong> junto a <strong>jekyll</strong> solo nos quedara crear un blog de nombre <strong>blog-test</strong> con el siguiente comando para generar una carpeta con todo lo necesario:

<pre>
    <code class="language-bash">
jekyll new blog-test
    </code>    
</pre>

Prácticamente al instante tendremos una estructura de ficheros que se divide en las siguientes partes:

<strong>css.</strong> En esta carpeta solo se encuentra el fichero <strong>main.css</strong>, en el se alojan las variables globales como pueden ser el tamaño de las fuentes o el ancho del container, muy modificable.

<strong>_includes.</strong> Aquí tendremos nuestras porciones de html que queramos utilizar en nuestros posts/paginas. Por ejemplo, si necesitamos un componente de tipo img pues creamos un img.html con el contenido correspondiente y lo agregamos a nuestro post/pagina.

<strong>_layouts.</strong> Los layouts, <strong>default.html</strong> es la raiz y contiene a <strong>page.html</strong> y <strong>post.html</strong> que actuan como hijos con respecto a <strong>default.html</strong>, podriamos decir que encapsulan nuestro contenido <strong>{% raw %}{{ content }}{% endraw %}</strong> en el html.

<strong>_posts.</strong> Todos los posts que escribamos se guardaran aquí con la extensión <strong>*.markdown</strong>. Disponemos de un post de ejemplo para poder ver su contenido.

<strong>_sass.</strong> El lugar donde tenemos los estilos css principales, de los 3 ficheros me quedaría con <strong>_layout.css</strong> que contiene lo estilos mas prioritarios para personalizar nuestro blog.

<strong>Configuración del blog.</strong> Tenemos que dotar al blog de cierta identidad, lo conseguiremos tan solo modificando <strong>_config.yml</strong>:

<pre>
    <code class="language-markdown">
# Welcome to Jekyll!
#
# This config file is meant for settings that affect your whole blog, values
# which you are expected to set up once and rarely need to edit after that.
# For technical reasons, this file is *NOT* reloaded automatically when you use
# 'jekyll serve'. If you change this file, please restart the server process.

# Site settings
title: (Nombre de vuestro blog)
email: (vuestro email)
description: "(descripcion del blog)"
baseurl: "" # the subpath of your site, e.g. /blog
url: "(url que tendra el blog)" # the base hostname & protocol for your site
twitter_username: (vuestro usuario de twitter)
github_username:  (vuestro usuario de github)

# Build settings
markdown: kramdown
    </code>    
</pre>

Ahora pasaremos a visualizar nuestros cambios creando un servidor local con el blog montado mediante el siguiente comando ejecutado dentro de la carpeta <strong>blog-test</strong>:

<pre>
    <code class="language-bash">
jekyll serve && watch
    </code>    
</pre>

Entramos en <a href="http://localhost:4000" target="_blank">http://localhost:4000</a> y voila!, tendremos el blog funcionando y listo para modificar en caliente.

<strong>Modificación y creación de posts.</strong> Siempre que queramos crear un post debemos respetar la nomenclatura del fichero: 

<strong>año-mes-día-(titulo post).markdown</strong>

Dentro de este fichero es importante conservar tres variables <strong>(layout, title y date)</strong>. Al ser un post, tenemos que apuntar el layout a post mientras que en title pondremos el titulo que nos interese. El valor de date fijara el momento a partir el cual se mostrara el post, pongo de ejemplo las modificaciones realizadas en el post que viene por defecto:

<pre>
    <code class="language-markdown">
---
layout: post
title:  "Este es mi primer post!"
date:   2016-02-29 18:00:00 +0100
---
Aqui pongo lo que considero oportuno.

Gracias por leerme.
    </code>    
</pre>


<strong>Añadir includes.</strong> Ahora os pondré un ejemplo de un posible include, imaginar que ese "Gracias por leerme" se repitiera en la totalidad de posts, en ese caso nos interesaría crear un include para ahorrarnos repetir código. Para ello crearemos en la carpeta _includes un <strong>thanks.html</strong> con el contenido "Gracias por leerme" sin comillas y en los fichero post.html y page.html de la carpeta _layouts pondremos un <strong>{% raw %}{% include thanks.html %}{% endraw %}</strong> debajo de <strong>{% raw %}{{ content }}{% endraw %}</strong> que es donde se incrusta todo el contenido.


Igual se ve un poco sencillo, veamos como podemos complicarlo un poco. A los includes se les puede pasar variables, sustituir <strong>{% raw %}{% include thanks.html %}{% endraw %}</strong> por <strong>{% raw %}{% include thanks.html details="Besos!!!" %}{% endraw %}</strong> y cambiar el contenido de thanks.html por:

<pre>
    <code class="language-markdown">
{% raw %}{% if include.details %}{% endraw %}
Gracias por leerme. {% raw %}{{ include.details }}{% endraw %}
{% raw %}{% else %}{% endraw %}
Gracias por leerme.
{% raw %}{% endif %}{% endraw %}
    </code>    
</pre>

De esta forma podemos pasar el valor de la variable details a nuestro include y de paso os muestro un ejemplo de <a href="https://github.com/Shopify/liquid/wiki/Liquid-for-Designers" target="_blank">liquid</a>, el culpable 
de toda la magia entorno a jekyll. ¿Os acordáis de la variable layout para diferenciar en que tipo de pagina estamos?, pues bien, si añadimos el siguiente (if) podemos controlar donde estamos y poder visualizarlo cambiando <strong>thanks.html</strong> nuevamente: 

<pre>
    <code class="language-markdown">
{% raw %}{% if page.layout == "post" %}{% endraw %}
Estas en un post!!! - 
{% raw %}{% else %}{% endraw %}
Estas en una pagina!!! - 
{% raw %}{% endif %}{% endraw %}

{% raw %}{% if include.details %}{% endraw %}
Gracias por leerme. {% raw %}{{ include.details }}{% endraw %}
{% raw %}{% else %}{% endraw %}
Gracias por leerme.
{% raw %}{% endif %}{% endraw %}
    </code>    
</pre>

<strong>Crear Paginas.</strong> OK, vamos a crear una pagina. En la raíz de vuestro blog encontrareis <strong>about.md</strong>, duplicarlo y renombrarlo a <strong>new.md</strong> con el siguiente contenido y tendremos una nueva pagina accesible desde la HOME:
<pre>
    <code class="language-markdown">
---
layout: page
title: Nueva pagina
permalink: /new/
---

Acabo de crear una nueva pagina!
    </code>    
</pre>


<strong>Modificar estilos.</strong> Tal como explique anteriormente, las modificaciones se realizan  en <strong>_sass/_layout.scss</strong> con mucho cuidado y comprobando la estructura html para localizar que estilo a modificar. Me gustaría ser mas explicito pero en verdad es un proceso bastante rudimentario. Lo habitual en estos casos es plantear los htmls y scss desde cero.