let section = "all"
let search = ""
let stop = false
let comments = false
let doc = document

let $ = (v) => {
  return doc.querySelector(v)
}

let All = (v) => {
  return doc.querySelectorAll(v)
}

function addclss(el, nam) {
  el.classList ? el.classList.add(nam) 
  : el.className += ' ' + nam
}

function delclss(el, nam) {
  el.classList ? el.classList.remove(nam) 
  : el.className = el.className.replace(new RegExp('(^|\\b)' + nam.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
}

$("#toggle").addEventListener("click", theme)
$("#test").addEventListener("click", change_section)
$("#menu-icon").addEventListener("click", open)
$("#return_post").addEventListener("click", return_post)
$("#search-input").addEventListener("keyup", search_post)
doc.addEventListener("scroll", scroll)

let act_disqus = () => {
    let dsq = doc.createElement('script'); 
    dsq.type = 'text/javascript'; 
    dsq.async = true;
    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    doc.getElementsByTagName('head')[0].appendChild(dsq)
}

let vendors = () => {
  if (window.location.pathname.indexOf('tutorial') >= 0) {
    let vendor = doc.createElement('script')
    vendor.type = 'text/javascript'
    vendor.src = '/js/prism.js'
    doc.getElementsByTagName('head')[0].appendChild(vendor)
  }
}

function scroll() {
  let scroll = $("html").scrollTop
  if (!stop) {
    $("div.categories-list").style.marginTop = "0px"
    if (scroll > 45) {
      $("div.categories-list").style.marginTop =  (scroll - 30).toString() + "px"
      addclss($("div.categories-list"),"scroll-fixed")
    }
  }
  showitem()
}

function search_post(e) {
  $(".header .site-title").innerHTML = 'BLOG'
  All('.categories .page-link').forEach(function(elem) {
    delclss(elem,'select')      
  }) 
  if ($("article") !== null) $("article").style.display = 'none'
  search = e.target.value;
  if (search != "") {
    if ($("article.post") !== null) $(".return").style.display = 'block'
  } else section = "all"
  $(".post-list").innerHTML = ''
  load()
}

function change_section(e) {
  window.scrollTo(0, 0)
  search = "";
  [].forEach.call(All('.categories .page-link'), function(elem){
    delclss(elem,'select')
  })
  section = e.originalTarget.id;
  addclss($('#'+section),'select')
  if ($("article") !== null) $("article").style.display = 'none'
  $("#search-input").value = ''

  $(".header .site-title").innerHTML = section.toUpperCase()
  if ($("article.post") !== null) $(".return").style.display = 'block'
  $(".post-list").innerHTML = '';
  load()
}

function open() {
  $('.trigger').classList.toggle('open')
}

function theme() {
  $('html').classList.toggle('black')
  localStorage.getItem("theme") == "black" ? localStorage.setItem("theme", "white") : localStorage.setItem("theme", "black")
}

function return_post() {
  window.scrollTo(0, 0)
  $(".header .site-title").innerHTML = 'BLOG'
  $(".post-list").styleheight = '0px'
  $(".post-list").innerHTML = ''
  $("article").style.display = 'block'
  $('#return_post').style.display = 'none';
  [].forEach.call(All('.categories .page-link'), function(el){
    delclss(el,'select')
  })
}

function posts(v,i) {
  var elem = "";
  v.img != "" ? elem = "<div class='wall_img'><img src='" + v.img + "'></div>" : elem = "<div class='wall_img'>" + v.svg + "</div>"
          var post = doc.createElement('a')
          post.className = 'post'
          post.href = v.url
          post.id = i.toString()
          $(".post-list").appendChild(post)
          doc.getElementById(i.toString()).insertAdjacentHTML('beforeend','<div class="wall_img"><img src="'+v.img
          +'"></div><div class="info_post"><div class="post-title">'+v.title+'</div><div class="post-meta">'+v.date+'</div></div>')         
}

function load() {
 let count = 0;
 fetch("/json/search.json").then(response =>
    response.json().then(data =>       
      data.forEach((val, i) => {
      if (search != "") {
        if (val.title.toUpperCase().indexOf(search.toUpperCase()) > -1) {
          posts(val,i);
          count += 1
        }
      } else if ((section == "all") || (val.category == section)) { 
          posts(val,i)
      }
      if ((i == data.length - 1) && (search != "")) {
          $('.header .site-title').innerHTML = 'RESULTADOS: ' + count
          $(".post-list").style.height = 'auto'
      }
 })))
}

doc.addEventListener('DOMContentLoaded', () => { 
  vendors()
  localStorage.getItem("theme") == "black" ? addclss($("html"), "black") 
  : delclss($("html"), "black")
  if ($(".important") === null) load()
}, false)

function isscroll(elem, n) {
  let dim = elem.getBoundingClientRect()
  let w_height = window.innerHeight + n
  return ((dim.top > 0) && (w_height > dim.top))
}

function showitem() {
  let n = [].slice.call(All(".wall_img"))
  let n_2 = [].slice.call(All(".wall_overflow"))
  let total = n.concat(n_2)
  let disqus = $(".disqus")
  if (disqus != undefined && !comments) {
    if (isscroll(disqus, 720)) {
    comments = true;
    act_disqus()        
  }}
  total.map((val, i) => {
    var src = val.children[0].currentSrc; 
      if (src !== undefined) {    
        if (isscroll(val, -90)) {
        if (src.indexOf("giphy_s.gif") >= 0) 
          val.children[0].src = src.replace("giphy_s.gif", "giphy.gif")  
        if (src.indexOf("mqdefault") >= 0) {
          val.children[0].src = ""
          val.innerHTML = ''
          var overflow = doc.createElement('div')
          overflow.className = 'wall_overflow'
          val.appendChild(overflow)
          val.children[0].outerHTML = '<iframe src="//www.youtube.com/embed/' +
          val.children[0].id + '" frameborder="0" allowfullscreen></iframe>'
        }      
    }
    }  
  })
}