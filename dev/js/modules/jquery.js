const doc = document;
const $ = v => doc.querySelector(v);
const all = v => doc.querySelectorAll(v);
const addclss = (el, nam) => el.classList.add(nam);
const delclss = (el, nam) => el.classList.remove(nam);
export { $, all, addclss, delclss };
