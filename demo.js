/* PawVago guided product demonstration: illustrative sample data, no real reservations. */
(() => {
  "use strict";
  const trigger = document.getElementById("heroDemo");
  if (!trigger) return;

  const chapters = [
    {label:"Your pet",title:"One profile. Every journey.",eyebrow:"01 / GETTING STARTED",caption:"Create your pet's profile once. Your companion's details help guide each trip.",detail:"Milo is a fictional Shih Tzu weighing 8.5 kg; the example carrier weighs 1.2 kg.",time:7000,art:"pet"},
    {label:"Your route",title:"From idea to itinerary.",eyebrow:"02 / PLAN YOUR ROUTE",caption:"Tell PawVago where you're going and how you're travelling.",detail:"An illustrative Nantes → Barcelona trip. The route graphic is schematic, not a live flight map.",time:7000,art:"route"},
    {label:"Airline rules",title:"Cabin, hold or cargo?",eyebrow:"03 / AIRLINE INTELLIGENCE",caption:"Compare published pet policies to identify checks to make before booking.",detail:"This 9.7 kg example is below Vueling's published 10 kg cabin weight maximum, but pet-space, breed, bag size and route acceptance are not confirmed.",time:8000,art:"airline"},
    {label:"Documents",title:"Travel-ready, one step at a time.",eyebrow:"04 / DOCUMENT PREPARATION",caption:"Gather the documents and timing requirements for your route.",detail:"Typical non-commercial travel between France and Spain starts with a microchip, valid rabies vaccination and EU pet passport. Exceptions may apply.",time:7000,art:"docs"},
    {label:"Mobile app",title:"The plan, in your pocket.",eyebrow:"05 / THE MOBILE EXPERIENCE",caption:"A connected view of your pets, trips, documents and next steps.",detail:"The phone preview is an interactive concept with example data — not a published mobile app.",time:7000,art:"mobile"}
  ];
  const scenes = {
    pet:[
      '<div class="pvd-appcard"><div class="pvd-app-top"><span>🐾 PET PROFILE</span><small>DEMO DATA</small></div>',
      '<div class="pvd-pet-main"><div class="pvd-pet-portrait" aria-hidden="true">🐶</div><div><small>YOUR TRAVEL COMPANION</small><h3>Milo</h3><p>Shih Tzu · Dog</p><div class="pvd-pet-pills"><span>Pet ID</span><span>Documents</span></div></div></div>',
      '<div class="pvd-stats"><div><small>PET WEIGHT</small><strong>8.5 <em>kg</em></strong></div><div><small>CARRIER</small><strong>1.2 <em>kg</em></strong></div><div><small>TOTAL</small><strong>9.7 <em>kg</em></strong></div></div>',
      '<div class="pvd-app-note"><span>✓</span> A travel companion profile ready for planning</div></div>'
    ].join(''),
    route:[
      '<div class="pvd-route"><div class="pvd-route-header"><span>PAWVAGO ROUTE PREVIEW</span><small>✈ AIR JOURNEY</small></div>',
      '<div class="pvd-route-lines"><svg viewBox="0 0 600 190" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path d="M50 164C165 13 433 13 550 164" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="5"/><path class="pvd-route-dash" d="M50 164C165 13 433 13 550 164" fill="none" stroke="#e1bf88" stroke-dasharray="8 10" stroke-width="4"/><circle cx="50" cy="164" r="12" fill="#90c1df"/><circle cx="550" cy="164" r="12" fill="#e1bf88"/></svg><span class="pvd-route-plane">✈</span></div>',
      '<div class="pvd-route-cities"><div><small>FROM</small><strong>Nantes</strong><span>France</span></div><b>→</b><div class="pvd-right"><small>TO</small><strong>Barcelona</strong><span>Spain</span></div></div>',
      '<div class="pvd-route-footer"><strong>Trip structure</strong><span>Origin · Destination · Pet · Mode</span><small>Illustrative route, no live flight inventory</small></div></div>'
    ].join(''),
    airline:[
      '<div class="pvd-appcard"><div class="pvd-app-top"><span>✈ AIRLINE INTELLIGENCE</span><small>REFERENCE POLICY</small></div>',
      '<div class="pvd-airline-top"><div><small>AIRLINE</small><h3>Vueling</h3><p>Example cabin check</p></div><div class="pvd-airline-tag">VY</div></div>',
      '<div class="pvd-airline-weight"><div><small>PET + CARRIER</small><strong>9.7 kg</strong></div><div class="pvd-meter"><span></span></div><div><small>PUBLISHED MAX</small><strong>10 kg</strong></div></div>',
      '<div class="pvd-warning"><b>!</b><span>Weight screen only. You must confirm carrier dimensions, breed, flight route and pet capacity with Vueling.</span></div>',
      '<div class="pvd-airline-types"><span>Cabin <b>Verify</b></span><span>Checked hold <b>Not offered</b></span><span>Air cargo <b>Separate enquiry</b></span></div></div>'
    ].join(''),
    docs:[
      '<div class="pvd-appcard"><div class="pvd-app-top"><span>▤ DOCUMENT ORGANISER</span><small>EXAMPLE CHECKLIST</small></div>',
      '<div class="pvd-doc-header"><div><small>FRANCE → SPAIN</small><h3>Your travel essentials</h3></div><div class="pvd-doc-count">03</div></div>',
      '<div class="pvd-doc-list"><div><b>01</b><span><strong>Identification microchip</strong><small>Match ID and paperwork</small></span><em>CHECK</em></div>',
      '<div><b>02</b><span><strong>Valid rabies vaccination</strong><small>Dates, validity and waiting period</small></span><em>CHECK</em></div>',
      '<div><b>03</b><span><strong>EU pet passport</strong><small>Check recorded details</small></span><em>CHECK</em></div></div>',
      '<div class="pvd-app-note"><span>ⓘ</span> Preparation only, not border or veterinary approval</div></div>'
    ].join(''),
    mobile:[
      '<div class="pvd-mobile-scene"><div class="pvd-mobile-orbit"></div><div class="pvd-phone"><div class="pvd-phone-notch"></div><div class="pvd-phone-status">9:41 <span>●●● ▰</span></div>',
      '<div class="pvd-phone-brand"><span>⌖</span><strong>PawVago</strong></div><small>YOUR JOURNEY</small><h3>Morning, Milo!</h3><p>Next up: review travel requirements.</p>',
      '<div class="pvd-phone-trip"><small>UPCOMING TRIP</small><strong>Nantes → Barcelona</strong><span>Air · France to Spain</span><div class="pvd-phone-progress"><i></i></div></div>',
      '<div class="pvd-phone-grid"><div>▤<strong>Documents</strong><small>3 to review</small></div><div>✈<strong>Airline</strong><small>Verify flight</small></div></div>',
      '<div class="pvd-phone-menu"><span>⌂</span><span>♡</span><span>⌖</span><span>▤</span></div></div>',
      '<div class="pvd-mobile-callout"><b>◈</b><strong>One pet.<br>One journey.</strong><small>Explore the site’s mobile concept next.</small></div></div>'
    ].join('')
  };
  const overlay = document.createElement("div");
  overlay.id = "pvDemoOverlay";
  overlay.className = "pvd-overlay";
  overlay.hidden = true;
  overlay.innerHTML = [
    '<div class="pvd-dialog" role="dialog" aria-modal="true" aria-labelledby="pvdTitle" aria-describedby="pvdDescription">',
    '<header class="pvd-topbar"><div class="pvd-brand"><img src="assets/logo.svg" alt="" width="38" height="38"><strong>PawVago</strong><span>PRODUCT TOUR</span></div>',
    '<div class="pvd-top-actions"><span id="pvdStatus">INTERACTIVE PRODUCT TOUR</span><button id="pvdClose" type="button" aria-label="Close demo">×</button></div></header>',
    '<div class="pvd-content"><aside class="pvd-sidebar"><div class="pvd-sidebar-title">THE PAWVAGO EXPERIENCE</div><div class="pvd-chapters" id="pvdChapters" aria-label="Demo chapters"></div>',
    '<div class="pvd-sidebar-note">ⓘ Interactive walkthrough with sample data. No live booking or travel approval.</div></aside>',
    '<section class="pvd-viewer"><div class="pvd-viewer-title"><div><small id="pvdEyebrow"></small><h2 id="pvdTitle"></h2></div><span id="pvdCounter"></span></div>',
    '<div class="pvd-stage" id="pvdStage"></div><p class="pvd-description" id="pvdDescription"></p><p class="pvd-detail" id="pvdDetail"></p></section></div>',
    '<footer class="pvd-footer"><div class="pvd-progress" id="pvdProgress" role="progressbar" aria-label="Demo progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i id="pvdProgressFill"></i></div>',
    '<div class="pvd-controls"><span id="pvdTime" class="pvd-timer">00:00 / 00:36</span>',
    '<div class="pvd-playback"><button id="pvdRestart" type="button" aria-label="Restart demo">↺</button><button id="pvdPrev" type="button" aria-label="Previous chapter">←</button><button id="pvdToggle" class="pvd-toggle" type="button" aria-label="Pause demo">❚❚ Pause</button><button id="pvdNext" type="button" aria-label="Next chapter">→</button></div>',
    '<div class="pvd-cta"><button id="pvdMobile" type="button">Explore mobile app ↗</button><button id="pvdTry" class="pvd-try" type="button">Try Trip Checker ↗</button></div></div></footer>',
    '</div>'
  ].join("");
  document.body.appendChild(overlay);

  const $ = id => document.getElementById(id);
  const el = {
    close:$("pvdClose"),status:$("pvdStatus"),chapters:$("pvdChapters"),eyebrow:$("pvdEyebrow"),
    title:$("pvdTitle"),counter:$("pvdCounter"),stage:$("pvdStage"),description:$("pvdDescription"),
    detail:$("pvdDetail"),progress:$("pvdProgress"),fill:$("pvdProgressFill"),timer:$("pvdTime"),
    restart:$("pvdRestart"),prev:$("pvdPrev"),toggle:$("pvdToggle"),next:$("pvdNext"),
    mobile:$("pvdMobile"),try:$("pvdTry")
  };
  el.chapters.innerHTML = chapters.map((ch,i) =>
    '<button class="pvd-chapter" type="button" data-pvd-chapter="' + i + '"><span class="pvd-chapter-number">' +
    String(i+1).padStart(2,"0") + '</span><span><strong>' + ch.label +
    '</strong><small>' + ["Pet identity","Plan a journey","Understand policies","Prepare documents","Mobile experience"][i] +
    '</small></span><b aria-hidden="true">↗</b></button>'
  ).join("");

  const duration = chapters.reduce((sum,ch)=>sum+ch.time,0);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let active = false, playing = false, chapter = 0, elapsed = 0, frame = 0, lastTick = 0, beforeOpen;
  const totalElapsed = () => chapters.slice(0,chapter).reduce((s,ch)=>s+ch.time,0)+elapsed;
  const stamp = ms => "00:"+String(Math.floor(ms/1000)).padStart(2,"0");

  function progress() {
    const percentage = Math.min(100,totalElapsed()/duration*100);
    el.fill.style.width = percentage+"%";
    el.progress.setAttribute("aria-valuenow",String(Math.round(percentage)));
    el.timer.textContent = stamp(totalElapsed())+" / "+stamp(duration);
  }
  function controls() {
    el.prev.disabled = chapter===0;
    el.next.disabled = chapter===chapters.length-1;
    el.toggle.textContent = playing ? "❚❚ Pause" : "▶ Play";
    el.toggle.setAttribute("aria-label",playing?"Pause demo":"Play demo");
    el.status.textContent = (playing?"PLAYING":"PAUSED")+" · INTERACTIVE TOUR";
    el.chapters.querySelectorAll("[data-pvd-chapter]").forEach((button,i)=>{
      button.classList.toggle("pvd-active",i===chapter);
      button.classList.toggle("pvd-complete",i<chapter);
      if(i===chapter)button.setAttribute("aria-current","step");
      else button.removeAttribute("aria-current");
    });
  }
  function render() {
    const ch = chapters[chapter];
    el.eyebrow.textContent = ch.eyebrow;
    el.title.textContent = ch.title;
    el.counter.textContent = String(chapter+1).padStart(2,"0")+" / 05";
    el.description.textContent = ch.caption;
    el.detail.textContent = ch.detail;
    el.stage.className = "pvd-stage pvd-scene-"+ch.art;
    el.stage.innerHTML = scenes[ch.art];
    controls();
    progress();
  }
  function stopFrame(){if(frame)window.cancelAnimationFrame(frame);frame=0;lastTick=0;}
  function pause(){playing=false;stopFrame();controls();}
  function animate(now) {
    if(!active||!playing)return;
    if(!lastTick)lastTick=now;
    elapsed+=Math.min(200,Math.max(0,now-lastTick));
    lastTick=now;
    if(elapsed>=chapters[chapter].time){
      if(chapter===chapters.length-1){elapsed=chapters[chapter].time;pause();progress();return;}
      chapter+=1;elapsed=0;render();
    }
    progress();
    if(playing)frame=window.requestAnimationFrame(animate);
  }
  function play(){
    if(!active||playing)return;
    if(chapter===chapters.length-1&&elapsed>=chapters[chapter].time){chapter=0;elapsed=0;render();}
    playing=true;lastTick=0;controls();frame=window.requestAnimationFrame(animate);
  }
  function move(i) {
    if(i<0||i>=chapters.length)return;
    const resume=playing&&!reducedMotion;
    pause();chapter=i;elapsed=0;render();if(resume)play();
  }
  function open(){
    if(active)return;
    beforeOpen=document.activeElement;
    active=true;playing=false;chapter=0;elapsed=0;
    overlay.hidden=false;
    document.body.classList.add("pvd-lock");
    render();el.close.focus({preventScroll:true});
    if(!reducedMotion)play();
  }
  function close(){
    if(!active)return;
    pause();active=false;overlay.hidden=true;document.body.classList.remove("pvd-lock");
    if(beforeOpen&&typeof beforeOpen.focus==="function")beforeOpen.focus({preventScroll:true});
  }
  function jump(id){
    close();const target=document.getElementById(id);
    if(target)target.scrollIntoView({behavior:reducedMotion?"auto":"smooth",block:"start"});
  }
  trigger.addEventListener("click",open);
  el.close.addEventListener("click",close);
  overlay.addEventListener("click",event=>{if(event.target===overlay)close();});
  el.prev.addEventListener("click",()=>move(chapter-1));
  el.next.addEventListener("click",()=>move(chapter+1));
  el.toggle.addEventListener("click",()=>playing?pause():play());
  el.restart.addEventListener("click",()=>{pause();chapter=0;elapsed=0;render();if(!reducedMotion)play();});
  el.mobile.addEventListener("click",()=>jump("mobile-app"));
  el.try.addEventListener("click",()=>jump("journey-lab"));
  el.chapters.addEventListener("click",event=>{
    const button=event.target.closest("[data-pvd-chapter]");
    if(button)move(Number(button.dataset.pvdChapter));
  });
  document.addEventListener("keydown",event=>{
    if(!active)return;
    if(event.key==="Escape"){event.preventDefault();close();return;}
    if(event.key==="ArrowLeft"||event.key==="ArrowRight"){
      event.preventDefault();move(chapter+(event.key==="ArrowLeft"?-1:1));return;
    }
    if(event.key!=="Tab")return;
    const controls=Array.from(overlay.querySelectorAll("button:not(:disabled), a[href]"))
      .filter(node=>node.getClientRects().length>0);
    if(!controls.length)return;
    if(event.shiftKey&&document.activeElement===controls[0]){event.preventDefault();controls[controls.length-1].focus();}
    else if(!event.shiftKey&&document.activeElement===controls[controls.length-1]){event.preventDefault();controls[0].focus();}
  });
  document.addEventListener("visibilitychange",()=>{if(active&&document.hidden)pause();});
})();
