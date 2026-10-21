/* Daily source sanity-check: flags policy drift; NEVER writes unverified legal rules. */
import { readFileSync } from 'node:fs';
const policy = JSON.parse(readFileSync(new URL('../data/pet-policy-snapshot.json', import.meta.url), 'utf8'));
const normalize = raw => raw
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&nbsp;|&#160;/gi, ' ')
  .replace(/&times;|&Cross;|&#215;/gi, '×')
  .replace(/&amp;/gi, '&')
  .replace(/\s+/g, ' ')
  .toLowerCase();
const regexWeight = weight => new RegExp('\\b' + weight + '\\s*(?:kg|kilogram|kilos)\\b', 'i');
const checks = [
  { name: 'Air France', url: policy.airlines.find(a => a.id === 'AF').source,
    patterns: [regexWeight(8)] },
  { name: 'Vueling', url: policy.airlines.find(a => a.id === 'VY').source,
    patterns: [regexWeight(10), /45\s*(?:cm)?\s*[×x]\s*39\s*(?:cm)?\s*[×x]\s*21/i] },
  { name: 'Transavia', url: policy.airlines.find(a => a.id === 'HV').source,
    patterns: [regexWeight(8), /40\s*(?:cm)?\s*[×x]\s*(?:width\s*)?30\s*(?:cm)?\s*[×x]\s*(?:height\s*)?24/i] },
  { name: 'Lufthansa', url: policy.airlines.find(a => a.id === 'LH').source,
    patterns: [regexWeight(8), /55\s*(?:cm)?\s*[×x]\s*40\s*(?:cm)?\s*[×x]\s*23/i] },
  { name: 'Air France checked hold', url: policy.airlines.find(a => a.id === 'AF').hold.source,
    patterns: [regexWeight(75), /hold/i] },
  { name: 'Vueling hold not offered', url: policy.airlines.find(a => a.id === 'VY').hold.source,
    patterns: [/cargo hold|hold/i] },
  { name: 'Transavia checked hold', url: policy.airlines.find(a => a.id === 'HV').hold.source,
    patterns: [regexWeight(75), /102/i, /69/i, /76/i] },
  { name: 'Transavia short-nosed breeds', url: policy.airlines.find(a => a.id === 'HV').hold.breed_source,
    patterns: [/shih\s*tzu/i, /persan|persian/i] },
  { name: 'Lufthansa checked hold', url: policy.airlines.find(a => a.id === 'LH').hold.source,
    patterns: [/cargo hold/i, /munich/i] },
  { name: 'Lufthansa short-nosed breeds', url: policy.airlines.find(a => a.id === 'LH').hold.breed_source,
    patterns: [/shih\s*tzus?/i, /persian/i] },
  { name: 'EU pet travel', url: policy.official_sources.eu,
    patterns: [/microchip/i, /rabies/i, /21\s*days/i] },
  { name: 'Great Britain pet travel', url: policy.official_sources.gb_routes,
    patterns: [/approved\s*routes/i, /cargo/i] }
];
const issues = [];
for (const check of checks) {
  try {
    const response = await fetch(check.url, {
      headers: { 'user-agent': 'PawVagoPolicyReferenceMonitor/1.0 (+official-source compliance review)', 'accept': 'text/html' },
      signal: AbortSignal.timeout(12000)
    });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const text = normalize(await response.text());
    const missing = check.patterns.filter(pattern => !pattern.test(text)).map(String);
    if (missing.length) issues.push({ source: check.name, status: 'Manual review needed: expected policy terms not detected', patterns: missing, url: check.url });
    else process.stdout.write('OK ' + check.name + '\n');
  } catch (error) {
    issues.push({ source: check.name, status: 'Official page not reachable by automated monitor', error: String(error), url: check.url });
  }
}
if (issues.length) {
  process.stderr.write('PAWVAGO_POLICY_REVIEW_REQUIRED\n' + JSON.stringify(issues,null,2) + '\n');
  process.exitCode = 1;
} else {
  process.stdout.write('All reference pages passed heuristic checks. This is NOT a legal re-verification; manual source review is still required.\n');
}
