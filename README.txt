Franchise Lab redesign
1. EXTRACT the zip first (do not open files from inside the zip).
2. Open index.html in Chrome/Edge. Works offline now (Tailwind is compiled into css/tailwind.css).
   Only Google Fonts need internet (a fallback font is used otherwise).
Pages: index, about-us, about-franchising, franchising-in-india, franchise-listings, develop-your-brand-franchise,
       our-clients, blogs, contact-us, listing-<brand>.html
components/: navbar.html, footer.html, modal.html
Inner-page copy not readable from the live site is generic - replace with client text.
Stats counters (data-count in index.html) are placeholders.
Brand logos: img/brand-<slug>.png (shown uncropped via .logo-box in css/style.css). Oye Paaji added as a listing.
Services > Buy a Franchise (franchise-listings.html) lists all 25 brands; each links to listing-<brand>.html.
V2: animated hero (particles, typed headline, floating logos), logo marquee, clients grid (img/clients), motion layer in js/animations.js + css/style.css.
Blogs: blogs.html + blog-*.html (6 articles, covers in img/blog). Contact: Google Map embed (needs internet). Articles 2-6 are draft copy written from the post titles; replace with client text.
