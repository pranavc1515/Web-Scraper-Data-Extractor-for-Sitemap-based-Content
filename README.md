# Web Scraper & Data Extractor for Sitemap-based Content

A Node.js application that scrapes web pages listed in a sitemap, extracts visible text, meta information, and heading tags (h1-h6) from each page, and stores this data in a CSV file. The project is designed to retrieve only the content that is visible to users in the UI (excluding scripts, styles, hidden elements, etc.), ensuring accurate word count and content extraction.

## Features

- **Sitemap Parsing**: Automatically reads and parses multiple sitemaps.
- **Content Extraction**: Extracts titles, meta descriptions, and heading tags (`h1-h6`).
- **Accurate Word Count**: Counts only the visible words in the UI, excluding scripts, styles, and hidden elements.
- **CSV Export**: Stores extracted data into a CSV file, including:
  - URL
  - Title
  - Meta description
  - Heading tags (h1-h6)
  - All visible words on the page
  - Total word count

## How It Works

The application reads one or more sitemaps provided by the user, visits each URL listed in the sitemap, and retrieves the corresponding HTML content. The HTML is processed to remove non-visible elements (e.g., scripts, styles, and hidden content). The title, meta description, and headings (`h1-h6`) are extracted, along with a word count of all visible text. The results are stored in a CSV file.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/pranavc1515/web-scraper-data-extractor.git
   ```

2. Navigate to the project directory:

   ```bash
   cd web-scraper-data-extractor
   ```

3. Install the necessary dependencies:

   ```bash
   npm install
   ```

## Usage

1. Update the `sitemapUrls` array in the `index.js` file to include the URLs of the sitemaps you want to process.

   Example:

   ```javascript
   const sitemapUrls = [
     "https://www.example.com/sitemap1.xml",
     "https://www.example.com/sitemap2.xml",
   ];
   ```

2. Run the scraper:

   ```bash
   node index.js
   ```

3. The extracted data will be saved in a CSV file named `scraped_data.csv` in the project directory.

## Project Structure

```
.
├── index.js             # Main script for scraping and extracting data
├── package.json         # Project metadata and dependencies
└── README.md            # Project documentation
```

## Dependencies

- [axios](https://www.npmjs.com/package/axios) - Used for making HTTP requests to fetch sitemaps and HTML content.
- [cheerio](https://www.npmjs.com/package/cheerio) - A fast, flexible, and lean implementation of jQuery to manipulate and traverse the scraped HTML.
- [json2csv](https://www.npmjs.com/package/json2csv) - Converts JSON data into CSV format.
- [xml2js](https://www.npmjs.com/package/xml2js) - A library to parse XML (used for parsing sitemaps).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Developed by [pranavc1515](https://github.com/pranavc1515)
#   W e b - S c r a p e r - D a t a - E x t r a c t o r - f o r - S i t e m a p - b a s e d - C o n t e n t  
 