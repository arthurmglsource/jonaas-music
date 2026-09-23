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
 performanceFrame.style.clipPath=mobile.matches?'':`inset(0 ${Math.max(0,1-pp*2.4)*5}%)`;
 performanceFrame.style.transform=mobile.matches?'':`translateY(${(pp-.5)*-28}px)`;
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
if(conversations){
 const podcastCards=all('.conversation');
 // Edit these seconds to change each real interview teaser without changing its card.
 const previewClips=[{videoId:'y2InmIeLu4c',previewStart:20,previewEnd:35}];
 let podcastFrame=0,activePreview=-1,activePlayer=null,loopCheck=0,rotationTimer=0,apiPromise;
 const revealElement=(element,offset=0)=>{const top=element.getBoundingClientRect().top;const amount=clamp((innerHeight*.88-top)/(innerHeight*.56)-offset);element.style.setProperty('--podcast-reveal',amount.toFixed(3));element.style.setProperty('--podcast-mask',`${((1-amount)*100).toFixed(1)}%`);element.style.setProperty('--podcast-shift',`${((1-amount)*30).toFixed(1)}px`)};
 function updatePodcastReveal(){podcastFrame=0;if(reduce.matches)return;revealElement($('.conversations-heading h2'));podcastCards.forEach((card,index)=>revealElement(card,index*.13))}
 function queuePodcastReveal(){if(!podcastFrame)podcastFrame=requestAnimationFrame(updatePodcastReveal)}
 if(!reduce.matches){conversations.classList.add('podcast-motion');updatePodcastReveal();addEventListener('scroll',queuePodcastReveal,{passive:true});addEventListener('resize',queuePodcastReveal)}
 function loadYouTubeAPI(){if(window.YT?.Player)return Promise.resolve(window.YT);if(apiPromise)return apiPromise;apiPromise=new Promise((resolve,reject)=>{const previous=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{previous?.();resolve(window.YT)};const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;script.onerror=reject;document.head.append(script)});return apiPromise}
 function stopPreview(){clearInterval(loopCheck);clearTimeout(rotationTimer);loopCheck=0;rotationTimer=0;const old=activePreview;activePreview=-1;activePlayer?.destroy();activePlayer=null;if(old>=0){podcastCards[old].classList.remove('is-playing');podcastCards[old].querySelector('.conversation-video')?.remove()}}
 function visiblePreviews(){return podcastCards.slice(0,1).map((card,index)=>{const rect=card.querySelector('.conversation-image').getBoundingClientRect();const visible=Math.max(0,Math.min(rect.bottom,innerHeight)-Math.max(rect.top,0));return {index,amount:visible/Math.max(1,Math.min(rect.height,innerHeight))}}).filter(item=>item.amount>.38)}
 function startPreview(index){if(index===activePreview)return;stopPreview();if(index<0||reduce.matches||document.hidden||navigator.connection?.saveData)return;activePreview=index;const clip=previewClips[index],card=podcastCards[index],slot=document.createElement('div');slot.className='conversation-video';slot.setAttribute('aria-hidden','true');card.querySelector('.conversation-image').append(slot);const mount=document.createElement('div');slot.append(mount);loadYouTubeAPI().then(YT=>{if(activePreview!==index)return;activePlayer=new YT.Player(mount,{videoId:clip.videoId,playerVars:{autoplay:1,mute:1,controls:0,playsinline:1,rel:0,fs:0,disablekb:1,iv_load_policy:3,origin:location.origin},events:{onReady:event=>{if(activePreview!==index)return;event.target.mute();event.target.loadVideoById({videoId:clip.videoId,startSeconds:clip.previewStart,endSeconds:clip.previewEnd});event.target.playVideo()},onStateChange:event=>{if(activePreview!==index)return;if(event.data===YT.PlayerState.PLAYING){card.classList.add('is-playing');if(!loopCheck)loopCheck=setInterval(()=>{if(activePreview===index&&event.target.getCurrentTime()>=clip.previewEnd-.2){event.target.seekTo(clip.previewStart,true);event.target.playVideo()}},350);clearTimeout(rotationTimer);rotationTimer=setTimeout(()=>{const visible=visiblePreviews();if(visible.length>1){const other=visible.find(item=>item.index!==index);if(other)startPreview(other.index)}},14000)}else if(event.data===YT.PlayerState.ENDED){event.target.seekTo(clip.previewStart,true);event.target.playVideo()}},onError:()=>{if(activePreview===index)stopPreview()}}})}).catch(()=>{if(activePreview===index)stopPreview()})}
 function syncPreview(){if(reduce.matches||document.hidden||navigator.connection?.saveData){stopPreview();return}const visible=visiblePreviews();if(!visible.length){stopPreview();return}if(visible.some(item=>item.index===activePreview))return;startPreview(visible.sort((a,b)=>b.amount-a.amount)[0].index)}
 const podcastObserver=new IntersectionObserver(syncPreview,{threshold:[0,.2,.4,.6,.8,1]});podcastObserver.observe(podcastCards[0].querySelector('.conversation-image'));document.addEventListener('visibilitychange',syncPreview);reduce.addEventListener('change',()=>{conversations.classList.toggle('podcast-motion',!reduce.matches);if(reduce.matches)stopPreview();else{updatePodcastReveal();syncPreview()}})
}
const biography=$('.biography'),bioChapters=all('[data-bio-chapter]');
if(biography){
 const bioWords=all('.bio-copy p').flatMap(paragraph=>{const text=paragraph.textContent;paragraph.replaceChildren();const fragment=document.createDocumentFragment(),words=[];text.split(/(\s+)/).forEach(part=>{if(!part)return;if(/^\s+$/.test(part)){fragment.append(document.createTextNode(part));return}const span=document.createElement('span');span.className='bio-word';span.textContent=part;fragment.append(span);words.push(span)});paragraph.append(fragment);return words});
 let bioFrame=0;
 if(!reduce.matches)biography.classList.add('bio-motion');
 function updateBio(){bioFrame=0;const focusY=innerHeight*.52;let best=-1,bestScore=-1;bioChapters.forEach((chapter,index)=>{const rect=chapter.getBoundingClientRect(),center=rect.top+rect.height*.5,focus=clamp(1-Math.abs(center-focusY)/(innerHeight*.82));if(focus>bestScore){bestScore=focus;best=index}chapter.querySelectorAll('.bio-word').forEach(word=>word.style.setProperty('--word-scroll',(reduce.matches?1:focus).toFixed(3)))});bioChapters.forEach((chapter,index)=>chapter.classList.toggle('is-current',index===best&&bestScore>.2))}
 function queueBio(){if(!bioFrame)bioFrame=requestAnimationFrame(updateBio)}
 bioChapters.forEach(chapter=>chapter.addEventListener('pointermove',event=>{if(reduce.matches||event.pointerType!=='mouse')return;const radius=250;chapter.querySelectorAll('.bio-word').forEach(word=>{const rect=word.getBoundingClientRect(),distance=Math.hypot(event.clientX-(rect.left+rect.width/2),event.clientY-(rect.top+rect.height/2));word.style.setProperty('--word-hover',clamp(1-distance/radius).toFixed(3))})}));
 bioChapters.forEach(chapter=>chapter.addEventListener('pointerleave',()=>chapter.querySelectorAll('.bio-word').forEach(word=>word.style.setProperty('--word-hover','0'))));
 const bioRevealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('is-revealed')})},{threshold:.08,rootMargin:'0px 0px -25px 0px'});
 bioChapters.forEach(chapter=>{const r=chapter.getBoundingClientRect();if(r.top<innerHeight*.88)chapter.classList.add('is-revealed');bioRevealObserver.observe(chapter)});
 addEventListener('scroll',queueBio,{passive:true});addEventListener('resize',queueBio);queueBio();
 reduce.addEventListener('change',()=>{if(reduce.matches){bioWords.forEach(word=>word.style.setProperty('--word-scroll','1'));bioChapters.forEach(c=>c.classList.add('is-revealed'))}queueBio()});
}
// Local pointer motion with stable keyboard and touch targets.
all('.platform,.footer-name').forEach(el=>{
 el.addEventListener('pointermove',e=>{if(reduce.matches||e.pointerType!=='mouse')return;const r=el.getBoundingClientRect();el.style.setProperty('--hover-x',`${(e.clientX-r.left-r.width/2)*.025}px`);el.style.setProperty('--hover-y',`${(e.clientY-r.top-r.height/2)*.06}px`)});
 el.addEventListener('pointerleave',()=>{el.style.setProperty('--hover-x','0px');el.style.setProperty('--hover-y','0px')});
});
})();
