const scroll=0,find=t=>import(t+".js"),scroll_tag=async t=>{const{$:a,addclss:i}=await find("./jquery");let e=a("html").scrollTop;a(".tags").style.marginTop="0px",a(".tags").style.marginTop=e>45&&e.toString()+"px",e>45&&i(a(".tags"),"fixed"),await showitem()},isscroll=(t,a)=>window.innerHeight+a>t.getBoundingClientRect().top>0,showitem=async t=>{const{all:a,addclss:i,$:e}=await find("./jquery"),{add_tag:s}=await find("./script");[].slice.call(a(".elem > div:first-child:not(.tested)")).map(async t=>{try{var a=t.children[0].src}catch(t){}if(isscroll(t,120)){if("chart"==t.className&&null!==e("#dashboard_div")){const{Chart:t}=await find("./chart"),{data:a}=await find("./conf_chart");new t("#dashboard_div",{data:a,type:"bar",height:320,colors:["red"]})}if("disqus"==t.className&&s("script",`https://${disqus_shortname}.disqus.com/embed.js`),void 0!==a){let a="";t.children[0].getAttribute("data-src")&&(a=t.children[0].getAttribute("data-src")),t.children[0].src=a,a.match(/(giphy|gfycat|coub)/i)&&(t.children[0].src=a.replace("_s.gif",".gif").replace("-mobile.jpg","-size_restricted.gif").replace("[block]","")),t.className.match(/(wall_overflow gif)/i)&&t.addEventListener("click",async t=>{const{modal:a}=await find("./modal");a(t)}),a.match(/(mqdefault)/i)&&t.insertAdjacentHTML("beforeend",`<iframe src="//www.youtube.com/embed/${t.children[0].id}" frameborder="0"></iframe>`)}i(t,"tested")}})};export{scroll,scroll_tag,isscroll,showitem};