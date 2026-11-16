/* PawVago language selector — preserves UI controls and user-entered values. */
(() => {
  const dict={"en":["Trip checker","How it works","Mobile preview","Contact","Log in","Create account","01 / How it works","One pet.","One intelligent journey.","Tell PawVago who your pet is, where you're going and when. The platform organizes the requirements around that exact journey.","Try the product","Airline rules & pet policies","Search airlines","HIDE AIRLINES"],"fr":["Vérifier un voyage","Comment ça marche","Aperçu mobile","Contact","Connexion","Créer un compte","01 / Comment ça marche","Un animal.","Un voyage intelligent.","Indiquez à PawVago les informations sur votre animal, votre destination et votre date de départ. La plateforme organise les formalités de ce voyage.","Essayer le service","Règles des compagnies aériennes","Rechercher","MASQUER LES COMPAGNIES"],"es":["Comprobar viaje","Cómo funciona","Vista móvil","Contacto","Iniciar sesión","Crear cuenta","01 / Cómo funciona","Una mascota.","Un viaje inteligente.","Dile a PawVago quién es tu mascota, adónde vas y cuándo. La plataforma organiza los requisitos de ese viaje.","Probar el servicio","Normas de aerolíneas para mascotas","Buscar aerolíneas","OCULTAR AEROLÍNEAS"],"de":["Reise prüfen","So funktioniert's","Mobile Vorschau","Kontakt","Anmelden","Konto erstellen","01 / So funktioniert's","Ein Haustier.","Eine intelligente Reise.","Sag PawVago, mit welchem Haustier du wohin und wann reist. Die Plattform organisiert die Anforderungen für diese Reise.","Produkt ausprobieren","Fluglinienregeln für Haustiere","Fluglinien suchen","FLUGLINIEN AUSBLENDEN"],"tr":["Seyahat kontrolü","Nasıl çalışır","Mobil önizleme","İletişim","Giriş yap","Hesap oluştur","01 / Nasıl çalışır","Bir evcil dost.","Akıllı bir yolculuk.","PawVago'ya evcil dostunu, nereye ve ne zaman seyahat edeceğini söyle. Platform yolculuğun gerekliliklerini tek yerde düzenler.","Ürünü dene","Havayolu evcil hayvan kuralları","Havayolu ara","HAVAYOLLARINI GİZLE"],"ar":["فحص الرحلة","كيف يعمل","معاينة التطبيق","اتصل بنا","تسجيل الدخول","إنشاء حساب","01 / كيف يعمل","حيوان أليف واحد.","رحلة ذكية واحدة.","أخبر PawVago عن حيوانك الأليف ووجهتك وموعد سفرك. تنظم المنصة المتطلبات المتعلقة بتلك الرحلة.","جرّب الخدمة","قواعد شركات الطيران للحيوانات","ابحث عن شركة طيران","إخفاء شركات الطيران"]};
  dict.fa=["بررسی سفر", "روش کار", "پیش‌نمایش اپلیکیشن", "تماس", "ورود", "ساخت حساب", "۰۱ / روش کار", "یک حیوان خانگی.", "یک سفر هوشمند.", "به پاواگو بگو حیوان خانگی‌ات کیست، مقصدت کجاست و چه زمانی سفر می‌کنی. پاواگو الزامات همان سفر را یک‌جا مرتب می‌کند.", "امتحان کنید", "قوانین ایرلاین‌ها برای حیوانات خانگی", "جست‌وجوی ایرلاین‌ها", "پنهان‌کردن ایرلاین‌ها"];
  const selectors=[".desktop-nav a:nth-child(1)",".desktop-nav a:nth-child(2)",".desktop-nav a:nth-child(3)",".desktop-nav a:nth-child(4)","#loginBtn","#signupBtn",".hero .eyebrow",".hero h1",".hero h1 span",".pv-how-summary p","#ctaSignup",".pvj-airline-summary-copy strong",".pvj-airline-open-text"];
  const picker=document.getElementById('pvLanguage');
  const originals=selectors.map(q=>document.querySelector(q)?.innerHTML||'');
  const safeLang=lang=>Object.prototype.hasOwnProperty.call(dict,lang)?lang:'en';
  const persianText={"PAWVAGO TRAVEL TOOLS": "ابزارهای سفر پاواگو", "Check pet travel rules": "بررسی قوانین سفر حیوانات خانگی", "Compare airline policies, explore travel requirements, or search the airline directory.": "قوانین ایرلاین‌ها و الزامات سفر را بررسی و مقایسه کنید.", "Plan a pet journey": "برنامه‌ریزی سفر حیوان خانگی", "Search airline rules": "جست‌وجوی قوانین ایرلاین‌ها", "PAWVAGO / JOURNEY INTELLIGENCE": "پاواگو / برنامه‌ریزی هوشمند سفر", "Make every journey": "هر سفر را", "feel effortless.": "آسان‌تر کنید.", "Build your journey": "سفرتان را بسازید", "Start with your route and pet details.": "با مسیر و مشخصات حیوان خانگی شروع کنید.", "From country": "کشور مبدأ", "To country": "کشور مقصد", "Departure city": "شهر مبدأ", "Arrival city": "شهر مقصد", "Pet type": "نوع حیوان خانگی", "Select pet type": "انتخاب نوع حیوان", "Dog": "سگ", "Cat": "گربه", "Travel date": "تاریخ سفر", "Pet weight (kg)": "وزن حیوان (کیلوگرم)", "Carrier weight (kg)": "وزن کیف حمل (کیلوگرم)", "Cabin bag dimensions": "ابعاد کیف کابین", "optional": "اختیاری", "Length (cm)": "طول (سانتی‌متر)", "Width (cm)": "عرض (سانتی‌متر)", "Height (cm)": "ارتفاع (سانتی‌متر)", "Hard travel crate for the hold": "باکس سخت برای قسمت بار", "Rigid crate weight (kg)": "وزن باکس سخت (کیلوگرم)", "Crate length (cm)": "طول باکس (سانتی‌متر)", "Crate width (cm)": "عرض باکس (سانتی‌متر)", "Crate height (cm)": "ارتفاع باکس (سانتی‌متر)", "How are you travelling?": "چگونه سفر می‌کنید؟", "Find airline options automatically": "پیداکردن خودکار ایرلاین‌های مناسب", "Cabin + Hold": "کابین و قسمت بار", "With you": "همراه شما", "Checked baggage": "بار همراه مسافر", "Air freight": "حمل بار هوایی", "Pet breed": "نژاد حیوان", "(recommended)": "(پیشنهاد می‌شود)", "(optional)": "(اختیاری)", "Check a specific airline": "بررسی یک ایرلاین مشخص", "Compare airlines for my pet": "مقایسه ایرلاین‌ها برای حیوان من", "Create a pet profile": "ساخت پروفایل حیوان خانگی", "Plan the route": "برنامه‌ریزی مسیر", "Follow the plan": "دنبال‌کردن برنامه", "Save breed, weight and travel details once. Your profile becomes the context for every trip.": "نژاد، وزن و اطلاعات سفر را یک بار ذخیره کنید تا در سفرهای بعدی در دسترس باشند.", "Enter origin, destination and date. PawVago checks the relevant airline and destination rules.": "مبدأ، مقصد و تاریخ را وارد کنید. پاواگو قوانین مربوط به ایرلاین و مقصد را بررسی می‌کند.", "See documents, deadlines, risks and useful destination services in one workflow.": "مدارک، مهلت‌ها، ریسک‌ها و خدمات مفید مقصد را یک‌جا ببینید.", "Enter departure city": "شهر مبدأ را وارد کنید", "Enter arrival city": "شهر مقصد را وارد کنید", "Language": "زبان", "Skip to main content": "رفتن به محتوای اصلی"};
  Object.assign(persianText,{
  "PawVago — The smarter way to travel with your pet": "پاواگو — راهی هوشمندانه‌تر برای سفر با حیوان خانگی",
  "Main navigation": "منوی اصلی",
  "Pet travel rules and journey checker": "قوانین و بررسی سفر حیوان خانگی",
  "Travel tool shortcuts": "دسترسی سریع به ابزارهای سفر",
  "Enter your pet’s weight, breed and route. PawVago automatically screens airlines for cabin and hold travel and prepares your document checklist.": "وزن، نژاد و مسیر سفر حیوان خانگی را وارد کنید. پاواگو شرایط ایرلاین‌ها برای کابین و قسمت بار را بررسی و فهرست مدارک لازم را آماده می‌کند.",
  "Official-source reference": "اطلاعات برگرفته از منابع رسمی",
  "Policy snapshot · not a flight reservation or live pet-space check": "نسخهٔ مرجع قوانین · رزرو پرواز یا بررسی لحظه‌ای ظرفیت حمل حیوان نیست",
  "Origin country": "کشور مبدأ",
  "Destination country": "کشور مقصد",
  "e.g. 6": "مثلاً ۶",
  "e.g. 1": "مثلاً ۱",
  "e.g. 42": "مثلاً ۴۲",
  "e.g. 30": "مثلاً ۳۰",
  "e.g. 21": "مثلاً ۲۱",
  "e.g. 80": "مثلاً ۸۰",
  "e.g. 55": "مثلاً ۵۵",
  "e.g. 60": "مثلاً ۶۰",
  "Measure the cabin bag in length × width × height; leave all three blank if unknown.": "طول، عرض و ارتفاع کیف کابین را اندازه بگیرید؛ اگر نمی‌دانید، هر سه را خالی بگذارید.",
  "Cabin bag and rigid hold crate have different weights. If crate weight or size is missing, hold options need manual verification.": "وزن کیف کابین و باکس سخت قسمت بار متفاوت است. اگر وزن یا ابعاد باکس مشخص نباشد، گزینه‌های قسمت بار نیاز به بررسی دستی دارند.",
  "✈ Air": "✈ هواپیما",
  "↗ Rail": "↗ قطار",
  "◇ Road": "◇ جاده‌ای",
  "✦ Auto": "✦ خودکار",
  "🐾 Cabin": "🐾 کابین",
  "▣ Hold": "▣ قسمت بار",
  "◇ Cargo": "◇ کارگو",
  "e.g. Shih Tzu or Persian": "مثلاً شیتزو یا گربهٔ پرشین",
  "My pet is flat-faced / short-nosed": "حیوان من پوزه‌کوتاه یا صورت‌تخت است",
  "Important for hold travel safety": "برای ایمنی سفر در قسمت بار مهم است",
  "e.g. Delta, United or another airline": "مثلاً دلتا، یونایتد یا ایرلاین دیگر",
  "Leave blank to compare every listed airline. You can enter an airline outside the directory; its pet policy will be marked unverified.": "برای مقایسهٔ همهٔ ایرلاین‌های فهرست، این قسمت را خالی بگذارید. می‌توانید ایرلاین دیگری وارد کنید؛ قوانین حمل حیوان آن «تأییدنشده» نمایش داده می‌شود.",
  "PawVago includes every listed carrier. Only source-reviewed rules can produce initial policy matches; others require airline confirmation.": "پاواگو همهٔ ایرلاین‌های فهرست را در نظر می‌گیرد. فقط قوانین بررسی‌شده می‌توانند تطابق اولیه نشان دهند؛ سایر موارد به تأیید ایرلاین نیاز دارند.",
  "✦ Global airline comparison": "✦ مقایسهٔ جهانی ایرلاین‌ها",
  "Screen the entire airline directory: verified conditions are assessed, and missing policies are clearly marked for direct airline confirmation.": "تمام فهرست ایرلاین‌ها بررسی می‌شود؛ شرایط تأییدشده ارزیابی و قوانین نامشخص برای دریافت تأیید مستقیم از ایرلاین مشخص می‌شوند.",
  "Illustrative trip planning. Check the operating carrier, transit rules, pet spaces, and veterinary paperwork before booking.": "این برنامه‌ریزی راهنماست. پیش از رزرو، ایرلاین مجری، قوانین ترانزیت، ظرفیت حمل حیوان و مدارک دامپزشکی را بررسی کنید.",
  "JOURNEY PREVIEW": "پیش‌نمایش سفر",
  "AIR ROUTE": "مسیر هوایی",
  "RAIL JOURNEY": "سفر با قطار",
  "ROAD JOURNEY": "سفر جاده‌ای",
  "Animated schematic route from your selected origin to destination; not a geographic map": "نمای متحرک و شماتیک مسیر مبدأ تا مقصد؛ نقشهٔ جغرافیایی نیست",
  "PAWVAGO / ROUTES": "پاواگو / مسیرها",
  "DEPARTURE": "مبدأ",
  "ARRIVAL": "مقصد",
  "Departure": "مبدأ",
  "Arrival": "مقصد",
  "Nantes": "نانت",
  "France": "فرانسه",
  "Barcelona": "بارسلون",
  "Spain": "اسپانیا",
  "Schematic route preview · No live routing or travel time is calculated": "پیش‌نمایش شماتیک مسیر · مسیریابی زنده یا زمان سفر محاسبه نمی‌شود",
  "Enter your journey details and select": "مشخصات سفرتان را وارد کنید و گزینهٔ",
  "Explore my journey": "بررسی سفر من",
  "to see a source-backed preview.": "را انتخاب کنید تا پیش‌نمایشی بر اساس منابع ببینید.",
  "Search airline names, compare pet policies and view verified references when you need them.": "نام ایرلاین‌ها را جست‌وجو کنید، قوانین حمل حیوان را مقایسه کنید و منابع بررسی‌شده را ببینید.",
  "KNOW BEFORE YOU GO": "پیش از سفر بدانید",
  "Airline rules, made": "قوانین ایرلاین‌ها،",
  "clearer.": "روشن‌تر از همیشه.",
  "Search our expanding global airline directory. Reviewed pet rules are shown alongside clearly labelled airlines awaiting verification; no real-time pet-space availability is checked.": "در فهرست رو‌به‌گسترش ایرلاین‌های جهان جست‌وجو کنید. قوانین بررسی‌شده و ایرلاین‌های در انتظار بررسی، جداگانه مشخص شده‌اند؛ ظرفیت لحظه‌ای حمل حیوان بررسی نمی‌شود.",
  "Checking reference data…": "در حال بررسی اطلاعات مرجع…",
  "Official airline and government links included": "همراه با پیوندهای رسمی ایرلاین‌ها و نهادهای دولتی",
  "Airline directory filters": "فیلترهای فهرست ایرلاین‌ها",
  "Search airline or IATA code": "جست‌وجوی ایرلاین یا کد یاتا",
  "e.g. KLM, Qatar, AF…": "مثلاً KLM، قطر، AF…",
  "Region": "منطقه",
  "All regions": "همهٔ مناطق",
  "Policy status": "وضعیت بررسی قوانین",
  "All airlines": "همهٔ ایرلاین‌ها",
  "Source-reviewed": "بررسی‌شده با منبع",
  "Awaiting verification": "در انتظار تأیید",
  "Loading the airline catalogue…": "در حال بارگذاری فهرست ایرلاین‌ها…",
  "Loading official-source policy references…": "در حال بارگذاری قوانین از منابع رسمی…",
  "Show more airlines ↓": "نمایش ایرلاین‌های بیشتر ↓",
  "The directory covers selected airlines worldwide, not every licensed airline. Unverified entries are informational only. Route-specific restrictions, animal age, breed, carrier compliance, capacity and veterinary paperwork can change. Always confirm with the carrier and official government source.": "این فهرست شامل ایرلاین‌های منتخب جهان است، نه تمام ایرلاین‌های دارای مجوز. موارد تأییدنشده صرفاً اطلاع‌رسانی هستند. محدودیت‌های مسیر، سن و نژاد حیوان، شرایط باکس، ظرفیت و مدارک دامپزشکی ممکن است تغییر کنند. همیشه از ایرلاین و منبع رسمی دولتی تأیید بگیرید.",
  "What PawVago helps you plan": "پاواگو در برنامه‌ریزی چه چیزهایی کمک می‌کند",
  "Airline rules": "قوانین ایرلاین‌ها",
  "Route-specific requirements": "الزامات ویژهٔ مسیر",
  "Travel documents": "مدارک سفر",
  "Clear preparation steps": "مراحل روشن آماده‌سازی",
  "Destination planning": "برنامه‌ریزی مقصد",
  "Explore services for your pet": "خدمات موردنیاز حیوان خانگی را پیدا کنید",
  "More on the way": "امکانات بیشتر در راه است",
  "Travel community in development": "جامعهٔ مسافران در حال توسعه است",
  "How PawVago works": "پاواگو چگونه کار می‌کند",
  "02 / PAWVAGO MOBILE": "۰۲ / اپلیکیشن پاواگو",
  "A better pet journey.": "سفری بهتر با حیوان خانگی.",
  "Right in your pocket.": "همیشه در دسترس شما.",
  "Meet the PawVago mobile experience, designed around your pets, journeys, documents and next steps. Explore an interactive concept below.": "با تجربهٔ موبایلی پاواگو آشنا شوید؛ برای حیوانات شما، سفرها، مدارک و اقدامات بعدی طراحی شده است. نمونهٔ تعاملی را در ادامه ببینید.",
  "Personal pet profiles": "پروفایل اختصاصی حیوانات",
  "Trip preparation": "آماده‌سازی سفر",
  "Document tracking": "پیگیری مدارک",
  "Interactive UI preview with illustrative sample data — not a live account, booking tool or published app.": "پیش‌نمایش تعاملی با اطلاعات نمونه؛ حساب واقعی، ابزار رزرو یا اپلیکیشن منتشرشده نیست.",
  "Request early access": "درخواست دسترسی زودهنگام",
  "Interactive preview of the PawVago mobile interface": "پیش‌نمایش تعاملی رابط موبایل پاواگو",
  "Pet travel, made clearer.": "سفر با حیوان خانگی، روشن‌تر و ساده‌تر.",
  "DEMO · ILLUSTRATIVE DATA": "نسخهٔ نمایشی · اطلاعات نمونه",
  "YOUR JOURNEY COMPANION": "همراه سفر شما",
  "Every journey": "هر سفر",
  "starts together.": "با هم آغاز می‌شود.",
  "Keep the next step in sight, wherever you go.": "هرجا می‌روید، اقدام بعدی را پیش چشم داشته باشید.",
  "UPCOMING TRIP": "سفر پیش‌رو",
  "SAMPLE": "نمونه",
  "Pet: Milo": "حیوان: میلو",
  "Checklist in progress": "فهرست کارها در حال تکمیل",
  "Get trip-ready": "برای سفر آماده شوید",
  "Review the documents and requirements for your route.": "مدارک و الزامات مسیرتان را بررسی کنید.",
  "Open documents preview": "بازکردن پیش‌نمایش مدارک",
  "View trip planner": "مشاهدهٔ برنامه‌ریز سفر",
  "PET PROFILES": "پروفایل حیوانات",
  "Meet your": "آشنا شوید با",
  "travel companions.": "همراهان سفرتان.",
  "One profile for every adventure.": "یک پروفایل برای هر ماجراجویی.",
  "Milo": "میلو",
  "Dog · Sample profile": "سگ · پروفایل نمونه",
  "Pet information": "اطلاعات حیوان خانگی",
  "Breed, weight, identification and travel notes in one place.": "نژاد، وزن، مشخصات شناسایی و یادداشت‌های سفر در یک‌جا.",
  "A saved pet profile helps personalise future trip checklists.": "پروفایل ذخیره‌شده به شخصی‌سازی فهرست سفرهای بعدی کمک می‌کند.",
  "TRIP PLANNER": "برنامه‌ریز سفر",
  "One route.": "یک مسیر.",
  "One clear plan.": "یک برنامهٔ روشن.",
  "Travel preparation tailored to your journey.": "آماده‌سازی متناسب با سفر شما.",
  "SAMPLE ROUTE": "مسیر نمونه",
  "Mode: Air": "روش سفر: هواپیما",
  "Check carrier rules": "بررسی قوانین شرکت حمل‌ونقل",
  "Prepare documents": "آماده‌سازی مدارک",
  "Explore documents": "بررسی مدارک",
  "DOCUMENT CENTRE": "مرکز مدارک",
  "Everything": "همه‌چیز",
  "in one place.": "در یک‌جا.",
  "Follow your travel document checklist.": "فهرست مدارک سفرتان را دنبال کنید.",
  "Microchip record": "مدرک میکروچیپ",
  "Sample checklist · Reviewed": "فهرست نمونه · بررسی‌شده",
  "Vaccination details": "اطلاعات واکسیناسیون",
  "Sample checklist · To review": "فهرست نمونه · نیازمند بررسی",
  "Entry requirements": "شرایط ورود",
  "Requirements depend on your route": "الزامات به مسیر شما بستگی دارد",
  "Always confirm official country and carrier rules before travel.": "پیش از سفر، قوانین رسمی کشور و شرکت حمل‌ونقل را تأیید کنید.",
  "YOUR SPACE": "فضای شخصی شما",
  "All your travel": "تمام ملزومات",
  "،essentials.": "سفر شما.",
  "essentials.": "سفر شما.",
  "A single place to keep the journey organised.": "یک فضای واحد برای سامان‌دهی سفر.",
  "Account & preferences": "حساب و تنظیمات",
  "Your travel profile and settings": "پروفایل سفر و تنظیمات شما",
  "Travel reminders": "یادآوری‌های سفر",
  "Keep key preparation dates visible": "تاریخ‌های مهم آماده‌سازی را در دسترس نگه دارید",
  "Help & support": "راهنما و پشتیبانی",
  "Find guidance when you need it": "هر زمان نیاز داشتید، راهنمایی بگیرید",
  "Mobile preview pages": "صفحه‌های پیش‌نمایش موبایل",
  "Home": "خانه",
  "My Pets": "حیوانات من",
  "Trips": "سفرها",
  "Docs": "مدارک",
  "Profile": "پروفایل",
  "Tap the phone tabs to explore the demo": "برای دیدن نمونه، زبانه‌های داخل گوشی را لمس کنید",
  "03 / Contact": "۰۳ / تماس",
  "Have a question?": "پرسشی دارید؟",
  "Get in touch.": "با ما تماس بگیرید.",
  "Questions about travelling with your pet or working with PawVago? Send us a message. We would love to hear what you need.": "دربارهٔ سفر با حیوان خانگی یا همکاری با پاواگو پرسشی دارید؟ برای ما پیام بفرستید و نیازتان را با ما در میان بگذارید.",
  "Email PawVago at contact@pawvago.com": "ارسال ایمیل به پاواگو: contact@pawvago.com",
  "FOLLOW PAWVAGO": "پاواگو را دنبال کنید",
  "PawVago social media": "شبکه‌های اجتماعی پاواگو",
  "PawVago Instagram, opens in a new tab": "اینستاگرام پاواگو؛ در زبانهٔ جدید باز می‌شود",
  "PawVago Facebook, opens in a new tab": "فیسبوک پاواگو؛ در زبانهٔ جدید باز می‌شود",
  "Instagram": "اینستاگرام",
  "Facebook": "فیسبوک",
  "PawVago home": "صفحهٔ اصلی پاواگو",
  "Dashboard": "داشبورد",
  "My pets": "حیوانات من",
  "Plan a trip": "برنامه‌ریزی سفر",
  "Documents": "مدارک",
  "Saved places": "مکان‌های ذخیره‌شده",
  "Community": "جامعهٔ کاربران",
  "Log out": "خروج",
  "YOUR PET TRAVEL ASSISTANT": "دستیار سفر حیوان خانگی شما",
  "Back to website": "بازگشت به سایت",
  "Close account dialog": "بستن پنجرهٔ حساب",
  "PAWVAGO ACCOUNT": "حساب پاواگو",
  "Create your account": "حساب خود را بسازید",
  "Start building your pet travel plan.": "برنامه‌ریزی سفر حیوان خانگی را آغاز کنید.",
  "Email": "ایمیل",
  "Password": "گذرواژه",
  "Use at least 6 characters. New accounts may need email verification.": "حداقل ۶ نویسه وارد کنید. حساب‌های جدید ممکن است نیاز به تأیید ایمیل داشته باشند.",
  "Already have an account? Log in": "حساب دارید؟ وارد شوید",
  "Already have an account?": "حساب دارید؟",
  "Don't have an account?": "حساب ندارید؟",
  "Forgot password?": "گذرواژه را فراموش کرده‌اید؟",
  "Close pet profile dialog": "بستن پنجرهٔ پروفایل حیوان",
  "PET PROFILE": "پروفایل حیوان خانگی",
  "Add your travel companion": "همراه سفرتان را اضافه کنید",
  "Pet name": "نام حیوان خانگی",
  "Species": "گونه",
  "Other": "سایر",
  "Weight (kg)": "وزن (کیلوگرم)",
  "Breed": "نژاد",
  "Save pet profile": "ذخیرهٔ پروفایل حیوان",
  "Welcome back": "خوش آمدید",
  "Log in to continue your PawVago journey.": "برای ادامهٔ سفر با پاواگو وارد شوید.",
  "Your PawVago dashboard": "داشبورد پاواگوی شما",
  "Create an account to continue.": "برای ادامه حساب بسازید.",
  "Welcome to PawVago": "به پاواگو خوش آمدید",
  "Pet profile": "پروفایل حیوان خانگی",
  "Edit profile": "ویرایش پروفایل",
  "Add your pet before planning a trip.": "پیش از برنامه‌ریزی سفر، حیوان خانگی خود را اضافه کنید.",
  "Add pet profile": "افزودن پروفایل حیوان",
  "Trip intelligence": "برنامه‌ریزی هوشمند سفر",
  "Change trip": "تغییر سفر",
  "Analyze my trip": "بررسی سفر من",
  "Plan your pet journey": "برنامه‌ریزی سفر حیوان خانگی",
  "From": "مبدأ",
  "To": "مقصد",
  "e.g. Nantes, France": "مثلاً نانت، فرانسه",
  "e.g. Budapest, Hungary": "مثلاً بوداپست، مجارستان",
  "Account created. Please check your email to confirm your account, then log in.": "حساب ساخته شد. ایمیلتان را برای تأیید حساب بررسی کنید، سپس وارد شوید.",
  "Invalid login credentials": "ایمیل یا گذرواژه نادرست است",
  "Email not confirmed": "ایمیل تأیید نشده است",
  "User already registered": "این کاربر قبلاً ثبت‌نام کرده است",
  "✦ Ask PawVago AI": "✦ از هوش مصنوعی پاواگو بپرسید",
  "PawVago AI Travel Assistant": "دستیار هوش مصنوعی سفر پاواگو",
  "Close assistant": "بستن دستیار",
  "Plan your pet's journey. Airline and border rules must be verified with official sources.": "سفر حیوان خانگی را برنامه‌ریزی کنید. قوانین ایرلاین و مرزها باید با منابع رسمی تأیید شوند.",
  "Hi! Where are you travelling from and to, and are you travelling with a dog or cat?": "درود! از کجا به کجا سفر می‌کنید و همراهتان سگ است یا گربه؟",
  "Ask a travel question": "پرسشی دربارهٔ سفر بپرسید",
  "Ask about travelling with your pet…": "دربارهٔ سفر با حیوان خانگی بپرسید…",
  "Send": "ارسال",
  "Thinking…": "در حال بررسی…",
  "Service unavailable": "سرویس در دسترس نیست",
  "Service unavailable. Please try again.": "سرویس در دسترس نیست. دوباره تلاش کنید.",
  "AI assistant is not configured yet.": "دستیار هوش مصنوعی هنوز پیکربندی نشده است.",
  "Please enter a question up to 1500 characters.": "پرسشی با حداکثر ۱۵۰۰ نویسه وارد کنید.",
  "The assistant is temporarily unavailable.": "دستیار موقتاً در دسترس نیست.",
  "Please try again.": "دوباره تلاش کنید.",
  "Select country": "انتخاب کشور",
  "Cabin bag weight (kg)": "وزن کیف کابین (کیلوگرم)",
  "PawVago compares cabin and checked-hold airline policies automatically. Rigid crate details are separate from cabin bag details.": "پاواگو قوانین کابین و قسمت بار ایرلاین‌ها را خودکار مقایسه می‌کند. مشخصات باکس سخت از کیف کابین جداست.",
  "Cabin: your pet stays in a compliant under-seat carrier.": "کابین: حیوان شما در کیف استاندارد زیر صندلی می‌ماند.",
  "Hold (checked baggage / AVIH): your pet travels in a ventilated, climate-controlled compartment. A rigid IATA-compliant crate is required.": "قسمت بار (AVIH): حیوان در محفظه‌ای با تهویه و کنترل دما سفر می‌کند. باکس سخت مطابق استاندارد یاتا لازم است.",
  "Air cargo (freight): separate handling and booking through a qualified animal transport provider; not booked with ordinary checked baggage.": "کارگوی هوایی: پذیرش و رزرو جداگانه توسط شرکت متخصص حمل حیوان؛ با بار معمول مسافر رزرو نمی‌شود.",
  "Source-reviewed reference": "مرجع بررسی‌شده با منبع",
  "Policy not yet verified": "قوانین هنوز تأیید نشده است",
  "Not yet reviewed": "هنوز بررسی نشده است",
  "No ordinary pets": "حیوانات خانگی معمول پذیرفته نمی‌شوند",
  "Confirm with airline": "از ایرلاین تأیید بگیرید",
  "Rules, limits and pet acceptance unknown": "قوانین، محدودیت‌ها و پذیرش حیوان مشخص نیست",
  "Carrier size and flight restrictions apply": "محدودیت ابعاد کیف و شرایط پرواز اعمال می‌شود",
  "Not offered": "ارائه نمی‌شود",
  "Verify with airline": "با ایرلاین بررسی کنید",
  "Hold pet acceptance not assessed": "پذیرش حیوان در قسمت بار بررسی نشده است",
  "Ordinary pets not accepted in checked hold": "حیوانات خانگی معمول در قسمت بار پذیرفته نمی‌شوند",
  "Operating flight and breed rules apply": "قوانین پرواز مجری و نژاد حیوان اعمال می‌شود",
  "CABIN": "کابین",
  "CHECKED HOLD": "قسمت بار همراه مسافر",
  "Reference only — verify booking, route, animal breed and kennel with the operating carrier.": "صرفاً مرجع؛ رزرو، مسیر، نژاد و باکس را با ایرلاین مجری تأیید کنید.",
  "No airline pet policy has been checked for this listing. Unknown is not the same as allowed or prohibited.": "قوانین حمل حیوان این ایرلاین بررسی نشده است. نامشخص بودن به معنای مجاز یا ممنوع بودن نیست.",
  "Official policy ↗": "قوانین رسمی ↗",
  "Compare automatically ↗": "مقایسهٔ خودکار ↗",
  "No airlines matched these filters. Try another name, code or region.": "ایرلاینی مطابق این فیلترها پیدا نشد. نام، کد یا منطقهٔ دیگری را امتحان کنید.",
  "Europe": "اروپا",
  "North America": "آمریکای شمالی",
  "South America": "آمریکای جنوبی",
  "Central America": "آمریکای مرکزی",
  "Latin America": "آمریکای لاتین",
  "Caribbean": "کارائیب",
  "Asia": "آسیا",
  "East Asia": "آسیای شرقی",
  "South Asia": "آسیای جنوبی",
  "Southeast Asia": "آسیای جنوب شرقی",
  "Central Asia": "آسیای مرکزی",
  "Middle East": "خاورمیانه",
  "Africa": "آفریقا",
  "Oceania": "اقیانوسیه",
  "Global": "جهانی",
  "Not in directory": "در فهرست نیست",
  "Region not specified": "منطقه مشخص نشده است",
  "Enter the departure, destination, travel date and pet / cabin bag weights to compare airlines automatically.": "برای مقایسهٔ خودکار ایرلاین‌ها، مبدأ، مقصد، تاریخ سفر و وزن حیوان و کیف کابین را وارد کنید.",
  "Enter positive, valid weights and dimensions to compare airline rules.": "برای مقایسهٔ قوانین، وزن و ابعاد معتبر و مثبت وارد کنید.",
  "Identification microchip (record must match pet)": "میکروچیپ شناسایی (اطلاعات باید با حیوان مطابقت داشته باشد)",
  "Valid rabies vaccination (check microchip/vaccination dates)": "واکسن معتبر هاری (تاریخ میکروچیپ و واکسیناسیون را بررسی کنید)",
  "Valid EU pet passport": "گذرنامهٔ معتبر حیوان خانگی اتحادیهٔ اروپا",
  "Valid approved pet travel document for Great Britain": "مدرک معتبر و مورد تأیید سفر حیوان به بریتانیا",
  "Check health certificate / pet passport requirements for your departure country": "الزامات گواهی سلامت یا گذرنامهٔ حیوان را برای کشور مبدأ بررسی کنید",
  "Vet-administered tapeworm treatment 24–120 hours before arrival": "درمان کرم نواری توسط دامپزشک، ۲۴ تا ۱۲۰ ساعت پیش از ورود",
  "Review cabin versus checked-hold options and get written airline approval": "گزینه‌های کابین و قسمت بار را مقایسه و تأیید کتبی ایرلاین را دریافت کنید",
  "Rigid IATA-compliant crate if travelling in the hold: adequate standing, turning and lying space": "برای قسمت بار، باکس سخت مطابق یاتا با فضای کافی برای ایستادن، چرخیدن و درازکشیدن",
  "Confirm approved hold pet space and applicable aircraft and transit restrictions": "ظرفیت تأییدشدهٔ حمل حیوان در بار و محدودیت‌های هواپیما و ترانزیت را بررسی کنید",
  "Vet fitness assessment and breed/temperature restrictions": "ارزیابی سلامت توسط دامپزشک و بررسی محدودیت نژاد و دما",
  "Choose a specialist live-animal air freight operator and obtain written quote": "شرکت متخصص حمل هوایی حیوان زنده انتخاب و قیمت کتبی دریافت کنید",
  "Confirm cargo acceptance, approved route and animal handling arrangements": "پذیرش کارگو، مسیر مجاز و ترتیبات مراقبت از حیوان را تأیید کنید",
  "Approved rigid crate and veterinary fitness assessment": "باکس سخت مورد تأیید و ارزیابی سلامت دامپزشکی",
  "Airline approval for pet, carrier and specific flight": "تأیید ایرلاین برای حیوان، کیف حمل و پرواز مشخص",
  "Domestic journeys can follow different rules. Check national and carrier requirements.": "سفرهای داخلی ممکن است قوانین متفاوتی داشته باشند. الزامات ملی و شرکت حمل‌ونقل را بررسی کنید.",
  "Entry from outside the EU can require an official health certificate and, depending on origin and history, a rabies antibody test. Check the official country-entry tool.": "ورود از خارج اتحادیهٔ اروپا ممکن است به گواهی سلامت رسمی و بسته به مبدأ و سابقه، آزمایش آنتی‌بادی هاری نیاز داشته باشد. سامانهٔ رسمی شرایط ورود کشور را بررسی کنید.",
  "Tapeworm treatment must be done by a veterinarian in the 24–120 hours before entry.": "درمان کرم نواری باید توسط دامپزشک، ۲۴ تا ۱۲۰ ساعت پیش از ورود انجام شود.",
  "If this is a primary rabies vaccination, the minimum 21-day waiting period may affect this departure date.": "اگر نخستین واکسن هاری است، حداقل دورهٔ انتظار ۲۱روزه ممکن است بر این تاریخ سفر اثر بگذارد.",
  "Great Britain requires an approved air route; ordinary pets entering GB on commercial flights normally travel as cargo, not passenger cabin or checked hold baggage.": "بریتانیا مسیر هوایی تأییدشده می‌خواهد؛ حیوانات خانگی معمول در پروازهای تجاری ورودی عموماً باید با کارگو سفر کنند، نه کابین یا بار همراه مسافر.",
  "Flight eligibility, route acceptance and pet-space availability are NOT checked or reserved by this tool.": "این ابزار مجاز بودن پرواز، پذیرش مسیر یا ظرفیت حمل حیوان را بررسی یا رزرو نمی‌کند.",
  "Checked-hold transport (AVIH) is different from a separate cargo shipment. Confirm the kennel is ventilated, safe and large enough for your pet to stand, turn and lie down.": "حمل در قسمت بار همراه مسافر (AVIH) با ارسال جداگانهٔ کارگو متفاوت است. تهویه، ایمنی و فضای کافی باکس برای ایستادن، چرخیدن و درازکشیدن را تأیید کنید.",
  "Cargo requires a freight booking/agent; do not assume the chosen passenger airline offers it.": "کارگو نیاز به رزرو یا نمایندهٔ حمل بار دارد؛ ارائهٔ آن توسط ایرلاین مسافری انتخاب‌شده را قطعی ندانید.",
  "Short-nosed breeds can face increased breathing and heat risks in transit. Obtain a veterinary assessment and written carrier approval; an airline may refuse transport.": "نژادهای پوزه‌کوتاه در سفر بیشتر در معرض مشکلات تنفسی و گرما هستند. ارزیابی دامپزشکی و تأیید کتبی شرکت حمل‌ونقل بگیرید؛ ایرلاین ممکن است حمل را نپذیرد.",
  "Rail and road operator rules, border crossings and route timetables are not checked in this prototype.": "قوانین شرکت‌های ریلی و جاده‌ای، گذرگاه‌های مرزی و زمان‌بندی مسیر در این نمونه بررسی نمی‌شوند.",
  "Personalised screening": "بررسی متناسب با سفر شما",
  "Air freight requires a separate service and booking": "کارگوی هوایی به سرویس و رزرو جداگانه نیاز دارد",
  "Cargo involves a qualified animal freight operator. PawVago cannot match cargo flights, quotes or accepted breeds with the current data.": "کارگو به شرکت متخصص حمل حیوان نیاز دارد. پاواگو با داده‌های فعلی نمی‌تواند پرواز، قیمت یا نژادهای قابل‌پذیرش در کارگو را تطبیق دهد.",
  "Great Britain: check an approved cargo route": "بریتانیا: مسیر کارگوی مجاز را بررسی کنید",
  "For ordinary commercial flights into Great Britain, companion animals normally travel as freight cargo. Confirm approved carrier and routes.": "در پروازهای تجاری معمول ورودی بریتانیا، حیوانات همراه عموماً با کارگو سفر می‌کنند. شرکت حمل‌ونقل و مسیر مجاز را تأیید کنید.",
  "View official guidance on cargo / approved routes ↗": "راهنمای رسمی کارگو و مسیرهای مجاز ↗",
  "Airline comparison unavailable": "مقایسهٔ ایرلاین‌ها در دسترس نیست",
  "The airline matching module could not be loaded. Do not make decisions using incomplete results.": "بخش مقایسهٔ ایرلاین بارگذاری نشد. بر اساس نتایج ناقص تصمیم نگیرید.",
  "Passes initial policy screen": "مطابق بررسی اولیهٔ قوانین",
  "Check further": "نیازمند بررسی بیشتر",
  "Not suitable under listed policy": "نامناسب طبق قوانین درج‌شده",
  "Checked hold": "قسمت بار همراه مسافر",
  "Cabin": "کابین",
  "Cabin:": "کابین:",
  "Hold:": "قسمت بار:",
  "Contact the operating airline for confirmation.": "برای تأیید با ایرلاین مجری تماس بگیرید.",
  "Initial policy matches": "تطابق‌های اولیهٔ قوانین",
  "Need additional checks": "نیازمند بررسی تکمیلی",
  "Policy mismatches": "عدم تطابق با قوانین",
  "Policies not verified": "قوانین تأییدنشده",
  "Coverage:": "پوشش بررسی:",
  "This screen checks published pet conditions, NOT whether an airline operates your route, flight spaces, aircraft restrictions, costs or real-time availability.": "این بررسی مربوط به شرایط منتشرشدهٔ حمل حیوان است؛ انجام پرواز در مسیر شما، ظرفیت، محدودیت هواپیما، هزینه یا دسترس‌پذیری لحظه‌ای را بررسی نمی‌کند.",
  "Automatic mode compares cabin using your cabin bag weight, and checked hold using a separate rigid crate weight. It does not assume the same carrier can be used in both places.": "حالت خودکار کابین را با وزن کیف کابین و قسمت بار را با وزن جداگانهٔ باکس سخت مقایسه می‌کند؛ استفاده از یک کیف برای هر دو بخش را فرض نمی‌کند.",
  "Preliminary policy matches": "تطابق‌های اولیه با قوانین",
  "Flight route + space unverified": "مسیر پرواز و ظرفیت تأیید نشده‌اند",
  "No airline has passed all available first-stage weight and container checks yet. Complete the carrier dimensions and breed, or review the airlines that need more information below.": "هنوز هیچ ایرلاینی تمام بررسی‌های اولیهٔ وزن و باکس را نگذرانده است. ابعاد کیف و نژاد را کامل کنید یا ایرلاین‌های نیازمند اطلاعات بیشتر را در ادامه ببینید.",
  "Potential options requiring verification": "گزینه‌های احتمالی نیازمند تأیید",
  "not yet listed": "هنوز در فهرست نیست",
  "Policy not verified": "قوانین تأیید نشده است",
  "Cabin acceptance, checked-hold transport, weight limits and route restrictions have not been verified for this carrier. This is not a positive match.": "پذیرش در کابین، حمل در بار، محدودیت وزن و مسیر این ایرلاین تأیید نشده است. این نتیجه به معنای تطابق مثبت نیست.",
  "· Confirm the flight, pet booking, breed restrictions and carrier with the operating airline.": "· پرواز، رزرو حیوان، محدودیت نژاد و کیف یا باکس را با ایرلاین مجری تأیید کنید.",
  "Airlines awaiting pet policy verification": "ایرلاین‌های در انتظار تأیید قوانین حمل حیوان",
  "Other airlines: policy verification required": "سایر ایرلاین‌ها: نیازمند تأیید قوانین",
  "Every airline below is included in this comparison, but no verified pet-policy limits are available. Do not assume cabin or hold permission.": "همهٔ ایرلاین‌های زیر در مقایسه لحاظ شده‌اند، اما محدودیت‌های تأییدشدهٔ حمل حیوان برایشان موجود نیست. مجاز بودن کابین یا بار را فرض نکنید.",
  "Find an airline in this group": "جست‌وجوی ایرلاین در این گروه",
  "Search e.g. Delta, United, JetBlue": "جست‌وجو، مثلاً دلتا، یونایتد، جت‌بلو",
  "Show all airlines awaiting verification": "نمایش همهٔ ایرلاین‌های در انتظار تأیید",
  "Rail: personalised document checklist": "قطار: فهرست مدارک متناسب با سفر شما",
  "Road: personalised document checklist": "جاده: فهرست مدارک متناسب با سفر شما",
  "PawVago prepares the destination checklist. Exact operator policies, border crossings and route availability have not been verified.": "پاواگو فهرست الزامات مقصد را آماده می‌کند. قوانین دقیق شرکت حمل‌ونقل، گذرگاه‌های مرزی و دسترس‌پذیری مسیر تأیید نشده‌اند.",
  "Document preparation checklist": "فهرست آماده‌سازی مدارک",
  "Tick items as you verify them; this checklist is saved only on this screen.": "پس از تأیید هر مورد، آن را علامت بزنید؛ این فهرست فقط در همین صفحه نگهداری می‌شود.",
  "Checklist progress": "پیشرفت فهرست مدارک",
  "Before you book": "پیش از رزرو",
  "Great Britain official entry rules ↗": "قوانین رسمی ورود به بریتانیا ↗",
  "EU official pet travel rules ↗": "قوانین رسمی اتحادیهٔ اروپا برای سفر حیوان ↗",
  "Approved routes into Great Britain ↗": "مسیرهای مجاز ورود به بریتانیا ↗",
  "View official source ↗": "مشاهدهٔ منبع رسمی ↗",
  "Complete your journey details to see personalized travel guidance.": "مشخصات سفر را کامل کنید تا راهنمای متناسب با سفرتان نمایش داده شود.",
  "Official-source reference data could not be loaded. Please use official airline websites before booking.": "اطلاعات مرجع رسمی بارگذاری نشد. پیش از رزرو، وب‌سایت رسمی ایرلاین‌ها را بررسی کنید.",
  "Policy data unavailable": "اطلاعات قوانین در دسترس نیست",
  "Policy checks cannot be completed at the moment. Do not rely on saved or cached rules.": "بررسی قوانین فعلاً ممکن نیست. به قوانین ذخیره‌شده یا کش‌شده تکیه نکنید.",
  "Standard commercial flights into Great Britain normally require cargo, not cabin pet travel.": "در پروازهای تجاری معمول ورودی بریتانیا، حیوان معمولاً باید با کارگو سفر کند، نه در کابین.",
  "The airline does not accept ordinary pets in the passenger cabin.": "این ایرلاین حیوانات خانگی معمول را در کابین مسافران نمی‌پذیرد.",
  "Cabin pet acceptance has not been confirmed in PawVago.": "پذیرش حیوان در کابین در پاواگو تأیید نشده است.",
  "Your cabin bag exceeds at least one published carrier dimension.": "حداقل یکی از ابعاد کیف کابین از حد اعلام‌شده بیشتر است.",
  "One universal cabin weight limit has not been confirmed.": "حد یکسانی برای وزن مجاز کابین تأیید نشده است.",
  "Enter all three cabin bag dimensions to check the published size limit.": "برای بررسی حد ابعاد اعلام‌شده، هر سه بُعد کیف کابین را وارد کنید.",
  "The cabin bag size limit requires direct airline verification.": "حد ابعاد کیف کابین باید مستقیماً از ایرلاین تأیید شود.",
  "Complete all three cabin bag dimensions.": "هر سه بُعد کیف کابین را کامل کنید.",
  "Add the breed to screen short-nosed travel restrictions.": "برای بررسی محدودیت نژادهای پوزه‌کوتاه، نژاد را وارد کنید.",
  "Flat-faced breed: check individual breed, respiratory and temperature restrictions with the airline.": "نژاد صورت‌تخت: محدودیت نژاد، تنفس و دما را با ایرلاین بررسی کنید.",
  "Flight/route-specific conditions apply to this carrier.": "این ایرلاین شرایط ویژهٔ پرواز یا مسیر دارد.",
  "Published cabin weight and measured bag dimensions pass this first screen; breed and flight acceptance are not guaranteed.": "وزن و ابعاد کیف با شرایط اولیهٔ کابین مطابقت دارند؛ پذیرش نژاد و پرواز تضمین نمی‌شود.",
  "Checked hold baggage is not the normal option for commercial flights into Great Britain; ask a cargo provider.": "بار همراه مسافر گزینهٔ معمول پرواز تجاری ورودی بریتانیا نیست؛ از شرکت کارگو بپرسید.",
  "The airline does not carry ordinary pets as checked-in hold baggage.": "این ایرلاین حیوانات خانگی معمول را در بار همراه مسافر حمل نمی‌کند.",
  "Checked hold service is restricted to eligible Turkish domestic / North Cyprus journeys; this route is not verified as eligible.": "حمل در بار به مسیرهای مجاز داخلی ترکیه یا قبرس شمالی محدود است؛ مجاز بودن این مسیر تأیید نشده است.",
  "Short-nosed dogs or cats are prohibited from the checked hold by this airline.": "این ایرلاین حمل سگ یا گربهٔ پوزه‌کوتاه در بار همراه مسافر را ممنوع کرده است.",
  "The animal alone weighs more than this airline's published checked-hold total maximum.": "وزن حیوان به‌تنهایی از حداکثر وزن کل اعلام‌شدهٔ ایرلاین برای قسمت بار بیشتر است.",
  "The rigid crate exceeds a published hold size limit.": "ابعاد باکس سخت از حد اعلام‌شدهٔ قسمت بار بیشتر است.",
  "Checked-hold pet acceptance is not independently established for this airline.": "پذیرش حیوان در بار همراه مسافر برای این ایرلاین مستقلاً تأیید نشده است.",
  "Emirates checked-hold service is itinerary-dependent; routes arriving Dubai normally require separate cargo.": "خدمات بار همراه مسافر امارات به مسیر بستگی دارد؛ مسیرهای ورودی دبی معمولاً به کارگوی جداگانه نیاز دارند.",
  "No universal hold weight maximum verified; confirm directly with the airline.": "حداکثر وزن یکسانی برای قسمت بار تأیید نشده است؛ مستقیماً از ایرلاین بپرسید.",
  "Add the hard crate weight; cabin bag weight cannot be used for the hold.": "وزن باکس سخت را وارد کنید؛ وزن کیف کابین برای قسمت بار قابل استفاده نیست.",
  "Add three rigid crate dimensions and confirm IATA live-animal requirements.": "هر سه بُعد باکس سخت را وارد و الزامات یاتا برای حیوان زنده را تأیید کنید.",
  "Complete all three rigid crate dimensions.": "هر سه بُعد باکس سخت را کامل کنید.",
  "No universal rigid crate dimension cap verified; ask the airline.": "حد یکسانی برای ابعاد باکس سخت تأیید نشده است؛ از ایرلاین بپرسید.",
  "Add the breed for short-nosed hold restrictions.": "برای بررسی محدودیت حمل نژادهای پوزه‌کوتاه در بار، نژاد را وارد کنید.",
  "Flat-faced breeds have extra safety restrictions. Hold eligibility is not verified.": "نژادهای صورت‌تخت محدودیت ایمنی بیشتری دارند. مجاز بودن حمل در بار تأیید نشده است.",
  "Lufthansa does not carry checked-hold pets on connections through Munich.": "لوفت‌هانزا در پروازهای اتصالی از مونیخ، حیوان را در بار همراه مسافر حمل نمی‌کند.",
  "Published hold weight/size screen passed; the rigid crate, flight type, route and vet clearance still need approval.": "وزن و ابعاد با شرایط اولیهٔ بار مطابقت دارند؛ باکس، نوع پرواز، مسیر و مجوز دامپزشکی همچنان نیازمند تأیید هستند.",
  "PawVago has not verified this airline’s cabin or checked-hold pet policy. Eligibility, route and pet acceptance are unknown; contact the operating airline.": "پاواگو قوانین کابین یا بار این ایرلاین را تأیید نکرده است. مجاز بودن مسیر و پذیرش حیوان نامشخص است؛ با ایرلاین مجری تماس بگیرید."
});
  Object.assign(persianText,{
  "PawVago will use your saved pet profile, route, travel date and database rules to build your travel plan.": "پاواگو با استفاده از پروفایل ذخیره‌شدهٔ حیوان، مسیر، تاریخ و قوانین موجود، برنامهٔ سفرتان را آماده می‌کند.",
  "No destination services are stored yet.": "هنوز خدماتی برای این مقصد ثبت نشده است.",
  "PawVago will show verified vets, pet sitters, pet taxis, hotels and shops here when they are available in the database.": "دامپزشکان، مراقبان حیوان، تاکسی‌ها، هتل‌ها و فروشگاه‌های تأییدشده پس از ثبت اطلاعات، اینجا نمایش داده می‌شوند.",
  "Website →": "وب‌سایت ←",
  "Verified": "تأییدشده",
  "No airline data is available yet.": "هنوز اطلاعات ایرلاین‌ها موجود نیست.",
  "PawVago will calculate airline compatibility after airline rules are stored in the database.": "پاواگو پس از ثبت قوانین ایرلاین‌ها، مطابقت شرایط را محاسبه می‌کند.",
  "Reservation required: yes": "رزرو الزامی است: بله",
  "Route restrictions stored — itinerary verification required.": "محدودیت مسیر ثبت شده است؛ برنامهٔ دقیق سفر باید تأیید شود.",
  "Official source →": "منبع رسمی ←",
  "Pet acceptance and route restrictions are unknown. Confirm directly with the operating airline.": "پذیرش حیوان و محدودیت مسیر مشخص نیست. مستقیماً از ایرلاین مجری تأیید بگیرید.",
  "IATA-style rigid transport crate and breed / route acceptance must be confirmed.": "باکس سخت مطابق یاتا و پذیرش نژاد و مسیر باید تأیید شوند.",
  "Official checked-hold policy →": "قوانین رسمی قسمت بار ←",
  "Route intelligence": "بررسی هوشمند مسیر",
  "Airlines matching your pet": "ایرلاین‌های متناسب با حیوان شما",
  "Airlines listed": "ایرلاین‌های موجود در فهرست",
  "Compatible": "مطابق شرایط",
  "Needs verification": "نیازمند تأیید",
  "Travel in the aircraft hold (checked pet baggage)": "سفر در قسمت بار هواپیما (حیوان همراه مسافر)",
  "Hold (AVIH) is separate from air cargo/freight. The options below are policy references only, not confirmed travel bookings. Short-nosed breeds and connections can be restricted.": "حمل در بار همراه مسافر (AVIH) از کارگوی هوایی جداست. گزینه‌های زیر فقط مرجع قوانین هستند، نه رزرو تأییدشده. نژادهای پوزه‌کوتاه و پروازهای اتصالی ممکن است محدودیت داشته باشند.",
  "Only reviewed carriers have checked-hold policy details. Other airlines are also listed above with an explicit unknown-policy warning. Cabin/hold acceptance must be confirmed by the operating airline.": "جزئیات قوانین بار فقط برای ایرلاین‌های بررسی‌شده موجود است. سایر ایرلاین‌ها با هشدار نامشخص بودن قوانین نمایش داده شده‌اند. پذیرش کابین یا بار باید توسط ایرلاین مجری تأیید شود.",
  "Browse the full airline directory →": "مشاهدهٔ فهرست کامل ایرلاین‌ها ←",
  "Documents PawVago expects": "مدارک مورد انتظار پاواگو",
  "Requirements come from the PawVago destination-rules database.": "الزامات از اطلاعات قوانین مقصد در پاواگو گرفته شده‌اند.",
  "Smart timeline": "زمان‌بندی هوشمند",
  "No timeline rules are stored yet.": "هنوز قوانین زمان‌بندی ثبت نشده‌اند.",
  "Destination services": "خدمات مقصد",
  "Vets, pet sitters, pet taxis, hotels and shops stored for this destination.": "دامپزشکان، مراقبان حیوان، تاکسی‌ها، هتل‌ها و فروشگاه‌های ثبت‌شده برای این مقصد.",
  "PawVago data status": "وضعیت اطلاعات پاواگو",
  "Airline rules, destination rules and service providers are database-driven. PawVago should verify the applicable official rules and operating carrier before a booking or international journey.": "قوانین ایرلاین‌ها، مقصد و ارائه‌دهندگان خدمات از پایگاه داده دریافت می‌شوند. پیش از رزرو یا سفر بین‌المللی، قوانین رسمی و ایرلاین مجری باید بررسی شوند.",
  "Tell PawVago where and when you are travelling. The app will generate airline compatibility, documents, rules and destination services from the database.": "مقصد و زمان سفرتان را به پاواگو بگویید. برنامه، تطابق ایرلاین‌ها، مدارک، قوانین و خدمات مقصد را بر اساس اطلاعات موجود نمایش می‌دهد.",
  "Rule not stored": "قانون ثبت نشده است",
  "Not compatible": "نامطابق با شرایط",
  "Conditional": "مشروط",
  "Check": "بررسی کنید",
  "PawVago does not yet have a current rule for this airline.": "پاواگو هنوز قانون به‌روزی برای این ایرلاین ندارد.",
  "This stored rule does not allow this pet type in the cabin.": "قانون ثبت‌شده، این نوع حیوان را در کابین مجاز نمی‌داند.",
  "For standard commercial flights entering Great Britain, pet dogs and cats normally travel as cargo, not in the passenger cabin. Check approved routes and airline conditions.": "در پروازهای تجاری معمول ورودی بریتانیا، سگ و گربه عموماً با کارگو سفر می‌کنند، نه در کابین. مسیرهای مجاز و شرایط ایرلاین را بررسی کنید.",
  "Add your pet weight to calculate compatibility.": "برای محاسبهٔ مطابقت شرایط، وزن حیوان را وارد کنید.",
  "The stored airline rule lists restrictions that match this breed.": "قانون ثبت‌شدهٔ ایرلاین محدودیت‌هایی برای این نژاد دارد.",
  "Your pet meets the stored cabin rule.": "حیوان شما با قانون ثبت‌شدهٔ کابین مطابقت دارد.",
  "The pet is exactly at the stored combined limit. The carrier must add no weight, so verify with the airline before booking.": "وزن حیوان دقیقاً برابر سقف مجموع وزن ثبت‌شده است و برای وزن کیف ظرفیتی باقی نمی‌ماند؛ پیش از رزرو از ایرلاین تأیید بگیرید.",
  "Carrier size:": "ابعاد کیف یا باکس:",
  "Carrier type:": "نوع کیف یا باکس:",
  "Rabies waiting period": "دورهٔ انتظار واکسن هاری",
  "Echinococcus treatment": "درمان کرم نواری اکینوکوکوس",
  "Microchip before rabies vaccination": "میکروچیپ پیش از واکسیناسیون هاری",
  "EU pet passport required": "گذرنامهٔ حیوان اتحادیهٔ اروپا لازم است",
  "Maximum non-commercial pets": "حداکثر تعداد حیوانات در سفر غیرتجاری",
  "Minimum age for primary rabies vaccination": "حداقل سن برای نخستین واکسن هاری",
  "Required": "الزامی",
  "Not required": "الزامی نیست",
  "Not specified": "مشخص نشده است",
  "Destination rules not loaded": "قوانین مقصد بارگذاری نشده است",
  "PawVago does not yet have a current database rule for this destination.": "پاواگو هنوز قانون به‌روزی برای این مقصد ندارد.",
  "Microchip": "میکروچیپ",
  "Required according to the stored destination rule.": "طبق قانون ثبت‌شدهٔ مقصد الزامی است.",
  "Valid rabies vaccination": "واکسن معتبر هاری",
  "EU pet passport": "گذرنامهٔ حیوان اتحادیهٔ اروپا",
  "Health certificate": "گواهی سلامت",
  "Rabies antibody titre": "آزمایش تیتر آنتی‌بادی هاری",
  "Destination rule found": "قانون مقصد یافت شد",
  "The destination has a current database rule. No additional document requirements are stored.": "قانون مقصد در اطلاعات موجود ثبت شده است. مدارک اضافه‌ای ثبت نشده‌اند.",
  "Travel day": "روز سفر",
  "Your planned travel date.": "تاریخ برنامه‌ریزی‌شدهٔ سفر شما.",
  "Rabies timing checkpoint": "بررسی زمان‌بندی واکسن هاری",
  "Deworming treatment window": "بازهٔ زمانی درمان ضدانگل",
  "GB arrival: air cargo normally required, not checked baggage": "ورود به بریتانیا: معمولاً کارگو لازم است، نه بار همراه مسافر",
  "Not offered by this airline": "این ایرلاین ارائه نمی‌دهد",
  "Hold eligibility requires individual confirmation": "مجاز بودن حمل در بار نیازمند تأیید موردی است",
  "This short-nosed breed is not accepted in the hold": "این نژاد پوزه‌کوتاه در قسمت بار پذیرفته نمی‌شود",
  "Hold option listed — airline and crate verification required": "گزینهٔ بار موجود است؛ ایرلاین و باکس باید تأیید شوند",
  "PAWVAGO TRIP INTELLIGENCE": "برنامه‌ریزی هوشمند سفر پاواگو",
  "PawVago compares transport modes using route structure, pet profile and available travel rules.": "پاواگو روش‌های سفر را با توجه به مسیر، پروفایل حیوان و قوانین موجود مقایسه می‌کند.",
  "OPTION": "گزینه",
  "ALTERNATIVE": "گزینهٔ جایگزین",
  "BACKUP": "گزینهٔ پشتیبان",
  "Train": "قطار",
  "Car": "خودرو",
  "Multimodal": "ترکیبی",
  "Check details": "بررسی جزئیات",
  "✓ Pet profile considered": "✓ پروفایل حیوان لحاظ شده است",
  "✓ Route structure considered": "✓ ساختار مسیر لحاظ شده است",
  "○ Operator-specific rules need verification": "○ قوانین شرکت حمل‌ونقل باید تأیید شوند",
  "✓ Verify operator-specific rules": "✓ قوانین شرکت حمل‌ونقل را تأیید کنید",
  "○ Compare with recommended option": "○ با گزینهٔ پیشنهادی مقایسه کنید",
  "Build this journey →": "برنامه‌ریزی این سفر ←",
  "Compare details →": "مقایسهٔ جزئیات ←",
  "Mode comparisons are illustrations, not verified rankings, route timetables, fares, pet-space availability or transport eligibility.": "مقایسهٔ روش‌ها نمایشی است؛ رتبه‌بندی تأییدشده، زمان‌بندی، قیمت، ظرفیت یا مجاز بودن حمل را نشان نمی‌دهد.",
  "🚗 PAWVAGO ROAD INTELLIGENCE": "🚗 برنامه‌ریزی هوشمند جاده‌ای پاواگو",
  "CHECK": "بررسی کنید",
  "ROAD REVIEW": "بررسی سفر جاده‌ای",
  "DISTANCE": "مسافت",
  "Route estimate": "برآورد مسیر",
  "DRIVING": "رانندگی",
  "Live routing": "مسیریابی زنده",
  "PET BREAKS": "توقف برای حیوان",
  "Every 1.5–2 h": "هر ۱٫۵ تا ۲ ساعت",
  "FLEXIBILITY": "انعطاف‌پذیری",
  "High": "زیاد",
  "Countries & journey rhythm": "کشورها و روند سفر",
  "Pre-drive check": "بررسی پیش از حرکت",
  "Water, secure carrier/restraint and travel documents ready.": "آب، کیف یا مهار ایمن و مدارک سفر را آماده کنید.",
  "Pet breaks": "توقف برای حیوان",
  "Plan water, toilet and comfort checks every 1.5–2 h.": "هر ۱٫۵ تا ۲ ساعت برای آب، دستشویی و بررسی راحتی حیوان توقف کنید.",
  "Border readiness": "آمادگی عبور از مرز",
  "Keep passport, vaccination and health documents accessible.": "گذرنامه، مدارک واکسن و سلامت را در دسترس نگه دارید.",
  "Overnight planning": "برنامه‌ریزی اقامت شبانه",
  "Consider a pet-friendly overnight stop for long routes.": "برای مسیرهای طولانی، اقامت شبانه در محل پذیرندهٔ حیوان در نظر بگیرید.",
  "Save an emergency vet near the destination.": "اطلاعات دامپزشک اورژانس نزدیک مقصد را ذخیره کنید.",
  "Pet road safety": "ایمنی حیوان در سفر جاده‌ای",
  "✓ Secure carrier or vehicle restraint": "✓ کیف حمل یا مهار ایمن در خودرو",
  "✓ Water at planned breaks": "✓ آب در توقف‌های برنامه‌ریزی‌شده",
  "✓ Never leave pet unattended in parked vehicle": "✓ حیوان را در خودروی پارک‌شده تنها نگذارید",
  "✓ Keep ID and documents accessible": "✓ مدارک شناسایی و سفر را در دسترس نگه دارید",
  "✓ Save emergency vet before departure": "✓ اطلاعات دامپزشک اورژانس را پیش از حرکت ذخیره کنید",
  "Heat sensitivity:": "حساسیت به گرما:",
  "Short-nosed breeds can be more vulnerable to heat and breathing stress. Use conservative temperature management and frequent checks.": "نژادهای پوزه‌کوتاه ممکن است نسبت به گرما و مشکلات تنفسی آسیب‌پذیرتر باشند. دما را با احتیاط مدیریت و مرتب وضعیت حیوان را بررسی کنید.",
  "Road intelligence is part of the PawVago journey-planning layer. Live traffic, closures, tolls and weather require connected data providers.": "بررسی جاده‌ای بخشی از برنامه‌ریزی سفر پاواگوست. ترافیک زنده، بسته‌شدن راه‌ها، عوارض و هواشناسی به منابع دادهٔ متصل نیاز دارند."
});
  // Reuse navigation translations for controls that authentication recreates later.
  dict.en.forEach((text,i)=>{if(dict.fa[i])persianText[text]=dict.fa[i];});
  Object.assign(persianText,{
  "Confirm the flight, pet booking, breed restrictions and carrier with the operating airline.": "پرواز، رزرو حیوان، محدودیت نژاد و کیف یا باکس را با ایرلاین مجری تأیید کنید.",
  "Reset your password | PawVago": "بازیابی گذرواژه | پاواگو",
  "← PawVago": "پاواگو ←",
  "Reset your PawVago password": "بازیابی گذرواژهٔ پاواگو",
  "One account works on": "با یک حساب در",
  ", Android and iPhone.": "، اندروید و آیفون وارد شوید.",
  "Your account email": "ایمیل حساب شما",
  "Email me a reset link": "ارسال پیوند بازیابی به ایمیل",
  "New password": "گذرواژهٔ جدید",
  "Confirm new password": "تکرار گذرواژهٔ جدید",
  "Save new password": "ذخیرهٔ گذرواژهٔ جدید",
  "Never share your password or reset link. The link is intended for the owner of your email account.": "گذرواژه یا پیوند بازیابی را با دیگران به اشتراک نگذارید. این پیوند فقط برای صاحب حساب ایمیل شماست.",
  "Account service temporarily unavailable.": "سرویس حساب موقتاً در دسترس نیست.",
  "Choose a new password for your PawVago account.": "برای حساب پاواگو گذرواژهٔ جدید انتخاب کنید.",
  "Sending…": "در حال ارسال…",
  "If this address has an account, a password-reset email will arrive. Check your inbox and spam folder.": "اگر این نشانی حساب داشته باشد، ایمیل بازیابی ارسال می‌شود. صندوق ورودی و پوشهٔ هرزنامه را بررسی کنید.",
  "Unable to request a reset at this moment. Please try again.": "درخواست بازیابی فعلاً ممکن نیست. دوباره تلاش کنید.",
  "The two passwords do not match.": "دو گذرواژه یکسان نیستند.",
  "Use at least eight characters.": "حداقل هشت نویسه وارد کنید.",
  "Updating…": "در حال به‌روزرسانی…",
  "Your password was updated. You can now sign in on the PawVago website and app.": "گذرواژه به‌روزرسانی شد. اکنون می‌توانید در سایت و اپلیکیشن پاواگو وارد شوید.",
  "Reset session expired or invalid. Request a fresh reset email.": "نشست بازیابی منقضی یا نامعتبر است. ایمیل بازیابی جدید درخواست کنید."
});
  const normalize = text => text.replace(/\s+/g,' ').trim();
  const number = value => String(value).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
  const patterns = [
    [/^Best travel options for (.+) · (.+) kg · (.+)$/,(_,name,kg,breed)=>`گزینه‌های سفر برای ${name} · ${number(kg)} کیلوگرم · ${breed}`],
    [/^Illustrative road preparation for (.+)$/,(_,name)=>`راهنمای نمونهٔ آماده‌سازی سفر جاده‌ای برای ${name}`],
    [/^Up to (\d+) pets$/,(_,a)=>`حداکثر ${number(a)} حیوان`],
    [/^(\d+) weeks$/,(_,a)=>`${number(a)} هفته`],
    [/^Primary vaccination must be valid for at least (\d+) days before travel\.$/,(_,a)=>`واکسن اولیه باید حداقل ${number(a)} روز پیش از سفر معتبر شده باشد.`],
    [/^Waiting period: (\d+) days\.$/,(_,a)=>`دورهٔ انتظار: ${number(a)} روز.`],
    [/^Treatment window: ([\d?]+)–([\d?]+) hours before entry\.$/,(_,a,b)=>`بازهٔ درمان: ${number(a)} تا ${number(b)} ساعت پیش از ورود.`],
    [/^The stored destination rule specifies a (\d+)-day waiting period\.$/,(_,a)=>`قانون ثبت‌شدهٔ مقصد دورهٔ انتظار ${number(a)}روزه تعیین کرده است.`],
    [/^Treatment must fall within the stored ([\d?]+)–([\d?]+) hour window before entry\.$/,(_,a,b)=>`درمان باید در بازهٔ ثبت‌شدهٔ ${number(a)} تا ${number(b)} ساعت پیش از ورود انجام شود.`],
    [/^View (\d+) airlines without verified pet policies$/,(_,a)=>`نمایش ${number(a)} ایرلاین بدون قوانین تأییدشدهٔ حمل حیوان`],
    [/^(\d+) airlines listed; (\d+) source-reviewed and (\d+) awaiting policy verification\. (\d+) meet stored initial checks or require further confirmation\. Flight routes and pet spaces are not verified\.$/,(_,a,b,c,d)=>`${number(a)} ایرلاین در فهرست؛ ${number(b)} دارای منبع بررسی‌شده و ${number(c)} در انتظار تأیید. ${number(d)} مورد مطابق بررسی اولیه یا نیازمند تأیید بیشتر هستند. مسیر و ظرفیت حمل حیوان تأیید نشده‌اند.`],
    [/^(\d+) \/ (\d+) carrier policies reviewed$/,(_,a,b)=>`${number(a)} از ${number(b)} قانون ایرلاین بررسی شده است`],
    [/^Review date (.+) · selected airlines worldwide, not an exhaustive global registry$/,(_,d)=>`تاریخ بررسی ${number(d)} · ایرلاین‌های منتخب جهان؛ فهرست جامع جهانی نیست`],
    [/^Showing (\d+) of (\d+) matching airlines · (\d+) listed · (\d+) reviewed · (\d+) awaiting policy verification$/,(_,a,b,c,d,e)=>`نمایش ${number(a)} از ${number(b)} ایرلاین مطابق جست‌وجو · ${number(c)} ایرلاین در فهرست · ${number(d)} بررسی‌شده · ${number(e)} در انتظار تأیید قوانین`],
    [/^Showing (\d+) of (\d+) airlines awaiting verification$/,(_,a,b)=>`نمایش ${number(a)} از ${number(b)} ایرلاین در انتظار تأیید`],
    [/^Show all (\d+) airlines awaiting verification$/,(_,a)=>`نمایش همهٔ ${number(a)} ایرلاین در انتظار تأیید`],
    [/^Show more airlines \((\d+) remaining\) ↓$/,(_,a)=>`نمایش ایرلاین‌های بیشتر (${number(a)} مورد باقی‌مانده) ↓`],
    [/^([\d.]+) kg max$/,(_,a)=>`حداکثر ${number(a)} کیلوگرم`],
    [/^([\d ×.]+) cm carrier$/,(_,a)=>`کیف حمل ${number(a)} سانتی‌متری`],
    [/^Crate up to ([\d ×.]+) cm; Operating flight and breed rules apply$/,(_,a)=>`باکس حداکثر ${number(a)} سانتی‌متری؛ قوانین پرواز و نژاد اعمال می‌شود`],
    [/^Reviewed (.+)$/,(_,d)=>`بررسی‌شده در ${number(d)}`],
    [/^Official (.+) animal transport rules ↗$/,(_,name)=>`قوانین رسمی حمل حیوان ${name} ↗`],
    [/^(\d+) of (\d+) items checked$/,(_,a,b)=>`${number(a)} مورد از ${number(b)} مورد تأیید شده است`],
    [/^(\d+) airlines$/,(_,a)=>`${number(a)} ایرلاین`],
    [/^(\d+) listed$/,(_,a)=>`${number(a)} مورد در فهرست`],
    [/^Not suitable under listed conditions \((\d+) carriers\)$/,(_,a)=>`نامناسب طبق شرایط درج‌شده (${number(a)} ایرلاین)`],
    [/^Pet and cabin bag total ([\d.]+) kg is above the ([\d.]+) kg cabin maximum\.$/,(_,a,b)=>`مجموع وزن حیوان و کیف کابین ${number(a)} کیلوگرم است و از حد مجاز ${number(b)} کیلوگرم بیشتر است.`],
    [/^Pet and rigid crate total ([\d.]+) kg exceeds ([\d.]+) kg\.$/,(_,a,b)=>`مجموع وزن حیوان و باکس سخت ${number(a)} کیلوگرم است و از حد مجاز ${number(b)} کیلوگرم بیشتر است.`],
    [/^Reference data last manually reviewed (.+)\. Official sources may change without notice\. No live inventory, veterinarian assessment, border clearance or booking is provided\.$/,(_,d)=>`آخرین بررسی دستی اطلاعات مرجع: ${number(d)}. منابع رسمی ممکن است بدون اطلاع تغییر کنند. موجودی زنده، ارزیابی دامپزشکی، مجوز مرزی یا رزرو ارائه نمی‌شود.`],
    [/^(\d+) airlines? considered( for your search| from the current worldwide directory): (\d+) source-reviewed and (\d+) awaiting policy verification\. An unverified airline has no eligibility verdict\. (.+)$/,(_,a,scope,b,c,warning)=>`${number(a)} ایرلاین ${scope.includes('search')?'برای جست‌وجوی شما':'از فهرست جهانی فعلی'} بررسی شده‌اند: ${number(b)} دارای منبع بررسی‌شده و ${number(c)} در انتظار تأیید قوانین. دربارهٔ مجاز بودن ایرلاین تأییدنشده نتیجه‌ای داده نمی‌شود. ${translate(warning)}`]
  ];
  function translate(value) {
    const key=normalize(value);
    let result=persianText[key];
    if (!result) {
      for (const [pattern,replace] of patterns) {
        if (pattern.test(key)) { result=key.replace(pattern,replace); break; }
      }
    }
    // Several result reasons share one text node, separated by a middle dot.
    if (!result && key.includes(' · ')) {
      const parts=key.split(' · '), translated=parts.map(translate);
      if(translated.some((part,i)=>part!==parts[i]))result=translated.join(' · ');
    }
    return result ? value.replace(value.trim(),result) : value;
  }
  const translatedNodes=new Map(), translatedAttributes=new Map();
  const ignored='script,style,svg,code,pre,textarea,#pvLanguage,.pv-ai-user,.pvj-rule-card-name,.pvj-match-card-head h4,.pvj-card-code,.brand';
  const translatedAttrs=['placeholder','aria-label','title','alt','data-hide-label'];
  const regionNames=typeof Intl.DisplayNames==='function'?new Intl.DisplayNames(['fa'],{type:'region'}):null;
  let active=false, translationTimer;
  const observer=new MutationObserver(()=>{
    if(!active)return;
    clearTimeout(translationTimer);
    translationTimer=setTimeout(translatePage,30);
  });
  function observe(){if(active)observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:translatedAttrs});}
  function translatePage(){
    if(!active)return;
    observer.disconnect();
    try {
      // Release detached nodes after renderers replace cards or dialogs.
      for(const node of translatedNodes.keys())if(!node.isConnected)translatedNodes.delete(node);
      for(const el of translatedAttributes.keys())if(!el.isConnected)translatedAttributes.delete(el);
      const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
      let node;
      while((node=walker.nextNode())){
        const el=node.parentElement;
        if(!el||el.closest(ignored))continue;
        const record=translatedNodes.get(node);
        if(record&&node.nodeValue===record.translated)continue;
        const source=node.nodeValue;
        let next=translate(source);
        const option=el.closest('option');
        if(option&&option.parentElement?.matches('#pvj-from,#pvj-to')&&/^[A-Z]{2}$/.test(option.value)&&regionNames){
          next=regionNames.of(option.value)||next;
        }
        if(next!==source){
          // A label-only option otherwise changes its submitted value when translated.
          if(option&&!option.hasAttribute('value'))option.setAttribute('value',option.value);
          translatedNodes.set(node,{source,translated:next});node.nodeValue=next;
        }else translatedNodes.delete(node);
      }
      document.body.querySelectorAll(translatedAttrs.map(a=>`[${a}]`).join(',')).forEach(el=>{
        if(el.closest(ignored))return;
        const records=translatedAttributes.get(el)||new Map();
        for(const attr of translatedAttrs){
          const source=el.getAttribute(attr);if(source===null)continue;
          if(records.get(attr)?.translated===source)continue;
          const next=translate(source);
          if(next!==source){records.set(attr,{source,translated:next});el.setAttribute(attr,next);}
          else records.delete(attr);
        }
        if(records.size)translatedAttributes.set(el,records);else translatedAttributes.delete(el);
      });
    }finally{observe();}
  }
  const originalTitle=document.title;
  function stopTranslation(){
    active=false;clearTimeout(translationTimer);observer.disconnect();
    translatedNodes.forEach((record,node)=>{if(node.isConnected&&node.nodeValue===record.translated)node.nodeValue=record.source;});
    translatedNodes.clear();
    translatedAttributes.forEach((records,el)=>{if(el.isConnected)records.forEach((record,attr)=>{if(el.getAttribute(attr)===record.translated)el.setAttribute(attr,record.source);});});
    translatedAttributes.clear();document.title=originalTitle;
  }

  const apply=lang=>{
    stopTranslation();
    lang=safeLang(lang);
    if(picker)picker.value=lang;
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
    if(lang==='fa'){active=true;document.title=translate(originalTitle);translatePage();}
    try{localStorage.setItem('pawvago-language',lang)}catch(_){}
  };
  picker?.addEventListener('change',()=>apply(picker.value));
  let initial='en';try{initial=safeLang(localStorage.getItem('pawvago-language')||'en')}catch(_){}
  apply(initial);
  if(picker){
  // Native options cannot render a custom flag. Keep the select as a no-JS
  // fallback and use a native disclosure with real buttons for consistent icons.
  const host=picker.closest('.pv-language-picker');
  const menu=document.createElement('details');
  menu.className='pv-language-menu';
  const trigger=document.createElement('summary');
  trigger.setAttribute('aria-label','Language');
  const list=document.createElement('div');
  list.className='pv-language-options';
  const options=Array.from(picker.options);
  const buttons=[];
  const render=(target,option)=>{
    target.replaceChildren();
    const icon=document.createElement(option.value==='fa'?'img':'span');
    icon.className='pv-language-flag';
    icon.setAttribute('aria-hidden','true');
    if(option.value==='fa'){
      icon.src='assets/persian-lion-sun.svg';icon.alt='';icon.width=22;icon.height=15;
    }else{icon.textContent=option.textContent.split(' ')[0];}
    const label=document.createElement('span');
    label.lang=option.value;label.dir='auto';
    label.textContent=option.value==='fa'?'پارسی':option.textContent.slice(option.textContent.indexOf(' ')+1);
    target.append(icon,label);
  };
  const sync=()=>{
    render(trigger,options.find(o=>o.value===picker.value));
    buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(options[i].value===picker.value)));
  };
  options.forEach(option=>{
    const button=document.createElement('button');
    button.type='button';render(button,option);
    button.addEventListener('click',()=>{
      picker.value=option.value;
      picker.dispatchEvent(new Event('change',{bubbles:true}));
      menu.open=false;trigger.focus();
    });
    buttons.push(button);list.append(button);
  });
  menu.append(trigger,list);host.append(menu);
  picker.hidden=true;
  host.classList.add('pv-language-enhanced');
  picker.addEventListener('change',sync);
  sync();
  document.addEventListener('click',event=>{if(!host.contains(event.target))menu.open=false;});
  menu.addEventListener('keydown',event=>{
    if(event.key==='Escape'){menu.open=false;trigger.focus();event.preventDefault();}
    if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
      event.preventDefault();menu.open=true;
      let index=buttons.indexOf(document.activeElement);
      index=event.key==='Home'?0:event.key==='End'?buttons.length-1:
        (index+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;
      buttons[index].focus();
    }
  });
  host.addEventListener('focusout',()=>{
    requestAnimationFrame(()=>{if(!host.contains(document.activeElement))menu.open=false;});
  });
  }
})();
