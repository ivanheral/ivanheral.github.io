if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
/* Vars */
const doc = document;
var section = 'all';
var search = '';

const find = mod => import(`${mod}.js`);
/* ready */
doc.addEventListener(
    'DOMContentLoaded',
    async _ => {
        const { $, delallclss } = await find('./modules/jquery');
        const { load } = await find('./modules/load');
        $('#search').addEventListener('keyup', async e => {
            const { load_posts } = await find('./modules/load');
            search = e.target.value;
            section = 'all';
            $('.site-title').innerHTML = 'BLOG';
            delallclss('.categories .link', 'select');
            load_posts();
        });
        $('#links').addEventListener('click', async _ => {
            const { change_section } = await find('./modules/section');
            section = await change_section(_, section);
        });
        doc.addEventListener('scroll', async _ => {
            const { scroll_tag } = await find('./modules/scroll');
            scroll_tag();
        });
        $('#modal').addEventListener('click', async e => {
            const { close_modal } = await find('./modules/modal');
            close_modal(e);
        });
        $('#modal').addEventListener('mouseover', async e => {
            const { animate_modal } = await find('./modules/modal');
            animate_modal(e);
        });
        window.location.pathname.match(/(tutorial)/i) && (await find('./modules/prism'));
        $('.important') === null && load();
    },
    false,
);

export { search, section };
