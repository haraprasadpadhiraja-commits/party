# 🎓 Fresher Party 2026 — Static Website Version

This is a **100% static (HTML/CSS/JS)** version of the Fresher Party Management
System. You can upload these files to **any web server** (shared hosting,
cPanel, GitHub Pages, Netlify, Vercel, a school/college server, etc.) and it
works immediately — **no Python, no Django, no database installation, nothing
to configure on the server.**

It uses your browser's **localStorage** as a local "database", so registration,
search, dashboard charts, admin management and exports all actually work, just
stored in each visitor's browser.

---

## 📦 How to deploy (any server)

1. Upload the **entire** `fresher_party_static/` folder to your server's web
   root (e.g. `public_html/` or `htdocs/`).
2. Open `index.html` in a browser. Done. ✅

That's it. No build step, no command line, no server software required.

---

## 📁 Files

```
fresher_party_static/
├── index.html        # Home (hero, countdown, live stats)
├── register.html     # Registration form + success
├── faculty.html      # Faculty directory (search + filter)
├── dashboard.html    # Dashboard with live Chart.js charts
├── search.html       # Live search page
├── gallery.html      # Photo gallery (categories + lightbox)
├── about.html        # About the college
├── admin.html        # Admin panel (login + full CRUD + exports)
├── css/style.css     # Theme (light/dark), responsive, animations
├── js/
│   ├── config.js     # ✏️ EDIT THIS: college info, photos, password, date
│   ├── data.js       # localStorage "database" layer
│   ├── common.js     # navbar/theme/search/toasts/confetti/countdown
│   ├── components.js # injects the shared navbar & footer
│   ├── register.js, faculty.js, search.js, gallery.js,
│   ├── about.js, charts.js, admin.js
└── images/           # put your logo & photos here
```

---

## ✏️ Customise (edit `js/config.js`)

- **College name, tagline, history, vision, mission, courses, branches,
  facilities, principal, contact, address** → `SITE_CONFIG.college`
- **Countdown date** → `SITE_CONFIG.partyDate` (e.g. `"2026-12-15T18:00:00"`)
- **Admin login** → `SITE_CONFIG.adminUsername` and `adminPassword`
- **Gallery photos** → `SITE_CONFIG.galleryImages` (use local paths like
  `images/photo1.jpg` or any image URL)
- **Logo** → `SITE_CONFIG.college.logo` (put your file in `images/`)
- **Hero background photo** → `SITE_CONFIG.college.heroImage`

> ⚠️ **Admin password note:** Because this is a pure static site, the password
> lives in `config.js` and is visible in the browser. This is fine for a
> college event demo, but for **real security** use the **Django version** in
> the `fresher_party/` folder, where authentication and passwords are handled
> securely on the server.

---

## 📱 Works everywhere

- Fully **responsive** (desktop, tablet, mobile — hamburger menu on phones).
- **Dark/Light mode** toggle, remembered in `localStorage`.
- Works when opened directly from a folder too (though CDN icons/charts need
  internet; see below).

## 🌐 About the CDN libraries

`Font Awesome` (icons), `Chart.js` (charts) and `SheetJS` (Excel export) load
from public CDNs. On a normal hosted website with internet they all work. If
you need it to work **completely offline**, download those files into `css/`
and `js/` and update the `<link>`/`<script>` tags to local paths.

---

## ✅ What works in this static version

| Feature | How |
|---------|-----|
| Student registration | Form saves to localStorage, auto-generates `FR2026XXXX` |
| Live countdown | Updates every second |
| Real statistics | Counted from stored records |
| Live search | Students + faculty as you type |
| Dashboard charts | Computed from stored records (Chart.js) |
| Faculty directory | Search + branch filter |
| Gallery | Categories + lightbox |
| Admin panel | Password-gated; add/edit/delete students & faculty |
| College editor | Edit college info from the admin panel |
| Excel export | Downloads a real `.xlsx` (SheetJS) |
| PDF export | Opens a printable PDF-ready page (Print → Save as PDF) |
| Dark/Light mode | localStorage toggle |
