const c = 'classList';
const q = 'querySelector';
const $ = (v: any) => document[q](v);
const all = (v: any) => document[`${q}All`](v);
const addclss = (el: { [x: string]: { add: (arg0: any) => any } }, nam: any) => el[c].add(nam);
const delclss = (el: { [x: string]: { remove: (arg0: any) => any } }, nam: any) => el[c].remove(nam);
const delallclss = (el: any, nam: any) =>
    [].map.call(all(el), (e: { [x: string]: { remove: (arg0: any) => any } }) => {
        delclss(e, nam);
    });
export { $, all, addclss, delclss, delallclss };
