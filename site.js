// ---- Clock ----
function clock(){document.getElementById('clock').textContent=' · '+new Date().toLocaleString('en-US',{timeZone:'America/Chicago',weekday:'short',day:'numeric',month:'short',hour:'numeric',minute:'2-digit'})}
clock();setInterval(clock,30000);

// ---- Only play videos that are on screen ----
const vids=[...document.querySelectorAll('.project video')];
vids.forEach(v=>{v.removeAttribute('autoplay');v.pause()});
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?e.target.play().catch(()=>{}):e.target.pause()),{threshold:.25});
vids.forEach(v=>io.observe(v));

// ---- Copy email ----
document.getElementById('copyBtn')?.addEventListener('click',()=>{
  const btn=document.getElementById('copyBtn'),el=document.getElementById('addr');
  const done=m=>{btn.textContent=m;setTimeout(()=>btn.textContent='copy email',1600)};
  const fallback=()=>{const s=getSelection(),r=document.createRange();r.selectNodeContents(el);s.removeAllRanges();s.addRange(r);done('selected')};
  try{navigator.clipboard.writeText(el.textContent).then(()=>done('copied'),fallback)}catch(e){fallback()}
});

// ---- Inquiry form: send in place, fall back to a normal post ----
document.getElementById('inquiry')?.addEventListener('submit',e=>{
  const f=e.currentTarget,btn=f.querySelector('button'),st=document.getElementById('formStatus');
  e.preventDefault();btn.disabled=true;st.textContent='sending…';
  fetch(f.action.replace('formsubmit.co/','formsubmit.co/ajax/'),{method:'POST',headers:{Accept:'application/json'},body:new FormData(f)})
    .then(r=>r.json()).then(d=>{if(d.success!=='true'&&d.success!==true)throw 0;f.reset();st.textContent='thanks! i’ll be in touch soon.'})
    .catch(()=>{st.textContent='something went wrong. please email me directly.'})
    .finally(()=>{btn.disabled=false});
});

// ---- Work page: open a project in a pop-up ----
const pops=[...document.querySelectorAll('dialog.pop')];
function openPop(){const d=pops.find(p=>'#'+p.id===location.hash);pops.forEach(p=>{if(p!==d&&p.open)p.close()});if(d&&!d.open){d.showModal();d.scrollTop=0;document.body.classList.add('pop-open')}}
pops.forEach(d=>{
  d.querySelector('.pop-close').addEventListener('click',()=>d.close());
  d.addEventListener('click',e=>{if(e.target===d)d.close()});
  d.addEventListener('close',()=>{document.body.classList.remove('pop-open');if(location.hash==='#'+d.id)history.pushState('',document.title,location.pathname)});
});
if(pops.length){addEventListener('hashchange',openPop);openPop()}

// ---- Home: reveal the top bar once you scroll ----
const floatBar=document.querySelector('.pagebar.float');
if(floatBar){const t=()=>floatBar.classList.toggle('show',scrollY>120);addEventListener('scroll',t,{passive:true});t()}

// ---- Subtle silver sparkles trail the mouse (desktop only) ----
if(matchMedia('(hover: hover) and (pointer: fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  let lx=0,ly=0,lt=0;
  addEventListener('mousemove',e=>{
    const now=performance.now(),d=Math.hypot(e.clientX-lx,e.clientY-ly);
    if(now-lt<45||d<14)return;lt=now;lx=e.clientX;ly=e.clientY;
    const s=document.createElement('span');s.className='spark';s.setAttribute('aria-hidden','true');
    const k=.5+Math.random()*.7;s.style.width=s.style.height=(9*k).toFixed(1)+'px';
    s.style.setProperty('--x',(e.clientX+(Math.random()*14-7)).toFixed(0)+'px');
    s.style.setProperty('--y',(e.clientY+(Math.random()*14-7)).toFixed(0)+'px');
    document.body.appendChild(s);s.addEventListener('animationend',()=>s.remove());
  },{passive:true});
}
