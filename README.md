# Southern Safari

A static travel website covering destinations and hotels across southern India.

## Folder layout

- `states/<state>/` contains that state's landing page, places, hotels, packages, travel pages, and state-specific styles.
- `states/<state>/assets/images/` contains destination and hotel images used by that state's pages.
- `states/karnataka/legacy/` keeps the older Karnataka site and its local dependencies separate from the current state pages.
- `assets/images/shared/` contains imagery and transport icons used across multiple states.
- `assets/videos/home/` contains the homepage videos.
- State place cards share a responsive layout and fetch place-specific five-day forecasts from Open-Meteo when the weather button is selected. An internet connection is required for forecasts.
- `assets/unverified/` preserves a legacy file with an image extension that is not actually an image.
- `home.html` uses state-folder images for the popular-package cards.

## Run locally

From this directory, start a static server:

```powershell
python -m http.server 8000
```

Then open <http://localhost:8000/home.html>.
