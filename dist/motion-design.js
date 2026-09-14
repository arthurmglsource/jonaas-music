(()=>{
'use strict';
const $=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:600px)');
const hero=$('.scroll-story'),stage=$('.stage'),musicWrap=$('.music-scroll'),music=$('.music'),poster=$('.video-poster'),info=$('.release-info'),catalogue=$('.catalogue-journey'),catalogueStage=$('.catalogue-stage'),cards=all('[data-record]'),character=$('.character'),contactWrap=$('.contact-scroll'),contactStage=$('.contact-stage'),contact=$('.contact'),portrait=$('.portrait-card'),dots=all('[data-record-target]');
const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n)),ease=n=>n*n*(3-2*n);
const progress=(wrap,visibleHeight=innerHeight)=>clamp(-wrap.getBoundingClientRect().top/Math.max(1,wrap.offsetHeight-visibleHeight));
let scheduled=false;
function draw(){scheduled=false;
 if(reduce.matches){[stage,catalogueStage,music,poster,info,character,contact,portrait,...cards].forEach(e=>{e.style.transform='';e.style.clipPath='';e.style.opacity='';e.style.visibility='';e.inert=false});return;}
 const hp=ease(progress(hero));stage.style.transform=`scale(${1-hp*.065})`;stage.style.clipPath=`inset(0 round ${hp*30}px)`;
 const mp=progress(musicWrap),enter=ease(clamp((mp-.08)/.3)),exit=ease(clamp((mp-.73)/.27));
 if(mobile.matches){poster.style.transform=`translateY(${-enter*25}px) scale(${1-enter*.06})`;poster.style.opacity=String(1-enter);poster.inert=enter>.6;info.style.transform=`translateY(${(1-enter)*35}px)`;info.style.opacity=String(enter);}
 else{poster.style.transform=`translateX(${(1-enter)*27}%) scale(${1+(1-enter)*.05})`;poster.style.opacity='1';poster.inert=false;info.style.transform=`translateX(${(1-enter)*80}px)`;info.style.opacity=String(enter);}
 info.style.visibility=enter<.01?'hidden':'visible';info.inert=enter<.1;music.style.clipPath=`inset(0 ${exit*100}% 0 0)`;music.style.transform=`translateX(${-exit*12}%)`;music.inert=exit>.98;
 const catTop=catalogue.getBoundingClientRect().top;catalogueStage.style.transform=mp>.6&&catTop>0?`translateY(${-catTop}px)`:'';
 const cp=progress(catalogue),u=clamp(cp/.69)*4,active=Math.round(u);
 cards.forEach((card,i)=>{const arrival=i===0?1:ease(clamp(u-(i-1))),past=clamp(u-i,0,4);card.style.transform=`translate3d(0,${(1-arrival)*innerHeight*1.1-past*15}px,${-past*7}px) scale(${1-past*.035})`;card.style.zIndex=String(i+1);card.inert=i!==active;card.style.visibility=arrival===0?'hidden':'visible';});
 $('#record-count').textContent=`${String(active+1).padStart(2,'0')} / 05`;dots.forEach((d,i)=>d.setAttribute('aria-current',String(i===active)));
 const reveal=ease(clamp((cp-.73)/.15));character.style.clipPath=`circle(${reveal*125}% at 50% 60%)`;character.inert=reveal<.85;
 const fp=ease(clamp(progress(contactWrap)/.7));contact.style.clipPath=`circle(${fp*145}% at 50% 100%)`;contact.inert=fp<.3;
 const pr=portrait.getBoundingClientRect();portrait.style.transform=`translateY(${(clamp((innerHeight-pr.top)/(innerHeight+pr.height))-.5)*-45}px) rotate(${4-hp*2}deg)`;
}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(draw)}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('load',schedule);reduce.addEventListener('change',schedule);mobile.addEventListener('change',schedule);document.fonts?.ready.then(schedule);new ResizeObserver(schedule).observe(document.body);schedule();
function gotoProgress(w,p){const y=scrollY+w.getBoundingClientRect().top+Math.max(0,w.offsetHeight-innerHeight)*p;scrollTo({top:y,behavior:reduce.matches?'instant':'smooth'})}
dots.forEach(d=>d.addEventListener('click',()=>gotoProgress(catalogue,Number(d.dataset.recordTarget)/4*.69)));
function anchor(hash){if(reduce.matches)return false;if(hash==='#musica'){gotoProgress(musicWrap,.04);return true}if(hash==='#discografia'){gotoProgress(catalogue,.035);return true}if(hash==='#personagem'){gotoProgress(catalogue,.92);return true}if(hash==='#contacto'){gotoProgress(contactWrap,.82);return true}return false}
all('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{if(anchor(a.hash)){e.preventDefault();history.replaceState(null,'',a.hash)}}));
addEventListener('load',()=>{if(location.hash)anchor(location.hash)});
// A spring returns the interactive portrait after a drag, tap or keyboard gesture.
const object=$('.character-object');let x=0,y=0,vx=0,vy=0,tx=0,ty=0,dragging=false,startX=0,startY=0,frame=0,last=0;
function spring(now){const dt=Math.min(2,(now-last)/16.67||1);last=now;vx+=(tx-x)*.08*dt;vy+=(ty-y)*.08*dt;vx*=Math.pow(.8,dt);vy*=Math.pow(.8,dt);x+=vx*dt;y+=vy*dt;object.style.transform=`rotateX(${-y*.32}deg) rotateY(${x*.42}deg) rotateZ(${x*.05}deg) translate3d(${x*.38}px,${y*.25}px,0)`;if(Math.abs(tx-x)+Math.abs(ty-y)+Math.abs(vx)+Math.abs(vy)>.03){frame=requestAnimationFrame(spring)}else frame=0;}
function animate(){if(!frame&&!reduce.matches){last=performance.now();frame=requestAnimationFrame(spring)}}
object.addEventListener('pointerdown',e=>{if(reduce.matches)return;dragging=true;startX=e.clientX;startY=e.clientY;object.setPointerCapture(e.pointerId);object.classList.add('dragging')});
object.addEventListener('pointermove',e=>{if(!dragging)return;tx=clamp((e.clientX-startX)*.5,-45,45);ty=clamp((e.clientY-startY)*.4,-30,30);animate()});
function release(){if(!dragging)return;dragging=false;object.classList.remove('dragging');if(Math.abs(tx)+Math.abs(ty)<2){vx=7;vy=-4}tx=ty=0;animate()}
object.addEventListener('pointerup',release);object.addEventListener('pointercancel',release);object.addEventListener('lostpointercapture',release);
object.addEventListener('keydown',e=>{const keys={ArrowLeft:[-9,0],ArrowRight:[9,0],ArrowUp:[0,-8],ArrowDown:[0,8],' ':[7,-5],Enter:[7,-5]};if(keys[e.key]){e.preventDefault();[vx,vy]=keys[e.key];animate()}});
reduce.addEventListener('change',()=>{if(reduce.matches){cancelAnimationFrame(frame);frame=0;object.style.transform=''}});
})();
