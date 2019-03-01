/* jshint -W033 */
/* Vars */
var section = 'all'
var search = ''
const doc = document

/* jQuery */
var $ = v => doc.querySelector(v)
var all = v => doc.querySelectorAll(v)

var addclss = (el, nam) => 
	el.classList ? el.classList.add(nam) :
	el.className += ' ' + nam;

var delclss = (el, nam) => 
	el.classList ? el.classList.remove(nam) :
	el.className = el.className.replace(new RegExp(`(^|\\b)${nam.split(' ').join('|')}(\\b|$)`, 'gi'), ' ');

/* vendors */
var add_script = script => {
	const vendor = Object.assign(doc.createElement('script'),{type: 'text/javascript', src: 
	script.indexOf('https') > -1 ? script : `/js/${script}.js`
	})
	doc.getElementsByTagName('head')[0].appendChild(vendor)
}

/* search posts */
$('#search').addEventListener('keyup', search_post)

function search_post(e) {
    search = e.target.value;
    section = search === '' && 'all'
	load_posts()
}

/* change section */
$('#links').addEventListener('click', change_section)

function change_section(e) {
	window.scrollTo(0, 0)
	search = '';
	[].forEach.call(all('.categories .link'), elem => {
		delclss(elem, 'select')
	})
	section = e.target.id;
	if (section === 'blog') {
		$('.post-list').innerHTML = ''
		$('article').style.display = 'block'
		$('#blog').style.display = 'none'
	} else {
		addclss($(`#${section}`), 'select')
		load_posts()
	}
	$('.site-title').innerHTML = section.toUpperCase()
}

/* load posts */
function load_posts() {
    if ($('article.post') !== null) {
        $('.return').style.display = 'block'
    }
    if ($('article') !== null) {
        $('article').style.display = 'none'
    }
	$('.post-list').innerHTML = ''
	load()
}

function posts(v, i) {
	const post = Object.assign(doc.createElement('a'),{className: 'post elem', href: v.url, id: i.toString()})
	$('.post-list').appendChild(post)
	var text = (v.img.indexOf('giphy') > 0) ? 'src' : 'data-src'
	doc.getElementById(i.toString()).insertAdjacentHTML('beforeend',
		`<div class="wall_img"><img ${text}="${v.img}"></div><div class="info_post"><div class="post-title">${v.title}</div><div class="post-meta">${v.date}</div></div>`)
}

function load() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {

            if (search !== "") {	
				var result = JSON.parse(this.responseText).filter(function(elem) {
					return elem.title.toUpperCase().indexOf(search.toUpperCase()) > -1
				})	 	
	
				result.forEach(function (elem, i) {
					posts(elem, i)
				}) 

				if (result.length > 0) {
					$('.site-title').innerHTML = result.length + ' posts'
					$('.post-list').style.height = 'auto'
				} else {
					const post = doc.createElement('div')
					post.innerHTML = "<div style='min-height: 80vh;'></div>"
					$('.post-list').appendChild(post)
				}
			} else {	
				JSON.parse(this.responseText).forEach(function (elem, i) {
					 if (section === 'all' || elem.category === section) posts(elem, i)
				}) 
			} 			
			showitem()			
		}
	}
	xhttp.open("GET", '/json/search.json', true);
	xhttp.send();
}

/* ready */
doc.addEventListener('DOMContentLoaded', () => {
	$('#modal').addEventListener('click', close_modal)
	$('#modal').addEventListener('mouseover', animate_modal)
	window.location.pathname.indexOf('tutorial') >= 0 && add_script('prism')
	$('.chart') && add_script('chart')		
	$('.important') === null && load()
}, false)


/* lazy-load */
doc.addEventListener('scroll', scroll)

function scroll() {
	let scroll = $('html').scrollTop
	$('.tags').style.marginTop = '0px'
	$('.tags').style.marginTop = scroll > 45 && scroll.toString() + 'px';
	scroll > 45 && addclss($('.tags'), 'fixed')
	showitem()
}

var isscroll = (elem, n) => window.innerHeight + n > elem.getBoundingClientRect().top > 0

function showitem() {
    let total = [].slice.call(all('.elem > div:first-child:not(.tested)'))

    total.map((val, i) => {
		try {
			var src = val.children[0].src;
		} catch (error) {
			val.className == 'disqus' && add_script(`https://${disqus_shortname}.disqus.com/embed.js`);
		}
            if (isscroll(val, -90)) {
				val.className == 'chart' && add_script('chart');

				if (src !== undefined) {
                if (val.children[0].getAttribute("src") && val.className == "") {
                    val.addEventListener('click', modal)
                }
                if (val.children[0].getAttribute("data-src")) {
                    val.children[0].src = val.children[0].getAttribute("data-src")
                }
                if (src.indexOf('giphy_s.gif') >= 0) {
					val.children[0].src = src.replace('_s.gif', '.gif')
					if (val.className == "wall_overflow gif") val.addEventListener('click', modal) 
                }
                if (src.indexOf('mqdefault') >= 0) {
                    val.children[0].src = ''
                    val.insertAdjacentHTML('beforeend', '<iframe src="//www.youtube.com/embed/' +
                        val.children[0].id + '" frameborder="0" allowfullscreen></iframe>')
				}				
			}
			addclss(val, 'tested')
		}
    })
}

/* Modal */
var animate_modal = (e) => {
	if ($('#modal img').className.indexOf('animate') < 0) {
		$('#modal img').style = "";
		addclss($('#modal img'), 'animate');
	}
}

var top, left, width, height, scroll = 0;

var close_modal = (e) => {
	// animate modal
	top -= Math.abs(scroll - window.scrollY)
	$('#modal img').style.transform = `translateY(${top}px) translateX(${left}px)`
	$('#modal img').style.width = `${width}px`
	// hide modal
	delclss($('.modal'), 'modal')
	delclss($('.fade'), 'show')
	setTimeout(function () {
		$('#modal').innerHTML = ''
		$('.fade-modal').style.display = "none"
	}, 1000)
}

var modal = (e) => {
	if (!(typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)) {
		e.target.className = "modal"
		width = e.target.width
		height = e.target.height
		scroll = window.scrollY;
		// show modal
		$('.fade-modal').style.display = "table"
		addclss($('.fade'), 'show')
		$('#modal').insertAdjacentHTML('beforeend', `<img style="width:${e.target.width}px;" src="${e.target.src}">`)
		// calculate position
		var t1 = e.target.getBoundingClientRect()
		var t2 = $('#modal img').getBoundingClientRect()
		top = t1.top - t2.top
		left = t1.left - t2.left
		// animate modal
		$('#modal img').style.transform = `translateY(${top}px) translateX(${left}px)`
	} else
		window.open(e.target.src, '_blank')
}

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js');
}