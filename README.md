# heck-lit Creative Portfolio

A modern artistic portfolio website for Kairo Voss, blending visual storytelling, music culture, and contemporary expression. The project showcases the artist’s paintings, creative identity, and contact form in a clean, immersive layout.

## Overview

This website is designed as a personal brand landing page for a multidisciplinary artist and rapper. It includes:

- a hero section with artist branding
- an About section
- a visual gallery of paintings
- category filters for artwork
- a lightbox preview for each piece
- a contact form for project inquiries
- Airtable-powered content loading for the artwork collection

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Netlify Functions
- Airtable API

## Project Structure

```text
.
├── index.html
├── style.css
├── script.js
├── README.md
├── .env.example
├── netlify.toml
├── netlify/
│   └── functions/
│       └── get-artwork.js
└── images/
```

## Features

### Artwork Gallery
The gallery dynamically loads artwork from Airtable through a secure Netlify serverless function. This keeps the Airtable token hidden from the browser and allows the site to display current content without hardcoding images or metadata directly in the frontend.

### Filter System
Users can filter the artwork by category, including abstract, portraits, street art, and contemporary work.

### Lightbox Preview
Each artwork opens in a larger detail view with title, year, medium, and description.

### Contact Form
The project inquiry form includes a submission interaction and shows visual confirmation when an inquiry is sent.

## Airtable Integration

This site uses Airtable as the content source for the artwork collection. The Airtable table is configured to store items such as:

- Title
- Description
- Release Date
- Medium
- Category
- Cover Art

The serverless function in `netlify/functions/get-artwork.js` fetches the Airtable records and returns them to the frontend as JSON.

## Environment Variables

Create a `.env` file locally or add these in the Netlify dashboard:

```bash
AIRTABLE_PAT=your_personal_access_token_here
AIRTABLE_BASE_ID=appgc0qthpwkgKRNW
AIRTABLE_TABLE_NAME=Content queue
```

## Local Development

1. Open the project folder.
2. Make sure you have a local web server running.
3. For a simple local preview, you can open `index.html` directly in a browser, or use a local dev server such as Live Server in VS Code.
4. For the Airtable function to work locally, run the project with Netlify CLI if needed.

## Deployment

This project is designed for Netlify deployment.

1. Push the project to GitHub.
2. Import the repository into Netlify.
3. Add the environment variables in the Netlify UI.
4. Deploy the site.

## Notes

- The website uses a secure API layer to protect the Airtable token.
- The frontend is static and lightweight, making it easy to host on Netlify or any static hosting service.
- Artwork content can be updated from Airtable without changing the site code.

## Author

Kairo Voss

## License

This project is for personal portfolio use and may be adapted for other artistic or creative brand projects.
