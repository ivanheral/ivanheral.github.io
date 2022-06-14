'serviceWorker' in navigator && navigator.serviceWorker.register('sw.js');
/* Vars */
let section = 'all';
let search = '';
const add = 'addEventListener';

const find = (mod: string) => import(`./modules/${mod}.js`);
/* ready */
document[add](
    'DOMContentLoaded',
    async (_) => {
        const { $, delallclss } = await find('jquery');
        const { load } = await find('load');
        $('#search')[add]('keyup', async (e: { target: { value: string } }) => {
            const { load_posts } = await find('load');
            search = e.target.value;
            section = 'all';
            delallclss('.link', 'select');
            load_posts();
        });
        $('#links')[add]('click', async (_: any) => {
            const { change_section } = await find('section');
            section = await change_section(_, section);
        });
        document[add]('scroll', async (_) => {
            const { scroll_tag } = await find('scroll');
            scroll_tag();
        });
        $('#modal')[add]('click', async (e: any) => {
            const { close_modal } = await find('modal');
            close_modal(e);
        });
        $('#modal')[add]('mouseover', async (e: any) => {
            const { animate_modal } = await find('modal');
            animate_modal(e);
        });
        window.location.pathname.match(/(tutorial)/i) && (await find('prism'));
        // warning
        $('.important') === null && load();
    },
    false,
);

export { search, section };
