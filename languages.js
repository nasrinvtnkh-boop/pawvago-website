/* PawVago language selector — preserves UI controls and user-entered values. */
(() => {
  const dict={"en":["Trip checker","How it works","Mobile preview","Contact","Log in","Create account","01 / How it works","One pet.","One intelligent journey.","Tell PawVago who your pet is, where you're going and when. The platform organizes the requirements around that exact journey.","Try the product","Airline rules & pet policies","Search airlines","HIDE AIRLINES"],"fr":["Vérifier un voyage","Comment ça marche","Aperçu mobile","Contact","Connexion","Créer un compte","01 / Comment ça marche","Un animal.","Un voyage intelligent.","Indiquez à PawVago les informations sur votre animal, votre destination et votre date de départ. La plateforme organise les formalités de ce voyage.","Essayer le service","Règles des compagnies aériennes","Rechercher","MASQUER LES COMPAGNIES"],"es":["Comprobar viaje","Cómo funciona","Vista móvil","Contacto","Iniciar sesión","Crear cuenta","01 / Cómo funciona","Una mascota.","Un viaje inteligente.","Dile a PawVago quién es tu mascota, adónde vas y cuándo. La plataforma organiza los requisitos de ese viaje.","Probar el servicio","Normas de aerolíneas para mascotas","Buscar aerolíneas","OCULTAR AEROLÍNEAS"],"de":["Reise prüfen","So funktioniert's","Mobile Vorschau","Kontakt","Anmelden","Konto erstellen","01 / So funktioniert's","Ein Haustier.","Eine intelligente Reise.","Sag PawVago, mit welchem Haustier du wohin und wann reist. Die Plattform organisiert die Anforderungen für diese Reise.","Produkt ausprobieren","Fluglinienregeln für Haustiere","Fluglinien suchen","FLUGLINIEN AUSBLENDEN"],"tr":["Seyahat kontrolü","Nasıl çalışır","Mobil önizleme","İletişim","Giriş yap","Hesap oluştur","01 / Nasıl çalışır","Bir evcil dost.","Akıllı bir yolculuk.","PawVago'ya evcil dostunu, nereye ve ne zaman seyahat edeceğini söyle. Platform yolculuğun gerekliliklerini tek yerde düzenler.","Ürünü dene","Havayolu evcil hayvan kuralları","Havayolu ara","HAVAYOLLARINI GİZLE"],"ar":["فحص الرحلة","كيف يعمل","معاينة التطبيق","اتصل بنا","تسجيل الدخول","إنشاء حساب","01 / كيف يعمل","حيوان أليف واحد.","رحلة ذكية واحدة.","أخبر PawVago عن حيوانك الأليف ووجهتك وموعد سفرك. تنظم المنصة المتطلبات المتعلقة بتلك الرحلة.","جرّب الخدمة","قواعد شركات الطيران للحيوانات","ابحث عن شركة طيران","إخفاء شركات الطيران"]};
  dict.fa=["بررسی سفر", "روش کار", "پیش‌نمایش اپلیکیشن", "تماس", "ورود", "ساخت حساب", "۰۱ / روش کار", "یک حیوان خانگی.", "یک سفر هوشمند.", "به پاواگو بگو حیوان خانگی‌ات کیست، مقصدت کجاست و چه زمانی سفر می‌کنی. پاواگو الزامات همان سفر را یک‌جا مرتب می‌کند.", "امتحان کنید", "قوانین ایرلاین‌ها برای حیوانات خانگی", "جست‌وجوی ایرلاین‌ها", "پنهان‌کردن ایرلاین‌ها"];
  const selectors=[".desktop-nav a:nth-child(1)",".desktop-nav a:nth-child(2)",".desktop-nav a:nth-child(3)",".desktop-nav a:nth-child(4)","#loginBtn","#signupBtn",".hero .eyebrow",".hero h1",".hero h1 span",".pv-how-summary p","#ctaSignup",".pvj-airline-summary-copy strong",".pvj-airline-open-text"];
  const picker=document.getElementById('pvLanguage');
  if(!picker)return;
  const originals=selectors.map(q=>document.querySelector(q)?.innerHTML||'');
  const safeLang=lang=>Object.prototype.hasOwnProperty.call(dict,lang)?lang:'en';
  const persianText={"PAWVAGO TRAVEL TOOLS": "ابزارهای سفر پاواگو", "Check pet travel rules": "بررسی قوانین سفر حیوانات خانگی", "Compare airline policies, explore travel requirements, or search the airline directory.": "قوانین ایرلاین‌ها و الزامات سفر را بررسی و مقایسه کنید.", "Plan a pet journey": "برنامه‌ریزی سفر حیوان خانگی", "Search airline rules": "جست‌وجوی قوانین ایرلاین‌ها", "PAWVAGO / JOURNEY INTELLIGENCE": "پاواگو / برنامه‌ریزی هوشمند سفر", "Make every journey": "هر سفر را", "feel effortless.": "آسان‌تر کنید.", "Build your journey": "سفرتان را بسازید", "Start with your route and pet details.": "با مسیر و مشخصات حیوان خانگی شروع کنید.", "From country": "کشور مبدأ", "To country": "کشور مقصد", "Departure city": "شهر مبدأ", "Arrival city": "شهر مقصد", "Pet type": "نوع حیوان خانگی", "Select pet type": "انتخاب نوع حیوان", "Dog": "سگ", "Cat": "گربه", "Travel date": "تاریخ سفر", "Pet weight (kg)": "وزن حیوان (کیلوگرم)", "Carrier weight (kg)": "وزن کیف حمل (کیلوگرم)", "Cabin bag dimensions": "ابعاد کیف کابین", "optional": "اختیاری", "Length (cm)": "طول (سانتی‌متر)", "Width (cm)": "عرض (سانتی‌متر)", "Height (cm)": "ارتفاع (سانتی‌متر)", "Hard travel crate for the hold": "باکس سخت برای قسمت بار", "Rigid crate weight (kg)": "وزن باکس سخت (کیلوگرم)", "Crate length (cm)": "طول باکس (سانتی‌متر)", "Crate width (cm)": "عرض باکس (سانتی‌متر)", "Crate height (cm)": "ارتفاع باکس (سانتی‌متر)", "How are you travelling?": "چگونه سفر می‌کنید؟", "Find airline options automatically": "پیداکردن خودکار ایرلاین‌های مناسب", "Cabin + Hold": "کابین و قسمت بار", "With you": "همراه شما", "Checked baggage": "بار همراه مسافر", "Air freight": "حمل بار هوایی", "Pet breed": "نژاد حیوان", "(recommended)": "(پیشنهاد می‌شود)", "(optional)": "(اختیاری)", "Check a specific airline": "بررسی یک ایرلاین مشخص", "Compare airlines for my pet": "مقایسه ایرلاین‌ها برای حیوان من", "Create a pet profile": "ساخت پروفایل حیوان خانگی", "Plan the route": "برنامه‌ریزی مسیر", "Follow the plan": "دنبال‌کردن برنامه", "Save breed, weight and travel details once. Your profile becomes the context for every trip.": "نژاد، وزن و اطلاعات سفر را یک بار ذخیره کنید تا در سفرهای بعدی در دسترس باشند.", "Enter origin, destination and date. PawVago checks the relevant airline and destination rules.": "مبدأ، مقصد و تاریخ را وارد کنید. پاواگو قوانین مربوط به ایرلاین و مقصد را بررسی می‌کند.", "See documents, deadlines, risks and useful destination services in one workflow.": "مدارک، مهلت‌ها، ریسک‌ها و خدمات مفید مقصد را یک‌جا ببینید.", "Enter departure city": "شهر مبدأ را وارد کنید", "Enter arrival city": "شهر مقصد را وارد کنید", "Language": "زبان", "Skip to main content": "رفتن به محتوای اصلی"};
  const translatedNodes = new Map();
  const translatedAttributes = [];
  const apply=lang=>{
    translatedNodes.forEach((text,node)=>{if(node.isConnected)node.nodeValue=text;});
    translatedNodes.clear();
    translatedAttributes.splice(0).forEach(([el,attr,value])=>el.setAttribute(attr,value));
    lang=safeLang(lang);
    picker.value=lang;
    document.documentElement.lang=lang;
    document.documentElement.dir=['ar','fa'].includes(lang)?'rtl':'ltr';
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
    if(lang==='fa'){
      const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
      let node;
      while((node=walker.nextNode())){
        if(node.parentElement.closest('script,style,#pvLanguage'))continue;
        const key=node.nodeValue.trim();
        if(persianText[key]){translatedNodes.set(node,node.nodeValue);node.nodeValue=node.nodeValue.replace(key,persianText[key]);}
      }
      document.querySelectorAll('[placeholder],[aria-label]').forEach(el=>{
        ['placeholder','aria-label'].forEach(attr=>{const value=el.getAttribute(attr);if(persianText[value]){translatedAttributes.push([el,attr,value]);el.setAttribute(attr,persianText[value]);}});
      });
    }
    try{localStorage.setItem('pawvago-language',lang)}catch(_){}
  };
  picker.addEventListener('change',()=>apply(picker.value));
  let initial='en';try{initial=safeLang(localStorage.getItem('pawvago-language')||'en')}catch(_){}
  apply(initial);
})();
