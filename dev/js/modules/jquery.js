const $ = v => document.querySelector(v);
const all = v => document.querySelectorAll(v);
const addclss = (el, nam) => el.classList.add(nam);
const delclss = (el, nam) => el.classList.remove(nam);
const delallclss = (el, nam) =>
    [].map.call(all(el), elem => {
        delclss(elem, nam);
    });
export { $, all, addclss, delclss, delallclss };
