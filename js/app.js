(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var section = "all";
var search = "";
var stop = false;
var comments = false;

var $ = function $(v) {
  return document.querySelector(v);
};

var All = function All(v) {
  return document.querySelectorAll(v);
};

function addClass(el, name) {
  el.classList ? el.classList.add(name) : el.className += ' ' + name;
}

function removeClass(el, name) {
  el.classList ? el.classList.remove(name) : el.className = el.className.replace(new RegExp('(^|\\b)' + name.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

function hasClass(el, nam) {
  if (el.classList) return el.classList.contains(nam);else return new RegExp('(^| )' + nam + '( |$)', 'gi').test(el.className);
}

$("#toggle").addEventListener("click", theme);
$("#cine").addEventListener("click", change_section);
$("#random").addEventListener("click", change_section);
$("#opiniones").addEventListener("click", change_section);
$("#tutorial").addEventListener("click", change_section);
$("#menu-icon").addEventListener("click", open);
$("#return_post").addEventListener("click", return_post);
$("#search-input").addEventListener("keyup", search_post);
document.addEventListener("scroll", scroll);

var act_disqus = function act_disqus() {
  var dsq = document.createElement('script');
  dsq.type = 'text/javascript';
  dsq.async = true;
  dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
  document.getElementsByTagName('head')[0].appendChild(dsq);
};

var vendors = function vendors() {
  if (window.location.pathname.indexOf('tutorial') >= 0) {
    var vendor = document.createElement('script');
    vendor.type = 'text/javascript';
    vendor.src = '/js/prism.js';
    document.getElementsByTagName('head')[0].appendChild(vendor);
  }
};

function scroll() {
  var scroll = $("html").scrollTop;
  if (!stop) {
    $("div.categories-list").style.marginTop = "0px";
    if (scroll > 45) {
      $("div.categories-list").style.marginTop = (scroll - 30).toString() + "px";
      addClass($("div.categories-list"), "scroll-fixed");
    }
  } else if ($("a.menu-icon").style.display = "block") {
    $("div.categories-list").style.marginTop = "0px";
  }
  showitem();
}

function search_post(e) {
  $(".header .site-title").innerHTML = 'BLOG';
  All('.categories .page-link').forEach(function (elem) {
    removeClass(elem, 'select');
  });
  if ($("article") !== null) $("article").style.display = 'none';
  search = e.target.value;
  if (search != "") {
    if ($("article.post") !== null) $(".return").style.display = 'block';
  } else section = "all";
  $(".post-list").innerHTML = '';
  load_posts();
}

function change_section(e) {
  window.scrollTo(0, 0);
  search = "";
  [].forEach.call(All('.categories .page-link'), function (elem) {
    removeClass(elem, 'select');
  });
  section = e.target.id;
  addClass($('#' + section), 'select');
  if ($("article") !== null) $("article").style.display = 'none';
  $("#search-input").value = '';

  $(".header .site-title").innerHTML = section.toUpperCase();
  if ($("article.post") !== null) $(".return").style.display = 'block';
  $(".post-list").innerHTML = '';
  load_posts();
}

function open() {
  $('.trigger').classList.toggle('open');
}

function theme() {
  $('html').classList.toggle('black');
  localStorage.getItem("theme") == "black" ? localStorage.setItem("theme", "white") : localStorage.setItem("theme", "black");
}

function return_post() {
  window.scrollTo(0, 0);
  $(".header .site-title").innerHTML = 'BLOG';
  $(".post-list").styleheight = '0px';
  $(".post-list").innerHTML = '';
  $("article").style.display = 'block';
  $('#return_post').style.display = 'none';
  [].forEach.call(All('.categories .page-link'), function (elem) {
    removeClass(elem, 'select');
  });
}

function put_posts(v, i) {
  var elem = "";
  v.img != "" ? elem = "<div class='wall_img'><img src='" + v.img + "'></div>" : elem = "<div class='wall_img'>" + v.svg + "</div>";
  var post = document.createElement('a');
  post.className = 'post';
  post.href = v.url;
  post.id = i.toString();
  $(".post-list").appendChild(post);
  var d1 = document.getElementById(i.toString());
  d1.insertAdjacentHTML('beforeend', '<div class="wall_img"><img src="' + v.img + '"></div><div class="info_post"><div class="post-title">' + v.title + '</div><div class="post-meta">' + v.date + '</div></div>');
}

function load_posts() {
  var count = 0;
  fetch("/json/search.json").then(function (response) {
    return response.json().then(function (data) {
      return data.forEach(function (val, i) {
        if (search != "") {
          if (val.title.toUpperCase().indexOf(search.toUpperCase()) > -1) {
            var pos_search = val.title.toUpperCase().indexOf(search.toUpperCase());
            val.title = val.title.substr(0, pos_search) + "[" + search + "]" + val.title.substr(pos_search + search.length);
            put_posts(val, i);
            count += 1;
          }
        } else if (section == "all" || val.category == section) {
          put_posts(val, i);
        }
        if (i == data.length - 1 && search != "") {
          $('.header .site-title').innerHTML = 'RESULTADOS: ' + count;
          $(".post-list").style.height = 'auto';
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  vendors();
  localStorage.getItem("theme") == "black" ? addClass($("html"), "black") : removeClass($("html"), "black");
  if ($(".important") === null) load_posts();
}, false);

function isscroll(elem, n) {
  var dim = elem.getBoundingClientRect();
  var w_height = window.innerHeight + n;
  return dim.top > 0 && w_height > dim.top;
}

function showitem() {
  var n = [].slice.call(All(".wall_img"));
  var n_2 = [].slice.call(All(".wall_overflow"));
  var total = n.concat(n_2);
  var disqus = $(".disqus");
  if (disqus != undefined && !comments) {
    if (isscroll(disqus, 720)) {
      comments = true;
      act_disqus();
    }
  }
  total.map(function (val, i) {
    var src = val.children[0].currentSrc;
    if (src !== undefined) {
      if (isscroll(val, -90)) {
        if (src.indexOf("giphy_s.gif") >= 0) val.children[0].src = src.replace("giphy_s.gif", "giphy.gif");
        if (src.indexOf("mqdefault") >= 0) {
          val.children[0].src = "";
          val.innerHTML = '';
          var overflow = document.createElement('div');
          overflow.className = 'wall_overflow';
          val.appendChild(overflow);
          val.children[0].outerHTML = '<iframe src="//www.youtube.com/embed/' + val.children[0].id + '" frameborder="0" allowfullscreen></iframe>';
        }
      }
    }
  });
}

},{}]},{},[1]);
