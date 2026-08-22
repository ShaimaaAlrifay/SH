/* ---- mood: one theme state, stored, restored, and animated ---- */
(function(){
  var root=document.documentElement, btn=document.getElementById('mood');
  var KEY='shaimaa-mood';
  function apply(mode,animate){
    if(animate){ root.classList.add('theming');
      setTimeout(function(){ root.classList.remove('theming'); },700); }
    if(mode==='light') root.setAttribute('data-theme','light');
    else root.removeAttribute('data-theme');
    btn.setAttribute('aria-pressed', mode==='light');
  }
  var saved=null;
  try{ saved=localStorage.getItem(KEY); }catch(e){}
  apply(saved==='light'?'light':'dark',false);
  btn.addEventListener('click',function(){
    var next = root.getAttribute('data-theme')==='light' ? 'dark' : 'light';
    btn.classList.add('turning');
    setTimeout(function(){ btn.classList.remove('turning'); },620);
    apply(next,true);
    try{ localStorage.setItem(KEY,next); }catch(e){}
  });
})();

/* ---- areep: a glimpse, not a page ---- */
(function(){
  var ov=document.getElementById('areep'), open=document.getElementById('peek'),
      close=document.getElementById('arClose'), last=null;
  if(!ov||!open) return;
  function show(){
    last=document.activeElement;
    ov.removeAttribute('inert'); ov.classList.add('open');
    document.body.style.overflow='hidden';
    close.focus({preventScroll:true});
  }
  function hide(){
    ov.classList.remove('open');
    document.body.style.overflow='';
    setTimeout(function(){ ov.setAttribute('inert',''); },420);
    if(last) last.focus({preventScroll:true});
  }
  open.addEventListener('click',show);
  close.addEventListener('click',hide);
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape' && ov.classList.contains('open')) hide();
  });

  /* fragments drift with the cursor; the nodes wake as you pass them */
  var fine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(fine){
    var layers=ov.querySelectorAll('[data-par]'), tx=0,ty=0,cx=0,cy=0,raf=null;
    ov.addEventListener('mousemove',function(e){
      tx=(e.clientX/window.innerWidth-.5); ty=(e.clientY/window.innerHeight-.5);
      if(!raf) raf=requestAnimationFrame(tick);
    });
    function tick(){
      cx+=(tx-cx)*.08; cy+=(ty-cy)*.08;
      layers.forEach(function(l){
        var k=parseFloat(l.getAttribute('data-par'));
        l.style.transform='translate3d('+(cx*-14*k)+'px,'+(cy*-10*k)+'px,0)';
      });
      raf = (Math.abs(tx-cx)>.001||Math.abs(ty-cy)>.001) ? requestAnimationFrame(tick) : null;
    }
    ov.querySelectorAll('.nd').forEach(function(g){
      g.addEventListener('mouseenter',function(){ g.classList.add('on'); });
      g.addEventListener('mouseleave',function(){ g.classList.remove('on'); });
    });
  }
})();
