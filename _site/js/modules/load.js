const l=document,i=e=>import(`${e}.js`),y=async e=>{const{$:t}=await i("./jquery");t("article.post")!==null&&(t(".return").style.display="block"),t("article")!==null&&(t("article").style.display="none"),t(".post-list").innerHTML="",c()},o=async(e,t)=>{const{$:s}=await i("./jquery"),n=Object.assign(l.createElement("a"),{className:"post elem",href:e.url,id:t.toString()});s(".post-list").appendChild(n),l.getElementById(t.toString()).insertAdjacentHTML("beforeend",`<div class="wall_img"><img data-src="${e.img}"></div><div class="info_post"><div class="post-title">${e.title}</div><div class="post-meta">${e.date}</div></div>`)},c=async e=>{const{search:t,section:s}=await i("../app"),{$:n}=await i("./jquery");let r=await fetch("/json/search.json"),d=await r.json();var p=d.filter(a=>t!==""&&a.title.toUpperCase().indexOf(t.toUpperCase())>-1||t===""&&s==="all"||s!=="all"&&a.category===s).map((a,m)=>{o(a,m)});p.length===0&&n(".post-list").appendChild(Object.assign(l.createElement("div"),{innerHTML:'<div style="min-height: 80vh;"></div>'}))};export{y as load_posts,o as posts,c as load};
