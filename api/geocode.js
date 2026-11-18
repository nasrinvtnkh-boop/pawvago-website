export default async function handler(req, res) {
  if (req.query?.mode === 'city') return suggestCities(req, res);
  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ORS_API_KEY is not configured' });

  const text = String(req.query?.text || '').trim();
  if (!text) return res.status(400).json({ error: 'Missing text query' });

  try {
    const url = new URL('https://api.openrouteservice.org/geocode/search');
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('text', text);
    url.searchParams.set('size', '5');

    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: 'Geocoding provider error', details: data });

    const results = (data.features || []).map(feature => ({
      label: feature.properties?.label || text,
      coordinates: feature.geometry?.coordinates || null,
      country: feature.properties?.country || null,
      locality: feature.properties?.locality || feature.properties?.county || null
    }));

    return res.status(200).json({ results });
  } catch (error) {
    return res.status(500).json({ error: 'Geocoding request failed' });
  }
}

// ISO 3166-1 alpha-3 to alpha-2 for Pelias country_a values.
const countryCodes = new Map(
  `ABWAW AFGAF AGOAO AIAAI ALAAX ALBAL ANDAD AREAE ARGAR ARMAM ASMAS ATAAQ ATFTF ATGAG
  AUSAU AUTAT AZEAZ BDIBI BELBE BENBJ BESBQ BFABF BGDBD BGRBG BHRBH BHSBS BIHBA BLMBL
  BLRBY BLZBZ BMUBM BOLBO BRABR BRBBB BRNBN BTNBT BVTBV BWABW CAFCF CANCA CCKCC CHECH
  CHLCL CHNCN CIVCI CMRCM CODCD COGCG COKCK COLCO COMKM CPVCV CRICR CUBCU CUWCW CXRCX
  CYMKY CYPCY CZECZ DEUDE DJIDJ DMADM DNKDK DOMDO DZADZ ECUEC EGYEG ERIER ESHEH ESPES
  ESTEE ETHET FINFI FJIFJ FLKFK FRAFR FROFO FSMFM GABGA GBRGB GEOGE GGYGG GHAGH GIBGI
  GINGN GLPGP GMBGM GNBGW GNQGQ GRCGR GRDGD GRLGL GTMGT GUFGF GUMGU GUYGY HKGHK HMDHM
  HNDHN HRVHR HTIHT HUNHU IDNID IMNIM INDIN IOTIO IRLIE IRNIR IRQIQ ISLIS ISRIL ITAIT
  JAMJM JEYJE JORJO JPNJP KAZKZ KENKE KGZKG KHMKH KIRKI KNAKN KORKR KWTKW LAOLA LBNLB
  LBRLR LBYLY LCALC LIELI LKALK LSOLS LTULT LUXLU LVALV MACMO MAFMF MARMA MCOMC MDAMD
  MDGMG MDVMV MEXMX MHLMH MKDMK MLIML MLTMT MMRMM MNEME MNGMN MNPMP MOZMZ MRTMR MSRMS
  MTQMQ MUSMU MWIMW MYSMY MYTYT NAMNA NCLNC NERNE NFKNF NGANG NICNI NIUNU NLDNL NORNO
  NPLNP NRUNR NZLNZ OMNOM PAKPK PANPA PCNPN PERPE PHLPH PLWPW PNGPG POLPL PRIPR PRKKP
  PRTPT PRYPY PSEPS PYFPF QATQA REURE ROURO RUSRU RWARW SAUSA SDNSD SENSN SGPSG SGSGS
  SHNSH SJMSJ SLBSB SLESL SLVSV SMRSM SOMSO SPMPM SRBRS SSDSS STPST SURSR SVKSK SVNSI
  SWESE SWZSZ SXMSX SYCSC SYRSY TCATC TCDTD TGOTG THATH TJKTJ TKLTK TKMTM TLSTL TONTO
  TTOTT TUNTN TURTR TUVTV TWNTW TZATZ UGAUG UKRUA UMIUM URYUY USAUS UZBUZ VATVA VCTVC
  VENVE VGBVG VIRVI VNMVN VUTVU WLFWF WSMWS YEMYE ZAFZA ZMBZM ZWEZW`
    .split(/\s+/).map(code => [code.slice(0, 3), code.slice(3)])
);

async function suggestCities(req, res) {
  const text = String(req.query?.text || '').trim();
  const country = String(req.query?.country || '').toUpperCase();
  if (req.method !== 'GET') return res.status(405).json({ results: [] });
  if (text.length < 2 || text.length > 65 || (country && !/^[A-Z]{2}$/.test(country))) {
    return res.status(400).json({ results: [] });
  }
  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) return res.status(503).json({ results: [] });
  const url = new URL('https://api.openrouteservice.org/geocode/autocomplete');
  url.searchParams.set('text', text);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('layers', 'locality,localadmin');
  url.searchParams.set('size', '7');
  if (country) url.searchParams.set('boundary.country', country);

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(4500)
    });
    if (!response.ok) return res.status(502).json({ results: [] });
    const data = await response.json();
    const results = (data.features || []).flatMap(({properties}) => {
      const code = countryCodes.get(properties?.country_a) || properties?.country_code;
      const name = properties?.name;
      return typeof name === 'string' && /^[A-Z]{2}$/.test(code)
        ? [{name, code, region: properties.region || ''}] : [];
    });
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300');
    return res.status(200).json({ results });
  } catch (_) {
    return res.status(502).json({ results: [] });
  }
}
