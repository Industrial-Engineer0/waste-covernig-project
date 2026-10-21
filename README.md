# مختبر التغطية المثلى – Set Covering (Operations Research)

Static site, no build step. Open `index.html` or serve the folder.

```
index.html          page structure (Arabic, RTL)
css/style.css       design tokens (:root) + components
js/app.js           model, solver, canvas simulation, reveals, intro
assets/             official Umm Al-Qura University logos (colour + white)
.github/workflows/  GitHub Pages deployment
```

All asset paths are relative, so it works at `https://<user>.github.io/<repo>/`.
Colours live in the `:root` blocks at the top of `css/style.css`.

## Publish
Push to `main`, then Settings > Pages > Source: **GitHub Actions** (or "Deploy from a branch" > `main` / root).
