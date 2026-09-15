(()=>{
const root=document.documentElement,body=document.body;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
if(reduce.matches||location.hash){document.querySelector('.intro')?.remove();return;}
body.classList.add('intro-running');let ended=false;let safety;
function finish(immediate=false){if(ended)return;ended=true;clearTimeout(safety);const main=document.querySelector('main'),header=document.querySelector('header');if(main)main.inert=false;if(header)header.inert=false;body.classList.add('intro-opening');document.querySelector('.intro-status').textContent='PRONTO';document.querySelector('.intro-line span').style.width='100%';setTimeout(()=>{body.classList.remove('intro-running','intro-opening');document.querySelector('.intro')?.remove()},immediate?0:1850)}
safety=setTimeout(()=>finish(true),5500);
addEventListener('keydown',e=>{if(e.key==='Escape')finish(true)},{once:true});
reduce.addEventListener('change',()=>{if(reduce.matches)finish(true)},{once:true});
addEventListener('pageshow',e=>{if(e.persisted)finish(true)});
document.addEventListener('DOMContentLoaded',()=>{
const main=document.querySelector('main'),header=document.querySelector('header');if(ended)return;main.inert=true;header.inert=true;
const assets=[document.querySelector('.hero-photo'),document.querySelector('.hero-signature')];let complete=0;
const ready=assets.map(img=>Promise.resolve().then(()=>img.decode?.()).catch(()=>{}).then(()=>{complete++;document.querySelector('.intro-line span').style.width=`${complete/assets.length*100}%`}));
Promise.all([Promise.all(ready),new Promise(r=>setTimeout(r,750))]).then(()=>finish());
},{once:true});
})();
