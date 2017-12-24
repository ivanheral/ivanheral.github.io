let section = 'all'
let search = ''
const stop = false
let comments = false
const doc = document
const loc = localStorage

const $ = v => {
  return doc.querySelector(v)
}

const all = v => {
  return doc.querySelectorAll(v)
}

function addclss(el, nam) {
  el.classList ? el.classList.add(nam) :
  el.className += ' ' + nam
}

function delclss(el, nam) {
  el.classList ? el.classList.remove(nam) :
  el.className = el.className.replace(new RegExp('(^|\\b)' + nam.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
}

$('#toggle').addEventListener('click', theme)
$('#test').addEventListener('click', change_section)
$('#menu-icon').addEventListener('click', open)
$('#search-input').addEventListener('keyup', search_post)
doc.addEventListener('scroll', scroll)

const act_disqus = () => {
    const dsq = doc.createElement('script');
    dsq.type = 'text/javascript';
    dsq.async = true;
    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    doc.getElementsByTagName('head')[0].appendChild(dsq)
}

const vendors = () => {
  if (window.location.pathname.indexOf('tutorial') >= 0) {
    const vendor = doc.createElement('script')
    vendor.type = 'text/javascript'
    vendor.src = '/js/prism.js'
    doc.getElementsByTagName('head')[0].appendChild(vendor)
  }
}

function scroll() {
  const scroll = $('html').scrollTop
  if (!stop) {
    $('div.categories-list').style.marginTop = '0px'
    if (scroll > 45) {
      $('div.categories-list').style.marginTop = (scroll - 30).toString() + 'px'
      addclss($('div.categories-list'), 'scroll-fixed')
    }
  }
  showitem()
}

function search_post(e) {
  $('.header .site-title').innerHTML = 'BLOG'
  all('.categories .page-link').forEach(elem => {
    delclss(elem, 'select')      
  }) 
  if ($('article') !== null) {
    $('article').style.display = 'none'
  }
  search = e.target.value;
  if (search === '') {
    section = 'all'
  } else if ($('article.post') !== null) {
      $('.return').style.display = 'block'
  }
  $('.post-list').innerHTML = ''
  load()
}

function change_section(e) {
  window.scrollTo(0, 0)
  search = '';
  [].forEach.call(all('.categories .page-link'), elem => {
    delclss(elem, 'select')
  })
  section = e.target.id;
  addclss($('#' + section), 'select')
  if (section === 'blog') {
        $('.post-list').styleheight = '0px'
        $('.post-list').innerHTML = ''
        $('article').style.display = 'block'
        $('#blog').style.display = 'none';
  } else {
    if ($('article') !== null) {
      $('article').style.display = 'none'
    }
    $('#search-input').value = ''

    $('.header .site-title').innerHTML = section.toUpperCase()
    if ($('article.post') !== null) {
      $('.return').style.display = 'block'
    }
    $('.post-list').innerHTML = '';
    load()
  } 
}

function open() {
  $('.trigger').classList.toggle('open')
}

function theme() {
  $('html').classList.toggle('black')
  loc.getItem('theme') === 'black' ? loc.setItem('theme', 'white') : 
  loc.setItem('theme', 'black')
}

function posts(v, i) {
          const post = doc.createElement('a')
          post.className = 'post'
          post.href = v.url
          post.id = i.toString()
          $('.post-list').appendChild(post)
          doc.getElementById(i.toString()).insertAdjacentHTML('beforeend', '<div class="wall_img"><img src="' + v.img + '"></div><div class="info_post"><div class="post-title">' + 
          v.title + '</div><div class="post-meta">' + v.date + '</div></div>')         
}

function load() {
 let count = 0;
 fetch('/json/search.json').then(response =>
    response.json().then(data =>       
      data.forEach((val, i) => {
      if (search !== '') {
        if (val.title.toUpperCase().indexOf(search.toUpperCase()) > -1) {
          posts(val, i);
          count += 1
        }
      } else if ((section === 'all') || (val.category === section)) { 
          posts(val, i)
      }
      if ((i === data.length - 1) && (search !== '')) {
          $('.header .site-title').innerHTML = 'RESULTADOS: ' + count
          $('.post-list').style.height = 'auto'
      }
 })))
}

doc.addEventListener('DOMContentLoaded', () => { 
  vendors()
  loc.getItem('theme') === 'black' ? addclss($('html'), 'black') :
  delclss($('html'), 'black')
  if ($('.important') === null) {
    load()
  }
}, false)

function isscroll(elem, n) {
  const dim = elem.getBoundingClientRect()
  const w_height = window.innerHeight + n
  return ((dim.top > 0) && (w_height > dim.top))
}

function showitem() {
  const n = [].slice.call(all('.wall_img'))
  const n_2 = [].slice.call(all('.wall_overflow'))
  let total = n.concat(n_2)
  let disqus = $(".disqus")
  if (disqus != undefined && !comments) {
    if (isscroll(disqus, 720)) {
    comments = true;
    act_disqus()        
  }}
  total.map((val, i) => {
    var src = val.children[0].src; 
      if (src !== undefined) {    
        if (isscroll(val, -90)) {
        if (src.indexOf('giphy_s.gif') >= 0) 
          val.children[0].src = src.replace('giphy_s.gif', 'giphy.gif')  
        if (src.indexOf('mqdefault') >= 0) {
          var id = val.children[0].id
          val.children[0].src = ''
          val.innerHTML = ''
          var overflow = doc.createElement('div')
          overflow.className = 'wall_overflow'
          val.appendChild(overflow)          
          val.children[0].outerHTML = '<iframe src="//www.youtube.com/embed/' +
          id + '" frameborder="0" allowfullscreen></iframe>'
        }      
    }
    }  
  })
}
