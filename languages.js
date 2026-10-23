/* PawVago language selector — preserves UI controls and user-entered values. */
(() => {
  const dict={"en":["Trip checker","How it works","Features","Mobile preview","Contact","Log in","Create account","A calmer way to travel together","Bring your pet.","Leave the guesswork.","Flying or crossing borders with a dog or cat? Explore pet travel rules, prepare your documents, and organise each step of the journey in one place.","Create free account","Watch demo","Or explore the trip checker","Airline rules & pet policies","Search airlines","HIDE AIRLINES"],"fr":["Vérifier un voyage","Comment ça marche","Fonctionnalités","Aperçu mobile","Contact","Connexion","Créer un compte","Voyager ensemble, l'esprit tranquille","Emmenez votre animal.","Voyagez sans incertitude.","Vous voyagez avec votre chien ou votre chat ? Consultez les règles, préparez les documents et organisez votre voyage au même endroit.","Créer un compte gratuit","Voir la démo","Explorer les règles de voyage","Règles des compagnies aériennes","Rechercher","MASQUER LES COMPAGNIES"],"es":["Comprobar viaje","Cómo funciona","Funciones","Vista móvil","Contacto","Iniciar sesión","Crear cuenta","Viajar juntos con tranquilidad","Viaja con tu mascota.","Sin complicaciones.","¿Viajas con tu perro o gato? Consulta las normas, prepara los documentos y organiza cada paso en un solo lugar.","Crear cuenta gratis","Ver demostración","Explorar normas de viaje","Normas de aerolíneas para mascotas","Buscar aerolíneas","OCULTAR AEROLÍNEAS"],"de":["Reise prüfen","So funktioniert's","Funktionen","Mobile Vorschau","Kontakt","Anmelden","Konto erstellen","Gemeinsam entspannt reisen","Nimm dein Haustier mit.","Ohne Rätselraten.","Du reist mit Hund oder Katze? Prüfe Reisevorschriften, bereite Dokumente vor und plane alles an einem Ort.","Kostenloses Konto erstellen","Demo ansehen","Reiseregeln entdecken","Fluglinienregeln für Haustiere","Fluglinien suchen","FLUGLINIEN AUSBLENDEN"],"tr":["Seyahat kontrolü","Nasıl çalışır","Özellikler","Mobil önizleme","İletişim","Giriş yap","Hesap oluştur","Birlikte daha rahat seyahat","Evcil dostunu yanına al.","Belirsizliği geride bırak.","Köpeğin veya kedinle mi seyahat ediyorsun? Kuralları incele, belgeleri hazırla ve yolculuğunu tek yerden planla.","Ücretsiz hesap oluştur","Demoyu izle","Seyahat kurallarını keşfet","Havayolu evcil hayvan kuralları","Havayolu ara","HAVAYOLLARINI GİZLE"],"ar":["فحص الرحلة","كيف يعمل","المميزات","معاينة التطبيق","اتصل بنا","تسجيل الدخول","إنشاء حساب","سافروا معًا براحة بال","اصطحب حيوانك الأليف.","ودع الحيرة.","هل تسافر مع كلبك أو قطتك؟ استكشف قواعد السفر وجهّز المستندات ونظّم رحلتك كلها في مكان واحد.","إنشاء حساب مجاني","شاهد العرض","استكشف قواعد السفر","قواعد شركات الطيران للحيوانات","ابحث عن شركة طيران","إخفاء شركات الطيران"]};
  const selectors=[".desktop-nav a:nth-child(1)",".desktop-nav a:nth-child(2)",".desktop-nav a:nth-child(3)",".desktop-nav a:nth-child(4)",".desktop-nav a:nth-child(5)","#loginBtn","#signupBtn",".hero .eyebrow",".hero h1",".hero h1 span",".hero-lead","#heroSignup","#heroDemo",".hero-inline-link",".pvj-airline-summary-copy strong",".pvj-airline-open-text"];
  const picker=document.getElementById('pvLanguage');
  if(!picker)return;
  const originals=selectors.map(q=>document.querySelector(q)?.innerHTML||'');
  const safeLang=lang=>Object.prototype.hasOwnProperty.call(dict,lang)?lang:'en';
  const apply=lang=>{
    lang=safeLang(lang);
    picker.value=lang;
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    // Keep the English fallback for controls that do not yet have verified translations.
    const v=dict[lang];
    selectors.forEach((q,i)=>{
      const el=document.querySelector(q);
      if(!el)return;
      if(lang==='en'){el.innerHTML=originals[i];return;}
      if(i===8){el.innerHTML=v[8]+'<br><span>'+v[9]+'</span>';return;}
      if(i===9)return;
      if(i===11){el.innerHTML=v[11]+' <b aria-hidden="true">→</b>';return;}
      if(i===12){el.innerHTML=v[12]+' <span aria-hidden="true">▶</span>';return;}
      if(i===13){el.innerHTML=v[13]+' <span aria-hidden="true">↗</span>';return;}
      el.textContent=v[i];
    });
    const show= document.querySelector('.pvj-airline-drawer[open] .pvj-airline-open-text');
    if(show)show.setAttribute('data-hide-label',v[16]);
    try{localStorage.setItem('pawvago-language',lang)}catch(_){}
  };
  picker.addEventListener('change',()=>apply(picker.value));
  let initial='en';try{initial=safeLang(localStorage.getItem('pawvago-language')||'en')}catch(_){}
  apply(initial);
})();
