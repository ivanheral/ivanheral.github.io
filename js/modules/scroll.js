const scroll=0,find=t=>import(`${t}.js`),scroll_tag=async t=>{const{$:a,addclss:e}=await find("./jquery");let i=a("html").scrollTop;a(".tags").style.marginTop="0px",a(".tags").style.marginTop=i>45&&`${i.toString()}px`,i>45&&e(a(".tags"),"fixed"),await showitem()},isscroll=(t,a)=>window.innerHeight+a>t.getBoundingClientRect().top>0,showitem=async t=>{const{all:a,addclss:e,$:i}=await find("./jquery"),{add_script:s}=await find("./script");[].slice.call(a(".elem > div:first-child:not(.tested)")).map(async t=>{try{var a=t.children[0].src}catch(t){}if(isscroll(t,120)){if("chart"==t.className&&null!==i("#dashboard_div")){const{Chart:t}=await find("./chart"),{data:a}=await find("./conf_chart");new t("#dashboard_div",{data:a,type:"bar",height:320,colors:["red"]})}"disqus"==t.className&&s(`https://${disqus_shortname}.disqus.com/embed.js`),void 0!==a&&(t.children[0].getAttribute("src")&&""==t.className&&t.addEventListener("click",async t=>{const{modal:a}=await find("./modal");a(t)}),t.children[0].getAttribute("data-src")&&(t.children[0].src=t.children[0].getAttribute("data-src")),a.match(/(giphy|gfycat|coub)/i)&&(t.children[0].src=a.replace("_s.gif",".gif").replace("-mobile.jpg","-size_restricted.gif").replace("[block]",""),"wall_overflow gif"==t.className&&t.addEventListener("click",async t=>{const{modal:a}=await find("./modal");a(t)})),a.match(/(mqdefault)/i)&&(t.children[0].src="",t.insertAdjacentHTML("beforeend",`<iframe src="//www.youtube.com/embed/${t.children[0].id}" frameborder="0"></iframe>`))),e(t,"tested")}})};export{scroll,scroll_tag,isscroll,showitem};