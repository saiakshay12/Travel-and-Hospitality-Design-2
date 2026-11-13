(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const toast = (message) => { const el=$('#toast'); el.textContent=message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove('show'),2800); };
  const menu=$('.menu-toggle'), nav=$('.main-nav');
  // Lodge details dialog: opens from the selected-stay card and closes accessibly.
  const stayDialog=$('#stayDialog'), openStay=$('#openStayDetails'), closeStay=$('#closeStayDetails'), stayContinue=$('#stayContinue');
  if(stayDialog && openStay){
    openStay.addEventListener('click',()=>{ if(typeof stayDialog.showModal==='function') stayDialog.showModal(); else stayDialog.setAttribute('open',''); });
    closeStay?.addEventListener('click',()=>stayDialog.close ? stayDialog.close() : stayDialog.removeAttribute('open'));
    stayDialog.addEventListener('click',e=>{ if(e.target===stayDialog) stayDialog.close(); });
    stayContinue?.addEventListener('click',()=>{ if(stayDialog.close) stayDialog.close(); });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape' && stayDialog.open && stayDialog.close) stayDialog.close(); });
  }

  // Keep the mobile navigation predictable: close after selection, outside tap, or Escape.
  const closeMenu=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');};
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  document.addEventListener('click',e=>{if(nav.classList.contains('open')&&!nav.contains(e.target)&&!menu.contains(e.target))closeMenu();});
  // Remote image resilience: retry once with a known alpine image, then show a designed fallback surface.
  $$('img').forEach(img=>{
    img.loading = img.classList.contains('hero-image') ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.addEventListener('error',()=>{
      if(!img.dataset.fallbackTried){
        img.dataset.fallbackTried='1';
        img.src='https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80';
      }else{
        img.hidden=true;
        const holder=img.parentElement;
        if(holder){holder.classList.add('image-fallback');holder.setAttribute('role','img');holder.setAttribute('aria-label',img.alt||'Mountain landscape');}
      }
    });
  });
  menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
  $$('.main-nav a').forEach(a=>a.addEventListener('click',closeMenu));
  const cards=$$('.departure-card');
  function applyFilters(){const grade=$('#gradeFilter').value,date=$('#dateFilter').value,guests=Number($('#guestFilter').value);let shown=0;cards.forEach(card=>{const gradeOk=grade==='all'||card.dataset.grade===grade;const dateOk=date==='all'||card.textContent.toLowerCase().includes(date.replace(' 2027','').toLowerCase());card.hidden=!(gradeOk&&dateOk);if(!card.hidden){shown++;const per=Number(card.dataset.price),total=per*guests+35*guests+60;const price=card.querySelector('.price-line>span');if(price)price.textContent=`€${total.toLocaleString('en-US')} total for ${guests}`;const perAdult=card.querySelector('.price-line strong');if(perAdult)perAdult.innerHTML=`€${per.toLocaleString('en-US')} <small>/ adult</small>`;}});$('#resultCount').textContent=shown;$('#departures').scrollIntoView({behavior:'smooth'});toast(`${shown} matching ${shown===1?'route':'routes'} · ${guests} ${guests===1?'adult':'adults'}`);}
  $('#searchDepartures').addEventListener('click',applyFilters);
  $('#sortSelect').addEventListener('change',e=>{const grid=$('#departureGrid');const sorted=[...cards].sort((a,b)=>e.target.value==='price-low'?+a.dataset.price-+b.dataset.price:e.target.value==='rating'?+b.dataset.rating-+a.dataset.rating:0);sorted.forEach(c=>grid.appendChild(c));});
  $$('.save-trip').forEach(btn=>btn.addEventListener('click',()=>{btn.classList.toggle('saved');toast(btn.classList.contains('saved')?'Saved to your trips':'Removed from saved trips');}));
  function showDetail(){ $('#trip-detail').scrollIntoView({behavior:'smooth'}); }
  $$('.choose-trip').forEach(btn=>btn.addEventListener('click',()=>{const name=btn.dataset.trip==='meadow'?'Meadow & Hut Explorer':btn.dataset.trip==='tre-cime'?'Tre Cime Trail Circle':'Dolomite Ridge Week';toast(`${name} selected · Opening trip details`);showDetail();}));
  $('#compareBtn').addEventListener('click',()=>{toast('Route comparison: Moderate · Easy · Moderate. See the three route cards above.');$('#departureGrid').scrollIntoView({behavior:'smooth',block:'center'});});
  $('#reserveBtn').addEventListener('click',()=>{ $('#checkout').scrollIntoView({behavior:'smooth'});toast('Your four places are ready to reserve'); });
  // Frontend-only demo sign-in: validates fields and keeps only the email in session storage.
  const authDialog=$('#authDialog'), authForm=$('#authForm'), authError=$('#authError'), authEmail=$('#authEmail'), authPassword=$('#authPassword'), accountBtn=$('#accountBtn');
  const updateAccountButton=()=>{
    const email=sessionStorage.getItem('stacklyDemoEmail');
    accountBtn.innerHTML=email ? `Sign out <span class="avatar">${email.trim().charAt(0).toUpperCase()}</span>` : 'My trips <span class="avatar">S</span>';
    accountBtn.setAttribute('aria-label',email ? `Sign out ${email}` : 'Sign in to My trips');
  };
  updateAccountButton();
  accountBtn.addEventListener('click',()=>{
    if(sessionStorage.getItem('stacklyDemoEmail')){
      sessionStorage.removeItem('stacklyDemoEmail'); updateAccountButton(); toast('You have signed out of the demo account.');
    } else if(authDialog?.showModal){ authError.textContent=''; authForm.reset(); authDialog.showModal(); authEmail.focus(); }
    else { toast('Sign-in dialog is not supported by this browser.'); }
  });
  $('#closeAuth')?.addEventListener('click',()=>authDialog.close());
  authDialog?.addEventListener('click',e=>{if(e.target===authDialog)authDialog.close();});
  authForm?.addEventListener('submit',e=>{
    e.preventDefault();
    if(!authForm.reportValidity()) return;
    const email=authEmail.value.trim();
    if(!email || authPassword.value.length<4){authError.textContent='Enter a valid email and a password with at least 4 characters.';return;}
    sessionStorage.setItem('stacklyDemoEmail',email);
    authPassword.value=''; authDialog.close(); updateAccountButton();
    toast(`Signed in for this demo as ${email}`);
  });
  $('#galleryBtn').addEventListener('click',()=>toast('Gallery preview · 12 trip photographs')); 
  $('#editBooking').addEventListener('click',()=>{ $('#departures').scrollIntoView({behavior:'smooth'});toast('Choose another departure above'); });
  $('#bookingForm').addEventListener('submit',e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;$('#checkout').style.display='none';$('#confirmation').classList.add('show');$('#confirmation').scrollIntoView({behavior:'smooth'});toast('Demo booking confirmed · TRB-DOL-27096');});
  $('#saveConfirmation').addEventListener('click',()=>{const text='Stackly booking confirmation\nTRB-DOL-27096\nDolomite Ridge Week\n6–10 September 2027\n4 adults · 2 twin rooms\nTotal: €4,120\nMeeting point: Ortisei central bus station · 6 Sep at 10:00';const blob=new Blob([text],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Stackly-Booking-TRB-DOL-27096.txt';a.click();URL.revokeObjectURL(a.href);toast('Confirmation saved');});
  $('#calendarBtn').addEventListener('click',()=>{const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Stackly//Trip//EN','BEGIN:VEVENT','UID:TRB-DOL-27096@stackly.example','DTSTAMP:20261112T090000Z','DTSTART:20270906T080000Z','DTEND:20270910T120000Z','SUMMARY:Stackly · Dolomite Ridge Week','LOCATION:Ortisei, Italy','DESCRIPTION:Five guided walking days in the Italian Dolomites.','END:VEVENT','END:VCALENDAR'].join('\r\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));a.download='Stackly-Dolomite-Ridge-Week.ics';a.click();URL.revokeObjectURL(a.href);toast('Calendar event downloaded');});
  $('#manageBooking').addEventListener('click',()=>{ $('#checkout').style.display='block';$('#confirmation').classList.remove('show');$('#checkout').scrollIntoView({behavior:'smooth'});toast('Demo booking details reopened');});
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}}),{threshold:.12});
  $$('.section-heading,.terrain-card,.day-row,.principles article,.departure-card,.detail-block').forEach(el=>{el.classList.add('reveal');revealObserver.observe(el);});
  // Subtle pointer parallax on the hero image; disabled for touch and reduced-motion users.
  const hero=$('.hero-visual'), heroImg=$('.hero-image');if(matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;heroImg.style.transform=`scale(1.035) translate(${x*-9}px,${y*-7}px)`;});hero.addEventListener('pointerleave',()=>heroImg.style.transform='');}
  // Deep links to checkout/confirmation work when opening the project from a URL.
  if(location.hash==='#checkout')$('#checkout').scrollIntoView();
})();
