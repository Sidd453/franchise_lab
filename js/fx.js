/* Franchise Lab V6 - motion & card polish (loads after animations.js) */
(function(){
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* 1. word-mask split for headings */
  function split(el){
    if(el.dataset.split)return;el.dataset.split=1;let i=0;
    (function walk(n){
      [...n.childNodes].forEach(c=>{
        if(c.nodeType===3){
          if(!c.textContent.trim())return;
          const f=document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(t=>{
            if(!t)return;
            if(/^\s+$/.test(t)){f.append(' ');return}
            const w=document.createElement('span');w.className='w';
            const s=document.createElement('span');s.textContent=t;s.style.setProperty('--i',i++);w.append(s);f.append(w);
          });
          n.replaceChild(f,c);
        }else if(c.nodeType===1&&!/^(BR|SVG|IMG|SCRIPT)$/i.test(c.tagName)){walk(c)}
      });
    })(el);
    el.classList.add('split');
  }
  const hio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');hio.unobserve(e.target)}}),{threshold:.2});
  function headings(){
    document.querySelectorAll('main h2, main h1').forEach(h=>{
      if(h.classList.contains('hero-title')||h.closest('.feat,.card-glow,.faq-item,.blog-card,.prose-fl,form,#modal'))return;
      if(h.dataset.split)return;
      if(reduce){return}
      split(h);hio.observe(h);
    });
  }

  /* 2. card enhancements: wrap arrow, count-up investment */
  const cio=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;cio.unobserve(e.target);
    const dd=e.target.querySelector('dl>div:first-child dd');if(!dd||reduce)return;
    const m=dd.textContent.trim().match(/^(\d+(?:\.\d+)?)(\s*(?:Lacs?|Lakhs?|Cr|Crores?)\.?)$/i);if(!m)return;
    const end=parseFloat(m[1]),dec=(m[1].split('.')[1]||'').length,t0=performance.now(),dur=1100;
    (function f(t){const p=Math.min((t-t0)/dur,1),v=end*(1-Math.pow(1-p,3));dd.textContent=v.toFixed(dec)+m[2];if(p<1)requestAnimationFrame(f)})(t0);
  }),{threshold:.6});
  function cards(){
    document.querySelectorAll('a.card-glow.group').forEach(c=>{
      if(c.dataset.fx)return;c.dataset.fx=1;
      const sp=c.querySelector('span.inline-flex');
      if(sp&&/→/.test(sp.textContent)){sp.innerHTML=sp.textContent.replace('→','').trim()+' <i class="arr">→</i>'}
      cio.observe(c);
    });
  }

  /* 3. navbar: hide on scroll down, show on scroll up */
  const nav=document.getElementById('navbar');let last=0,tick=false;
  addEventListener('scroll',()=>{
    if(tick||!nav)return;tick=true;
    requestAnimationFrame(()=>{
      const y=scrollY;nav.classList.toggle('nav-stuck',y>20);
      
      last=y;tick=false;
    });
  },{passive:true});

  /* 4. hero copy drifts slower than page */
  const hc=document.querySelector('.hero-copy'),hv=document.querySelector('.hero-visual');
  if(hc&&!reduce)addEventListener('scroll',()=>{
    const y=Math.min(scrollY,700);hc.style.translate='0 '+(y*.12)+'px';if(hv)hv.style.translate='0 '+(y*-.06)+'px';
  },{passive:true});

  /* 5. run now + whenever content is injected */
  function run(){headings();cards()}
  if(document.readyState!=='loading')run();else document.addEventListener('DOMContentLoaded',run);
  setTimeout(run,300);setTimeout(run,1200);
  new MutationObserver(()=>{clearTimeout(run.t);run.t=setTimeout(run,60)}).observe(document.body,{childList:true,subtree:true});
})();

/* V6.2: process line scroll-draw, cursor follower */
(function(){
  const line=document.querySelector('.steps');
  if(line){
    const b=line.querySelector('.steps-line');
    const upd=()=>{const r=line.getBoundingClientRect(),p=Math.max(0,Math.min(1,(innerHeight*.75-r.top)/(r.height+innerHeight*.2)));b.style.setProperty('--p',p.toFixed(3))};
    addEventListener('scroll',upd,{passive:true});upd();
  }
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
    const c=document.createElement('div'),d=document.createElement('div');c.className='cur';d.className='cur-dot';document.body.append(c,d);
    let x=0,y=0,cx=0,cy=0;
    addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;c.classList.add('on');d.classList.add('on');d.style.transform=`translate(${x}px,${y}px)`;
      c.classList.toggle('big',!!e.target.closest('a,button,.card-glow,.mq-logo,.faq-item'))},{passive:true});
    document.addEventListener('mouseleave',()=>{c.classList.remove('on');d.classList.remove('on')});
    (function loop(){cx+=(x-cx)*.18;cy+=(y-cy)*.18;c.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(loop)})();
  }
})();
