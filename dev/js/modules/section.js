const find = m => import(`${m}.js`);
const change_section = async e => {
    const { $, addclss, delallclss } = await find('./jquery');
    const { load_posts } = await find('./load');
    window.scrollTo(0, 0);
    delallclss('.categories .link', 'select');
    if (e.target.id === 'blog') {
        $('.post-list').innerHTML = '';
        $('article').style.display = 'block';
        $('#blog').style.display = 'none';
    } else {
        addclss($(`#${e.target.id}`), 'select');
        load_posts();
    }
    $('.site-title').innerHTML = e.target.id.toUpperCase();
    return e.target.id;
};

export { change_section };
