const scroll = 0;
const find = (m) => import(`${m}.js`);
const scroll_tag = async (_) => {
    const { $, addclss } = await find('./jquery');
    const scroll = $('html').scrollTop;
    $('.tags').style.marginTop = '0px';
    $('.tags').style.marginTop = scroll > 45 && `${scroll.toString()}px`;
    scroll > 45 && addclss($('.tags'), 'fixed');
    await showitem();
};

const isscroll = (
    e: {
        children?: any;
        className?: any;
        addEventListener?: any;
        insertAdjacentHTML?: any;
        getBoundingClientRect?: () => { (): any; new (): any; top: number };
    },
    n: number,
) => window.innerHeight + n > e.getBoundingClientRect().top && e.getBoundingClientRect().top > 0;

const showitem = async () => {
    const { all, addclss, $ } = await find('./jquery');
    const { add_tag } = await find('./script');
    const total = [].slice.call(all('.elem > div:first-child:not(.tested)'));
    total.map(
        async (val: {
            children?: any;
            className?: any;
            addEventListener?: any;
            insertAdjacentHTML?: any;
            getBoundingClientRect?: () => { (): any; new (): any; top: number };
        }) => {
            try {
                var src = val.children[0].src;
            } catch (_) {}
            if (isscroll(val, 120)) {
                if (val.className == 'chart') {
                    //load chart
                    if ($('#dashboard_div') !== null) {
                        const { Chart } = await find('./chart');
                        const { data } = await find('./conf_chart');
                        new Chart('#dashboard_div', {
                            data: data,
                            type: 'bar',
                            height: 320,
                            colors: ['red'],
                        });
                    }
                }

                val.className == 'disqus' && add_tag('script', `https://${disqus_shortname}.disqus.com/embed.js`);

                if (src !== undefined) {
                    let new_src = '';
                    if (val.children[0].getAttribute('data-src')) {
                        new_src = val.children[0].getAttribute('data-src');
                    }
                    val.children[0].src = new_src;
                    if (new_src.match(/(giphy|gfycat|coub)/i)) {
                        val.children[0].src = new_src
                            .replace('_s.gif', '.gif')
                            .replace('-mobile.jpg', '-size_restricted.gif')
                            .replace('[block]', '');
                    }
                    if (val.className.match(/(wall_overflow gif)/i)) {
                        val.addEventListener('click', async (e: any) => {
                            const { modal } = await find('./modal');
                            modal(e);
                        });
                    }

                    if (new_src.match(/(mqdefault)/i)) {
                        val.insertAdjacentHTML(
                            'beforeend',
                            `<iframe src="//www.youtube.com/embed/${val.children[0].id}" frameborder="0"></iframe>`,
                        );
                    }
                }
                addclss(val, 'tested');
            }
        },
    );
};

export { scroll, scroll_tag, isscroll, showitem };
