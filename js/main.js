document.addEventListener('DOMContentLoaded',()=>{
  // Navbar shadow on scroll
  const nav=document.getElementById('navbar');
  addEventListener('scroll',()=>nav.classList.toggle('shadow-lg',scrollY>20));
  // Mobile menu
  document.getElementById('menuBtn').addEventListener('click',()=>document.getElementById('mobileMenu').classList.toggle('hidden'));
  // Reveal on scroll
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  // Counters
  const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;
    const el=e.target,t=+el.dataset.count;let n=0;const step=Math.max(1,Math.ceil(t/60));
    const id=setInterval(()=>{n+=step;if(n>=t){n=t;clearInterval(id)}el.textContent=n+'+'},25);co.unobserve(el)}),{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(el=>co.observe(el));
  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item=>{
    item.querySelector('button').addEventListener('click',()=>{
      const open=item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i=>{i.classList.remove('open');i.querySelector('.faq-body').style.maxHeight=0;i.querySelector('.plus').style.transform='none'});
      if(!open){item.classList.add('open');const b=item.querySelector('.faq-body');b.style.maxHeight=b.scrollHeight+'px';item.querySelector('.plus').style.transform='rotate(45deg)'}
    });
  });
  // Form tabs
  const tabs=document.querySelectorAll('[data-tab]');
  tabs.forEach(t=>t.addEventListener('click',()=>{
    tabs.forEach(x=>{x.classList.remove('bg-white','text-brand-600','shadow');x.classList.add('text-white')});
    t.classList.add('bg-white','text-brand-600','shadow');t.classList.remove('text-white');
    document.querySelectorAll('[data-panel]').forEach(p=>p.classList.toggle('hidden',p.dataset.panel!==t.dataset.tab));
  }));
  // Modal
  const modal=document.getElementById('modal');
  document.querySelectorAll('[data-open-modal]').forEach(b=>b.addEventListener('click',()=>{modal.classList.remove('hidden');modal.classList.add('flex');document.body.style.overflow='hidden'}));
  const close=()=>{modal.classList.add('hidden');modal.classList.remove('flex');document.body.style.overflow=''};
  document.querySelectorAll('[data-close-modal]').forEach(b=>b.addEventListener('click',close));
  addEventListener('keydown',e=>e.key==='Escape'&&close());
  // Forms (demo handler - connect to your backend)
  document.querySelectorAll('form').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();
    const btn=f.querySelector('button[type=submit]'),old=btn.textContent;btn.textContent='Sent ✓';setTimeout(()=>{btn.textContent=old;f.reset()},2000)}));
});
