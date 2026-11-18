(function () {
  'use strict';
  const cities = {
    FR:'Paris|پاریس;Nantes|نانت;Lyon|لیون;Marseille|مارسی;Bordeaux|بوردو;Nice|نیس;Toulouse|تولوز;Lille;Strasbourg;Rennes;Montpellier;La Chapelle-sur-Erdre;Saint-Herblain',
    GB:'London|لندن|Londres;Manchester|منچستر;Edinburgh|ادینبرو;Birmingham;Bristol;Glasgow;Liverpool;Cardiff;Leeds',
    TR:'Istanbul|استانبول|İstanbul;Ankara|آنکارا;Antalya|آنتالیا;Izmir|ازمیر|İzmir;Van|وان;Bodrum|بدروم;Dalaman|دالامان;Bursa;Adana;Kayseri',
    CA:'Toronto|تورنتو;Montréal|مونترال;Vancouver|ونکوور;Ottawa|اتاوا;Calgary;Québec;Edmonton',
    US:'New York|نیویورک;Los Angeles|لس آنجلس;Chicago|شیکاگو;Miami|میامی;Boston;San Francisco;Seattle;Washington;Dallas;Houston;Atlanta;Las Vegas',
    MX:'Mexico City|Ciudad de México|مکزیکوسیتی;Cancún;Guadalajara;Monterrey',
    ES:'Barcelona|بارسلونا;Madrid|مادرید;Valencia;Málaga;Sevilla;Alicante;Palma',
    DE:'Berlin|برلین;Frankfurt|فرانکفورت;Munich|München|مونیخ;Hamburg;Düsseldorf;Cologne|Köln;Stuttgart',
    IT:'Rome|Roma|رم;Milan|Milano|میلان;Venice|Venezia;Naples|Napoli;Florence|Firenze;Bologna;Turin|Torino',
    BE:'Brussels|Bruxelles|بروکسل;Antwerp|Anvers;Bruges;Charleroi',
    NL:'Amsterdam|آمستردام;Rotterdam;Eindhoven;Utrecht;The Hague|Den Haag',
    AT:'Vienna|Wien|وین;Salzburg;Graz;Innsbruck', PT:'Lisbon|Lisboa|لیسبون;Porto;Faro',
    HU:'Budapest|بوداپست;Debrecen;Szeged', PL:'Warsaw|Warszawa|ورشو;Kraków;Gdańsk;Wrocław',
    CZ:'Prague|Praha|پراگ;Brno;Ostrava', HR:'Zagreb|زاگرب;Split;Dubrovnik',
    GR:'Athens|آتن;Thessaloniki;Heraklion', FI:'Helsinki|هلسینکی;Tampere;Turku',
    IE:'Dublin|دوبلین;Cork;Galway', MT:'Valletta|والتا;Sliema', NO:'Oslo|اسلو;Bergen;Tromsø|ترومسو;Stavanger',
    CH:'Geneva|Genève|ژنو;Zurich|Zürich|زوریخ;Basel|Bâle;Bern;Lausanne',
    AM:'Yerevan|ایروان;Gyumri', IR:'Tehran|تهران;Tabriz|تبریز;Shiraz|شیراز;Isfahan|اصفهان;Mashhad|مشهد'
  };
  const normalize = value => value.normalize('NFKD').replace(/\p{M}/gu, '').replace(/ي/g,'ی').replace(/ك/g,'ک').toLowerCase().trim();
  const localCities = Object.entries(cities).flatMap(([code, names]) =>
    names.split(';').map(entry => {
      const [name, ...aliases] = entry.split('|');
      return {name, code, aliases};
    })
  );
  const cache = new Map();
  const picked = new WeakMap();

  function bind(input, country) {
    if (!input) return;
    const list = document.createElement('ul');
    list.className = 'city-suggestions';
    list.id = input.id + '-suggestions';
    list.setAttribute('role', 'listbox');
    list.hidden = true;
    input.after(list);
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-controls', list.id);
    input.setAttribute('aria-expanded', 'false');
    let timer, request, items = [], active = -1;
    const allowed = code => !country || Array.from(country.options).some(option => option.value === code);
    function close() {
      clearTimeout(timer);
      request?.abort();
      request = null;
      list.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    }
    function select(city) {
      input.value = country ? city.name : city.name + ', ' + new Intl.DisplayNames(['en'], {type:'region'}).of(city.code);
      picked.set(input, {value:input.value, code:city.code});
      close();
      if (country && country.value !== city.code) {
        country.value = city.code;
        country.dispatchEvent(new Event('change', {bubbles:true}));
      }
      input.dispatchEvent(new Event('change', {bubbles:true}));
    }
    function draw(results) {
      const locale = document.documentElement.lang || 'en';
      const names = new Intl.DisplayNames([locale], {type:'region'});
      items = results.slice(0, 7);
      active = -1;
      input.removeAttribute('aria-activedescendant');
      list.replaceChildren(...items.map((city, index) => {
        const option = document.createElement('li');
        option.id = list.id + '-' + index;
        option.setAttribute('role', 'option');
        option.setAttribute('aria-selected', 'false');
        const translatedName = locale === 'fa' && city.aliases?.find(alias => /[\u0600-\u06ff]/.test(alias));
        option.textContent = [translatedName || city.name, city.region, names.of(city.code)].filter(Boolean).join(' · ');
        option.addEventListener('pointerdown', event => event.preventDefault());
        option.addEventListener('click', () => select(city));
        return option;
      }));
      list.hidden = !items.length;
      input.setAttribute('aria-expanded', String(items.length > 0));
    }
    input.addEventListener('input', () => {
      picked.delete(input);
      close();
      const query = input.value.trim();
      const code = country?.value || '';
      if (query.length < 2 || query.length > 65) return;
      const term = normalize(query);
      const local = localCities.filter(city => allowed(city.code) && (!code || city.code === code) &&
        [city.name, ...city.aliases].some(name => normalize(name).startsWith(term)));
      draw(local);
      function merge(remote) {
        const extended = remote.filter(city => allowed(city.code) && (!code || city.code === code) &&
          !local.some(entry => entry.code === city.code && normalize(entry.name) === normalize(city.name)));
        draw([...local, ...extended]);
      }
      const cacheKey = code + ':' + term;
      if (cache.has(cacheKey)) { merge(cache.get(cacheKey)); return; }
      timer = setTimeout(async () => {
        const current = new AbortController();
        request = current;
        try {
          const params = new URLSearchParams({text:query, mode:'city', country:code});
          const response = await fetch('/api/geocode?' + params, {signal:current.signal});
          if (!response.ok) return;
          const {results} = await response.json();
          if (request !== current || !Array.isArray(results)) return;
          if (cache.size >= 100) cache.delete(cache.keys().next().value);
          cache.set(cacheKey, results);
          if (active < 0) merge(results);
        } catch (_) { /* Local suggestions remain available. */ }
        finally { if (request === current) request = null; }
      }, 300);
    });
    country?.addEventListener('change', close);
    input.addEventListener('blur', close);
    input.addEventListener('keydown', event => {
      if (list.hidden || event.isComposing) return;
      if (event.key === 'Escape') { event.preventDefault(); close(); return; }
      if (event.key === 'Enter' && active >= 0) { event.preventDefault(); select(items[active]); return; }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      active = active < 0 && step < 0 ? items.length - 1 : (active + step + items.length) % items.length;
      Array.from(list.children).forEach((option, index) => option.setAttribute('aria-selected', String(index === active)));
      input.setAttribute('aria-activedescendant', list.children[active].id);
      list.children[active].scrollIntoView({block:'nearest'});
    });
  }
  window.PawVagoCitySearch = {
    bind,
    country(input) {
      const selection = picked.get(input);
      return selection?.value === input.value ? selection.code : '';
    },
    reset(input) { picked.delete(input); }
  };
})();
