(function(){
  var rok=document.getElementById('rok'); if(rok) rok.textContent=new Date().getFullYear();

  // menu mobilne
  var bur=document.querySelector('.burger'), mm=document.getElementById('menu-mob');
  function zamknij(){bur.setAttribute('aria-expanded','false');bur.setAttribute('aria-label','Otwórz menu');mm.hidden=true;}
  bur.addEventListener('click',function(){
    var o=bur.getAttribute('aria-expanded')==='true';
    if(o){zamknij();}else{bur.setAttribute('aria-expanded','true');bur.setAttribute('aria-label','Zamknij menu');mm.hidden=false;}
  });
  mm.addEventListener('click',function(e){if(e.target.closest('a'))zamknij();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!mm.hidden){zamknij();bur.focus();}});

  // aktywna pozycja menu = bieżąca sekcja
  var linki=[].slice.call(document.querySelectorAll('.nav a'));
  var sek=linki.map(function(a){return document.querySelector(a.getAttribute('href'));});
  function ustaw(){
    var y=window.scrollY+window.innerHeight*0.35, akt=-1;
    sek.forEach(function(s,i){if(s&&s.offsetTop<=y)akt=i;});
    linki.forEach(function(a,i){a.classList.toggle('on',i===akt);});
  }
  window.addEventListener('scroll',ustaw,{passive:true}); ustaw();

  // tory kart (droga detalu, historia) - przesuwanie palcem, myszą, strzałkami
  document.querySelectorAll('[data-slider]').forEach(function(box){
    var tor=box.querySelector('.tor'), el=[].slice.call(tor.children);
    var lp=box.querySelector('.str-l'), pp=box.querySelector('.str-p'), licz=box.querySelector('.licz');
    function krok(){return el[1]?el[1].offsetLeft-el[0].offsetLeft:tor.clientWidth;}
    function stan(){
      var i=Math.round(tor.scrollLeft/krok()), max=tor.scrollWidth-tor.clientWidth-2;
      if(tor.scrollLeft>=max) i=el.length-1;
      licz.textContent=Math.min(i+1,el.length)+' / '+el.length;
      lp.disabled=tor.scrollLeft<=2; pp.disabled=tor.scrollLeft>=max;
    }
    lp.addEventListener('click',function(){tor.scrollBy({left:-krok(),behavior:'smooth'});});
    pp.addEventListener('click',function(){tor.scrollBy({left:krok(),behavior:'smooth'});});
    tor.addEventListener('scroll',stan,{passive:true}); window.addEventListener('resize',stan); stan();
    tor.addEventListener('keydown',function(e){
      if(e.key==='ArrowRight'){e.preventDefault();pp.click();} if(e.key==='ArrowLeft'){e.preventDefault();lp.click();}
    });
    var x0=0,s0=0,ciagnie=false,ruch=false;
    tor.addEventListener('pointerdown',function(e){
      if(e.pointerType!=='mouse')return;
      ciagnie=true;ruch=false;x0=e.clientX;s0=tor.scrollLeft;
    });
    window.addEventListener('pointermove',function(e){
      if(!ciagnie)return; var dx=e.clientX-x0;
      if(Math.abs(dx)>4){ruch=true;tor.classList.add('drag');}
      if(ruch)tor.scrollLeft=s0-dx;
    });
    window.addEventListener('pointerup',function(){
      if(!ciagnie)return; ciagnie=false;
      if(ruch){
        tor.classList.remove('drag');
        var i=Math.round(tor.scrollLeft/krok()); tor.scrollTo({left:i*krok(),behavior:'smooth'});
      }
    });
    tor.addEventListener('click',function(e){if(ruch){e.preventDefault();e.stopPropagation();ruch=false;}},true);
    tor.addEventListener('dragstart',function(e){e.preventDefault();});
  });

  // pasek kontaktu na telefonie - dopiero po przewinięciu za przyciski z pierwszego ekranu
  var mob=document.querySelector('.mob'), cta=document.querySelector('.hero-cta');
  if(mob&&cta&&'IntersectionObserver' in window){
    new IntersectionObserver(function(w){
      var ponizej=!w[0].isIntersecting&&w[0].boundingClientRect.top<0;
      mob.classList.toggle('widac',ponizej);
    }).observe(cta);
  }

  var pl=document.querySelector('.plik input');
  if(pl) pl.addEventListener('change',function(){document.querySelector('.plik-n').textContent=pl.files[0]?pl.files[0].name:'nie wybrano pliku';});

  // formularz pokazowy
  var f=document.getElementById('zapytanie');
  if(f) f.addEventListener('submit',function(e){e.preventDefault();f.querySelector('.form-ok').hidden=false;});
})();
