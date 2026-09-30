export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ORS_API_KEY is not configured' });

  const { start, end, profile = 'driving-car' } = req.body || {};
  const validPoint = p => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite);
  const allowedProfiles = new Set(['driving-car', 'driving-hgv', 'cycling-regular', 'foot-walking']);

  if (!validPoint(start) || !validPoint(end)) {
    return res.status(400).json({ error: 'start and end must be [longitude, latitude]' });
  }
  if (!allowedProfiles.has(profile)) {
    return res.status(400).json({ error: 'Unsupported routing profile' });
  }

  try {
    const response = await fetch(`https://api.openrouteservice.org/v2/directions/${profile}/geojson`, {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ coordinates: [start, end] })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Routing provider error', details: data });
    }

    const summary = data?.features?.[0]?.properties?.summary || null;
    return res.status(200).json({ summary, route: data });
  } catch (error) {
    return res.status(500).json({ error: 'Route request failed' });
  }
}
