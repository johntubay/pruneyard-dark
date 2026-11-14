# Pruneyard Cabinets: option A, dark (v2.1, John)

This is a static HTML/CSS layout for the Pruneyard Cabinets woodshop site, the custom cabinetry brand of Parfett Construction Inc. It follows the Website Brief and the 10-page sitemap linked on the Podio project entry.

## Pages (10)
| # | File | Page |
|---|------|------|
| 1 | index.html | Home |
| 2 | about.html | About |
| 3 | services.html | Services (parent) |
| 4 | custom-cabinetry-and-vanities.html | Service: Custom Cabinetry & Vanities |
| 5 | built-ins-and-hidden-bookshelf-doors.html | Service: Built-ins & Hidden Bookshelf Doors |
| 6 | bespoke-woodwork-and-finish-details.html | Service: Bespoke Woodwork & Finish Details |
| 7 | projects.html | Projects (parent) |
| 8 | project-1.html | Project Placeholder 1 (Airstream, from the brief) |
| 9 | project-2.html | Project Placeholder 2 |
| 10 | contact.html | Contact / enquiry |

Revision 1 changes:

- Fixed contrast across every page: darker image overlays, a dark glass card behind the hero copy, lighter eyebrows on photos and darker muted text.
- Replaced the marquee with a row of three service cards (photo, name and arrow) on Home, About and the three service pages. The client didn't like the slanted ribbons, so they were removed.
- Cut the white space: tighter section padding, image columns that stretch to fill their sections, and new sections added.
- Made the footer wordmark readable: a full-colour oak gradient.
- Added JM Lara-style features:
  - floating pill header with a scroll progress line
  - framed hero with corner brackets
  - service tabs with a large image panel
  - sticky image beside a numbered list (01/04)
  - process timeline with a sticky image card and progress bars
  - text that fills in as you scroll
  - project cards that fan out on scroll
  - a material sample board
  - images that reveal and move at a different speed on scroll
  - buttons that follow the cursor
  - smooth scrolling

The animations use GSAP 3.12.5 with ScrollTrigger (from cdnjs) and Lenis 1.1.13 (from jsDelivr). If those scripts don't load, the site still works, with simpler fade-in animations.

Shared styles are in `assets/css/style.css` and scripts are in `assets/js/main.js`. To preview the site, open `index.html` in a browser.

## Open items before client review or launch
- **Logo:** the header uses a typographic wordmark only as a stand-in. The final logo is still pending from Anthony.
- **Photos:** all photos are free Unsplash stock, loaded from images.unsplash.com. The Drive "Before Photos" folder holds only screenshots of the current Parfett site, so there were no project photos to use. Replace the stock photos with Rob's photos once he sends them.
- **Project pages:** project pages 1 and 2 use placeholder text. Confirm the Airstream details and that the client approves showing them.
- **Enquiry form:** the form works only in the browser and sends nothing yet. Connect it to Duda or the CRM.
- **Licence number:** the CSLB number isn't shown because the existing site screenshots give two different numbers. Confirm it, then add it to the footer.
- **Copy limits from the brief:** the copy avoids the following:
  - online sales or checkout, furniture lines and lockers
  - the "full kitchen every 3–4 weeks" output
  - laminate or Formica work
  - standard door manufacturing
  - the loft ladder, which is still in development
