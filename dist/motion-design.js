(()=>{
'use strict';
const $=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:600px)');
const stage=$('.stage'),journey=$('.music-scroll'),track=$('.releases-track'),music=$('.music'),title=$('.single-title'),poster=$('.video-poster'),info=$('.release-info'),catalogue=$('.catalogue-journey'),stack=$('.record-stack'),cards=all('[data-record]'),contactWrap=$('.contact-scroll'),meeting=$('.next-meeting'),contact=$('.contact'),performance=$('.performance'),performanceFrame=$('.performance-frame'),dots=all('[data-record-target]');
const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n)),ease=n=>n*n*(3-2*n);
const progress=wrap=>clamp(-wrap.getBoundingClientRect().top/Math.max(1,wrap.offsetHeight-innerHeight));
let scheduled=false;
let pointerX=0,pointerY=0;
const signature=$('.hero-signature svg');
function reset(el){el.style.transform='';el.style.clipPath='';el.style.opacity='';el.style.visibility='';el.inert=false;}
function draw(){
 scheduled=false;
 if(reduce.matches){[stage,track,music,title,poster,info,catalogue,stack,contact,meeting,performanceFrame,...cards].forEach(reset);meeting.removeAttribute('aria-hidden');signature.style.transform='';signature.style.opacity='';return;}
 const hp=clamp(scrollY/innerHeight);stage.style.transform=`translateY(${-hp*110}px)`;
 signature.style.transform=`translateY(${-hp*22}px) scale(${1-hp*.025})`;signature.style.opacity=String(1-hp*.22);
 const mp=progress(journey),slide=ease(clamp((mp-.30)/.14));
 let cardProgress;
 if(mobile.matches){
  [track,music,title,poster,info,catalogue].forEach(reset);
  cardProgress=clamp(progress(catalogue)/.96);
 }else{
  const rise=ease(clamp(mp/.08)),settle=ease(clamp((mp-.10)/.08)),links=ease(clamp((mp-.18)/.07));
  track.style.transform=`translate3d(${-slide*50}%,0,0)`;
  title.style.transform=`translateY(${(1-rise)*innerHeight*.14}px)`;
  // Centre the clip before opening the space for streaming platforms.
  const centreOffset=($('.release-grid').clientWidth-poster.offsetWidth)/2;
  poster.style.transform=`translate(${(1-settle)*centreOffset}px,${(1-rise)*innerHeight*.7}px) scale(${1+(1-settle)*.08})`;
  info.style.transform=`translateX(${(1-links)*innerWidth*.28}px)`;
  info.style.opacity=String(links);info.style.visibility=links<.01?'hidden':'visible';info.inert=links<.1;
  music.inert=slide>.98;catalogue.inert=slide<.95;
  cardProgress=clamp((mp-.45)/.50);
 }
 const u=cardProgress*(cards.length-1),active=Math.min(cards.length-1,Math.floor(u+.999));
 const tilt=mobile.matches?0:1-ease(clamp(cardProgress*1.4));
 stack.style.transform=`rotateX(${tilt*16+pointerY}deg) rotateY(${pointerX}deg) rotateZ(${tilt*7}deg)`;
 cards.forEach((card,i)=>{
  const arrival=i===0?1:ease(clamp(u-(i-1))),past=clamp(u-i,0,cards.length-1);
  card.style.transform=`translate3d(0,${(1-arrival)*innerHeight*1.12-past*(mobile.matches?8:12)}px,${-past*8}px) scale(${1-past*.035})`;
  card.style.zIndex=String(i+1);card.inert=i!==active;card.style.visibility=arrival===0?'hidden':'visible';
 });
 dots.forEach((d,i)=>d.setAttribute('aria-current',String(i===active)));
 const fp=ease(clamp((progress(contactWrap)-.08)/.72));
 contact.style.clipPath=`circle(${(fp*145).toFixed(3)}% at 50% 100%)`;contact.inert=fp<.6;
 meeting.style.transform=`translateY(${-fp*65}px)`;meeting.inert=fp>.45;meeting.setAttribute('aria-hidden',String(fp>.75));
 const pr=performance.getBoundingClientRect(),pp=clamp((innerHeight-pr.top)/(innerHeight+pr.height));
 performanceFrame.style.clipPath=`inset(0 ${Math.max(0,1-pp*2.4)*5}%)`;
 performanceFrame.style.transform=`translateY(${(pp-.5)*-28}px)`;
}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(draw)}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('load',schedule);reduce.addEventListener('change',schedule);mobile.addEventListener('change',schedule);document.fonts?.ready.then(schedule);new ResizeObserver(schedule).observe(document.body);schedule();
function gotoProgress(w,p){const y=scrollY+w.getBoundingClientRect().top+Math.max(0,w.offsetHeight-innerHeight)*p;scrollTo({top:y,behavior:reduce.matches?'instant':'smooth'})}
dots.forEach(d=>d.addEventListener('click',()=>{const p=Number(d.dataset.recordTarget)/(cards.length-1);if(mobile.matches)gotoProgress(catalogue,p*.96);else gotoProgress(journey,.45+p*.50)}));
function anchor(hash){if(reduce.matches)return false;if(hash==='#musica'){if(mobile.matches)return false;gotoProgress(journey,.26);return true}if(hash==='#discografia'){gotoProgress(mobile.matches?catalogue:journey,mobile.matches?0:.45);return true}if(hash==='#contacto'){gotoProgress(contactWrap,.85);return true}return false}
all('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{if(anchor(a.hash)){e.preventDefault();history.replaceState(null,'',a.hash)}}));
addEventListener('load',()=>{if(location.hash)anchor(location.hash)});
stack.addEventListener('pointermove',e=>{if(reduce.matches||mobile.matches||e.pointerType!=='mouse')return;const r=catalogue.getBoundingClientRect();pointerX=clamp((e.clientX-r.left)/r.width-.5,-.5,.5)*7;pointerY=-clamp(e.clientY/innerHeight-.5,-.5,.5)*5;schedule()});
stack.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;schedule()});
const performanceObserver=new IntersectionObserver(entries=>{performance.classList.toggle('is-visible',entries[0].isIntersecting)},{threshold:.05});performanceObserver.observe(performance);
const conversations=$('.conversations');
if(conversations){if(reduce.matches)conversations.classList.add('is-visible');else{const conversationsObserver=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){conversations.classList.add('is-visible');conversationsObserver.disconnect()}},{threshold:.12});conversationsObserver.observe(conversations)}}
const biography=$('.biography'),bioChapters=all('[data-bio-chapter]'),bioCurrent=$('[data-bio-current]'),bioFill=$('[data-bio-fill]');
if(biography){if(!reduce.matches)biography.classList.add('bio-motion');const biographyObserver=new IntersectionObserver(entries=>entries.forEach(entry=>biography.classList.toggle('is-active',entry.isIntersecting)),{threshold:.04});biographyObserver.observe(biography);const bioChapterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{entry.target.classList.toggle('is-visible',entry.isIntersecting);if(entry.isIntersecting){const index=Number(entry.target.dataset.bioChapter);bioCurrent.textContent=String(index+1).padStart(2,'0');bioFill.style.setProperty('--bio-progress',`${((index+1)/bioChapters.length)*100}%`)}}),{rootMargin:'-34% 0px -34% 0px',threshold:0});bioChapters.forEach(chapter=>bioChapterObserver.observe(chapter))}
// Local pointer motion with stable keyboard and touch targets.
all('.platform,.footer-name').forEach(el=>{
 el.addEventListener('pointermove',e=>{if(reduce.matches||e.pointerType!=='mouse')return;const r=el.getBoundingClientRect();el.style.setProperty('--hover-x',`${(e.clientX-r.left-r.width/2)*.025}px`);el.style.setProperty('--hover-y',`${(e.clientY-r.top-r.height/2)*.06}px`)});
 el.addEventListener('pointerleave',()=>{el.style.setProperty('--hover-x','0px');el.style.setProperty('--hover-y','0px')});
});
})();
