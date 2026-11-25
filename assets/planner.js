/* Pixel and Brush – website planner.
   Customers pick options in 5 short steps, see a live sketch of their site,
   then send the plan to us on WhatsApp or by email. No backend needed. */
(() => {
const WA_ID = "pixelandbrush1";
const EMAIL = "sm@pixelandbrush.com";
const STORE = "pb-website-plan-v1";
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* ---------- options ---------- */
const TYPES = [
  {v:"Restaurant or café", em:"☕", items:["Breakfast","Lunch & dinner","Catering"]},
  {v:"Shop or store", em:"🛍️", items:["New arrivals","Best sellers","Gift ideas"]},
  {v:"Salon, spa or beauty", em:"💇", items:["Haircuts","Colour","Nails & spa"]},
  {v:"Trades or home services", em:"🛠️", items:["Repairs","Installations","Free estimates"]},
  {v:"Health or fitness", em:"🩺", items:["Consultations","Treatments","Classes"]},
  {v:"Professional services", em:"💼", items:["Consulting","Planning","Ongoing support"]},
  {v:"Personal brand or creative", em:"🎨", items:["My work","Projects","Collaborations"]},
  {v:"Non-profit or community", em:"🤝", items:["Programs","Volunteer","Donate"]},
  {v:"Something else", em:"✨", items:["Service one","Service two","Service three"]}
];
const GOALS = [
  {v:"Call or message me", cta:"Contact us"},
  {v:"Book an appointment", cta:"Book now"},
  {v:"Buy products online", cta:"Shop now"},
  {v:"Visit my location", cta:"Get directions"},
  {v:"Learn about me or my work", cta:"See our work"}
];
const STYLES = [
  {v:"Modern", d:"Clean and fresh"},
  {v:"Bold", d:"Dark and striking"},
  {v:"Elegant", d:"Classic and refined"},
  {v:"Playful", d:"Friendly and fun"},
  {v:"Minimal", d:"Simple and calm"}
];
const PALETTES = [
  {v:"Ocean", c:["#2f6bff","#00c2a8"]},
  {v:"Sunset", c:["#f0592a","#ffb020"]},
  {v:"Forest", c:["#2e7d32","#c0a062"]},
  {v:"Berry", c:["#c2185b","#7b3fe4"]},
  {v:"Earthy", c:["#8d5b3c","#d9a066"]},
  {v:"Royal", c:["#4338ca","#eab308"]},
  {v:"Sky", c:["#0ea5e9","#f59e0b"]},
  {v:"Black & white", c:["#222222","#9a9a9a"]}
];
const SECTIONS = [
  {v:"about", label:"About us", em:"👋", on:true},
  {v:"services", label:"Services / what we offer", em:"⭐", on:true},
  {v:"gallery", label:"Photo gallery", em:"🖼️"},
  {v:"reviews", label:"Customer reviews", em:"💬", on:true},
  {v:"pricing", label:"Prices, menu or packages", em:"🏷️"},
  {v:"team", label:"Our team", em:"👥"},
  {v:"faq", label:"Questions & answers", em:"❓"},
  {v:"booking", label:"Book online", em:"📅"},
  {v:"shop", label:"Online shop", em:"🛒"},
  {v:"contact", label:"Contact & location", em:"📍", on:true}
];
const FEATURES = [
  {v:"WhatsApp chat button", on:true}, {v:"Contact form", on:true}, {v:"Google map"},
  {v:"Instagram feed"}, {v:"Newsletter sign-up"}, {v:"Blog or news"}, {v:"English & French"}
];
const LOGO = ["I have a logo","I need a logo","Not sure"];
const CONTENT = ["Yes, photos and text are ready","I have some","No, please help me"];
const BUDGET = ["Under $1,000","$1,000 – $2,500","$2,500 – $5,000","$5,000+","Not sure yet"];
const WHEN = ["As soon as possible","Within a month","1 – 3 months","No rush"];
const NAMES = {about:"About",services:"Services",gallery:"Gallery",reviews:"Reviews",pricing:"Prices",team:"Team",faq:"FAQ",booking:"Book",shop:"Shop",contact:"Contact"};

/* ---------- build the option buttons ---------- */
function pick(name, type, value, inner, checked){
  return `<label class="pick"><input type="${type}" name="${name}" value="${esc(value)}"${checked?" checked":""}><span>${inner}</span></label>`;
}
const tick = `<i class="tick" aria-hidden="true"></i>`;
$("#typePick").innerHTML = TYPES.map(t => pick("type","radio",t.v,`<span class="em" aria-hidden="true">${t.em}</span>${esc(t.v)}`)).join("");
$("#goalPick").innerHTML = GOALS.map((g,i) => pick("goal","radio",g.v,esc(g.v),i===0)).join("");
$("#stylePick").innerHTML = STYLES.map((s,i) => pick("style","radio",s.v,`<span class="sw ${s.v.toLowerCase()}" aria-hidden="true">Aa</span><span><b>${s.v}</b><small>${s.d}</small></span>`,i===0)).join("");
$("#palPick").innerHTML = PALETTES.map((p,i) => pick("palette","radio",p.v,`<span class="dots" aria-hidden="true">${p.c.map(c=>`<i style="background:${c}"></i>`).join("")}</span>${esc(p.v)}`,i===0)).join("")
  + pick("palette","radio","My own colour",`<span class="dots" aria-hidden="true"><i id="ownDot" style="background:#e0338f"></i></span>My own colour`);
$("#secPick").innerHTML = SECTIONS.map(s => pick("sections","checkbox",s.v,`<span class="em" aria-hidden="true">${s.em}</span>${esc(s.label)}${tick}`,s.on)).join("");
$("#featPick").innerHTML = FEATURES.map(f => pick("features","checkbox",f.v,`${esc(f.v)}${tick}`,f.on)).join("");
$("#logoPick").innerHTML = LOGO.map((v,i) => pick("logo","radio",v,esc(v),i===0)).join("");
$("#contentPick").innerHTML = CONTENT.map((v,i) => pick("content","radio",v,esc(v),i===1)).join("");
$("#budgetPick").innerHTML = BUDGET.map((v,i) => pick("budget","radio",v,esc(v),i===4)).join("");
$("#whenPick").innerHTML = WHEN.map((v,i) => pick("when","radio",v,esc(v),i===1)).join("");

const form = $("#plForm");
const steps = [...form.querySelectorAll(".pl-step")];
const stepBtns = [...document.querySelectorAll("#plSteps button")];
let step = 0, reached = 0;

/* ---------- read the form ---------- */
function data(){
  const fd = new FormData(form);
  const get = k => (fd.get(k) || "").toString().trim();
  const palName = get("palette");
  const pal = PALETTES.find(p => p.v === palName);
  const own = $("#ownColor").value;
  return {
    name: get("bName"), type: get("type"), tag: get("bTag"), goal: get("goal"),
    style: get("style") || "Modern", palette: palName,
    colors: pal ? pal.c : [own, shade(own)],
    sections: fd.getAll("sections"), features: fd.getAll("features"),
    logo: get("logo"), content: get("content"), budget: get("budget"), when: get("when"),
    notes: get("notes"), cName: get("cName"), cReach: get("cReach")
  };
}
function shade(hex){ // a lighter companion colour for "my own colour"
  const n = parseInt(hex.slice(1),16); const mix = c => Math.round(c + (255-c)*.55);
  return "#" + [n>>16, (n>>8)&255, n&255].map(c => mix(c).toString(16).padStart(2,"0")).join("");
}

/* ---------- live preview ---------- */
const WA_SVG = `<svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><use href="#wa"/></svg>`;
function renderPreview(){
  const d = data();
  const name = d.name || "Your Business";
  const type = TYPES.find(t => t.v === d.type) || TYPES[TYPES.length-1];
  const goal = GOALS.find(g => g.v === d.goal) || GOALS[0];
  const site = $("#site");
  site.className = "site st-" + d.style.toLowerCase();
  site.style.setProperty("--c1", d.colors[0]);
  site.style.setProperty("--c2", d.colors[1]);
  site.style.setProperty("--hero", d.style === "Bold" ? "#16161c" : `color-mix(in srgb, ${d.colors[0]} 10%, var(--bg))`);
  $("#pvUrl").textContent = (d.name ? d.name.toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"") : "yourbusiness") + ".ca";
  const has = s => d.sections.includes(s);
  const menu = SECTIONS.filter(s => has(s.v)).slice(0,4).map(s => `<span>${NAMES[s.v]}</span>`).join("");
  const lines = n => `<div class="s-lines">${Array.from({length:n},(_,i)=>`<i style="width:${[100,92,78,60][i%4]}%"></i>`).join("")}</div>`;
  const cards = (arr, extra="") => `<div class="s-grid">${arr.map(t=>`<div class="s-card"><span class="s-ico"></span><b>${esc(t)}</b>${extra}${lines(2)}</div>`).join("")}</div>`;
  const blocks = {
    about: () => `<h2>About ${esc(name)}</h2>${lines(4)}`,
    services: () => `<h2>What we offer</h2>${cards(type.items)}`,
    gallery: () => `<h2>Gallery</h2><div class="s-gal">${"<i></i>".repeat(6)}</div>`,
    reviews: () => `<h2>What customers say</h2><div class="s-grid">${["Sara M.","James T.","Priya K."].map(n=>`<div class="s-card"><span class="s-stars">★★★★★</span>${lines(2)}<b>${n}</b></div>`).join("")}</div>`,
    pricing: () => `<h2>Prices</h2><div class="s-grid">${type.items.map((t,i)=>`<div class="s-card"><b>${esc(t)}</b><span class="s-price">$${[29,59,99][i]}</span>${lines(2)}</div>`).join("")}</div>`,
    team: () => `<h2>Meet the team</h2><div class="s-grid">${["Owner","Manager","Specialist"].map(r=>`<div class="s-card"><span class="s-ico" style="border-radius:50%;width:34px;height:34px"></span><b>${r}</b></div>`).join("")}</div>`,
    faq: () => `<h2>Questions & answers</h2><div class="s-faq">${["How do I get started?","What are your hours?","Do you offer refunds?"].map(q=>`<div>${q}<span>+</span></div>`).join("")}</div>`,
    booking: () => `<h2>Book online</h2><div class="s-cal">${Array.from({length:14},(_,i)=>`<i class="${i===9?"on":""}"></i>`).join("")}</div><span class="s-btn" style="justify-self:start">Pick a time</span>`,
    shop: () => `<h2>Shop</h2>${cards(["Product one","Product two","Product three"], `<span class="s-price" style="font-size:13px">$24</span>`)}`,
    contact: () => `<h2>Get in touch</h2>${d.features.includes("Contact form") ? `<div class="s-form"><i></i><i></i><i style="height:52px"></i><span class="s-btn" style="justify-self:start">Send</span></div>` : lines(2)}${d.features.includes("Google map") ? `<div class="s-map" aria-hidden="true">📍</div>` : ""}`
  };
  const body = SECTIONS.filter(s => has(s.v)).map(s => `<section class="s-sec">${blocks[s.v]()}</section>`).join("")
    || `<div class="s-empty">Pick some sections in step 3 and they appear here.</div>`;
  const insta = d.features.includes("Instagram feed") ? `<section class="s-sec"><h2>Follow us on Instagram</h2><div class="s-gal">${"<i></i>".repeat(3)}</div></section>` : "";
  const news = d.features.includes("Newsletter sign-up") ? `<section class="s-sec"><h2>Get our news</h2><div class="s-form" style="grid-template-columns:1fr auto"><i></i><span class="s-btn">Sign up</span></div></section>` : "";
  site.innerHTML = `
    <div class="s-nav"><div class="s-logo"><b>${esc(name.charAt(0).toUpperCase())}</b><span>${esc(name)}</span></div><div class="s-menu">${menu}${d.features.includes("English & French")?"<span>EN | FR</span>":""}</div></div>
    <header class="s-hero"><h1>${esc(d.name ? name : "Your business name goes here")}</h1>
      <p>${esc(d.tag || "A short sentence about what you do and who you help.")}</p>
      <div class="s-btns"><span class="s-btn">${esc(goal.cta)}</span>${has("about")?`<span class="s-btn alt">Learn more</span>`:""}</div></header>
    ${body}${insta}${news}
    <footer class="s-foot"><span>© ${new Date().getFullYear()} ${esc(name)}</span><span>Website by Pixel and Brush</span></footer>
    ${d.features.includes("WhatsApp chat button") ? `<div class="s-wa">${WA_SVG}</div>` : ""}`;
}
document.querySelectorAll(".pv-dev button").forEach(b => b.addEventListener("click", () => {
  document.querySelectorAll(".pv-dev button").forEach(x => x.setAttribute("aria-pressed", x === b));
  $("#browser").classList.toggle("phone", b.dataset.dev === "phone");
}));

/* ---------- steps ---------- */
function show(n){
  step = Math.max(0, Math.min(steps.length-1, n)); reached = Math.max(reached, step);
  steps.forEach((s,i) => s.hidden = i !== step);
  stepBtns.forEach((b,i) => {
    const li = b.parentElement; li.classList.toggle("now", i===step); li.classList.toggle("done", i<step);
    b.disabled = i > reached; b.setAttribute("aria-current", i===step ? "step" : "false");
  });
  $("#plBack").hidden = step === 0;
  $("#plNext").hidden = step === steps.length-1;
  $("#plNext").textContent = step === steps.length-2 ? "Review & send" : "Next";
  if(step === steps.length-1) renderSummary();
}
function check(n){
  if(n === 0 && !$("#bName").value.trim()){ $("#plErr").textContent = "Please type your business name. A working name is fine."; $("#bName").focus(); return false; }
  return true;
}
function go(n){
  $("#plErr").textContent = "";
  if(n > step) for(let i = step; i < n; i++){ if(!check(i)){ show(i); return; } }
  show(n);
  form.scrollIntoView({behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block:"start"});
  const first = steps[step].querySelector("input:not([type=radio]):not([type=checkbox]),textarea");
  if(first && n !== 0) first.focus({preventScroll:true});
}
$("#plNext").addEventListener("click", () => go(step+1));
$("#plBack").addEventListener("click", () => go(step-1));
stepBtns.forEach((b,i) => b.addEventListener("click", () => go(i)));
form.addEventListener("keydown", e => { if(e.key === "Enter" && e.target.tagName === "INPUT" && e.target.type !== "checkbox" && e.target.type !== "radio"){ e.preventDefault(); if(step < steps.length-1) go(step+1); } });

/* ---------- summary & sending ---------- */
function rows(d){
  const secNames = SECTIONS.filter(s => d.sections.includes(s.v)).map(s => s.label);
  return [
    ["Business", d.name + (d.type ? ` (${d.type})` : "")],
    ["About", d.tag],
    ["Main goal", d.goal],
    ["Style", d.style],
    ["Colours", `${d.palette || "Ocean"} (${d.colors.join(", ")})`],
    ["Sections", secNames.join(", ") || "None picked"],
    ["Extras", d.features.join(", ") || "None"],
    ["Logo", d.logo],
    ["Photos & text", d.content],
    ["Budget", d.budget],
    ["Timeline", d.when],
    ["Notes", d.notes]
  ].filter(r => r[1]);
}
function renderSummary(){
  $("#summary").innerHTML = rows(data()).map(([k,v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
}
function message(d, bold){
  const b = t => bold ? `*${t}:*` : `${t}:`;
  return `Hi Pixel and Brush! I made a website plan on your website.\n\n`
    + rows(d).map(([k,v]) => `${b(k)} ${v}`).join("\n")
    + `\n\n${b("My name")} ${d.cName}\n${b("Reach me at")} ${d.cReach}`;
}
function ready(){
  const d = data();
  if(!d.name){ show(0); check(0); return null; }
  if(!d.cName){ $("#plErr").textContent = "Please add your name."; $("#cName").focus(); return null; }
  if(!d.cReach){ $("#plErr").textContent = "Please add a phone number or email so we can reply."; $("#cReach").focus(); return null; }
  $("#plErr").textContent = ""; return d;
}
function openLink(href, newTab){
  const a = document.createElement("a"); a.href = href; if(newTab){ a.target = "_blank"; a.rel = "noopener"; }
  document.body.appendChild(a); a.click(); a.remove();
}
function sent(how){
  $("#doneBox").hidden = false;
  $("#doneHow").textContent = how;
  $("#doneBox").scrollIntoView({behavior:"smooth", block:"nearest"});
}
$("#sendWa").addEventListener("click", () => {
  const d = ready(); if(!d) return;
  openLink(`https://wa.me/${WA_ID}?text=${encodeURIComponent(message(d, true))}`, true);
  sent("WhatsApp should open with your plan already typed. Just press send.");
});
$("#sendMail").addEventListener("click", () => {
  const d = ready(); if(!d) return;
  openLink(`mailto:${EMAIL}?subject=${encodeURIComponent("Website plan – " + d.name)}&body=${encodeURIComponent(message(d, false))}`);
  sent(`Your email app should open with your plan ready to send to ${EMAIL}.`);
});
$("#copyPlan").addEventListener("click", () => {
  const d = data(); const txt = message(d, false); const btn = $("#copyPlan"); const label = btn.textContent;
  const done = () => { btn.textContent = "Copied"; setTimeout(() => btn.textContent = label, 1800); };
  const fail = () => { $("#plErr").textContent = `Copy didn't work here. Send it on WhatsApp or email ${EMAIL}.`; };
  try { navigator.clipboard.writeText(txt).then(done, fail); } catch(e){ fail(); }
});

/* ---------- save progress in this browser ---------- */
function save(){
  try{
    const fd = new FormData(form); const o = {};
    for(const [k,v] of fd) (o[k] = o[k] || []).push(v);
    o.ownColor = [$("#ownColor").value]; o._step = reached;
    localStorage.setItem(STORE, JSON.stringify(o));
    $("#saved").textContent = "Progress saved";
  }catch(e){}
}
function restore(){
  try{
    const o = JSON.parse(localStorage.getItem(STORE) || "null"); if(!o) return;
    form.querySelectorAll("input[type=checkbox]").forEach(i => i.checked = (o[i.name]||[]).includes(i.value));
    form.querySelectorAll("input[type=radio]").forEach(i => { if(o[i.name]) i.checked = o[i.name].includes(i.value); });
    form.querySelectorAll("input:not([type=checkbox]):not([type=radio]),textarea").forEach(i => { if(o[i.name] && o[i.name][0] != null) i.value = o[i.name][0]; });
    if(o.ownColor) $("#ownColor").value = o.ownColor[0];
    reached = Math.min(o._step || 0, steps.length-1);
    $("#saved").textContent = "Welcome back – your plan was saved";
  }catch(e){}
}
$("#ownColor").addEventListener("input", () => {
  $("#ownDot").style.background = $("#ownColor").value;
  const r = form.querySelector('input[name=palette][value="My own colour"]'); if(r) r.checked = true;
});
$("#restart").addEventListener("click", () => {
  try{ localStorage.removeItem(STORE); }catch(e){}
  form.reset(); $("#doneBox").hidden = true; reached = 0; $("#saved").textContent = ""; $("#ownDot").style.background = $("#ownColor").value;
  renderPreview(); show(0);
});
let t; form.addEventListener("input", () => { renderPreview(); clearTimeout(t); t = setTimeout(save, 400); });
form.addEventListener("change", () => { renderPreview(); if(step === steps.length-1) renderSummary(); });
form.addEventListener("submit", e => e.preventDefault());

restore();
$("#ownDot").style.background = $("#ownColor").value;
renderPreview(); show(0);
})();
