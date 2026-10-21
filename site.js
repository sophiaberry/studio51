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

// ---- Work page: move a few assets under the text when the right column runs long ----
function balance(){
  document.querySelectorAll('.project').forEach(p=>{
    const left=p.querySelector('.p-left'),media=p.querySelector('.p-media'),extra=p.querySelector('.p-extra');
    if(!media)return;
    [...extra.children].forEach(f=>media.appendChild(f));
    if(innerWidth<=760)return;
    while(media.children.length>1){
      const last=media.lastElementChild,h=last.getBoundingClientRect().height;
      if(media.offsetHeight-left.offsetHeight<h*0.6)break;
      extra.prepend(last);
    }
    // keep portrait shots in pairs on both sides so no half-empty rows
    const ports=[...media.querySelectorAll('figure.p')];
    if(extra.children.length&&ports.length%2)extra.prepend(ports[ports.length-1]);
  });
}
addEventListener('load',balance);addEventListener('resize',()=>{clearTimeout(window._bt);window._bt=setTimeout(balance,150)});
