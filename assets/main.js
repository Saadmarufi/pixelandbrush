/* Pixel and Brush – shared site script */
const PHONE = "+16135193706";               // Call now
const PHONE_DISPLAY = "(613) 519-3706";
const WHATSAPP_NUMBER = "16135193706";       // digits only, with country code
const HANDLE = "@pixelandbrush1";
const waURL = t => "https://wa.me/" + WHATSAPP_NUMBER + (t ? "?text=" + encodeURIComponent(t) : "");
const $ = s => document.querySelector(s);

const yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

// sticky header state
const hdr = $("#top");
if (hdr) { const f = () => hdr.classList.toggle("scrolled", scrollY > 20); addEventListener("scroll", f, {passive:true}); f(); }

// mobile menu
const menuBtn = $("#menuBtn"), links = $("#links");
if (menuBtn && links) {
  menuBtn.addEventListener("click", () => { const o = links.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", o); });
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { links.classList.remove("open"); menuBtn.setAttribute("aria-expanded", false); }));
}
// services dropdown (keyboard / touch)
document.querySelectorAll(".dd > button").forEach(b => b.addEventListener("click", () => {
  const o = b.parentElement.classList.toggle("open"); b.setAttribute("aria-expanded", o);
}));
document.addEventListener("click", e => document.querySelectorAll(".dd.open").forEach(d => { if (!d.contains(e.target)) d.classList.remove("open"); }));

// cursor glow
document.querySelectorAll(".card,.f").forEach(c => c.addEventListener("pointermove", e => {
  const r = c.getBoundingClientRect();
  c.style.setProperty("--mx", (e.clientX - r.left) + "px");
  c.style.setProperty("--my", (e.clientY - r.top) + "px");
}));

// scroll reveal – only for elements that start below the fold
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if ("IntersectionObserver" in window && !reduce) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); e.target.classList.remove("pre"); io.unobserve(e.target); }
  }), {threshold:.12});
  document.querySelectorAll(".reveal").forEach((el, i) => {
    if (el.getBoundingClientRect().top > innerHeight) {
      el.classList.add("pre"); el.style.transitionDelay = ((i % 4) * 80) + "ms"; io.observe(el);
    }
  });
}

// AEO typing demo
const typed = $("#typed");
if (typed) {
  const answer = typed.dataset.text || "";
  if (reduce || !("IntersectionObserver" in window)) typed.textContent = answer;
  else new IntersectionObserver((es, o) => {
    if (!es[0].isIntersecting) return; o.disconnect(); let i = 0;
    const tick = () => { typed.textContent = answer.slice(0, ++i); if (i < answer.length) setTimeout(tick, 26); }; tick();
  }).observe(typed);
}

// copy buttons
document.querySelectorAll("[data-copy]").forEach(btn => btn.addEventListener("click", () => {
  const val = btn.dataset.copy, label = btn.textContent;
  const done = () => { btn.textContent = "Copied"; setTimeout(() => btn.textContent = label, 1800); };
  const sel = () => { const t = btn.parentElement.querySelector("strong"); if (!t) return;
    const r = document.createRange(); r.selectNodeContents(t); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
  try { navigator.clipboard.writeText(val).then(done, sel); } catch (e) { sel(); }
}));

// WhatsApp enquiry form
const form = $("#waForm");
if (form) form.addEventListener("submit", e => {
  e.preventDefault();
  const note = $("#note"), nameEl = $("#name");
  const name = nameEl.value.trim();
  if (!name) { note.textContent = "Please add your name so we know who we're talking to."; nameEl.focus(); return; }
  const svcs = [...form.querySelectorAll(".svc-pick input:checked")].map(i => i.value);
  const biz = ($("#biz") || {}).value?.trim() || "";
  const msg = ($("#msg") || {}).value?.trim() || "";
  const text = `Hi Pixel and Brush! I'm ${name}${biz ? " from " + biz : ""}.\nInterested in: ${svcs.join(", ") || "not sure yet"}.${msg ? "\n\n" + msg : ""}`;
  const a = document.createElement("a"); a.href = waURL(text); a.target = "_blank"; a.rel = "noopener"; document.body.appendChild(a); a.click(); a.remove();
  note.textContent = `WhatsApp should open with your message ready. If it doesn't, WhatsApp us at ${HANDLE} or call ${PHONE_DISPLAY}.`;
});
