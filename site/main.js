const root = document.documentElement;
const card = document.querySelector(".card");
const tabs = [...document.querySelectorAll("[role=tab]")];
const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
const [count, total] = document.querySelectorAll(".count span");
const mouse = document.querySelector(".mouse");
const h1 = document.querySelector("h1");
let current = 0;

// Language switch. The choice is kept only in this visitor's browser.
const langButtons = [...document.querySelectorAll("[data-set]")];
const mouseLabel = { en: mouse.getAttribute("aria-label"), ko: mouse.dataset.koLabel };
function setLang(lang) {
  root.lang = lang;
  document.title = document.querySelector("title").dataset[lang];
  mouse.setAttribute("aria-label", mouseLabel[lang]);
  langButtons.forEach((button) => button.setAttribute("aria-pressed", button.dataset.set === lang));
}
// Every font, Korean included, downloads at the start. A click on 한 waits for it (at most half a second).
const koFont = loadKorean();
const koButton = langButtons.find((button) => button.dataset.set === "ko");
langButtons.forEach((button) => button.addEventListener("click", async () => {
  if (button === koButton) await Promise.race([koFont, new Promise((done) => setTimeout(done, 500))]);
  setLang(button.dataset.set);
  pointAt();
  try { localStorage.setItem("lang", button.dataset.set); } catch {}
}));
langButtons[0].parentElement.hidden = false;
setLang(root.lang === "ko" ? "ko" : "en");

// "About" topics. A small cursor glides to the chosen topic and clicks it once.
const cursor = document.createElement("i");
cursor.className = "cursor";
cursor.setAttribute("aria-hidden", "true");
cursor.innerHTML = '<svg viewBox="0 0 14 20"><path d="M1 1v15.5l4-3.6 2.8 6.1 2.9-1.3-2.8-6h5.6Z"/></svg>';
const wave = document.createElement("i");
wave.className = "wave";
wave.setAttribute("aria-hidden", "true");
tabs[0].parentElement.append(wave, cursor);
const spot = () => {
  const tab = tabs[current];
  return `${tab.offsetLeft + tab.offsetWidth - 2}px ${tab.offsetTop + tab.offsetHeight / 2 + 4}px`;
};
function pointAt() {
  cursor.style.translate = spot();
}
// On a click: the wave appears at the chosen topic straight away, and the cursor glides into it.
function tap() {
  wave.style.translate = spot();
  wave.classList.remove("go");
  wave.offsetWidth;
  wave.classList.add("go");
}
addEventListener("resize", pointAt);
document.fonts.ready.then(pointAt);

let ready = false;
function select(index, focus) {
  const before = current;
  current = (index + tabs.length) % tabs.length;
  tabs.forEach((tab, i) => {
    const on = i === current;
    tab.setAttribute("aria-selected", on);
    tab.tabIndex = on ? 0 : -1;
    panels[i].hidden = !on;
  });
  count.textContent = String(current + 1).padStart(2, "0");
  if (ready && current !== before) tap();
  pointAt();
  if (focus) tabs[current].focus();
}
tabs.forEach((tab, i) => {
  tab.id = "tab-" + panels[i].id;
  panels[i].setAttribute("aria-labelledby", tab.id);
  tab.addEventListener("click", () => select(i));
  tab.addEventListener("keydown", (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (step) select(current + step, true);
  });
});
total.textContent = String(tabs.length).padStart(2, "0");
card.classList.add("is-tabbed");
tabs[0].parentElement.hidden = false;
select(0);
ready = true;

// The mouse: left click shows the next topic, right click the previous one.
function press(side, step) {
  select(current + step);
  mouse.classList.add(side);
  setTimeout(() => mouse.classList.remove(side), 140);
}
mouse.addEventListener("click", () => press("is-left", 1));
mouse.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  press("is-right", -1);
});

// Readout: real load time and the visitor's own clock. Nothing is sent anywhere.
const clock = document.getElementById("clock");
const tick = () => { clock.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); };
tick();
setInterval(tick, 15000);
addEventListener("load", () => setTimeout(() => {
  const [nav] = performance.getEntriesByType("navigation");
  if (nav) document.getElementById("load").textContent = Math.round(nav.loadEventEnd || nav.duration) + " ms";
}));

