document.addEventListener('DOMContentLoaded',()=>{
  // scroll progress + back to top + parallax blobs
  const bar=document.createElement('div');bar.id='progress';document.body.prepend(bar);
  const top=document.createElement('button');top.id='toTop';top.setAttribute('aria-label','Back to top');top.textContent='↑';
  top.onclick=()=>scrollTo({top:0,behavior:'smooth'});document.body.append(top);
  const blobs=document.querySelectorAll('.blob');
  addEventListener('scroll',()=>{
    const h=document.documentElement.scrollHeight-innerHeight;
    bar.style.width=(scrollY/h*100)+'%';top.classList.toggle('show',scrollY>500);
    blobs.forEach((b,i)=>b.style.translate='0 '+(scrollY*(i%2?.06:-.06))+'px');
  },{passive:true});
  // reveal variants
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal-left,.reveal-right,.zoom-in').forEach(el=>io.observe(el));
  // 3D tilt cards
  document.addEventListener('mousemove',e=>{
    const c=e.target.closest&&e.target.closest('[data-tilt]');
    document.querySelectorAll('[data-tilt]').forEach(el=>{if(el!==c)el.style.transform=''});
    if(!c)return;const r=c.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    c.style.transform=`perspective(900px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-6px)`;
  });
  document.addEventListener('mouseleave',()=>document.querySelectorAll('[data-tilt]').forEach(el=>el.style.transform=''));
  // active nav link
  const page=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('#navbar a.nav-link').forEach(a=>{
    if(a.getAttribute('href').split('#')[0]===page&&page!=='index.html'){a.classList.add('text-brand-600','font-bold')}});
  // generic tab buttons (.tab-btn[data-target])
  document.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');
    document.querySelectorAll('.tab-pane').forEach(p=>p.classList.toggle('hidden',p.id!==b.dataset.target));
    history.replaceState(null,'','#'+b.dataset.target);
  }));
  if(location.hash){const t=document.querySelector('.tab-btn[data-target="'+location.hash.slice(1)+'"]');t&&t.click()}
});
setTimeout(()=>document.documentElement.classList.add('reveal-all'),2500);

/* ===== V2 motion layer ===== */
document.addEventListener('DOMContentLoaded',()=>{
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  // 1. auto-stagger siblings of .reveal / .zoom-in
  document.querySelectorAll('.reveal,.zoom-in').forEach(el=>{
    if(el.style.transitionDelay)return;
    const sibs=[...el.parentElement.children].filter(c=>c.classList.contains('reveal')||c.classList.contains('zoom-in'));
    const i=sibs.indexOf(el);if(i>0)el.style.transitionDelay=(Math.min(i,6)*0.08)+'s';
  });
  // 2. hero: rotating typed words
  const rot=document.getElementById('rot');
  if(rot&&!reduce){
    const words=rot.dataset.words.split('|').map(w=>w.replace(/&amp;/g,'&'));let wi=0,ci=words[0].length,del=true;
    const tick=()=>{const w=words[wi];
      if(del){ci--;if(ci<=0){del=false;wi=(wi+1)%words.length}}else{ci++;if(ci>=words[wi].length)del=null}
      rot.textContent=words[wi].slice(0,Math.max(ci,0));
      let t=del===true?35:del===false?70:1600;if(del===null)del=true;setTimeout(tick,t)};
    setTimeout(tick,2200);
  }
  // 3. particles canvas
  const cv=document.querySelector('.hero-canvas');
  if(cv&&!reduce){
    const x=cv.getContext('2d');let W,H,P=[],mouse={x:-1e3,y:-1e3};
    const size=()=>{W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;P=Array.from({length:Math.min(70,W/18|0)},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,r:Math.random()*1.8+.6}))};
    size();addEventListener('resize',size);
    cv.parentElement.addEventListener('mousemove',e=>{const r=cv.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top});
    (function loop(){x.clearRect(0,0,W,H);
      P.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
        x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fillStyle='rgba(255,255,255,.7)';x.fill();
        for(let j=i+1;j<P.length;j++){const q=P[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<110){x.strokeStyle='rgba(167,139,250,'+(1-d/110)*.35+')';x.lineWidth=1;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke()}}
        const dm=Math.hypot(p.x-mouse.x,p.y-mouse.y);if(dm<150){x.strokeStyle='rgba(251,191,36,'+(1-dm/150)*.6+')';x.beginPath();x.moveTo(p.x,p.y);x.lineTo(mouse.x,mouse.y);x.stroke()}});
      requestAnimationFrame(loop)})();
  }
  // 4. mouse parallax on hero cards + cursor spotlight on dark sections
  const hero=document.getElementById('hero');
  if(hero&&!reduce){
    hero.classList.add('spot');
    hero.addEventListener('mousemove',e=>{
      const r=hero.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
      hero.style.setProperty('--mx',(e.clientX-r.left)+'px');hero.style.setProperty('--my',(e.clientY-r.top)+'px');
      hero.querySelectorAll('.hcard').forEach(c=>{const d=+c.dataset.depth||.5;c.style.translate=(px*-34*d)+'px '+(py*-34*d)+'px'});
    });
  }
  document.querySelectorAll('.bg-slate-900,.grid-bg').forEach(s=>{
    if(s===hero)return;s.classList.add('spot-host');s.style.position=s.style.position||'relative';
    s.addEventListener('mousemove',e=>{const r=s.getBoundingClientRect();s.style.setProperty('--mx',(e.clientX-r.left)+'px');s.style.setProperty('--my',(e.clientY-r.top)+'px')});
  });
  // 5. inner page header floating shapes
  document.querySelectorAll('section.grid-bg').forEach(s=>{if(s.id==='hero')return;['s1','s2','s3'].forEach(c=>{const d=document.createElement('span');d.className='fshape '+c;s.prepend(d)})});
  // 6. magnetic buttons
  if(!reduce)document.querySelectorAll('.magnetic').forEach(b=>{
    b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.28}px)`});
    b.addEventListener('mouseleave',()=>b.style.transform='');
  });
  // 7. click ripple
  document.addEventListener('click',e=>{const b=e.target.closest('button,.btn-primary,.btn-ghost,.btn-hero,.btn-hero-ghost');if(!b)return;
    const r=b.getBoundingClientRect(),s=Math.max(r.width,r.height),d=document.createElement('span');d.className='ripple';
    d.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px`;
    b.style.position=getComputedStyle(b).position==='static'?'relative':'';b.appendChild(d);setTimeout(()=>d.remove(),650)});
  // 8. smooth parallax for section headings on scroll (subtle)
  const heads=document.querySelectorAll('h2.reveal');
  if(!reduce)addEventListener('scroll',()=>{heads.forEach(h=>{const r=h.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)h.style.letterSpacing=(-0.02-(r.top/innerHeight)*0.01)+'em'})},{passive:true});
});
