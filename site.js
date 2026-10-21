// ---- Clock ----
function clock(){document.getElementById('clock').textContent=' · '+new Date().toLocaleString('en-US',{timeZone:'America/Chicago',weekday:'short',day:'numeric',month:'short',hour:'numeric',minute:'2-digit'})}
clock();setInterval(clock,30000);

// ---- Only play videos that are on screen ----
const vids=[...document.querySelectorAll('.filmstrip video')];
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
