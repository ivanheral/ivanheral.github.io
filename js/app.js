"serviceWorker"in navigator&&navigator.serviceWorker.register("sw.js").then(e=>{console.log("Service Worker Registered")});const doc=document;var section="all",search="";try{const e=e=>import(`${e}.js`);doc.addEventListener("DOMContentLoaded",async a=>{const{$:o}=await e("./modules/jquery"),{load:t}=await e("./modules/load");o("#search").addEventListener("keyup",async a=>{const{load_posts:o}=await e("./modules/load");search=a.target.value,section=""===search&&"all",o()}),o("#links").addEventListener("click",async a=>{const{change_section:o}=await e("./modules/section");section=await o(a,section)}),doc.addEventListener("scroll",async a=>{const{scroll_tag:o}=await e("./modules/scroll");o()}),o("#modal").addEventListener("click",async a=>{const{close_modal:o}=await e("./modules/modal");o(a)}),o("#modal").addEventListener("mouseover",async a=>{const{animate_modal:o}=await e("./modules/modal");o(a)}),window.location.pathname.match(/(tutorial)/i)&&await e("./modules/prism"),null===o(".important")&&t()},!1)}catch(e){window.location.replace("https://bestvpn.org/outdatedbrowser/es")}export{search,section};