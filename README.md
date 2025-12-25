# GRLLA Fitness Website - File Structure

## 📁 Directory Structure

```
GRLLA/
├── index.html                 # Main homepage
├── assets/                    # Static assets (images, fonts, etc.)
│   └── images/               # All image files
├── pages/                     # HTML pages
│   ├── supplements.html      # Supplements listing page
│   └── supplement-detail.html # Individual supplement detail page
├── css/                       # Stylesheets
│   ├── style.css            # Main homepage styles
│   └── supplements.css      # Supplements page styles
├── js/                        # JavaScript files
│   ├── script.js            # Main homepage scripts
│   └── supplements.js       # Supplements page scripts
├── data/                      # JSON data files
│   ├── ifit_supplements.json # iFit supplements data
│   └── nbs_supplements.json  # NBS supplements data
└── scripts/                   # Python scraping scripts
    ├── scrape_ifit.py        # iFit scraper
    ├── scrape_nbs.py         # NBS scraper
    ├── scrape_fish_oil.py    # Fish oil scraper
    ├── fix_supplements_json.py
    └── fix_nbs_json.py

```

## 🔗 Navigation Structure

### From Homepage (index.html):

- Links to: `pages/supplements.html`
- Uses: `css/style.css`, `js/script.js`
- Data: `data/nbs_supplements.json`

### From Supplements Page (pages/supplements.html):

- Links to: `../index.html` (back to home)
- Links to: `supplement-detail.html` (product details)
- Uses: `../css/supplements.css`, `../js/supplements.js`
- Data: `../data/nbs_supplements.json`

### From Supplement Detail Page (pages/supplement-detail.html):

- Links to: `supplements.html` (back to supplements)
- Links to: `../index.html` (back to home)
- Uses: `../css/supplements.css`, `../js/supplements.js`
- Data: `../data/nbs_supplements.json`

## 🎯 Key Features

- **Organized Structure**: Files grouped by type (pages, styles, scripts, data)
- **Proper Separation**: HTML, CSS, JS, and data files in separate directories
- **Relative Paths**: All navigation and resource links use proper relative paths
- **Maintainable**: Easy to find and update specific components

## 📝 Notes

- All image assets remain in `assets/images/`
- Python scraping scripts are in `scripts/` directory
- JSON data files are in `data/` directory
- The `index.html` stays in the root for easy web hosting
