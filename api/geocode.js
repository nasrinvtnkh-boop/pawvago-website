export default async function handler(req, res) {
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
