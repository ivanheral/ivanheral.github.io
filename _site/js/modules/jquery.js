const $=l=>document.querySelector(l),all=l=>document.querySelectorAll(l),addclss=(l,s)=>l.classList.add(s),delclss=(l,s)=>l.classList.remove(s),delallclss=(l,s)=>[].map.call(all(l),l=>{delclss(l,s)});export{$,all,addclss,delclss,delallclss};