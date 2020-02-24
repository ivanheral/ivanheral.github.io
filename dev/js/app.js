if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(_ => {
        console.log('Service Worker Registered');
    });
}
/* Vars */
const doc = document;
var section = 'all';
var search = '';

try {
    const find = mod => import(`${mod}.js`);
    /* ready */
    doc.addEventListener(
        'DOMContentLoaded',
        async _ => {
            const { $ } = await find('./modules/jquery');
            const { load } = await find('./modules/load');
            $('#search').addEventListener('keyup', async e => {
                const { load_posts } = await find('./modules/load');
                search = e.target.value;
                section = search === '' && 'all';
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
            if (window.location.pathname.match(/(tutorial)/i)) {
                await find('./modules/prism');
            }
            $('.important') === null && load();
        },
        false,
    );
} catch (error) {
    window.location.replace('https://bestvpn.org/outdatedbrowser/es');
}

export { search, section };
