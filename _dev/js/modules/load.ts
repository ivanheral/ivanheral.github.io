const doc = document;
const find = (m: string) => import(`${m}.js`);

const load_posts = async (_: any) => {
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

const posts = async (v: { url: any; img: any; title: any; date: any }, i: { toString: () => string }, search: any) => {
    const { $ } = await find('./jquery');
    const post = Object.assign(doc.createElement('a'), {
        className: 'post elem',
        href: v.url,
        id: i.toString(),
    });
    v.title = v.title.replace(search, `<span>${search}</span>`);
    console.log(search);
    $('.post-list').appendChild(post);
    doc.getElementById(i.toString()).insertAdjacentHTML(
        'beforeend',
        `<div class="wall_img"><img data-src="${v.img}"></div>` +
            `<div class="info_post"><div class="post-title">${v.title}</div>` +
            `<div class="post-meta">${v.date}</div></div>`,
    );
};

const load = async () => {
    const { search, section } = await find('../app');
    let response = await fetch('/json/search.json');
    let data = await response.json();
    data.filter((e: { title: string; category: any }) => {
        return (
            (search !== '' && e.title.toUpperCase().indexOf(search.toUpperCase()) > -1) ||
            (search === '' && section === 'all') ||
            (section !== 'all' && e.category === section)
        );
    }).map((elem: { url: any; img: any; title: any; date: any }, i: { toString: () => string }) => {
        posts(elem, i, search);
    });
};

export { load_posts, posts, load };
