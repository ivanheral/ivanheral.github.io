/* Vars */
let section = 'all'
let search = ''
const stop = false
let comments = false
const doc = document
let top, left, width, height

/* jQuery */
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

/* vendors */
const act_disqus = () => {
    const dsq = doc.createElement('script');
    dsq.type = 'text/javascript';
    dsq.async = true;
    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    doc.getElementsByTagName('head')[0].appendChild(dsq)
}

const add_script = (script) => {
    const vendor = doc.createElement('script')
    vendor.type = 'text/javascript'
    vendor.src = '/js/' + script + '.js'
    doc.getElementsByTagName('head')[0].appendChild(vendor)
}


/* search posts */
$('#search').addEventListener('keyup', search_post)

function search_post(e) {

    search = e.target.value;
    if (search === '') {
        section = 'all'
    }
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
        addclss($('#' + section), 'select')
        $('.site-title').innerHTML = section.toUpperCase()
        load_posts()
    }
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
    const post = doc.createElement('a')
    post.className = 'post elem'
    post.href = v.url
    post.id = i.toString()
    $('.post-list').appendChild(post)
    var text = (v.img.indexOf('giphy') > 0) ? 'src' : 'data-src'
    doc.getElementById(i.toString()).insertAdjacentHTML('beforeend', '<div class="wall_img"><img ' + text + '="' + v.img + '"></div><div class="info_post"><div class="post-title">' +
        v.title + '</div><div class="post-meta">' + v.date + '</div></div>')
}

function load() {
    let count = 0;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            data.forEach((val, i) => {
                if (search !== '') {
                    if (val.title.toUpperCase().indexOf(search.toUpperCase()) > -1) {
                        posts(val, i);
                        count += 1
                    }
                } else if ((section === 'all') || (val.category === section)) {
                    posts(val, i)
                }
                if (i === data.length - 1) {
                    if (search !== '') {
                        $('.site-title').innerHTML = count + ' posts'
                        $('.post-list').style.height = 'auto'
                        if (count == 0) {
                            const post = doc.createElement('div')
                            post.className = 'square'
                            post.innerHTML = "<div class='table'></div>"
                            $('.post-list').appendChild(post)
                        }
                    }
                    showitem()
                }
            })
        }
    }
    xhttp.open("GET", '/json/search.json', true);
    xhttp.send();
}

/* ready */
doc.addEventListener('DOMContentLoaded', () => {
    $('#modal').addEventListener('click', close_modal)
    $('#modal').addEventListener('mouseover', animate_modal)

    if (window.location.pathname.indexOf('tutorial') >= 0)
        add_script('prism')
    if ($('.chart')) add_script('chart')
    if ($('.important') === null) {
        load()
    }
}, false)


/* lazy-load */
doc.addEventListener('scroll', scroll)

function scroll() {
    const scroll = $('html').scrollTop
    if (!stop) {
        $('.tags').style.marginTop = '0px'
        if (scroll > 45) {
            $('.tags').style.marginTop = (scroll - 10).toString() + 'px'
            addclss($('.tags'), 'fixed')
        }
    }
    showitem()
}

function isscroll(elem, n) {
    const dim = elem.getBoundingClientRect()
    const w_height = window.innerHeight + n
    return ((dim.top > 0) && (w_height > dim.top))
}

function animate_modal(e) {
    if ($('#modal img').className.indexOf('animate') < 0) {
        $('#modal img').style = "";
        addclss($('#modal img'), 'animate');
    }
}

function close_modal(e) {
    var t1 = $(".modal").getBoundingClientRect()
    var t2 = $('#modal img').getBoundingClientRect()
    top = t1.top - t2.top - 15 - (e.target.height - height) / 2
    left = t1.left - t2.left - 15 - (e.target.width - width) / 2
    $('#modal img').style.transform = "translateX(" + left + "px) translateY(" + top + "px)"
    $('#modal img').style.width = width + "px"
    delclss($('.modal'), 'modal')
    delclss($('.fade'), 'show')
    setTimeout(function () {
        $('#modal').innerHTML = ''
        $('.fade-modal').style.display = "none"
    }, 1000)
}

function modal(e) {
    if (e.target.width !== 330) {
        e.target.className = "modal"
        width = e.target.width
        height = e.target.height
        $('.fade-modal').style.display = "table"
        addclss($('.fade'), 'show')
        $('#modal').insertAdjacentHTML('beforeend', '<img style="width:' + e.target.width + 'px;" src="' + e.target.src + '">')
        var t1 = e.target.getBoundingClientRect()
        var t2 = $('#modal img').getBoundingClientRect()
        top = t1.top - t2.top - 15
        left = t1.left - t2.left - 15
        $('#modal img').style.transform = "translateY(" + top + "px) translateX(" + left + "px)"
    }
}

function showitem() {
    let total = [].slice.call(all('.elem > div'))
    let disqus = $(".disqus")
    if (disqus != undefined && !comments && isscroll(disqus, 720)) {
        comments = true;
        act_disqus()
    }
    total.map((val, i) => {
        var src = val.children[0].src;

        if (src !== undefined) {
            if (isscroll(val, -90)) {
                if (val.children[0].getAttribute("src") && val.className == "") {
                    val.addEventListener('click', modal)
                }
                if (val.children[0].getAttribute("data-src")) {
                    val.children[0].src = val.children[0].getAttribute("data-src")
                }
                if (src.indexOf('giphy_s.gif') >= 0 && val.className == "wall_overflow gif") {
                    val.addEventListener('click', modal)
                }
                if (src.indexOf('giphy_s.gif') >= 0) {
                    val.children[0].src = src.replace('_s.gif', '.gif')
                }
                if (src.indexOf('mqdefault') >= 0) {
                    val.children[0].src = ''
                    val.insertAdjacentHTML('beforeend', '<iframe src="//www.youtube.com/embed/' +
                        val.children[0].id + '" frameborder="0" allowfullscreen></iframe>')
                }
            }
        }
    })
}