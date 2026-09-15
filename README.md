# Sadeeda & Ashique — Wedding Invitation

Mobile-first invitation website. No build step.

Live path after GitHub Pages is on:

`https://YOUR-USERNAME.github.io/sadeeda-ashique-wedding/`

---

## Host on GitHub Pages (easiest)

### 1. Create the repository

1. Open [https://github.com/new](https://github.com/new)
2. Repository name: `sadeeda-ashique-wedding`
3. Public
4. Do **not** add a README, .gitignore, or license
5. Create repository

### 2. Upload the site files

1. Unzip `sadeeda-ashique-wedding.zip`
2. Open the folder so you can see `index.html`, `css`, `js`, `assets`
3. On the empty GitHub repo page, click **uploading an existing file**
4. Drag **everything inside** the unzipped folder onto GitHub  
   (the files themselves — `index.html` must sit at the repo root, not inside another extra folder)
5. Commit

Your repo root should look like:

```
index.html
README.md
css/
js/
assets/
```

### 3. Turn on Pages

1. Repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` (or `master`) / folder: `/ (root)`
4. Save

Wait 1–2 minutes, then open:

`https://YOUR-USERNAME.github.io/sadeeda-ashique-wedding/`

Share that link with guests.

---

## Optional: upload with Git (Windows)

```bat
cd path\to\sadeeda-ashique-wedding
git init
git add .
git commit -m "Wedding invitation site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/sadeeda-ashique-wedding.git
git push -u origin main
```

Then enable Pages as in step 3 above.

---

## Edit later

Wedding details live in `js/config.js`:

- WhatsApp RSVP: `whatsappNumber`
- Music file: `audioSrc`
- Date, venue, maps, gallery

After any change, upload the updated file to the same repo (or `git push`). Pages rebuilds automatically.
