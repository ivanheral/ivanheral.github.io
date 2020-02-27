const doc = document;
const find = m => import(`${m}.js`);

const load_posts = async _ => {
    const { $ } = await find('./jquery');
    if ($('article.post') !== null) {
        $('.return').style.display = 'block';
    }
    if ($('article') !== null) {
        $('article').style.display = 'none';
    }
    $('.post-list').innerHTML = '';
    load();
};

const posts = async (v, i) => {
    const { $ } = await find('./jquery');
    const post = Object.assign(doc.createElement('a'), {
        className: 'post elem',
        href: v.url,
        id: i.toString(),
    });
    $('.post-list').appendChild(post);
    var text = v.img.match(/(giphy|gfycat)/i) ? 'src' : 'data-src';
    doc.getElementById(i.toString()).insertAdjacentHTML(
        'beforeend',
        `<div class="wall_img"><img ${text}="${v.img}"></div><div class="info_post"><div class="post-title">${v.title}</div><div class="post-meta">${v.date}</div></div>`,
    );
};

const load = async _ => {
    const { search, section } = await find('../app');
    const { $ } = await find('./jquery');
    let response = await fetch('/json/search.json');
    let data = await response.json();

    var result = data
        .filter(e => {
            return (
                (search !== '' && e.title.toUpperCase().indexOf(search.toUpperCase()) > -1) ||
                (search === '' && section === 'all') ||
                (section !== 'all' && e.category === section)
            );
        })
        .map((elem, i) => {
            $('.post-list').style.height = 'auto';
            posts(elem, i);
        });

    if (result.length === 0) {
        $('.post-list').appendChild(
            Object.assign(doc.createElement('div'), {
                innerHTML: '<div style="min-height: 80vh;"></div>',
            }),
        );
    }
};

export { load_posts, posts, load };
