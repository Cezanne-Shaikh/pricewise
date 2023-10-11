"use client";
import { scrapeAndStoreProduct } from "@/lib/actions";
import React, { FormEvent, useState } from "react";

const isValidAmazonProductURL = (url: string) => {
  //this will check if we type the correct amazon link/url in the searchbar
  try {
    const parsedURL = new URL(url); //this is for the url that in entered the searchbar
    const hostname = parsedURL.hostname; //this is for the hostname i.e the name of the website (https://amazon.com) so it checks the hostname which in this case is amazon

    if (
      hostname.includes("amazon.com") ||
      hostname.includes("amazon.") ||
      hostname.endsWith("amazon")
    ) {
      return true; //if any of  the above 3 conditions are true then its a valid url
    }
  } catch (error) {
    return false;
  }
  return false;
};

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState(""); //this state is for the url that'll be entered in the searchbar
  const [isLoading, setIsLoading] = useState(false); // this state is a loader state which will display a loader when we submit in the searchbar

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(searchPrompt);

    if (!isValidLink) return alert("Please provide a valid Amazon link");

    try {
      setIsLoading(true);

      // Scrape the product page
      const product=await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        type="text"
        placeholder="Enter Product Link"
        className="searchbar-input"
      />

      <button
        type="submit"
        className="searchbar-btn"
        // disabled is added because the button should be disabled when the searchbar is empty
        disabled={searchPrompt === ""}
      >
        {isLoading ? "Searching....." : "Search"}
      </button>
    </form>
  );
};

export default Searchbar;
