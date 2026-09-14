(()=>{
'use strict';
const $=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:600px)');
const stage=$('.stage'),musicWrap=$('.music-scroll'),music=$('.music'),poster=$('.video-poster'),info=$('.release-info'),catalogue=$('.catalogue-journey'),catalogueStage=$('.catalogue-stage'),cards=all('[data-record]'),contactWrap=$('.contact-scroll'),performance=$('.performance'),performanceFrame=$('.performance-frame'),contact=$('.contact'),portrait=$('.portrait-card'),dots=all('[data-record-target]');
const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n)),ease=n=>n*n*(3-2*n);
const progress=(wrap,visibleHeight=innerHeight)=>clamp(-wrap.getBoundingClientRect().top/Math.max(1,wrap.offsetHeight-visibleHeight));
let scheduled=false;
function draw(){scheduled=false;
 if(reduce.matches){[stage,catalogueStage,music,poster,info,contact,portrait,...cards].forEach(e=>{e.style.transform='';e.style.clipPath='';e.style.opacity='';e.style.visibility='';e.inert=false});$('.origin').style.setProperty('--origin-progress','1');performanceFrame.style.transform='';performanceFrame.style.clipPath='';return;}
 const hp=clamp(scrollY/innerHeight);stage.style.transform=`translateY(${-hp*110}px)`;stage.style.clipPath='none';
 const mp=progress(musicWrap),enter=ease(clamp((mp-.08)/.3));
 if(mobile.matches){[poster,info,music,performanceFrame].forEach(e=>{e.style.transform='';e.style.opacity='';e.style.visibility='';e.style.clipPath='';e.inert=false})}
 else{poster.style.transform=`translateX(${(1-enter)*27}%) scale(${1+(1-enter)*.025})`;poster.style.opacity='1';poster.inert=false;info.style.transform=`translateX(${(1-enter)*45}px)`;info.style.opacity=String(enter);info.style.visibility=enter<.01?'hidden':'visible';info.inert=enter<.1;music.style.clipPath='none';music.style.transform='';music.inert=false;}
 const cp=progress(catalogue),u=clamp(cp/.88)*4,active=Math.round(u);
 cards.forEach((card,i)=>{const arrival=i===0?1:ease(clamp(u-(i-1))),past=clamp(u-i,0,4);card.style.transform=`translate3d(0,${(1-arrival)*innerHeight*1.1-past*15}px,${-past*7}px) scale(${1-past*.035})`;card.style.zIndex=String(i+1);card.inert=i!==active;card.style.visibility=arrival===0?'hidden':'visible';});
 dots.forEach((d,i)=>d.setAttribute('aria-current',String(i===active)));
 const fp=ease(clamp(progress(contactWrap)/.7));contact.style.clipPath=`circle(${fp*145}% at 50% 100%)`;contact.inert=fp<.3;
 const origin=$('.origin'),or=origin.getBoundingClientRect(),op=clamp((innerHeight-or.top)/(innerHeight+or.height));portrait.style.transform=`translateY(${(op-.5)*-40}px)`;origin.style.setProperty('--origin-progress',op.toFixed(3));const pr=performance.getBoundingClientRect(),pp=clamp((innerHeight-pr.top)/(innerHeight+pr.height));performanceFrame.style.clipPath=`inset(0 ${Math.max(0,1-pp*2.4)*5}%)`;performanceFrame.style.transform=`translateY(${(pp-.5)*-28}px)`;
}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(draw)}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('load',schedule);reduce.addEventListener('change',schedule);mobile.addEventListener('change',schedule);document.fonts?.ready.then(schedule);new ResizeObserver(schedule).observe(document.body);schedule();
function gotoProgress(w,p){const y=scrollY+w.getBoundingClientRect().top+Math.max(0,w.offsetHeight-innerHeight)*p;scrollTo({top:y,behavior:reduce.matches?'instant':'smooth'})}
dots.forEach(d=>d.addEventListener('click',()=>gotoProgress(catalogue,Number(d.dataset.recordTarget)/4*.88)));
function anchor(hash){if(reduce.matches)return false;if(hash==='#musica'){gotoProgress(musicWrap,.04);return true}if(hash==='#discografia'){gotoProgress(catalogue,.035);return true}if(hash==='#contacto'){gotoProgress(contactWrap,.82);return true}return false}
all('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{if(anchor(a.hash)){e.preventDefault();history.replaceState(null,'',a.hash)}}));
addEventListener('load',()=>{if(location.hash)anchor(location.hash)});
})();
