# BEC — Budding Entrepreneurs' Club, IIT Jammu

The official website of the **Budding Entrepreneurs' Club (BEC)**, the student-run
entrepreneurship club (E-Cell) of IIT Jammu.

Plain HTML, CSS and JavaScript. No build step, no dependencies, no npm install.
Open `index.html` in a browser and it works.

---

## Quick start

```bash
# any static server works
python3 -m http.server 8000
# then open http://localhost:8000
```

To deploy: upload the whole folder to GitHub Pages, Netlify, Vercel or any static host.

---

## The one file you'll edit most

**`assets/js/config.js`** holds every external link, the contact email and the social
profiles. Change a URL there and it updates everywhere on the site at once.

```js
links: {
  joinBec:       "join.html",               // replace with the recruitment form URL
  bigIdeaCohort: "initiatives.html#cohort", // replace with the cohort application URL
  ideaDropbox:   "initiatives.html#dropbox", // replace with the idea submission URL
}
```

Any optional link left as `""` still renders as a button, but it's labelled
**"Link coming soon"** and shows a small notice instead of navigating to a dead page.
Fill in the URL and the label flips to **"Link is live"** automatically — no other
change needed.

The same applies to `handbooks` (one key per handbook) and `socials`.

---

## Pages

| File | What's on it |
|---|---|
| `index.html` | Home — hero, stats, about, the three primary links, formats, ecosystem, network, handbooks teaser |
| `about.html` | Story, vision & mission, positioning, the IIT Jammu ecosystem (I3C / I2EDC / AIC / ACIC), student journey |
| `initiatives.html` | Big Idea Cohort, Idea Dropbox, the six formats we run, filterable events calendar |
| `handbooks.html` | Searchable handbook library |
| `team.html` | Team grid, filterable by vertical |
| `join.html` | Why join, six verticals, recruitment process, FAQ |
| `contact.html` | Contact form, direct details, ways to collaborate |
| `404.html` | Not-found page |

---

## Common edits

**Change the three primary links** → `assets/js/config.js`, `links` object.

**Add a handbook** → copy an `<article class="handbook">` block in `handbooks.html`,
give its link a new `data-bec-handbook="yourKey"`, then add `yourKey: "https://…"`
to `handbooks` in `config.js`.

**Add an event** → copy an `<article class="event">` block in `initiatives.html`.
Set `data-category` to one or more of `workshop speaker bootcamp competition outreach`
(space-separated) so the filter buttons pick it up.

**Add a team member** → copy an `<article class="person">` block in `team.html` and set
`data-category` to one of `core ops outreach design tech content finance`.
For a photo, replace the initials inside `.person__avatar` with
`<img src="assets/img/team/name.jpg" alt="">`.

**Update the stats** → the numbers on `index.html` live in `data-count` attributes;
`data-suffix="+"` adds the plus sign. They animate when scrolled into view.

**Change the colours** → every colour is a CSS variable at the top of
`assets/css/style.css` under `:root`. The palette follows IIT Jammu's blue, sky blue
and white.

---

## Contact form

The site is static, so the form validates input and then opens the visitor's email
client with everything pre-filled. Nothing is stored on a server.

To collect submissions automatically instead, replace the `mailto:` handoff at the end
of `initForm()` in `assets/js/main.js` with a `fetch()` POST to a form endpoint
(Formspree, Netlify Forms, Google Forms or your own API).

---

## Notes on the build

- **Mobile-first and fully responsive** — tested down to 320px. Slide-in nav drawer with
  focus trapping and Escape-to-close, fluid type via `clamp()`, and auto-fitting grids.
- **No external requests.** No CDN, no Google Fonts, no icon library. Fonts are a system
  stack, icons are inline SVG, and all imagery is CSS/SVG. The site works offline and
  loads instantly.
- **Accessible** — skip link, landmarks, ARIA on the nav/accordion/filters, visible focus
  rings, and `prefers-reduced-motion` support throughout.
- **Progressive enhancement** — content is in the HTML, so it renders and reads fine even
  if JavaScript fails.

---

## Still to fill in

These are deliberately left as placeholders:

- The three primary URLs, handbook URLs and social profiles in `config.js`
- Real team names, roles and photos in `team.html`
- Real event names and dates in `initiatives.html`
- The stat figures on `index.html`
- The club email in `config.js` (currently `bec@iitjammu.ac.in`)
