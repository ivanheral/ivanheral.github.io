(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

/* Vars */
var section = 'all';
var search = '';
var stop = false;
var comments = false;
var doc = document;
var loc = localStorage;

/* Not jQuery */
var $ = function $(v) {
  return doc.querySelector(v);
};

var all = function all(v) {
  return doc.querySelectorAll(v);
};

function addclss(el, nam) {
  el.classList ? el.classList.add(nam) : el.className += ' ' + nam;
}

function delclss(el, nam) {
  el.classList ? el.classList.remove(nam) : el.className = el.className.replace(new RegExp('(^|\\b)' + nam.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

/* Events */
$('#toggle').addEventListener('click', theme);
$('#links').addEventListener('click', change_section);
$('#menu-icon').addEventListener('click', open);
$('#search-input').addEventListener('keyup', search_post);
doc.addEventListener('scroll', scroll);

var act_disqus = function act_disqus() {
  var dsq = doc.createElement('script');
  dsq.type = 'text/javascript';
  dsq.async = true;
  dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
  doc.getElementsByTagName('head')[0].appendChild(dsq);
};

var add_script = function add_script(script) {
  var vendor = doc.createElement('script');
  vendor.type = 'text/javascript';
  vendor.src = '/js/' + script + '.js';
  doc.getElementsByTagName('head')[0].appendChild(vendor);
};

var vendors = function vendors() {
  if (window.location.pathname.indexOf('tutorial') >= 0) add_script('prism');
  if ($('div.chart')) add_script('chart');
};

function scroll() {
  var scroll = $('html').scrollTop;
  if (!stop) {
    $('div.categories-list').style.marginTop = '0px';
    if (scroll > 45) {
      $('div.categories-list').style.marginTop = (scroll - 30).toString() + 'px';
      addclss($('div.categories-list'), 'scroll-fixed');
    }
  }
  showitem();
}

function search_post(e) {
  $('.header .site-title').innerHTML = 'BLOG';
  all('.categories .page-link').forEach(function (elem) {
    delclss(elem, 'select');
  });
  if ($('article') !== null) {
    $('article').style.display = 'none';
  }
  search = e.target.value;
  if (search === '') {
    section = 'all';
  } else if ($('article.post') !== null) {
    $('.return').style.display = 'block';
  }
  $('.post-list').innerHTML = '';
  load();
}

function change_section(e) {
  window.scrollTo(0, 0);
  search = '';
  [].forEach.call(all('.categories .page-link'), function (elem) {
    delclss(elem, 'select');
  });
  section = e.target.id;
  addclss($('#' + section), 'select');
  if (section === 'blog') {
    $('.post-list').styleheight = '0px';
    $('.post-list').innerHTML = '';
    $('article').style.display = 'block';
    $('#blog').style.display = 'none';
  } else {
    if ($('article') !== null) {
      $('article').style.display = 'none';
    }
    $('#search-input').value = '';

    $('.header .site-title').innerHTML = section.toUpperCase();
    if ($('article.post') !== null) {
      $('.return').style.display = 'block';
    }
    $('.post-list').innerHTML = '';
    load();
  }
}

function open() {
  $('.trigger').classList.toggle('open');
}

function theme() {
  $('html').classList.toggle('black');
  loc.getItem('theme') === 'black' ? loc.setItem('theme', 'white') : loc.setItem('theme', 'black');
}

function posts(v, i) {
  var post = doc.createElement('a');
  post.className = 'post';
  post.href = v.url;
  post.id = i.toString();
  $('.post-list').appendChild(post);
  var text = v.img.indexOf('giphy') ? 'src' : 'data-src';
  doc.getElementById(i.toString()).insertAdjacentHTML('beforeend', '<div class="wall_img"><img ' + text + '="' + v.img + '"></div><div class="info_post"><div class="post-title">' + v.title + '</div><div class="post-meta">' + v.date + '</div></div>');
}

function load() {
  var count = 0;
  fetch('/json/search.json').then(function (response) {
    return response.json().then(function (data) {
      return data.forEach(function (val, i) {
        if (search !== '') {
          if (val.title.toUpperCase().indexOf(search.toUpperCase()) > -1) {
            posts(val, i);
            count += 1;
          }
        } else if (section === 'all' || val.category === section) {
          posts(val, i);
        }
        if (i === data.length - 1) {
          if (search !== '') {
            $('.header .site-title').innerHTML = 'RESULTADOS: ' + count;
            $('.post-list').style.height = 'auto';
          }
          showitem();
        }
      });
    });
  });
}

doc.addEventListener('DOMContentLoaded', function () {
  vendors();
  loc.getItem('theme') === 'black' ? addclss($('html'), 'black') : delclss($('html'), 'black');
  if ($('.important') === null) {
    load();
  }
}, false);

function isscroll(elem, n) {
  var dim = elem.getBoundingClientRect();
  var w_height = window.innerHeight + n;
  return dim.top > 0 && w_height > dim.top;
}

function showitem() {
  var n = [].slice.call(all('.wall_img'));
  var n_2 = [].slice.call(all('.wall_overflow'));
  var total = n.concat(n_2);
  var disqus = $(".disqus");
  if (disqus != undefined && !comments) {
    if (isscroll(disqus, 720)) {
      comments = true;
      act_disqus();
    }
  }
  total.map(function (val, i) {
    var src = val.children[0].src;
    if (src !== undefined) {
      if (isscroll(val, -90)) {
        if (val.children[0].getAttribute("data-src")) val.children[0].src = val.children[0].getAttribute("data-src");
        if (src.indexOf('giphy_s.gif') >= 0) val.children[0].src = src.replace('giphy_s.gif', 'giphy.gif');
        if (src.indexOf('mqdefault') >= 0) {
          var id = val.children[0].id;
          val.children[0].src = '';
          val.innerHTML = '';
          var overflow = doc.createElement('div');
          overflow.className = 'wall_overflow';
          val.appendChild(overflow);
          val.children[0].outerHTML = '<iframe src="//www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>';
        }
      }
    }
  });
}

},{}]},{},[1]);
