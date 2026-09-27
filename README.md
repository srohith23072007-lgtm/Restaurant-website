# Spice Garden Restaurant Website

A premium, responsive restaurant landing page built with HTML, CSS, and JavaScript for a modern food brand experience.

## Project Overview

Spice Garden Restaurant is a restaurant landing page designed to feel elegant, warm, and premium. It includes:
- Sticky navigation with a mobile hamburger menu
- Full-width hero banner with overlay text and CTA buttons
- About us story section with restaurant imagery
- Filterable food menu with category buttons
- Add-to-cart functionality with cart count and sidebar
- Special offer cards
- Why choose us feature section
- Restaurant gallery with lightbox interaction
- Customer reviews/testimonials
- Table reservation form with validation
- Contact section with map, social links, and form validation
- Footer with brand, links, and contact details

## Preview

A live local preview is available by running:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Screenshots

Add screenshots to a `screenshots/` folder and reference them here:

```md
![Homepage](screenshots/homepage.png)
![Menu Section](screenshots/menu.png)
![Reservation Form](screenshots/reservation.png)
```

## File Structure

```text
restaurant website/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    └── images/
```

## How to Run

### Option 1: Open directly
1. Open the project folder in VS Code.
2. Open `index.html` in a browser.

### Option 2: Use a local web server
From the project folder, run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Customizing the Website

### Change restaurant name and tagline
Edit the text in `index.html`:
- Restaurant name
- Tagline
- Hero heading
- About section text
- Footer text

### Update prices
In `index.html`, look for the menu item price elements and change the values inside the price tags.

Example:

```html
<span class="menu-card-price" data-price="320">₹320</span>
```

### Change contact details
Update the phone number, email, address, and social links in `index.html`.

### Replace images
Place your new images in `assets/images/` and update the `src` values in `index.html`.

### Update theme colors
Edit the CSS variables in `style.css` under `:root`.

```css
:root {
  --color-dark-brown: #2c1810;
  --color-cream: #fdf5e6;
  --color-gold: #d4a853;
  --color-orange: #e07b39;
}
```

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Google Fonts
- Font Awesome

## Deployment

### Netlify
1. Push this project to GitHub.
2. Go to Netlify and click "Add new site" > "Import from Git".
3. Select your repository.
4. Set the publish directory to the project root.
5. Click "Deploy site".

### Vercel
1. Push this project to GitHub.
2. Open Vercel and import the repository.
3. Keep the default project settings.
4. Deploy the project.

> This is a static website, so no backend setup is required for basic deployment.

## Notes

- The project is static and can be used as a front-end prototype or portfolio project.
- The reservation and contact forms currently validate client-side input and display success/error messages.
- Images are served locally and can be swapped without changing the layout structure.

## License

This project is for educational/demo purposes.
