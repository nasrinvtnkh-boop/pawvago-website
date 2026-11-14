/* PawVago language selector — preserves UI controls and user-entered values. */
(() => {
  const dict={"en":["Trip checker","How it works","Mobile preview","Contact","Log in","Create account","01 / How it works","One pet.","One intelligent journey.","Tell PawVago who your pet is, where you're going and when. The platform organizes the requirements around that exact journey.","Try the product","Airline rules & pet policies","Search airlines","HIDE AIRLINES"],"fr":["Vérifier un voyage","Comment ça marche","Aperçu mobile","Contact","Connexion","Créer un compte","01 / Comment ça marche","Un animal.","Un voyage intelligent.","Indiquez à PawVago les informations sur votre animal, votre destination et votre date de départ. La plateforme organise les formalités de ce voyage.","Essayer le service","Règles des compagnies aériennes","Rechercher","MASQUER LES COMPAGNIES"],"es":["Comprobar viaje","Cómo funciona","Vista móvil","Contacto","Iniciar sesión","Crear cuenta","01 / Cómo funciona","Una mascota.","Un viaje inteligente.","Dile a PawVago quién es tu mascota, adónde vas y cuándo. La plataforma organiza los requisitos de ese viaje.","Probar el servicio","Normas de aerolíneas para mascotas","Buscar aerolíneas","OCULTAR AEROLÍNEAS"],"de":["Reise prüfen","So funktioniert's","Mobile Vorschau","Kontakt","Anmelden","Konto erstellen","01 / So funktioniert's","Ein Haustier.","Eine intelligente Reise.","Sag PawVago, mit welchem Haustier du wohin und wann reist. Die Plattform organisiert die Anforderungen für diese Reise.","Produkt ausprobieren","Fluglinienregeln für Haustiere","Fluglinien suchen","FLUGLINIEN AUSBLENDEN"],"tr":["Seyahat kontrolü","Nasıl çalışır","Mobil önizleme","İletişim","Giriş yap","Hesap oluştur","01 / Nasıl çalışır","Bir evcil dost.","Akıllı bir yolculuk.","PawVago'ya evcil dostunu, nereye ve ne zaman seyahat edeceğini söyle. Platform yolculuğun gerekliliklerini tek yerde düzenler.","Ürünü dene","Havayolu evcil hayvan kuralları","Havayolu ara","HAVAYOLLARINI GİZLE"],"ar":["فحص الرحلة","كيف يعمل","معاينة التطبيق","اتصل بنا","تسجيل الدخول","إنشاء حساب","01 / كيف يعمل","حيوان أليف واحد.","رحلة ذكية واحدة.","أخبر PawVago عن حيوانك الأليف ووجهتك وموعد سفرك. تنظم المنصة المتطلبات المتعلقة بتلك الرحلة.","جرّب الخدمة","قواعد شركات الطيران للحيوانات","ابحث عن شركة طيران","إخفاء شركات الطيران"]};
  const selectors=[".desktop-nav a:nth-child(1)",".desktop-nav a:nth-child(2)",".desktop-nav a:nth-child(3)",".desktop-nav a:nth-child(4)","#loginBtn","#signupBtn",".hero .eyebrow",".hero h1",".hero h1 span",".pv-how-summary p","#ctaSignup",".pvj-airline-summary-copy strong",".pvj-airline-open-text"];
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
      if(i===7){el.innerHTML=v[7]+'<br><span>'+v[8]+'</span>';return;}
      if(i===8)return;
      if(i===10){el.innerHTML=v[10]+' <b aria-hidden="true">→</b>';return;}
      el.textContent=v[i];
    });
    const show= document.querySelector('.pvj-airline-drawer[open] .pvj-airline-open-text');
    if(show)show.setAttribute('data-hide-label',v[13]);
    try{localStorage.setItem('pawvago-language',lang)}catch(_){}
  };
  picker.addEventListener('change',()=>apply(picker.value));
  let initial='en';try{initial=safeLang(localStorage.getItem('pawvago-language')||'en')}catch(_){}
  apply(initial);
})();
