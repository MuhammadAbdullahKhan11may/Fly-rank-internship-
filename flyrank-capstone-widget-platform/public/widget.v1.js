(() => {
  const script = document.currentScript;
  if (!script) return;
  const id = new URL(script.src).searchParams.get("id");
  if (!id) return;
  const base = new URL(script.src).origin;

  async function boot() {
    try {
      const r = await fetch(`${base}/api/public/widgets/${encodeURIComponent(id)}/config`);
      if (!r.ok) throw new Error("Widget configuration unavailable");
      const config = await r.json();

      const host = document.createElement("div");
      host.style.cssText = "font-family:Arial,sans-serif;max-width:380px;padding:16px;border:1px solid #ddd;border-radius:10px;margin:12px 0;background:#fff;color:#111";
      const title = document.createElement("h3");
      title.textContent = config.title;
      host.appendChild(title);
      if (config.description) {
        const p = document.createElement("p"); p.textContent = config.description; host.appendChild(p);
      }

      const form = document.createElement("form");
      config.fields.forEach(f => {
        const wrap = document.createElement("div"); wrap.style.marginBottom = "10px";
        const label = document.createElement("label"); label.textContent = f.label; label.style.display = "block";
        const input = f.type === "textarea" ? document.createElement("textarea") : document.createElement("input");
        if (f.type !== "textarea") input.type = f.type;
        input.name = f.name; input.required = !!f.required; input.style.width = "100%";
        wrap.append(label, input); form.appendChild(wrap);
      });
      const hp = document.createElement("input");
      hp.name = "website"; hp.tabIndex = -1; hp.autocomplete = "off"; hp.style.display = "none";
      form.appendChild(hp);
      const button = document.createElement("button"); button.type = "submit"; button.textContent = config.buttonText;
      form.appendChild(button);
      const msg = document.createElement("p"); form.appendChild(msg);

      form.addEventListener("submit", async e => {
        e.preventDefault(); button.disabled = true; msg.textContent = "Sending...";
        const fd = new FormData(form), data = {};
        config.fields.forEach(f => data[f.name] = fd.get(f.name) || "");
        const response = await fetch(`${base}/api/public/widgets/${encodeURIComponent(id)}/submissions`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data, website: fd.get("website") || "" })
        });
        msg.textContent = response.ok ? "Thanks — submitted." : "Submission failed.";
        button.disabled = false;
      });
      host.appendChild(form);
      script.insertAdjacentElement("afterend", host);
    } catch (e) {
      console.error("[widget]", e);
    }
  }
  boot();
})();
