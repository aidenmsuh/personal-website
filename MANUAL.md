# Your website, and how to change it

Everything on the page can be changed by editing a few plain text files. This guide shows where each thing lives and what to change. If you can copy and edit text, you can do all of it.

**Contents**

1. [Where things are](#1-where-things-are)
2. [See your changes](#2-see-your-changes)
3. [Words on the page](#3-words-on-the-page)
4. ["About" topics](#4-about-topics)
5. [Social links](#5-social-links)
6. [Colours and sizes](#6-colours-and-sizes)
7. [The mouse](#7-the-mouse)
8. [Animation timing](#8-animation-timing)
9. [Pictures](#9-pictures)
10. [If something looks off](#10-if-something-looks-off)
11. [How the site is built](#11-how-the-site-is-built)

---

## 1. Where things are

```
Personal Website/
├─ README.md            the short intro shown on GitHub
├─ MANUAL.md            this guide
└─ site/                the website itself (this is the folder you publish)
   ├─ index.html        all the words, topics and links, in English and Korean
   ├─ theme.css         colours, fonts, sizes and animations
   ├─ main.js           what happens when people click, plus the opening animation
   ├─ boot.js           runs first and picks the language before the page appears
   ├─ _headers          security rules for the web host (leave as is)
   ├─ fonts/            the font files (leave as is)
   └─ assets/           your portrait and the tab icon
```

Most of the time you'll only open **`index.html`**. For colours and sizes, open **`theme.css`**.

To find something inside a file, press `Ctrl + F` in your editor and type the word this guide tells you to search for.

---

## 2. See your changes

Double-clicking `index.html` opens the page, but the fonts won't load that way. To see it exactly as visitors will:

1. Open the `site` folder in File Explorer.
2. Click the address bar at the top, type `cmd`, and press `Enter`. A black terminal window opens in that folder.
3. Type this and press `Enter`:
   ```
   python -m http.server 8765 --bind 127.0.0.1
   ```
4. Open **http://127.0.0.1:8765/** in your browser.

Only your own computer can see this. After you save a file, refresh the browser. When you're done, click the terminal and press `Ctrl + C`, or just close it.

(This needs Python, which you already have. On a new computer, install it from python.org first.)

---

## 3. Words on the page

Every sentence is written twice in `index.html`, side by side: once in English and once in Korean.

```html
<span lang="en">Building something new</span><span lang="ko">새로운 걸 만드는 중</span>
```

Change the words between the tags. Leave the tags themselves (`<span lang="en">` and `</span>`) as they are. The EN | 한 switch decides which one visitors see.

> **Always keep both.** Each English piece needs a Korean partner. The page saves room for whichever is longer, and that's what keeps it perfectly still when someone switches language.

| On the page | Search `index.html` for |
|---|---|
| Browser tab title | `<title`. Change the text and both `data-en` / `data-ko` values. |
| Status, top right | `class="status"` |
| Your name and the line under it | `class="kicker"` |
| Big headline | `<h1>`. The word inside `<em>…</em>` gets the gold underline. |
| "click me" beside the mouse | `class="hint"` |
| Load / Trackers / Local time | `class="readout"` |
| What screen readers say for the mouse | `aria-label` (English) and `data-ko-label` (Korean) on `class="mouse"` |

The headline types itself in automatically, whatever you write.

---

## 4. "About" topics

Each topic has two matching parts in `index.html`:

```html
<button type="button" role="tab" aria-controls="background"> …name… </button>
<section id="background" role="tabpanel"> …text… </section>
```

The word after `aria-controls=` and the word after `id=` must be the same.

- **Change a topic:** edit its name in the button (and in the `<h3>` inside its section), then edit the text.
- **Add a topic:** copy one button and one section, then give both a new matching word, such as `music`. The "01 / 03" counter updates itself.
- **Remove a topic:** delete its button and its section.
- **Write more:** inside a section, the English text sits in `<div lang="en">` and the Korean in `<div lang="ko">`. Add as many `<p>…</p>` paragraphs inside each as you like. The card grows to fit the longest topic, so switching topics never makes the page jump.

Visitors can click a topic name, or click the mouse: left-click for the next topic, right-click for the previous one.

---

## 5. Social links

Search `index.html` for **`SOCIAL LINKS`**. The icons appear left to right in the same order as in the file.

| To… | Do this |
|---|---|
| Change where a link goes | Edit its `href="…"`. Web links open in a new tab, so keep `target="_blank" rel="noopener noreferrer"` next to it. |
| Change your email | Edit the address after `mailto:`. Keep `mailto:` in front, or the link won't open an email app. |
| Hide a link | Add the word `hidden` inside its opening `<a …>` tag. LinkedIn is hidden this way right now. |
| Show a hidden link | Delete the word `hidden`. |
| Reorder | Move a whole `<a> … </a>` block up or down. |
| Add another site | Copy the template written in the `SOCIAL LINKS` note, then fill in the address and the site's name. |

The template uses a simple chain-link icon. For a site's real logo, look it up on **simpleicons.org**, copy its SVG, and paste it in place of the `<svg>…</svg>` part. Keep `aria-hidden="true"` on it.

---

## 6. Colours and sizes

Open `theme.css`. All colours are listed at the very top, under `:root`. Change one value and it updates everywhere it's used.

| Name | Used for |
|---|---|
| `--canvas`, `--paper` | page background and light surfaces |
| `--ink` | main text, borders and key shadows |
| `--body`, `--muted` | paragraphs and quieter text |
| `--navy`, `--night` | the "About" card |
| `--gold` | highlights on dark areas, and the headline underline |
| `--brass` | highlights on light areas |
| `--led` | the mouse light and the blue corner |
| `--col` | width of the centre column (`40rem` is about 640 px) |

Colours are written as hex codes like `#13233a`. Any colour picker will give you one.

---

## 7. The mouse

| To change | Where |
|---|---|
| Logo (ring with the S-frame, A and M inside) | `index.html`: search `logo-mark` |
| Logo size and position | the `translate(79 189) scale(.42)` on `logo-mark` (bigger `scale` = larger; the first number moves it left/right, the second up/down) |
| Line thickness | the `stroke-width` values inside `logo-mark` |
| Tilt on large screens | `theme.css`: `.mouse`, `rotate(-14deg)` (more negative = front leans further left) |
| Lift when the pointer is on it | `theme.css`: `.mouse:hover svg`, `scale: 1.05` |
| Light colour | `theme.css`: `--led` |

---

## 8. Animation timing

On screens narrower than about 1100 px (phones and tablets) there is no mouse. Instead, the emblem from the mouse draws itself in the middle of the dark screen (ring, then S, then A and M), flashes, and its glow uncovers the page. Its timings are in `main.js` inside `powerOn()`, next to the comment about phones and tablets.

The opening plays in this order: dark screen → the emblem on the mouse draws itself (ring, then S, then A and M) and flashes → LED strip wakes → its glow uncovers the page → headline types → gold underline draws → "click me" bounces in.

Times in `main.js` (inside `powerOn()`) are in milliseconds, so `1000` is one second. Times in `theme.css` are in seconds.

| Step | File | Value |
|---|---|---|
| Darkness before the emblem starts drawing | `main.js` | `250` in the `for` loop |
| Gap between starting the ring, the S, and A/M | `main.js` | `300` in the same loop |
| Each part drawing | `theme.css` | `.draw`, `.55s` |
| Flash after the last stroke | `main.js` | `wait(550)` |
| Light spreading across the page | `main.js` | `/ 1400` |
| Typing speed, per letter | `main.js` | `30` |
| Card, links and readout rising in (start with the typing) | `theme.css` | `.is-rising`, `.4s`, each block `.1s` after the one above |
| Switching topics in the card | `theme.css` | `.panels section`, `.35s` |
| Pause before "click me" (a little under the underline time) | `main.js` | `wait(750)` |
| Underline drawing | `theme.css` | `h1 em`, `1s` |
| "click me" bounce | `theme.css` | `.hint-in .hint`, `.7s` |

A click or key press skips the opening. People who have reduced motion turned on in their device settings see the page straight away, with no animation.

---

## 9. Pictures

Both pictures live in `site/assets/`.

| File | What it is | Size |
|---|---|---|
| `portrait.webp` | your photo beside your name | 256 × 256 |
| `favicon.png` | the icon in the browser tab (and on GitHub) | 96 × 96 |

### Changing your portrait

The photo shows quite small on the page (88 px wide at most), so one 256 × 256 picture is sharp on every screen, including phones and high-resolution laptops.

1. **Make it square.** Open your photo in the Windows Photos app, click **Edit image** (or press `Ctrl + E`), choose **Crop**, set the aspect ratio to **Square**, and frame your face in the middle. Click **Save as copy**.
2. **Shrink it.** Go to **squoosh.app** and drop the square photo onto the page. Everything happens inside your browser; the photo isn't uploaded anywhere. On the right:
   - Turn on **Resize** and set the width to `256`. The height follows.
   - Under **Compress**, choose **WebP**. A quality of about `75` looks good.
   - Click the download button at the bottom right.
3. **Swap it in.** Rename the downloaded file to `portrait.webp`, then put it in `site/assets/`, replacing the old one.
4. **Check it.** Refresh the page with `Ctrl + Shift + R`.

If your face sits too high or too low in the frame, open `theme.css`, search `.portrait img`, and change `center 40%`. A smaller number shows more of the top of the photo.

### Changing the tab icon

Replace `favicon.png` with any square PNG, 96 × 96 is plenty. Bigger only makes the site slower. A see-through background works best, so it sits nicely on light and dark browser tabs. Browsers remember tab icons for a while, so press `Ctrl + Shift + R` to see the new one.

---

## 10. If something looks off

| You notice | Likely reason |
|---|---|
| Fonts look plain | The page was opened by double-clicking. Use section 2 instead. |
| Page shifts when switching language | An English piece is missing its Korean partner, or the other way round. See section 3. |
| A topic shows the wrong text | Its `aria-controls` and `id` words don't match. See section 4. |
| An icon goes nowhere | Its `href` is still a placeholder like `YOUR-USERNAME` or `#`. |
| The portrait looks squashed | The new photo isn't square. See section 9. |
| A change doesn't show | Save the file, then refresh. If it still doesn't show, press `Ctrl + Shift + R` to reload without the browser's saved copy. |

---

## 11. How the site is built

- Plain HTML, CSS and JavaScript. No frameworks and no build step: the `site` folder is published exactly as it is.
- No trackers, analytics or cookies. `site/_headers` tells browsers to block anything from other websites.
- Every font is bundled in `site/fonts/`, so the page never contacts outside servers. The Korean font loads only when Korean is shown.
- Browsers keep the fonts for a year and the pictures for a week (`site/_headers`), so repeat visits load almost nothing.
- If you turn on Cloudflare Web Analytics in the dashboard, the security rules block its script anyway. Leave it off.
- Hosted on Cloudflare Pages.
- Fonts are under the SIL Open Font License (`site/fonts/OFL.txt`). The site's own code is © Aiden M Suh, all rights reserved.
