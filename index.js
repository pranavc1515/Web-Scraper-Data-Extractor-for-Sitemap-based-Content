const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { parseStringPromise } = require('xml2js');
const { Parser } = require('json2csv');  // For converting JSON to CSV

const sitemapUrls = [
  'https://www.avathi.com/static_pages/sitemap.xml',
  'https://www.avathi.com/activities/sitemap.xml',
  'https://www.avathi.com/experiences/sitemap.xml',
  'https://www.avathi.com/places/sitemap.xml'
  // Add other sitemap URLs here
];

const s3BaseUrl = 'https://avathioutdoors.gumlet.io/scrapped-data/';
const filePath = path.join(__dirname, 'scraped_data.csv');  // Set file path for CSV

// Prepare fields for CSV
const fields = [
  'url', 
  'title', 'metaDescription', 
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
  'textLengthWords', 
  'allWords', 'totalWords' // New columns: 'allWords' will store all the words, 'totalWords' will store their count
];
const json2csvParser = new Parser({ fields });

async function fetchSitemap(sitemapUrl) {
  const { data } = await axios.get(sitemapUrl);
  const parsedData = await parseStringPromise(data);
  return parsedData.urlset.url.map(u => u.loc[0]);
}

async function scrapePage(url) {
  // Construct the S3 URL by replacing part of the original URL and ensuring correct path formatting
  const s3Url = url
    .replace('https://www.avathi.com', s3BaseUrl) // replace base URL
    .replace(/\/$/, '') // remove trailing slash if it exists in the original URL
    + '/index.html'; // append index.html

  try {
    const { data } = await axios.get(s3Url);

    const $ = cheerio.load(data);

    // Extract the title
    const title = $('title').text();

    // Extract the meta description
    const metaDescription = $('meta[name="description"]').attr('content') || '';

    // Extract H1 to H6
    const h1 = $('h1').text();
    const h2 = $('h2').text();
    const h3 = $('h3').text();
    const h4 = $('h4').text();
    const h5 = $('h5').text();
    const h6 = $('h6').text();

    // Remove non-visible elements and unnecessary tags
    $('script, style, noscript, iframe, [style*="display:none"], [style*="visibility:hidden"]').remove();

    // Extract visible text from the page (excluding scripts, styles, and hidden elements)
    const visibleText = $('body').text().replace(/\s+/g, ' ').trim();

    // Split the visible text into words
    const allWords = visibleText.split(/\s+/).filter(word => word.length > 0); // An array of all visible words

    // Calculate the word count of the visible text
    const textLengthWords = allWords.length;

    // Return the structured data, including all the words in 'allWords' and the total word count in 'totalWords'
    return {
      url,
      title,
      metaDescription,
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      textLengthWords,
      allWords: allWords.join(' '), // Join all words into a single string to store in the CSV
      totalWords: textLengthWords    // Total word count
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return null; // Return null to handle errors gracefully
  }
}

async function processSitemaps() {
  let allUrls = [];
  
  // Fetch all URLs from all sitemaps
  for (let sitemap of sitemapUrls) {
    const urls = await fetchSitemap(sitemap);
    allUrls = [...allUrls, ...urls];
  }

  // Process each URL one by one and save the data incrementally
  for (let url of allUrls) {
    const pageData = await scrapePage(url);
    if (pageData) {
      // Convert the single page data to CSV format
      const csv = json2csvParser.parse([pageData]);

      // Check if the file exists; if it doesn't, create it with the header
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, csv);  // Write the CSV file with header
      } else {
        // Append the CSV data without the header
        fs.appendFileSync(filePath, '\n' + csv.split('\n').slice(1).join('\n'));
      }

      console.log(`Processed and saved: ${url}`);
    }
  }
}

processSitemaps().catch(console.error);
