
import axios from "axios";
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from "../utils";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  
  // BrightData proxy configuration

  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port=22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  }

  try {
    //Fethcing the product page
    const response=await axios.get(url,options);
    const $ =cheerio.load(response.data);  //cheerio has a $ symbol as a variable name 

     // Extract the product title
     const title = $('#productTitle').text().trim();// here with the help of '$' i.e cheerio we are able to extract the info easily 
     const currentPrice = extractPrice(
        $('.priceToPay span.a-price-whole'),
        $('.a.size.base.a-color-price'),
        $('.a-button-selected .a-color-base'),
        $('.a-price.a-text-price.a-size-base'),
        $('.a-color-secondary.a-size-base')
      );

      const originalPrice = extractPrice(
        $('#priceblock_ourprice'),
        $('.a-price.a-text-price span.a-offscreen'),
        $('#listPrice'),
        $('#priceblock_dealprice'),
        $('.a-size-base.a-color-price')
      )

      const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

      const images = 
      $('#imgBlkFront').attr('data-a-dynamic-image') || 
      $('#landingImage').attr('data-a-dynamic-image') ||
      '{}'

      const imageUrls = Object.keys(JSON.parse(images));//this is made to make the urls readable

      const currency = extractCurrency($('.a-price-symbol'))

      // const discountRate = $('.a-color-price').text().replace(/[-%]/g, ""); 
    //   the discount rate is breaking so i wont add it
    
    const description = extractDescription($)

    //Construct data object with scraped information
    const data = {
        url,
        currency: currency || '₹',
        image: imageUrls[0],
        title,
        currentPrice: Number(currentPrice) || Number(originalPrice),
        originalPrice: Number(originalPrice) || Number(currentPrice),
        priceHistory: [],
        // discountRate: Number(discountRate),//doesnt work for all products which leads to giving an error 
        category: 'category',
        reviewsCount:100,
        stars: 4.5,
        isOutOfStock: outOfStock,
        description,
        lowestPrice: Number(currentPrice) || Number(originalPrice),
        highestPrice: Number(originalPrice) || Number(currentPrice),//check with other product prices
        averagePrice: Number(currentPrice) || Number(originalPrice),
    }

        return data;
     


  } catch (error:any) {
    throw new Error(`Failed to scrape product : ${error.message}`)
  }

}
