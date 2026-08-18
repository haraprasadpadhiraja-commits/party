# 🎓 Fresher Party Management System

A complete, database-driven **Fresher Party Management Website** for a college,
built with **Django**, **SQLite** (ready for MySQL), **HTML5/CSS3/JavaScript**,
**Chart.js**, **openpyxl** (Excel export) and **ReportLab** (PDF export).

The website is **not a static demo** — everything (registrations, faculty,
college info, gallery, statistics, search) is stored in and read from a real
database, with full authentication, CRUD, live search, dashboard charts and
export functionality.

---

## ✨ Features

| Area | What it does |
|------|--------------|
| 🏠 **Home** | Hero section, live countdown timer (updates every second), real statistics from the database |
| 🎓 **Registration** | Auto-generated registration numbers (`FR20260001`…), full validation, success page with confetti |
| 👨‍🏫 **Faculty** | Searchable faculty directory with branch filter and profile cards |
| 📊 **Dashboard** | Live totals + 4 Chart.js charts (students by branch, 7-day growth, faculty by branch, marks distribution) |
| 🔍 **Live Search** | Instant AJAX search for students & faculty as you type (no page reload) |
| 🏫 **About** | Editable college info stored in DB (history, vision, mission, courses, branches, facilities, principal, contact) |
| 🖼️ **Gallery** | Responsive photo gallery with categories, hover zoom and lightbox |
| 🔐 **Admin Panel** | Custom dashboard; add/edit/view/delete students & faculty; edit college; manage gallery |
| 📊 **Exports** | One-click **Excel (.xlsx)** and **PDF** export of all (or filtered) students |
| 🌙 **Theme** | Dark/Light mode remembered via `localStorage` |
| 📱 **Responsive** | Works on desktop, tablet and mobile (hamburger menu) |
| 🎉 **Animations** | Confetti, floating particles, countdown, hover effects, toast notifications — respects `prefers-reduced-motion` |

**Security:** Django's CSRF protection, password hashing, built-in authentication,
`@login_required` on all admin URLs, server-side validation, and permission checks
(visitors cannot add/edit/delete anything).

---

## 📁 Project Structure

```
fresher_party/
│
├── manage.py
├── requirements.txt
├── README.md
│
├── fresher_party/            # project configuration
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── party/                    # main application
│   ├── models.py             # Student, Faculty, CollegeInfo, GalleryImage
│   ├── views.py              # all page & admin views
│   ├── forms.py              # validated forms
│   ├── urls.py
│   ├── admin.py              # Django admin registration
│   ├── management/commands/seed_demo.py
│   └── migrations/
│
├── templates/                # HTML templates
│   ├── base.html
│   ├── home.html, student_register.html, registration_success.html
│   ├── faculty.html, dashboard.html, search.html, gallery.html, about.html
│   └── admin/                # login, dashboard, student & faculty management,
│                             # college edit, gallery management, forms
│
├── static/
│   ├── css/style.css
│   ├── js/main.js, search.js, countdown.js, confetti.js, particles.js, charts.js
│   └── images/favicon.svg, hero-fallback.svg
│
└── media/                    # uploaded images (college photos, gallery, logo)
```

---

## 🚀 Setup Instructions

### 1. Create a virtual environment

**Windows (PowerShell / CMD):**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Create & apply the database

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create an admin (administrator) account

```bash
python manage.py createsuperuser
```
You'll be asked for a username, email and password. **This password is hashed and
never stored in plain text.** Use it to log in to the Admin Panel (top-right
"Admin Login" button, or the `/login/` page).

### 5. (Optional) Load sample / demo data

```bash
python manage.py seed_demo
```
This adds **clearly-marked demo students, faculty, college info and sample
gallery images** so the site isn't empty. It never overwrites existing data.

### 6. Run the server

```bash
python manage.py runserver
```
Open http://127.0.0.1:8000/ in your browser.

> **Demo login:** if you used `seed_demo`, the demo content is ready. The admin
> login is whatever you created with `createsuperuser` — no credentials are
> embedded in the code.

---

## 🔐 Default Admin Credentials (this workspace only)

A superuser was created for convenience during development:

- **Username:** `admin`
- **Password:** `admin123`

> ⚠️ **Change this before real use!** Run `python manage.py changepassword admin`.
> Never commit real credentials to version control.

---

## 📌 Where to put your college logos & photographs

Uploaded images are saved to the `media/` folder. There are **two ways** to add them:

### Option A — Use the website (easiest, no code)
1. Log in as admin → **Admin Panel**.
2. **Edit College Information** → upload your **College Logo** and **Hero Image**.
3. **Manage Gallery / Add Image** → upload your campus, classroom, laboratory,
   fresher-party, event, student and faculty photos (or paste external URLs).

### Option B — Drop files directly into `media/`
```
media/
├── college/    # college.logo and hero photos (CollegeInfo model)
└── gallery/    # gallery photos (GalleryImage model)
```
Uploaded files placed here are referenced by the model records you create.

For **remote/sample** gallery images, add them via the admin panel using an
**External Image URL** (the demo seed already does this with clearly-marked
sample URLs — replace them with your own).

---

## 📊 Database Models

| Model | Key fields |
|-------|-----------|
| `Student` | `registration_number` (auto), `name`, `father_name`, `address`, `phone`, `marks`, `branch`, `created_at`, `updated_at` |
| `Faculty` | `faculty_number` (auto), `name`, `branch`, `designation`, `email`, `created_at` |
| `CollegeInfo` | `college_name`, `tagline`, `history`, `vision`, `mission`, `courses`, `branches`, `facilities`, `principal_name/message`, `address`, `phone`, `email`, `website`, `established_year`, `logo`, `hero_image` |
| `GalleryImage` | `title`, `category`, `image`, `image_url`, `uploaded_at` |

Commonly searched fields (`registration_number`, `name`, `branch`, etc.) have
database **indexes** for fast search.

---

## 🗄️ Switching from SQLite to MySQL (Production)

1. Install the MySQL driver:
   ```bash
   pip install mysqlclient
   ```
2. Create a MySQL database and user.
3. In `fresher_party/settings.py`, comment out the **SQLite** block and uncomment
   the **MySQL** block (fill in your host, user, password, and database name).
4. Run migrations:
   ```bash
   python manage.py migrate
   ```

---

## 🛠️ Troubleshooting

- **Charts don't load / icons missing offline:** Chart.js and Font Awesome load
  from CDNs. If you're offline they won't appear — that's expected. You can
  download these libraries into `static/` for full offline use.
- **`makemigrations` needs running after editing models:** run
  `python manage.py makemigrations && python manage.py migrate`.
- **Port already in use:** run `python manage.py runserver 0.0.0.0:8001`.

---

## ✅ "Important Requirements" checklist

1. ✔ Actually saves data to the database
2. ✔ Actually retrieves saved data
3. ✔ Actually searches the database (AJAX live search)
4. ✔ Actually generates registration numbers (`FR2026XXXX`, no duplicates)
5. ✔ Actually calculates student/faculty/branch totals (never hard-coded)
6. ✔ Actual admin CRUD (add / edit / view / delete)
7. ✔ Actually exports student records (Excel + PDF)
8. ✔ No hard-coded fake statistics
9. ✔ Responsive (no horizontal scroll)
10. ✔ Proper error handling & validation
11. ✔ Polished, non-generic UI
12. ✔ Sample data clearly marked as demo
13. ✔ Secrets/passwords never in frontend files
