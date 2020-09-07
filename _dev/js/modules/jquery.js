const c = 'classList';
const q = 'querySelector';
const $ = v => document[q](v);
const all = v => document[`${q}All`](v);
const addclss = (el, nam) => el[c].add(nam);
const delclss = (el, nam) => el[c].remove(nam);
const delallclss = (el, nam) =>
    [].map.call(all(el), e => {
        delclss(e, nam);
    });
export { $, all, addclss, delclss, delallclss };
