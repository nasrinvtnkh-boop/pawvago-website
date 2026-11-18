/* Route-policy candidates, not a flight timetable or booking inventory. */
(function(root){
  'use strict';
  const normalize = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const groups = {
    Europe:'AD AL AT AX BA BE BG BY CH CZ DE DK EE ES FI FO FR GB GG GI GR HR HU IE IM IS IT JE LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS RU SE SI SJ SK SM UA VA XK',
    Asia:'AE AF AM AZ BD BH BN BT CN CY GE HK ID IL IN IQ IR JO JP KG KH KP KR KW KZ LA LB LK MM MN MO MV MY NP OM PH PK PS QA SA SG SY TH TJ TL TM TR TW UZ VN YE',
    'North America':'AG AI AW BB BL BM BQ BS BZ CA CR CU CW DM DO GD GL GP GT HN HT JM KN KY LC MF MQ MS MX NI PA PM PR SV SX TC TT US VC VG VI',
    'South America':'AR BO BR CL CO EC FK GF GY PE PY SR UY VE',
    Africa:'AO BF BI BJ BW CD CF CG CI CM CV DJ DZ EG EH ER ET GA GH GM GN GQ GW KE KM LR LS LY MA MG ML MR MU MW MZ NA NE NG RE RW SC SD SH SL SN SO SS ST SZ TD TG TN TZ UG YT ZA ZM ZW',
    Oceania:'AS AU CK FJ FM GU KI MH MP NC NF NR NU NZ PF PG PN PW SB TK TO TV UM VU WF WS',
    Antarctica:'AQ BV GS HM TF'
  };
  const byCountry = {};
  for (const [continent,codes] of Object.entries(groups)) for (const code of codes.split(' ')) byCountry[code]=[continent];
  // Transcontinental countries retain both sides of their geography.
  byCountry.TR=['Europe','Asia']; byCountry.RU=['Europe','Asia']; byCountry.KZ=['Europe','Asia'];
  byCountry.EG=['Africa','Asia'];
  const aliases = new Map();
  for (const locale of ['en','fr','fa']) {
    try { const names=new Intl.DisplayNames([locale],{type:'region'});
      for (const code of Object.keys(byCountry)) aliases.set(normalize(names.of(code)),code);
    } catch (_) {}
  }
  const country = value => {
    const s = normalize(value);
    if (/^(gb|uk|gbr)$/.test(s) || /united kingdom|great britain|england|scotland|wales|london|heathrow|gatwick|stansted|luton|manchester|لندن|بریتانیا|انگلستان/.test(s)) return 'GB';
    if (/^(tr|tur)$/.test(s) || /turkey|türkiye|turkiye|istanbul|antalya|ankara|izmir|dalaman|bodrum|ترکیه|استانبول|آنتالیا|ازمیر|آنکارا/.test(s)) return 'TR';
    if (byCountry[s.toUpperCase()]) return s.toUpperCase();
    if (aliases.has(s)) return aliases.get(s);
    const cities={paris:'FR',nantes:'FR',budapest:'HU',barcelona:'ES',madrid:'ES',berlin:'DE',frankfurt:'DE',rome:'IT',milan:'IT',lisbon:'PT',vienna:'AT',warsaw:'PL',brussels:'BE',amsterdam:'NL',helsinki:'FI',oslo:'NO',zurich:'CH',toronto:'CA',montreal:'CA',vancouver:'CA','new york':'US','los angeles':'US','mexico city':'MX',تهران:'IR',تورنتو:'CA',پاریس:'FR'};
    if (cities[s]) return cities[s];
    for (const part of s.split(',').map(x=>x.trim())) {if(aliases.has(part))return aliases.get(part);if(cities[part])return cities[part];}
    return s.toUpperCase();
  };
  const continents = value => byCountry[country(value)] || [];
  const airlineContinent = region => region === 'Middle East' ? 'Asia' : region;
  function scope(airlines,from,to){
    const a=country(from),b=country(to);
    const allowed=[...new Set([...continents(a),...continents(b)])];
    return {airlines:allowed.length?airlines.filter(item=>allowed.includes(airlineContinent(item.region))):airlines,
      filtered:allowed.length>0,from:a,to:b,continents:allowed};
  }
  root.PawVagoRouteScope=Object.freeze({scope,country,continents,airlineContinent});
})(window);