// Entrance: the LED wakes in total darkness, its glow uncovers the page, then the headline types itself.
async function powerOn() {
  let skip = false;
  const pending = new Set();
  const skipNow = () => { skip = true; pending.forEach((finish) => finish()); };
  addEventListener("pointerdown", skipNow, { once: true });
  addEventListener("keydown", skipNow, { once: true });
  const wait = (ms) => new Promise((done) => {
    const finish = () => { clearTimeout(timer); pending.delete(finish); done(); };
    const timer = setTimeout(finish, skip ? 0 : ms);
    pending.add(finish);
  });

  const layer = document.createElement("div");
  layer.className = "power";
  document.body.append(layer);
  root.classList.remove("has-cover");

  // Wrap each headline letter (in the shown language) so it can appear without moving the layout.
  const line = h1.querySelector(`[lang="${root.lang}"]`);
  const original = line.innerHTML;
  const letters = [];
  for (const node of [...line.childNodes]) {
    const text = node.nodeType === 3 ? node : node.firstChild;
    const spans = [...text.textContent].map((ch) => {
      const span = document.createElement("span");
      span.className = "ch";
      span.textContent = ch;
      return span;
    });
    letters.push(...spans);
    text.replaceWith(...spans);
  }
  h1.classList.add("typing");

  // Wait for the fonts, but never more than a moment: the page is still dark, so a late font is never seen.
  await Promise.race([document.fonts.ready, wait(300)]);

  // The emblem draws itself (ring, then S, then A and M) and flashes; its glow then uncovers the page.
  // Large screens: it draws on the mouse, whose LED strip switches on with the flash.
  // Phones and tablets have no mouse, so the emblem draws in the middle of the screen instead.
  let target = mouse, emblem = null;
  if (matchMedia("(max-width: 68.75rem)").matches) {
    emblem = document.createElement("div");
    emblem.className = "intro-emblem";
    emblem.setAttribute("aria-hidden", "true");
    emblem.innerHTML = '<svg class="draw" viewBox="-6 -6 112 112" stroke-linejoin="miter"><circle class="ring" pathLength="1" cx="50" cy="50" r="46" stroke-width="4.5"/><g transform="translate(50 50) scale(.72) translate(-50 -50)"><path class="sframe" pathLength="1" d="M88 8H12V50H88V92H12" stroke-width="7"/><path class="am" pathLength="1" d="M36 42L50 16L64 42M41 33H59" stroke-width="5.5"/><path class="am" pathLength="1" d="M36 84V58L50 72L64 58V84" stroke-width="5.5"/></g></svg>';
    document.body.append(emblem);
    target = emblem;
  }
  for (const step of ["s1", "s2", "s3"]) {
    await wait(step === "s1" ? 250 : 300);
    target.classList.add(step);
  }
  // The emblem flashes as the last stroke lands, and its light spreads out.
  await wait(550);
  // Light the page only once its fonts are in (at most 2 s more), so no letter swaps after it appears.
  await Promise.race([Promise.all([koFont, document.fonts.ready]), wait(2000)]);
  target.classList.add("flash");
  root.classList.add("is-lit");

  const box = target.getBoundingClientRect();
  const x = box.left + box.width / 2, y = box.top + box.height / 2;
  const far = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 220;
  root.classList.remove("is-booting");
  const start = performance.now();
  requestAnimationFrame(function grow(now) {
    const p = skip ? 1 : Math.min((now - start) / 1400, 1);
    const r = far * (p < .5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2);
    layer.style.background = `radial-gradient(circle at ${x}px ${y}px, transparent ${r}px, #4cc3ff40 ${r + 50}px, #0b1a2ce6 ${r + 120}px, #000 ${r + 200}px)`;
    p < 1 ? requestAnimationFrame(grow) : layer.remove();
  });
  if (emblem) wait(400).then(() => emblem.classList.add("out")).then(() => wait(700)).then(() => emblem.remove());
  else wait(1400).then(() => mouse.classList.remove("flash", "s1", "s2", "s3"));

  await wait(700);
  // The rest of the page rises in while the headline types.
  root.classList.remove("is-held");
  root.classList.add("is-rising");
  for (const [i, letter] of letters.entries()) {
    letter.classList.add("on", "at");
    if (i) letters[i - 1].classList.remove("at");
    await wait(letter.textContent === " " ? 50 : 30);
  }
  // Keep the same letters in place so the gold underline draws in (1 s) as soon as typing ends.
  // "click me" bounces in as the underline settles (its last quarter-second barely moves).
  letters.at(-1).classList.remove("at");
  h1.classList.remove("typing");
  await wait(750);
  root.classList.remove("is-rising");
  root.classList.add("hint-in");
  line.innerHTML = original;
  h1.removeAttribute("class");
  layer.remove();
  removeEventListener("pointerdown", skipNow);
  removeEventListener("keydown", skipNow);
}

if (root.classList.contains("is-booting")) powerOn();
else root.classList.add("hint-in");
