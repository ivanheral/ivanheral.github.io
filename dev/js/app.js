
'serviceWorker' in navigator && navigator.serviceWorker.register('sw.js');
/* Vars */
var section = 'all';
var search = '';
const add = 'addEventListener';

const find = mod => import(`./modules/${mod}.js`);
/* ready */
document[add](
    'DOMContentLoaded',
    async _ => {
        const { $, delallclss } = await find('jquery');
        const { load } = await find('load');
        $('#search')[add]('keyup', async e => {
            const { load_posts } = await find('load');
            search = e.target.value;
            section = 'all';
            delallclss('.link', 'select');
            load_posts();
        });
        $('#links')[add]('click', async _ => {
            const { change_section } = await find('section');
            section = await change_section(_, section);
        });
        document[add]('scroll', async _ => {
            const { scroll_tag } = await find('scroll');
            scroll_tag();
        });
        $('#modal')[add]('click', async e => {
            const { close_modal } = await find('modal');
            close_modal(e);
        });
        $('#modal')[add]('mouseover', async e => {
            const { animate_modal } = await find('modal');
            animate_modal(e);
        });
        window.location.pathname.match(/(tutorial)/i) && (await find('prism'));
        $('.important') === null && load();
    },
    false,
);

export { search, section };
