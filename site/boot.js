// Runs before the page is drawn: picks the language and prepares the entrance.
(() => {
  const root = document.documentElement;
  let lang = null;
  try { lang = localStorage.getItem("lang"); } catch {}
  root.lang = lang || (navigator.language.startsWith("ko") ? "ko" : "en");
  // Korean font: main.js starts it at load for everyone, so switching language never changes a letter.
  // It resolves once the letters the page uses are downloaded, so a switch can wait for them.
  let ready;
  window.loadKorean = () => ready ||= new Promise((done) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "fonts/pretendard.css";
    link.onload = link.onerror = done;
    document.head.append(link);
  }).then(() => {
    const text = [...document.querySelectorAll('[lang="ko"]')].map((node) => node.textContent).join("") || "가";
    return Promise.all(["400", "800"].map((weight) => document.fonts.load(`${weight} 1em Pretendard`, text)));
  }).catch(() => {});
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.add("is-booting", "has-cover", "is-held");
    setTimeout(() => root.classList.remove("is-booting", "has-cover", "is-held"), 6000);
  }
})();
