export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(503).json({ error: 'AI assistant is not configured yet.' });
  const { message, history = [] } = req.body || {};
  if (typeof message !== 'string' || !message.trim() || message.length > 1500) return res.status(400).json({ error: 'Please enter a question up to 1500 characters.' });
  const safeHistory = Array.isArray(history) ? history.slice(-8).filter(x => x && ['user','assistant'].includes(x.role) && typeof x.content === 'string').map(x => ({ role:x.role, content:x.content.slice(0,1500) })) : [];
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method:'POST',
      headers:{'Authorization':'Bearer ' + key,'Content-Type':'application/json'},
      body:JSON.stringify({ model:process.env.OPENAI_MODEL || 'gpt-4o-mini', temperature:0.3, max_tokens:650,
        messages:[{role:'system',content:'You are PawVago, a pet travel planning assistant. Help users with travel routes, airline pet policies, pet size and breed restrictions, documents, vaccinations and deadlines. Ask for origin, destination, travel date, transit points, airline, pet species, breed, weight and carrier dimensions as needed. Do not pretend to have real-time airline, border, or veterinary regulation data. Explicitly mark rules as unverified and tell users to confirm with the airline, official government/veterinary authority and veterinarian before booking. Never fabricate citations or guarantees. Respond in the user language. Avoid collecting sensitive personal information.'},...safeHistory,{role:'user',content:message}] })
    });
    if (!response.ok) return res.status(502).json({error:'The assistant is temporarily unavailable.'});
    const data=await response.json();
    return res.status(200).json({reply:data.choices?.[0]?.message?.content || 'Please try again.'});
  } catch { return res.status(502).json({error:'The assistant is temporarily unavailable.'}); }
}