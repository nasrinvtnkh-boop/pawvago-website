(() => {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("pv-agent-form");
    const result = document.getElementById("pv-agent-result");
    const submit = document.getElementById("pv-agent-submit");
    if (!form || !result || !submit) return;

    const line = (value, className = "") => {
      const p = document.createElement("p");
      if (className) p.className = className;
      p.textContent = value;
      return p;
    };
    const show = data => {
      result.replaceChildren();
      const headline = document.createElement("strong");
      headline.textContent = data.status === "preliminary-weight-match" ? "Preliminary weight match — further checks required"
        : data.status === "preliminary-mismatch" ? "Preliminary policy mismatch"
        : "More verification is needed";
      result.append(headline);
      if (data.airline) result.append(line(data.airline));
      if (data.reason) result.append(line(data.reason));
      if (Array.isArray(data.issues)) {
        const ul = document.createElement("ul");
        for (const item of data.issues) {
          const li = document.createElement("li"); li.textContent = item; ul.append(li);
        }
        result.append(ul);
      }
      if (Array.isArray(data.source_urls) && data.source_urls.length) {
        for (const raw of data.source_urls.slice(0,3)) {
          try {
            const url = new URL(raw);
            if (!["https:","http:"].includes(url.protocol)) continue;
            const a = document.createElement("a");
            a.href = url.href; a.target = "_blank"; a.rel = "noopener noreferrer";
            a.textContent = "Review source: " + url.hostname;
            result.append(a);
          } catch { /* Untrusted source URL is ignored */ }
        }
      }
      if (data.reviewed_on) result.append(line("Policy snapshot last reviewed: " + data.reviewed_on, "pv-agent-muted"));
      result.append(line(data.disclaimer || "Screening only. Always confirm with the airline and destination authority.", "pv-agent-muted"));
    };

    form.addEventListener("submit", async event => {
      event.preventDefault();
      submit.disabled = true;
      result.replaceChildren(line("Checking the PawVago policy snapshot…"));
      const data = Object.fromEntries(new FormData(form));
      const petWeight = Number(data.petWeightKg), bagWeight = Number(data.carrierWeightKg);
      if (!Number.isFinite(petWeight) || petWeight <= 0 || !Number.isFinite(bagWeight) || bagWeight < 0) {
        result.replaceChildren(line("Please enter valid pet and carrier weights.")); submit.disabled = false; return;
      }
      try {
        const response = await fetch("/api/agent", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({action:"screen",airline:String(data.airline||""),breed:String(data.breed||""),
            petWeightKg:petWeight,carrierWeightKg:bagWeight,from:String(data.from||""),to:String(data.to||"")})
        });
        if (!response.ok) throw new Error("Unable to check policy.");
        show(await response.json());
      } catch {
        result.replaceChildren(line("The policy service is temporarily unavailable. Please try again later."));
      } finally {submit.disabled=false;}
    });
  });
})();