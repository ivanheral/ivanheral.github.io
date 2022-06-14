let width: any, top: number, left: number;
let scroll = 0;
const find = (m: string) => import(`${m}.js`);

const animate_modal = async (_e: any) => {
    const { $, addclss } = await find('./jquery');
    if (!$('#modal img').className.match(/(animate)/i)) {
        $('#modal img').style = '';
        addclss($('#modal img'), 'animate');
    }
};

const close_modal = async (_e: any) => {
    const { $, delclss } = await find('./jquery');
    top -= Math.abs(scroll - window.scrollY);
    $('#modal img').style.transform = `translateY(${top}px) translateX(${left}px)`;
    $('#modal img').style.width = `${width}px`;
    // hide modal
    delclss($('.modal'), 'modal');
    delclss($('.fade'), 'show');
    setTimeout(function () {
        $('#modal').innerHTML = '';
        $('.fade-modal').style.display = 'none';
    }, 1000);
};

const modal = async (e: {
    target: { className: string; width: any; src: string; getBoundingClientRect: () => any };
}) => {
    const { $, addclss } = await find('./jquery');
    if (!(typeof window.orientation !== 'undefined') || navigator.userAgent.indexOf('IEMobile') !== -1) {
        e.target.className = 'modal';
        width = e.target.width;
        scroll = window.scrollY;
        // show modal
        $('.fade-modal').style.display = 'table';
        addclss($('.fade'), 'show');
        $('#modal').insertAdjacentHTML('beforeend', `<img style="width:${e.target.width}px;" src="${e.target.src}">`);
        // calculate position
        const t1 = e.target.getBoundingClientRect();
        const t2 = $('#modal img').getBoundingClientRect();
        top = t1.top - t2.top;
        left = t1.left - t2.left;
        // animate modal
        $('#modal img').style.transform = `translateY(${top}px) translateX(${left}px)`;
    } else window.open(e.target.src, '_blank');
};

export { animate_modal, close_modal, modal };
