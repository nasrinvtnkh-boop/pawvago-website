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
  "Leave blank to compare all source-reviewed airlines for this trip.": "برای مقایسهٔ همهٔ ایرلاین‌های دارای منبع بررسی‌شده برای این سفر، این قسمت را خالی بگذارید.",
  "Compare published cabin and checked-hold policies for your pet.": "شرایط منتشرشدهٔ حمل حیوان در کابین و قسمت بار را مقایسه کنید.",
  "✦ Global airline comparison": "✦ مقایسهٔ جهانی ایرلاین‌ها",
  "Compare cabin and hold policies reviewed against official airline sources.": "قوانین کابین و بار را که با منابع رسمی ایرلاین‌ها بررسی شده‌اند، مقایسه کنید.",
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
  "Search airline guides reviewed against official sources. Each guide shows its sources and review date.": "در راهنماهای بررسی‌شده با منابع رسمی جست‌وجو کنید. منبع و تاریخ بررسی در هر راهنما آمده است.",
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
  "Check the guide for your airline, including route, breed and carrier restrictions. Confirm pet space with the operating airline before booking.": "راهنمای ایرلاین، محدودیت‌های مسیر، نژاد و باکس را بررسی کنید. قبل از رزرو، ظرفیت حمل حیوان را از ایرلاین انجام‌دهندهٔ پرواز بپرسید.",
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
  "No published airline guide matches this search": "راهنمای منتشرشده‌ای مطابق این جست‌وجو پیدا نشد",
  "Confirm your flight and pet space": "پرواز و ظرفیت حمل حیوان را بررسی کنید",
  "Try a different carrier or clear the airline field to see the guides available for this trip.": "ایرلاین دیگری را امتحان کنید یا نام ایرلاین را پاک کنید تا راهنماهای موجود برای این سفر را ببینید.",
  "No published airline guide matches this route.": "راهنمای منتشرشده‌ای برای ایرلاین‌های این مسیر پیدا نشد.",
  "Browse the airline guides to check the policies currently covered by PawVago.": "برای دیدن قوانین موجود، راهنمای ایرلاین‌ها را مرور کنید.",
  "See published carrier conditions": "شرایط منتشرشدهٔ کیف حمل را ببینید",
  "Source-reviewed airline comparison": "مقایسهٔ ایرلاین‌ها با منابع بررسی‌شده",
  "✦ Source-reviewed airline comparison": "✦ مقایسهٔ ایرلاین‌ها با منابع بررسی‌شده",
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
  Object.assign(persianText,{
  "Ordinary dogs/cats in cabin: up to 9 kg including carrier. Checked pets: up to 45 kg including rigid kennel. Carrier dimensions vary by cabin/aircraft; confirm exact dimensions, breed, temperature and itinerary acceptance before travel.": "سگ و گربهٔ معمول در کابین: مجموع وزن با کیف حداکثر ۹ کیلوگرم. بار: مجموع حیوان و باکس سخت حداکثر ۴۵ کیلوگرم. ابعاد به کلاس و هواپیما بستگی دارد؛ ابعاد دقیق، نژاد، دما و پذیرش مسیر را پیش از سفر تأیید کنید.",
  "Soft, flexible cabin carriers only. Size depends on aircraft/class: many mainline Economy aircraft use 43 × 40 × 20 cm; regional aircraft and Business have different limits. Premium Economy and codeshares have restrictions. Checked pet + kennel: up to 45 kg and 292 cm total length + width + height; breed, weather and destination restrictions apply.": "در کابین فقط کیف نرم و انعطاف‌پذیر. ابعاد به هواپیما و کلاس بستگی دارد؛ در اکونومی بسیاری از هواپیماها ۴۳ × ۴۰ × ۲۰ سانتی‌متر و در هواپیماهای منطقه‌ای و بیزنس متفاوت است. پریمیوم اکونومی و پروازهای اشتراکی محدودیت دارند. مجموع وزن حیوان و باکس بار حداکثر ۴۵ کیلوگرم و مجموع طول، عرض و ارتفاع ۲۹۲ سانتی‌متر است؛ نژاد، دما و مقصد باید تأیید شوند.",
  "Cabin dogs/cats: 8 kg including soft carrier; reserve at least 24 hours ahead. Checked hold: rigid crate up to 122 × 81.3 × 89 cm and 45 kg combined. Checked pets excluded on connections, codeshares and Train + Air. Some breeds are prohibited; other short-nosed breeds need special conditions. UK/Ireland and departure-airport restrictions apply.": "سگ و گربه در کابین: مجموع وزن با کیف نرم حداکثر ۸ کیلوگرم؛ رزرو دست‌کم ۲۴ ساعت زودتر. بار: باکس سخت حداکثر ۱۲۲ × ۸۱٫۳ × ۸۹ سانتی‌متر و مجموع وزن ۴۵ کیلوگرم. در اتصال‌ها، پرواز اشتراکی و قطار+هواپیما، بار حیوان ارائه نمی‌شود. برخی نژادها ممنوع و سایر پوزه‌کوتاه‌ها مشروط‌اند. بریتانیا، ایرلند و فرودگاه مبدأ محدودیت دارند.",
  "Shared Alaska/Hawaiian pet program. Cabin soft carrier: 17 × 11 × 9.5 inches. Checked pet + kennel: up to 150 lb / published 68 kg. Aircraft, destination, seasonal and breed restrictions apply. Short-nosed checked-pet rules include exceptions in the contract; obtain written confirmation for the exact itinerary.": "برنامهٔ مشترک آلاسکا و هاوایین. کیف نرم کابین: ۴۳٫۱۸ × ۲۷٫۹۴ × ۲۴٫۱۳ سانتی‌متر. مجموع حیوان و باکس بار: حداکثر ۱۵۰ پوند یا ۶۸ کیلوگرم طبق اعلام شرکت. هواپیما، مقصد، فصل و نژاد محدودیت دارند. قوانین بار نژادهای پوزه‌کوتاه استثناهایی در قرارداد دارند؛ برای مسیر دقیق تأیید کتبی بگیرید.",
  "Dogs and cats in cabin; no cargo-area pets. Soft carrier up to 18 × 12 × 11 inches; hard carrier up to 17 × 11 × 10.5 inches. Minimum age eight weeks. Closed carrier must fit under the seat; seat and itinerary approval required.": "سگ و گربه در کابین؛ حمل حیوان در قسمت بار ارائه نمی‌شود. کیف نرم حداکثر ۴۵٫۷۲ × ۳۰٫۴۸ × ۲۷٫۹۴ و کیف سخت ۴۳٫۱۸ × ۲۷٫۹۴ × ۲۶٫۶۷ سانتی‌متر. حداقل سن هشت هفته. کیف بسته باید زیر صندلی جا بگیرد؛ صندلی و مسیر نیاز به تأیید دارند.",
  "Dogs and cats in an under-seat carrier on eligible routes. Dimensions shown are for soft-sided carriers; hard carriers depend on aircraft. No carry-on pets on transatlantic/transpacific trips or to/from Hawaii. Checked pets are restricted to eligible military/Foreign Service personnel on official orders; others need separate cargo.": "سگ و گربه در کیف زیر صندلی، فقط در مسیرهای مجاز. ابعاد نمایش‌داده‌شده برای کیف نرم است؛ کیف سخت به هواپیما بستگی دارد. حیوان در کابینِ مسیرهای اقیانوس اطلس، آرام یا هاوایی پذیرفته نمی‌شود. بار همراه مسافر فقط برای افراد نظامی و دیپلمات‌های واجد شرایط با حکم مأموریت است؛ دیگران باید کارگوی جداگانه بررسی کنند.",
  "Small dogs and cats in cabin on eligible aircraft and routes. Delta recommends 45.72 × 27.94 × 27.94 cm soft carriers, but the actual limit depends on aircraft. Delta One, international Business and Premium cabins exclude ordinary pets. Ordinary passengers cannot check pets as baggage; eligible military/Foreign Service exceptions and separate cargo require confirmation.": "سگ و گربهٔ کوچک در کابین، بسته به مسیر و هواپیما. دلتا کیف نرم ۴۵٫۷۲ × ۲۷٫۹۴ × ۲۷٫۹۴ سانتی‌متر را پیشنهاد می‌کند؛ حد واقعی به هواپیما بستگی دارد. در دلتا وان، بیزنس بین‌المللی و پریمیوم، حیوان معمول پذیرفته نمی‌شود. بار همراه مسافر برای عموم ارائه نمی‌شود؛ استثنای مأموریت رسمی و کارگو را جداگانه بررسی کنید.",
  "New ordinary-pet bookings restricted to domestic U.S. travel; international pets are not accepted. Soft carrier maximum 18 × 14 × 11 inches; hard carrier 18 × 14 × 8 inches. Pet must fit under the seat and move naturally. No checked-pet transport.": "رزرو جدید حیوان معمول فقط برای سفر داخلی آمریکا؛ در سفر بین‌المللی پذیرفته نمی‌شود. کیف نرم حداکثر ۴۵٫۷۲ × ۳۵٫۵۶ × ۲۷٫۹۴ و کیف سخت ۴۵٫۷۲ × ۳۵٫۵۶ × ۲۰٫۳۲ سانتی‌متر. حیوان باید زیر صندلی جا بگیرد و طبیعی حرکت کند. حمل حیوان در بار ارائه نمی‌شود.",
  "Small dogs and cats in cabin only; carrier maximum 43.18 × 31.75 × 21.59 cm. No ordinary checked pets. One animal per carrier; pet must stand and turn comfortably. Mint, bulkhead and exit seats excluded. Confirm destination acceptance and required documents; no universal numeric weight cap was verified on the current page.": "فقط سگ و گربهٔ کوچک در کابین؛ کیف حداکثر ۴۳٫۱۸ × ۳۱٫۷۵ × ۲۱٫۵۹ سانتی‌متر. بار همراه مسافر برای حیوان معمول ارائه نمی‌شود. هر کیف یک حیوان با فضای کافی ایستادن و چرخیدن. مینت، ردیف خروج و جلوی دیواره مجاز نیست. مقصد و مدارک را تأیید کنید؛ در صفحهٔ فعلی حد وزن عددی یکسان تأیید نشد.",
  "Dogs and cats in cabin only; no baggage-hold pets. Current pet page lists 55 × 40 × 27 cm carrier dimensions. Older tariffs quote a 9 kg combined cap; reconfirm the applicable limit with Porter rather than treating the conflicting weight publications as universal.": "فقط سگ و گربه در کابین؛ حمل حیوان در بار ارائه نمی‌شود. صفحهٔ فعلی ابعاد ۵۵ × ۴۰ × ۲۷ سانتی‌متر را اعلام می‌کند. تعرفه‌های قدیمی سقف مجموع وزن ۹ کیلوگرم دارند؛ به‌دلیل اختلاف منابع، حد قابل‌اعمال را از پورتر تأیید کنید.",
  "Small vaccinated cats and dogs, domestic U.S. itineraries only; no international pet itineraries or mainland–Hawaii pets. Carrier maximum 18 × 10.5 × 10 inches; must fit under the assigned seat. No checked/cargo pets. Reserve by phone; minimum age eight weeks.": "سگ و گربهٔ کوچک واکسینه‌شده، فقط در مسیرهای داخلی آمریکا؛ سفر بین‌المللی با حیوان و مسیر سرزمین اصلی–هاوایی پذیرفته نمی‌شود. کیف حداکثر ۴۵٫۷۲ × ۲۶٫۶۷ × ۲۵٫۴ سانتی‌متر و متناسب با زیر صندلی. بار و کارگوی حیوان ارائه نمی‌شود. رزرو تلفنی؛ حداقل سن هشت هفته.",
  "Published carriage contract permits cabin pets in a carrier up to 18 × 14 × 9 inches, subject to airline inspection and under-seat fit. Confirm current operations, route, species and weight rules directly. Checked-pet acceptance and a current numeric weight cap were not verified; left unspecified.": "قرارداد حمل منتشرشده، حیوان در کابین را در کیف حداکثر ۴۵٫۷۲ × ۳۵٫۵۶ × ۲۲٫۸۶ سانتی‌متر، مشروط به بررسی ایرلاین و جاگیری زیر صندلی مجاز می‌داند. فعالیت فعلی، مسیر، گونه و وزن را مستقیم تأیید کنید. پذیرش در بار و حد وزن عددی فعلی تأیید نشد و نامشخص باقی مانده است.",
  "Published contract includes in-cabin pet transport and under-seat carrier requirements. Carrier-size publications differ, so a universal dimension/weight limit is not recorded. Confirm current domestic-route eligibility, carrier dimensions and any checked-pet service directly before booking.": "قرارداد منتشرشده حمل حیوان در کابین و کیف زیر صندلی را پوشش می‌دهد. منابع ابعاد متفاوت دارند؛ حد عددی یکسان برای ابعاد و وزن ثبت نشده است. مجاز بودن مسیر داخلی، ابعاد کیف و هرگونه خدمات بار را پیش از رزرو مستقیم تأیید کنید.",
  "Dogs and cats must fit and move comfortably in a closed under-seat carrier. Soft-carrier dimensions shown; hard-carrier and aircraft-specific limits differ. Confirm itinerary, seat and current checked-pet service directly; no general checked-baggage entitlement is recorded.": "سگ و گربه باید در کیف بستهٔ زیر صندلی جا بگیرند و راحت حرکت کنند. ابعاد برای کیف نرم است؛ کیف سخت و نوع هواپیما محدودیت متفاوت دارند. مسیر، صندلی و خدمات فعلی بار را مستقیم تأیید کنید؛ حق عمومی حمل در بار در این مرجع ثبت نشده است.",
  "Published Viva guidance describes cabin pets up to 12 kg and checked pets up to 45 kg. Carrier dimensions and checked species differ between published documents; these are not treated as universal. Confirm combined-weight allowance, species, connections, breed and current dimensions before purchase.": "راهنمای منتشرشدهٔ ویوا، کابین تا ۱۲ و قسمت بار تا ۴۵ کیلوگرم را توضیح می‌دهد. ابعاد کیف و گونه‌های مجاز در بار بین اسناد متفاوت‌اند و یکسان فرض نمی‌شوند. مجموع وزن مجاز، گونه، اتصال‌ها، نژاد و ابعاد فعلی را پیش از خرید تأیید کنید.",
  "Current main pet page: cabin carrier + pet up to 12 kg, 44 × 30 × 19 cm. Older terms still quote 10 kg; reconfirm applicable allowance. Checked pet + rigid crate up to 45 kg; crate height up to 90 cm, length/width depend on animal. Only dogs/cats; Frontier-operated legs excluded. Breed and route restrictions apply.": "صفحهٔ اصلی فعلی: مجموع حیوان و کیف کابین تا ۱۲ کیلوگرم، ابعاد ۴۴ × ۳۰ × ۱۹ سانتی‌متر. شرایط قدیمی هنوز ۱۰ کیلوگرم دارند؛ سقف قابل‌اعمال را تأیید کنید. بار: مجموع حیوان و باکس سخت تا ۴۵ کیلوگرم، ارتفاع باکس تا ۹۰ سانتی‌متر و طول و عرض متناسب با حیوان. فقط سگ و گربه؛ بخش‌های پرواز با مجری فرانتیر مستثنا هستند. محدودیت نژاد و مسیر اعمال می‌شود.",
  "Cabin requires a soft carrier up to 41 × 25.4 × 21.5 cm. Checked pet + rigid kennel: 45 kg, up to 101 × 68 × 81 cm. Brachycephalic and strong breeds cannot use ordinary checked baggage. Destination, heat and holiday embargoes apply; no pets to/from UK, Ireland, Barbados or Jamaica, or Hawaii.": "کابین: کیف نرم حداکثر ۴۱ × ۲۵٫۴ × ۲۱٫۵ سانتی‌متر. بار: حیوان و باکس سخت مجموعاً ۴۵ کیلوگرم، باکس حداکثر ۱۰۱ × ۶۸ × ۸۱ سانتی‌متر. نژادهای پوزه‌کوتاه و قوی در بار معمول پذیرفته نمی‌شوند. مقصد، گرما و تعطیلات محدودیت دارند؛ بریتانیا، ایرلند، باربادوس، جامائیکا و هاوایی پذیرفته نمی‌شوند.",
  "The published cabin policy excludes this country pair; check the airline's route restrictions.": "قوانین منتشرشدهٔ کابین این مسیر بین دو کشور را مجاز نمی‌دانند؛ محدودیت مسیر را از ایرلاین بررسی کنید.",
  "Check official destination entry requirements for your pet's species, age, origin and travel history": "شرایط رسمی ورود مقصد را بر اساس گونه، سن، مبدأ و سابقهٔ سفر حیوان بررسی کنید",
  "Confirm required health, vaccination and identification documents with the destination authority": "مدارک سلامت، واکسن و شناسایی لازم را از مرجع رسمی مقصد تأیید کنید",
  "Complete the CDC Dog Import Form and check requirements based on the dog's last six months of travel": "فرم ورود سگ CDC را تکمیل و الزامات شش ماه گذشتهٔ سفر سگ را بررسی کنید",
  "Destination official pet entry rules ↗": "قوانین رسمی ورود حیوان به مقصد ↗",
  "More official sources ↗": "منابع رسمی بیشتر ↗",
  "Airline review dates are shown individually": "تاریخ بررسی هر ایرلاین جداگانه نمایش داده می‌شود"
});
  Object.assign(persianText,{"The published checked-hold policy excludes this country pair; confirm with the airline.": "قوانین منتشرشدهٔ قسمت بار این مسیر بین دو کشور را مجاز نمی‌دانند؛ از ایرلاین تأیید بگیرید.", "The rigid crate exceeds the published combined length, width and height limit.": "مجموع طول، عرض و ارتفاع باکس سخت از سقف اعلام‌شده بیشتر است."});
  Object.assign(persianText,{
  "Cabin: 8 kg combined; carrier 55 × 40 × 23 cm, or 40 × 25 × 25 cm on DH8/ATR. Checked hold available on eligible A320/A321/ATR aircraft; crate, breed and connection rules apply. Connections over three hours may prevent checked-pet carriage.": "کابین: مجموع حیوان و کیف تا ۸ کیلوگرم؛ ۵۵ × ۴۰ × ۲۳ یا در DH8/ATR، ۴۰ × ۲۵ × ۲۵ سانتی‌متر. بار در هواپیماهای مجاز A320/A321/ATR ارائه می‌شود؛ قوانین باکس، نژاد و اتصال اعمال می‌شوند. توقف بیش از سه ساعت ممکن است مانع حمل در بار شود.",
  "Ordinary dogs/cats in cabin: up to 9 kg including carrier. Checked pets: up to 45 kg including rigid kennel. Carrier dimensions vary by cabin/aircraft; confirm exact dimensions, breed, temperature and itinerary acceptance before travel.": "سگ و گربهٔ معمول در کابین: مجموع وزن با کیف حداکثر ۹ کیلوگرم. بار: مجموع حیوان و باکس سخت حداکثر ۴۵ کیلوگرم. ابعاد به کلاس و هواپیما بستگی دارد؛ ابعاد دقیق، نژاد، دما و پذیرش مسیر را پیش از سفر تأیید کنید.",
  "Soft, flexible cabin carriers only. Size depends on aircraft/class: many mainline Economy aircraft use 43 × 40 × 20 cm; regional aircraft and Business have different limits. Premium Economy and codeshares have restrictions. Checked pet + kennel: up to 45 kg and 292 cm total length + width + height; breed, weather and destination restrictions apply.": "در کابین فقط کیف نرم و انعطاف‌پذیر. ابعاد به هواپیما و کلاس بستگی دارد؛ در اکونومی بسیاری از هواپیماها ۴۳ × ۴۰ × ۲۰ سانتی‌متر و در هواپیماهای منطقه‌ای و بیزنس متفاوت است. پریمیوم اکونومی و پروازهای اشتراکی محدودیت دارند. مجموع وزن حیوان و باکس بار حداکثر ۴۵ کیلوگرم و مجموع طول، عرض و ارتفاع ۲۹۲ سانتی‌متر است؛ نژاد، دما و مقصد باید تأیید شوند.",
  "Cabin: pet alone up to 8 kg; pet + soft carrier up to 10 kg, 40 × 30 × 30 cm. Short-nosed pets have an 8 kg combined cabin cap. Hold: 50 kg combined, crate up to 134 × 121 × 83 cm. No short-nosed pets in hold. Business, summer Madrid connections and route restrictions apply.": "کابین: وزن خود حیوان حداکثر ۸ و مجموع حیوان و کیف نرم حداکثر ۱۰ کیلوگرم؛ ۴۰ × ۳۰ × ۳۰ سانتی‌متر. برای نژاد پوزه‌کوتاه مجموع وزن کابین حداکثر ۸ کیلوگرم است. بار: مجموعاً ۵۰ کیلوگرم؛ باکس تا ۱۳۴ × ۱۲۱ × ۸۳ سانتی‌متر. پوزه‌کوتاه در بار ممنوع است. بیزنس، اتصال تابستانی مادرید و مسیر محدودیت دارند.",
  "Cabin: pet + soft carrier up to 8 kg; 46 × 28 × 24 cm. Checked hold: up to 75 kg including a rigid crate. Short-nosed dogs/cats cannot travel in the hold. Add a checked pet to the reservation at least 24 hours ahead. Pet-space reservation is separate from published size/weight rules.": "کابین: حیوان و کیف نرم مجموعاً تا ۸ کیلوگرم؛ ۴۶ × ۲۸ × ۲۴ سانتی‌متر. بار: حیوان و باکس سخت مجموعاً تا ۷۵ کیلوگرم. سگ و گربهٔ پوزه‌کوتاه در بار ممنوع‌اند. افزودن حیوان بار دست‌کم ۲۴ ساعت قبل از حرکت؛ رزرو ظرفیت حیوان جدا از قوانین وزن و ابعاد است.",
  "Cabin: dogs/cats up to 8 kg combined; carrier dimensions total at most 94 cm, for example 40 × 30 × 24 cm. Ordinary checked-hold pets are not accepted on Air Serbia flights. No pets to/from UK, UAE or Qatar; destination and document rules apply.": "کابین: سگ و گربه با کیف مجموعاً تا ۸ کیلوگرم؛ مجموع ابعاد کیف حداکثر ۹۴ سانتی‌متر، مثلاً ۴۰ × ۳۰ × ۲۴. بار حیوان معمول در پرواز ایر صربیا پذیرفته نمی‌شود. حیوان به یا از بریتانیا، امارات و قطر پذیرفته نمی‌شود؛ مقررات مقصد و مدارک اعمال می‌شوند.",
  "Cabin dogs/cats: 8 kg including soft carrier; reserve at least 24 hours ahead. Checked hold: rigid crate up to 122 × 81.3 × 89 cm and 45 kg combined. Checked pets excluded on connections, codeshares and Train + Air. Some breeds are prohibited; other short-nosed breeds need special conditions. UK/Ireland and departure-airport restrictions apply.": "سگ و گربه در کابین: مجموع وزن با کیف نرم حداکثر ۸ کیلوگرم؛ رزرو دست‌کم ۲۴ ساعت زودتر. بار: باکس سخت حداکثر ۱۲۲ × ۸۱٫۳ × ۸۹ سانتی‌متر و مجموع وزن ۴۵ کیلوگرم. در اتصال‌ها، پرواز اشتراکی و قطار+هواپیما، بار حیوان ارائه نمی‌شود. برخی نژادها ممنوع و سایر پوزه‌کوتاه‌ها مشروط‌اند. بریتانیا، ایرلند و فرودگاه مبدأ محدودیت دارند.",
  "Cabin: 8 kg including carrier, 55 × 40 × 23 cm. Hold: up to 75 kg combined; flights to/from Amsterdam cap at 39 kg. Rigid crate maximum 84 × 142 × 84 cm (length × width × height). Larger consignments use separate cargo; pet-space booking required.": "کابین: حیوان و کیف مجموعاً تا ۸ کیلوگرم؛ ۵۵ × ۴۰ × ۲۳ سانتی‌متر. بار: مجموعاً تا ۷۵ کیلوگرم؛ برای پرواز به یا از آمستردام سقف ۳۹ کیلوگرم. باکس سخت حداکثر ۸۴ × ۱۴۲ × ۸۴ سانتی‌متر (طول، عرض، ارتفاع). محمولهٔ بزرگ‌تر کارگوی جداست؛ رزرو جای حیوان لازم است.",
  "Shared Alaska/Hawaiian pet program. Cabin soft carrier: 17 × 11 × 9.5 inches. Checked pet + kennel: up to 150 lb / published 68 kg. Aircraft, destination, seasonal and breed restrictions apply. Short-nosed checked-pet rules include exceptions in the contract; obtain written confirmation for the exact itinerary.": "برنامهٔ مشترک آلاسکا و هاوایین. کیف نرم کابین: ۴۳٫۱۸ × ۲۷٫۹۴ × ۲۴٫۱۳ سانتی‌متر. مجموع حیوان و باکس بار: حداکثر ۱۵۰ پوند یا ۶۸ کیلوگرم طبق اعلام شرکت. هواپیما، مقصد، فصل و نژاد محدودیت دارند. قوانین بار نژادهای پوزه‌کوتاه استثناهایی در قرارداد دارند؛ برای مسیر دقیق تأیید کتبی بگیرید.",
  "Dogs and cats in cabin; no cargo-area pets. Soft carrier up to 18 × 12 × 11 inches; hard carrier up to 17 × 11 × 10.5 inches. Minimum age eight weeks. Closed carrier must fit under the seat; seat and itinerary approval required.": "سگ و گربه در کابین؛ حمل حیوان در قسمت بار ارائه نمی‌شود. کیف نرم حداکثر ۴۵٫۷۲ × ۳۰٫۴۸ × ۲۷٫۹۴ و کیف سخت ۴۳٫۱۸ × ۲۷٫۹۴ × ۲۶٫۶۷ سانتی‌متر. حداقل سن هشت هفته. کیف بسته باید زیر صندلی جا بگیرد؛ صندلی و مسیر نیاز به تأیید دارند.",
  "Dogs and cats in an under-seat carrier on eligible routes. Dimensions shown are for soft-sided carriers; hard carriers depend on aircraft. No carry-on pets on transatlantic/transpacific trips or to/from Hawaii. Checked pets are restricted to eligible military/Foreign Service personnel on official orders; others need separate cargo.": "سگ و گربه در کیف زیر صندلی، فقط در مسیرهای مجاز. ابعاد نمایش‌داده‌شده برای کیف نرم است؛ کیف سخت به هواپیما بستگی دارد. حیوان در کابینِ مسیرهای اقیانوس اطلس، آرام یا هاوایی پذیرفته نمی‌شود. بار همراه مسافر فقط برای افراد نظامی و دیپلمات‌های واجد شرایط با حکم مأموریت است؛ دیگران باید کارگوی جداگانه بررسی کنند.",
  "Cabin: dogs/cats up to 8 kg including a soft carrier, 55 × 40 × 23 cm. Checked hold: rigid IATA-compliant crate; no single overall weight cap is published on the pet page. Snub-nosed breeds are excluded from checked hold. Register at least 72 hours before departure; destination freight-only rules apply.": "کابین: سگ و گربه با کیف نرم، مجموعاً تا ۸ کیلوگرم؛ ابعاد ۵۵ × ۴۰ × ۲۳ سانتی‌متر. بار همراه مسافر: باکس سخت مطابق الزامات یاتا؛ در صفحهٔ حیوانات سقف وزنی واحد اعلام نشده است. نژادهای پوزه‌کوتاه در بار پذیرفته نمی‌شوند. ثبت حیوان دست‌کم ۷۲ ساعت پیش از پرواز؛ برخی مقصدها فقط کارگو می‌پذیرند.",
  "Ordinary pets are not accepted in the cabin. Pet transport is booked separately as cargo through PetAir UK for departures from the UK or IAG Cargo for arrivals into the UK. This is not an ordinary checked-baggage pet service. Recognised assistance dogs have a separate policy.": "حیوان معمول در کابین پذیرفته نمی‌شود. حمل حیوان به‌صورت کارگوی جداگانه است: خروج از بریتانیا از طریق PetAir UK و ورود به بریتانیا از طریق IAG Cargo. این خدمت بار معمول همراه مسافر نیست. سگ‌های راهنما مقررات جدا دارند.",
  "Cabin: 8 kg including soft carrier, 55 × 40 × 23 cm. Checked hold accepts dogs/cats in a suitable rigid crate; the official hold page states no size or weight limit. Pet must fit naturally; breed, aircraft and flight-booking conditions still apply.": "کابین: حیوان و کیف نرم مجموعاً تا ۸ کیلوگرم؛ ۵۵ × ۴۰ × ۲۳ سانتی‌متر. بار: سگ و گربه در باکس سخت مناسب؛ صفحهٔ رسمی بار سقف اندازه یا وزن تعیین نمی‌کند. حیوان باید فضای طبیعی کافی داشته باشد؛ نژاد، هواپیما و رزرو پرواز شرایط جدا دارند.",
  "Small dogs and cats in cabin on eligible aircraft and routes. Delta recommends 45.72 × 27.94 × 27.94 cm soft carriers, but the actual limit depends on aircraft. Delta One, international Business and Premium cabins exclude ordinary pets. Ordinary passengers cannot check pets as baggage; eligible military/Foreign Service exceptions and separate cargo require confirmation.": "سگ و گربهٔ کوچک در کابین، بسته به مسیر و هواپیما. دلتا کیف نرم ۴۵٫۷۲ × ۲۷٫۹۴ × ۲۷٫۹۴ سانتی‌متر را پیشنهاد می‌کند؛ حد واقعی به هواپیما بستگی دارد. در دلتا وان، بیزنس بین‌المللی و پریمیوم، حیوان معمول پذیرفته نمی‌شود. بار همراه مسافر برای عموم ارائه نمی‌شود؛ استثنای مأموریت رسمی و کارگو را جداگانه بررسی کنید.",
  "Ordinary pets are not accepted in either cabin or hold. Eligible trained guide/assistance dogs follow a separate policy; emotional-support status does not make an ordinary pet eligible.": "حیوانات خانگی معمول نه در کابین و نه در بار پذیرفته نمی‌شوند. سگ‌های راهنما و کمک‌رسان آموزش‌دیده مقررات جدا دارند؛ عنوان حمایت عاطفی به‌تنهایی مجوز حمل حیوان معمول نیست.",
  "Cabin only: small dogs/cats up to 8 kg including soft carrier, 55 × 40 × 23 cm. Service on short/medium-haul flights; no ordinary checked-pet service. Pet must remain in the closed carrier under the seat; completed carriage form required.": "فقط کابین: سگ و گربهٔ کوچک با کیف نرم، مجموعاً تا ۸ کیلوگرم؛ ۵۵ × ۴۰ × ۲۳ سانتی‌متر. این خدمت برای مسیرهای کوتاه و متوسط است؛ بار حیوان معمول ارائه نمی‌شود. کیف بسته باید زیر صندلی بماند؛ فرم حمل تکمیل‌شده لازم است.",
  "Cabin: 8 kg combined; soft carrier 55 × 40 × 23 cm on Finnair or 55 × 40 × 20 cm on Norra; hard carriers 35 × 30 × 20 cm. Hold: 75 kg on Finnair, 50 kg on Norra. Crate limits: Airbus 122 × 81 × 89, Norra E90 101 × 68 × 76, ATR 81 × 57 × 53 cm.": "کابین: حیوان و کیف تا ۸ کیلوگرم؛ کیف نرم در فین‌ایر ۵۵ × ۴۰ × ۲۳ و در نورا ۵۵ × ۴۰ × ۲۰؛ باکس سخت ۳۵ × ۳۰ × ۲۰ سانتی‌متر. بار: فین‌ایر ۷۵ و نورا ۵۰ کیلوگرم. باکس: ایرباس ۱۲۲ × ۸۱ × ۸۹، نورا E90 برابر ۱۰۱ × ۶۸ × ۷۶ و ATR برابر ۸۱ × ۵۷ × ۵۳ سانتی‌متر.",
  "New ordinary-pet bookings restricted to domestic U.S. travel; international pets are not accepted. Soft carrier maximum 18 × 14 × 11 inches; hard carrier 18 × 14 × 8 inches. Pet must fit under the seat and move naturally. No checked-pet transport.": "رزرو جدید حیوان معمول فقط برای سفر داخلی آمریکا؛ در سفر بین‌المللی پذیرفته نمی‌شود. کیف نرم حداکثر ۴۵٫۷۲ × ۳۵٫۵۶ × ۲۷٫۹۴ و کیف سخت ۴۵٫۷۲ × ۳۵٫۵۶ × ۲۰٫۳۲ سانتی‌متر. حیوان باید زیر صندلی جا بگیرد و طبیعی حرکت کند. حمل حیوان در بار ارائه نمی‌شود.",
  "Cabin: 8 kg including carrier, 45 × 35 × 25 cm, with total dimensions no more than 105 cm. Checked hold: 45 kg combined. Air Nostrum hold crate maximum 83 × 65 × 56 cm. Short-nosed breeds excluded from hold. Reserve at least 48 hours ahead; connections must be between 90 minutes and 4 hours.": "کابین: حیوان و کیف تا ۸ کیلوگرم؛ ۴۵ × ۳۵ × ۲۵ سانتی‌متر و مجموع ابعاد حداکثر ۱۰۵ سانتی‌متر. بار: مجموعاً ۴۵ کیلوگرم. باکس بار ایر نوستروم حداکثر ۸۳ × ۶۵ × ۵۶ سانتی‌متر. پوزه‌کوتاه‌ها در بار ممنوع‌اند. رزرو دست‌کم ۴۸ ساعت قبل؛ مدت اتصال بین ۹۰ دقیقه و ۴ ساعت.",
  "Small dogs and cats in cabin only; carrier maximum 43.18 × 31.75 × 21.59 cm. No ordinary checked pets. One animal per carrier; pet must stand and turn comfortably. Mint, bulkhead and exit seats excluded. Confirm destination acceptance and required documents; no universal numeric weight cap was verified on the current page.": "فقط سگ و گربهٔ کوچک در کابین؛ کیف حداکثر ۴۳٫۱۸ × ۳۱٫۷۵ × ۲۱٫۵۹ سانتی‌متر. بار همراه مسافر برای حیوان معمول ارائه نمی‌شود. هر کیف یک حیوان با فضای کافی ایستادن و چرخیدن. مینت، ردیف خروج و جلوی دیواره مجاز نیست. مقصد و مدارک را تأیید کنید؛ در صفحهٔ فعلی حد وزن عددی یکسان تأیید نشد.",
  "Cabin: 8 kg including carrier, 46 × 28 × 24 cm; Economy or European Business only. Checked hold: 75 kg combined; crate 122 × 81 × 89 cm, or 102 × 69 × 76 cm on European Boeing 737/Embraer flights. No hold pets on 787-9/787-10/A321neo or German Airways; connection and UK-entry restrictions apply. Book at least 48 hours ahead.": "کابین: حیوان و کیف مجموعاً ۸ کیلوگرم، ۴۶ × ۲۸ × ۲۴ سانتی‌متر؛ فقط اکونومی یا بیزنس اروپا. بار: مجموعاً ۷۵ کیلوگرم؛ باکس ۱۲۲ × ۸۱ × ۸۹ یا در بوئینگ ۷۳۷ و امبرائرِ مسیر اروپایی ۱۰۲ × ۶۹ × ۷۶ سانتی‌متر. در ۷۸۷-۹، ۷۸۷-۱۰، A321neo و جرمن ایرویز بار حیوان ارائه نمی‌شود. اتصال و ورود بریتانیا محدودیت دارند؛ رزرو دست‌کم ۴۸ ساعت قبل.",
  "Cabin: 8 kg including carrier. B787/B777/B737 carriers: 55 × 40 × 20 cm; Embraer: 45 × 30 × 20 cm. Checked hold: up to 99 kg including crate; B787/B777 crate 122 × 81 × 89 cm, B737/737 MAX and Embraer 102 × 69 × 76 cm. Short-nosed breeds are not accepted in the hold.": "کابین: حیوان و کیف مجموعاً تا ۸ کیلوگرم. B787، B777 و B737: کیف ۵۵ × ۴۰ × ۲۰؛ امبرائر: ۴۵ × ۳۰ × ۲۰ سانتی‌متر. بار: حیوان و باکس مجموعاً تا ۹۹ کیلوگرم؛ B787/B777: باکس ۱۲۲ × ۸۱ × ۸۹؛ B737، مکس و امبرائر: ۱۰۲ × ۶۹ × ۷۶ سانتی‌متر. نژادهای پوزه‌کوتاه در بار ممنوع‌اند.",
  "Cabin: dogs/cats up to 8 kg including soft carrier, 55 × 40 × 23 cm. Checked hold: rigid crate sized to the animal; a single overall weight ceiling is not stated on the pet page. Short-nosed breeds are excluded from checked hold. Aircraft and connection restrictions apply; crate ventilation rules updated 4 May 2026. Checked-pet connections through Munich are not accepted.": "کابین: سگ و گربه با کیف نرم، مجموعاً تا ۸ کیلوگرم؛ ۵۵ × ۴۰ × ۲۳ سانتی‌متر. بار: باکس سخت متناسب با حیوان؛ سقف وزن کل واحد در صفحهٔ حیوانات اعلام نشده است. نژادهای پوزه‌کوتاه در بار ممنوع‌اند. محدودیت هواپیما و اتصال اعمال می‌شود؛ الزامات تهویهٔ باکس از ۴ مهٔ ۲۰۲۶ به‌روزرسانی شده‌اند. اتصال بار حیوان از مونیخ پذیرفته نمی‌شود.",
  "Pet cabin up to 8 kg, 50×32×32 cm. Hold pets permitted only on domestic Turkey and North Cyprus flights, not normal international routes.": "کابین: حیوان و کیف مجموعاً تا ۸ کیلوگرم؛ ۵۰ × ۳۲ × ۳۲ سانتی‌متر. حمل حیوان در بار فقط در پروازهای داخلی ترکیه و قبرس شمالی ارائه می‌شود؛ در مسیرهای معمول بین‌المللی ارائه نمی‌شود.",
  "Dogs and cats in cabin only; no baggage-hold pets. Current pet page lists 55 × 40 × 27 cm carrier dimensions. Older tariffs quote a 9 kg combined cap; reconfirm the applicable limit with Porter rather than treating the conflicting weight publications as universal.": "فقط سگ و گربه در کابین؛ حمل حیوان در بار ارائه نمی‌شود. صفحهٔ فعلی ابعاد ۵۵ × ۴۰ × ۲۷ سانتی‌متر را اعلام می‌کند. تعرفه‌های قدیمی سقف مجموع وزن ۹ کیلوگرم دارند؛ به‌دلیل اختلاف منابع، حد قابل‌اعمال را از پورتر تأیید کنید.",
  "Cabin: 8 kg including soft carrier, 40 × 25 × 23 cm. Hold: 50 kg including rigid crate; crate dimensions depend on aircraft. Ordinary cabin pets excluded from Business on North America/Asia routes and SAS charters. Specified short-nosed breeds cannot travel in hold; cabin breed rules are also restricted in the conditions of carriage.": "کابین: حیوان و کیف نرم مجموعاً تا ۸ کیلوگرم؛ ۴۰ × ۲۵ × ۲۳ سانتی‌متر. بار: حیوان و باکس سخت مجموعاً تا ۵۰ کیلوگرم؛ ابعاد باکس به هواپیما بستگی دارد. کابین بیزنس مسیر آمریکای شمالی و آسیا و پرواز چارتر حیوان معمول نمی‌پذیرد. نژادهای مشخص پوزه‌کوتاه در بار ممنوع‌اند؛ قرارداد حمل برای نژاد کابین نیز محدودیت دارد.",
  "Small vaccinated cats and dogs, domestic U.S. itineraries only; no international pet itineraries or mainland–Hawaii pets. Carrier maximum 18 × 10.5 × 10 inches; must fit under the assigned seat. No checked/cargo pets. Reserve by phone; minimum age eight weeks.": "سگ و گربهٔ کوچک واکسینه‌شده، فقط در مسیرهای داخلی آمریکا؛ سفر بین‌المللی با حیوان و مسیر سرزمین اصلی–هاوایی پذیرفته نمی‌شود. کیف حداکثر ۴۵٫۷۲ × ۲۶٫۶۷ × ۲۵٫۴ سانتی‌متر و متناسب با زیر صندلی. بار و کارگوی حیوان ارائه نمی‌شود. رزرو تلفنی؛ حداقل سن هشت هفته.",
  "Published carriage contract permits cabin pets in a carrier up to 18 × 14 × 9 inches, subject to airline inspection and under-seat fit. Confirm current operations, route, species and weight rules directly. Checked-pet acceptance and a current numeric weight cap were not verified; left unspecified.": "قرارداد حمل منتشرشده، حیوان در کابین را در کیف حداکثر ۴۵٫۷۲ × ۳۵٫۵۶ × ۲۲٫۸۶ سانتی‌متر، مشروط به بررسی ایرلاین و جاگیری زیر صندلی مجاز می‌داند. فعالیت فعلی، مسیر، گونه و وزن را مستقیم تأیید کنید. پذیرش در بار و حد وزن عددی فعلی تأیید نشد و نامشخص باقی مانده است.",
  "Published contract includes in-cabin pet transport and under-seat carrier requirements. Carrier-size publications differ, so a universal dimension/weight limit is not recorded. Confirm current domestic-route eligibility, carrier dimensions and any checked-pet service directly before booking.": "قرارداد منتشرشده حمل حیوان در کابین و کیف زیر صندلی را پوشش می‌دهد. منابع ابعاد متفاوت دارند؛ حد عددی یکسان برای ابعاد و وزن ثبت نشده است. مجاز بودن مسیر داخلی، ابعاد کیف و هرگونه خدمات بار را پیش از رزرو مستقیم تأیید کنید.",
  "Cabin: dogs/cats up to 8 kg including soft carrier, 55 × 40 × 23 cm. Checked hold: rigid crate sized to the animal; a single overall weight ceiling is not stated on the pet page. Short-nosed breeds are excluded from checked hold. Aircraft and connection restrictions apply; crate ventilation rules updated 4 May 2026.": "کابین: سگ و گربه با کیف نرم، مجموعاً تا ۸ کیلوگرم؛ ۵۵ × ۴۰ × ۲۳ سانتی‌متر. بار: باکس سخت متناسب با حیوان؛ سقف وزن کل واحد در صفحهٔ حیوانات اعلام نشده است. نژادهای پوزه‌کوتاه در بار ممنوع‌اند. محدودیت هواپیما و اتصال اعمال می‌شود؛ الزامات تهویهٔ باکس از ۴ مهٔ ۲۰۲۶ به‌روزرسانی شده‌اند.",
  "Cabin: up to 8 kg including soft carrier, 45 × 30 × 23 cm. Checked hold: 32 kg including crate for journeys to/from/via USA, Hungary, France or Netherlands; 45 kg for other destinations. Short-nosed pets cannot travel in the hold. Long-haul Business cabin excludes ordinary pets; transit can change the applicable hold limit.": "کابین: حیوان و کیف نرم مجموعاً تا ۸ کیلوگرم؛ ۴۵ × ۳۰ × ۲۳ سانتی‌متر. بار همراه مسافر: در سفر به، از یا با توقف در آمریکا، مجارستان، فرانسه و هلند، مجموع حیوان و باکس تا ۳۲ کیلوگرم؛ برای سایر مقصدها تا ۴۵ کیلوگرم. نژادهای پوزه‌کوتاه در بار ممنوع‌اند. کابین بیزنس طولانی‌مدت حیوان معمول نمی‌پذیرد؛ ترانزیت نیز بر سقف بار اثر دارد.",
  "Cabin: pet + soft carrier up to 8 kg, 40 × 30 × 24 cm. Checked hold: up to 75 kg including a rigid crate, 102 × 69 × 76 cm. Flat-faced dogs/cats cannot travel in the hold. Use the policy of the actual operating Transavia carrier; destinations and pet-space booking have separate requirements.": "کابین: حیوان و کیف نرم مجموعاً تا ۸ کیلوگرم؛ ۴۰ × ۳۰ × ۲۴ سانتی‌متر. بار: حیوان و باکس سخت مجموعاً تا ۷۵ کیلوگرم؛ ۱۰۲ × ۶۹ × ۷۶ سانتی‌متر. سگ و گربهٔ صورت‌تخت در بار ممنوع‌اند. مقررات شرکت مجری ترانزاویا اعمال می‌شود؛ مقصد و رزرو ظرفیت حیوان الزامات جدا دارند.",
  "Cabin bag max length 40, width 30, height 23; check breed, route and codeshares. Hold total 50kg, crate 125×75×75 cm.": "کابین: حیوان و کیف مجموعاً تا ۸ کیلوگرم؛ طول ۴۰، عرض ۳۰، ارتفاع ۲۳ سانتی‌متر. بار: حیوان و باکس مجموعاً تا ۵۰ کیلوگرم؛ باکس ۱۲۵ × ۷۵ × ۷۵ سانتی‌متر. مقررات نژاد و مسیر اعمال می‌شوند؛ ظرفیت جای حیوان باید رزرو شود.",
  "Dogs and cats must fit and move comfortably in a closed under-seat carrier. Soft-carrier dimensions shown; hard-carrier and aircraft-specific limits differ. Confirm itinerary, seat and current checked-pet service directly; no general checked-baggage entitlement is recorded.": "سگ و گربه باید در کیف بستهٔ زیر صندلی جا بگیرند و راحت حرکت کنند. ابعاد برای کیف نرم است؛ کیف سخت و نوع هواپیما محدودیت متفاوت دارند. مسیر، صندلی و خدمات فعلی بار را مستقیم تأیید کنید؛ حق عمومی حمل در بار در این مرجع ثبت نشده است.",
  "Published Viva guidance describes cabin pets up to 12 kg and checked pets up to 45 kg. Carrier dimensions and checked species differ between published documents; these are not treated as universal. Confirm combined-weight allowance, species, connections, breed and current dimensions before purchase.": "راهنمای منتشرشدهٔ ویوا، کابین تا ۱۲ و قسمت بار تا ۴۵ کیلوگرم را توضیح می‌دهد. ابعاد کیف و گونه‌های مجاز در بار بین اسناد متفاوت‌اند و یکسان فرض نمی‌شوند. مجموع وزن مجاز، گونه، اتصال‌ها، نژاد و ابعاد فعلی را پیش از خرید تأیید کنید.",
  "Current main pet page: cabin carrier + pet up to 12 kg, 44 × 30 × 19 cm. Older terms still quote 10 kg; reconfirm applicable allowance. Checked pet + rigid crate up to 45 kg; crate height up to 90 cm, length/width depend on animal. Only dogs/cats; Frontier-operated legs excluded. Breed and route restrictions apply.": "صفحهٔ اصلی فعلی: مجموع حیوان و کیف کابین تا ۱۲ کیلوگرم، ابعاد ۴۴ × ۳۰ × ۱۹ سانتی‌متر. شرایط قدیمی هنوز ۱۰ کیلوگرم دارند؛ سقف قابل‌اعمال را تأیید کنید. بار: مجموع حیوان و باکس سخت تا ۴۵ کیلوگرم، ارتفاع باکس تا ۹۰ سانتی‌متر و طول و عرض متناسب با حیوان. فقط سگ و گربه؛ بخش‌های پرواز با مجری فرانتیر مستثنا هستند. محدودیت نژاد و مسیر اعمال می‌شود.",
  "Cabin only: pet + soft carrier up to 10 kg, maximum 45 × 39 × 21 cm. No pet transport in the hold. The pet must stand, turn and lie down inside the carrier. Eligible species and route rules apply; booking a pet place is required.": "فقط کابین: حیوان و کیف نرم مجموعاً تا ۱۰ کیلوگرم؛ ۴۵ × ۳۹ × ۲۱ سانتی‌متر. حمل حیوان در بار ارائه نمی‌شود. حیوان باید داخل کیف بایستد، بچرخد و دراز بکشد. گونه و مسیر باید مجاز باشند؛ رزرو جای حیوان لازم است.",
  "Cabin requires a soft carrier up to 41 × 25.4 × 21.5 cm. Checked pet + rigid kennel: 45 kg, up to 101 × 68 × 81 cm. Brachycephalic and strong breeds cannot use ordinary checked baggage. Destination, heat and holiday embargoes apply; no pets to/from UK, Ireland, Barbados or Jamaica, or Hawaii.": "کابین: کیف نرم حداکثر ۴۱ × ۲۵٫۴ × ۲۱٫۵ سانتی‌متر. بار: حیوان و باکس سخت مجموعاً ۴۵ کیلوگرم، باکس حداکثر ۱۰۱ × ۶۸ × ۸۱ سانتی‌متر. نژادهای پوزه‌کوتاه و قوی در بار معمول پذیرفته نمی‌شوند. مقصد، گرما و تعطیلات محدودیت دارند؛ بریتانیا، ایرلند، باربادوس، جامائیکا و هاوایی پذیرفته نمی‌شوند.",
  "Under-seat fit required": "باید در کیف زیر صندلی جا بگیرد",
  "Cabin service not documented": "خدمات کابین در منبع ثبت نشده است",
  "Assistance animals follow a separate policy": "حیوانات کمک‌رسان مقررات جدا دارند",
  "Aircraft-specific carrier rules are detailed below": "شرایط کیف برحسب هواپیما در جزئیات آمده است",
  "Separate cargo service": "فقط کارگوی جداگانه",
  "32–45 kg depending on route": "۳۲ تا ۴۵ کیلوگرم، برحسب مسیر",
  "50–75 kg depending on operating carrier": "۵۰ تا ۷۵ کیلوگرم، برحسب شرکت مجری",
  "39–75 kg depending on airport": "۳۹ تا ۷۵ کیلوگرم، برحسب فرودگاه",
  "No single published weight cap": "سقف وزن عددیِ واحد اعلام نشده",
  "Accepted in checked hold": "حمل در بار همراه مسافر ارائه می‌شود",
  "Checked-hold service not documented": "خدمات بار همراه در منبع ثبت نشده است",
  "Booked through a specialist cargo provider, not passenger baggage": "رزرو از طریق شرکت متخصص کارگو؛ جدا از بار مسافر",
  "Rigid crate and aircraft conditions determine acceptance": "پذیرش بر اساس باکس سخت و شرایط هواپیما",
  "Published weight includes pet and carrier. Flight pet-space reservation is separate.": "وزن اعلام‌شده شامل حیوان و کیف یا باکس است. جای حیوان در پرواز جداگانه رزرو می‌شود.",
  "The pet alone exceeds the airline's published animal-only cabin weight limit.": "وزن خود حیوان از سقف اعلام‌شدهٔ ایرلاین برای کابین بیشتر است.",
  "Your cabin bag exceeds all published aircraft-specific size options.": "ابعاد کیف کابین از تمام گزینه‌های اعلام‌شدهٔ هواپیما بیشتر است.",
  "Your cabin bag exceeds the published combined length, width and height limit.": "مجموع طول، عرض و ارتفاع کیف کابین از سقف اعلام‌شده بیشتر است.",
  "Published carrier limits are listed by aircraft or total dimensions in the policy details.": "حدود کیف برحسب هواپیما یا مجموع ابعاد در جزئیات قوانین درج شده‌اند.",
  "The rigid crate exceeds all published aircraft-specific hold size options.": "ابعاد باکس سخت از تمام گزینه‌های اعلام‌شدهٔ قسمت بار بیشتر است.",
  "The published hold policy sets no single weight cap; rigid crate and aircraft conditions apply.": "قوانین منتشرشدهٔ بار سقف وزنی واحدی تعیین نکرده‌اند؛ شرایط باکس سخت و هواپیما اعمال می‌شود.",
  "The published weight limit depends on origin, destination and transit countries; transit is not entered in this checker.": "سقف وزن اعلام‌شده به مبدأ، مقصد و کشورهای ترانزیت بستگی دارد؛ این فرم هنوز کشور ترانزیت را دریافت نمی‌کند.",
  "Published hold limits vary by operating aircraft or airport; see the listed policy conditions.": "حدود بار برحسب هواپیما یا فرودگاه مجری متفاوت‌اند و در جزئیات قوانین درج شده‌اند.",
  "Published crate size limits vary by aircraft and are listed in the policy details.": "حد ابعاد باکس برحسب هواپیما متفاوت است و در جزئیات قوانین درج شده است.",
  "Airbus: 55 × 40 × 23 cm": "ایرباس: ۵۵ × ۴۰ × ۲۳ سانتی‌متر",
  "DH8 / ATR: 40 × 25 × 25 cm": "DH8 / ATR: ۴۰ × ۲۵ × ۲۵ سانتی‌متر",
  "Finnair soft carrier: 55 × 40 × 23 cm": "کیف نرم فین‌ایر: ۵۵ × ۴۰ × ۲۳ سانتی‌متر",
  "Norra soft carrier: 55 × 40 × 20 cm": "کیف نرم نورا: ۵۵ × ۴۰ × ۲۰ سانتی‌متر",
  "Hard carrier: 35 × 30 × 20 cm": "باکس سخت: ۳۵ × ۳۰ × ۲۰ سانتی‌متر",
  "Finnair Airbus: 122 × 81 × 89 cm": "ایرباس فین‌ایر: ۱۲۲ × ۸۱ × ۸۹ سانتی‌متر",
  "Norra E90: 101 × 68 × 76 cm": "نورا E90: ۱۰۱ × ۶۸ × ۷۶ سانتی‌متر",
  "Norra ATR: 81 × 57 × 53 cm": "نورا ATR: ۸۱ × ۵۷ × ۵۳ سانتی‌متر",
  "KLM aircraft with eligible hold service: 122 × 81 × 89 cm": "هواپیمای KLM با امکان بار حیوان: ۱۲۲ × ۸۱ × ۸۹ سانتی‌متر",
  "European Boeing 737 / Embraer: 102 × 69 × 76 cm": "بوئینگ ۷۳۷ یا امبرائر اروپایی: ۱۰۲ × ۶۹ × ۷۶ سانتی‌متر",
  "B787 / B777 / B737: 55 × 40 × 20 cm": "B787 / B777 / B737: ۵۵ × ۴۰ × ۲۰ سانتی‌متر",
  "E70 / E75 / E90 / E95: 45 × 30 × 20 cm": "E70 / E75 / E90 / E95: ۴۵ × ۳۰ × ۲۰ سانتی‌متر",
  "B787 / B777: 122 × 81 × 89 cm": "B787 / B777: ۱۲۲ × ۸۱ × ۸۹ سانتی‌متر",
  "B737 / 737 MAX / Embraer: 102 × 69 × 76 cm": "بوئینگ ۷۳۷، مکس یا امبرائر: ۱۰۲ × ۶۹ × ۷۶ سانتی‌متر",
  "Carrier total dimensions: 94 cm maximum": "مجموع طول، عرض و ارتفاع کیف: حداکثر ۹۴ سانتی‌متر",
  "Carrier total dimensions: 105 cm maximum": "مجموع طول، عرض و ارتفاع کیف: حداکثر ۱۰۵ سانتی‌متر"
});
  Object.assign(persianText,{"The published cabin policy excludes short-nosed breeds.": "قوانین منتشرشدهٔ کابین نژادهای پوزه‌کوتاه را نمی‌پذیرند."});
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


