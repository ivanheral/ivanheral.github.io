const doc=document,find=t=>import(`${t}.js`),load_posts=async t=>{const{$:s}=await find("./jquery");null!==s("article.post")&&(s(".return").style.display="block"),null!==s("article")&&(s("article").style.display="none"),s(".post-list").innerHTML="",load()},posts=async(t,s)=>{const{$:e}=await find("./jquery"),i=Object.assign(doc.createElement("a"),{className:"post elem",href:t.url,id:s.toString()});e(".post-list").appendChild(i);var a=t.img.match(/(giphy|gfycat)/i)?"src":"data-src";doc.getElementById(s.toString()).insertAdjacentHTML("beforeend",`<div class="wall_img"><img ${a}="${t.img}"></div><div class="info_post"><div class="post-title">${t.title}</div><div class="post-meta">${t.date}</div></div>`)},load=async t=>{const{search:s,section:e}=await find("../app"),{$:i}=await find("./jquery");let a=await fetch("/json/search.json");0===(await a.json()).filter(t=>""!==s&&t.title.toUpperCase().indexOf(s.toUpperCase())>-1||""===s&&"all"===e||"all"!==e&&t.category===e).map((t,s)=>{i(".post-list").style.height="auto",posts(t,s)}).length&&i(".post-list").appendChild(Object.assign(doc.createElement("div"),{innerHTML:'<div style="min-height: 80vh;"></div>'}))};export{load_posts,posts,load};