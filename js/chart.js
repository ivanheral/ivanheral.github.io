!function(){function t(i,h,e){function a(n,s){if(!h[n]){if(!i[n]){var l="function"==typeof require&&require;if(!s&&l)return l(n,!0);if(r)return r(n,!0);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}var o=h[n]={exports:{}};i[n][0].call(o.exports,function(t){return a(i[n][1][t]||t)},o,o.exports,t,i,h,e)}return h[n].exports}for(var r="function"==typeof require&&require,n=0;n<e.length;n++)a(e[n]);return a}return t}()({1:[function(t,h,e){function a(t){this.width=720,this.ctx=t.canvas.getContext("2d"),this.canvas=t.canvas,this.height=405,this.maxValue,this.margin=3,this.draw=function(t){var h,e,a,r=t.length,n=["#4285f4","#34a853","#fbbc05","#ea4335"],s=getComputedStyle(this.canvas);s.width,s.height;this.canvas.width=720,this.canvas.height=405,barWidth=this.width/r-2*this.margin,e=this.height;var a=0;for(i=0;i<t.length;i+=1)t[i].val>a&&(a=t[i].val);for(i=0;i<t.length;i+=1){h=t[i].val/a,this.maxValue&&(h=t[i].val/this.maxValue),barHeight=h*e,this.ctx.fillStyle="#ddd",this.ctx.fillRect(this.margin+i*this.width/r-1,this.height-barHeight+2,barWidth+1,barHeight-45),this.ctx.fillStyle=n[i],this.ctx.fillRect(this.margin+i*this.width/r,this.height-barHeight,barWidth,barHeight-45),this.ctx.shadowBlur=0,this.ctx.fillStyle="#263238",this.ctx.font="28px sans-serif",this.ctx.textAlign="center";try{this.ctx.fillText(parseInt(t[i].val,10),i*this.width/r+this.width/r/2,this.height-barHeight+30),this.ctx.fillText(t[i].title,i*this.width/r+this.width/r/2,this.canvas.height-10)}catch(t){}}}}new a({canvas:document.getElementById("test")}).draw([{title:"cine",val:3},{title:"random",val:2},{title:"opinión",val:4},{title:"tutorial",val:9}])},{}]},{},[1]);