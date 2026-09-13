(()=>{
const reduce=matchMedia('(prefers-reduced-motion: reduce)'),desktop=matchMedia('(min-width: 901px)');
const musicWrap=document.querySelector('.music-scroll'),music=document.querySelector('.music'),poster=document.querySelector('.video-poster'),info=document.querySelector('.release-info');
const contactWrap=document.querySelector('.contact-scroll'),contact=document.querySelector('.contact'),cards=[...document.querySelectorAll('.record')],portrait=document.querySelector('.portrait-card');
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>x*x*(3-2*x);let pending=false;
function render(){pending=false;const vh=innerHeight;
if(reduce.matches){[music,poster,info,contact,...cards,portrait].forEach(e=>e.removeAttribute('style'));info.inert=false;music.inert=false;contact.inert=false;return;}
if(desktop.matches){const r=musicWrap.getBoundingClientRect(),p=clamp(-r.top/(musicWrap.offsetHeight-vh));const enter=ease(clamp((p-.08)/.34));const exit=ease(clamp((p-.78)/.22));poster.style.transform=`translateX(${(1-enter)*25}%) scale(${1+(1-enter)*.04})`;info.style.transform=`translateX(${(1-enter)*60}px)`;info.style.opacity=String(enter);info.style.visibility=enter<.03?'hidden':'visible';info.inert=enter<.03;music.inert=exit>.95;music.style.clipPath=`inset(0 ${exit*100}% 0 0)`;music.style.transform=`translateX(${-exit*9}%)`;
}else{[music,poster,info].forEach(e=>e.removeAttribute('style'));info.inert=false;music.inert=false;}
const cr=contactWrap.getBoundingClientRect(),travel=Math.max(1,contactWrap.offsetHeight-document.querySelector('.contact-stage').offsetHeight),cp=clamp(-cr.top/travel);const radius=7+ease(clamp(cp/.6))*143;contact.style.clipPath=`circle(${radius}% at 50% 100%)`;contact.inert=cp<.32;
cards.forEach((card,i)=>{const next=cards[i+1];const reached=next?clamp((vh*.85-next.getBoundingClientRect().top)/(vh*.65)):0;const rot=desktop.matches?5:2;card.style.transform=`rotate(${rot*(1-reached)}deg) scale(${1-reached*.045})`;});
const pr=portrait.getBoundingClientRect(),pp=clamp((vh-pr.top)/(vh+pr.height));portrait.style.transform=`translateY(${(pp-.5)*-35}px) rotate(${5-pp*6}deg)`;
}
function schedule(){if(!pending){pending=true;requestAnimationFrame(render)}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduce.addEventListener('change',schedule);desktop.addEventListener('change',schedule);schedule();
// Native anchors must land on readable stages, including the clipped contact reveal.
document.querySelectorAll('a[href="#contacto"]').forEach(a=>a.addEventListener('click',e=>{if(reduce.matches)return;e.preventDefault();const stage=document.querySelector('.contact-stage');const y=scrollY+contactWrap.getBoundingClientRect().top+(contactWrap.offsetHeight-stage.offsetHeight)*.7;scrollTo({top:y,behavior:'smooth'});history.replaceState(null,'','#contacto')}));
addEventListener('load',()=>{if(location.hash==='#contacto'&&!reduce.matches){const stage=document.querySelector('.contact-stage');scrollTo(0,scrollY+contactWrap.getBoundingClientRect().top+(contactWrap.offsetHeight-stage.offsetHeight)*.7)}});
// Reveal hidden chapter controls when keyboard navigation reaches the chapter.
music.addEventListener('focusin',()=>{if(info.inert&&desktop.matches&&!reduce.matches)scrollTo({top:scrollY+musicWrap.getBoundingClientRect().top+(musicWrap.offsetHeight-innerHeight)*.5,behavior:'smooth'})});
})();
