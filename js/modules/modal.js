var width,top,left;const find=t=>import(`${t}.js`),animate_modal=async t=>{const{$:a,addclss:e}=await find("./jquery");a("#modal img").className.match(/(animate)/i)||(a("#modal img").style="",e(a("#modal img"),"animate"))},close_modal=async t=>{const{$:a,delclss:e}=await find("./jquery");top-=Math.abs(scroll-window.scrollY),a("#modal img").style.transform=`translateY(${top}px) translateX(${left}px)`,a("#modal img").style.width=`${width}px`,e(a(".modal"),"modal"),e(a(".fade"),"show"),setTimeout((function(){a("#modal").innerHTML="",a(".fade-modal").style.display="none"}),1e3)},modal=async t=>{const{$:a,addclss:e}=await find("./jquery");if(void 0===window.orientation||-1!==navigator.userAgent.indexOf("IEMobile")){t.target.className="modal",width=t.target.width,scroll=window.scrollY,a(".fade-modal").style.display="table",e(a(".fade"),"show"),a("#modal").insertAdjacentHTML("beforeend",`<img style="width:${t.target.width}px;" src="${t.target.src}">`);var l=t.target.getBoundingClientRect(),o=a("#modal img").getBoundingClientRect();top=l.top-o.top,left=l.left-o.left,a("#modal img").style.transform=`translateY(${top}px) translateX(${left}px)`}else window.open(t.target.src,"_blank")};export{animate_modal,close_modal,modal};