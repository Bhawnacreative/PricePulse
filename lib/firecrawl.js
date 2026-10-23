
import FirecrawlApp from "@mendable/firecrawl-js";

const apiKey = process.env.FIRECRAWL_API_KEY;

export async function scrapeProduct(url) {
  if (!apiKey) {
    throw new Error("Missing FIRECRAWL_API_KEY environment variable.");
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("Please enter a valid product URL.");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  }

  try {
    const firecrawl = new FirecrawlApp({ apiKey });

    const result = await firecrawl.scrapeUrl(url, {
      formats: ["extract"],
      extract: {
        prompt:
          "Extract the exact product title, current selling price as a number, currency code, and main product image URL. Use only information present on the page. Do not guess missing values.",
        schema: {
          type: "object",
          properties: {
            productName: { type: "string" },
            currentPrice: { type: "number" },
            currencyCode: { type: "string" },
            productImageUrl: { type: "string" },
          },
          required: ["productName", "currentPrice"],
        },
      },
    });

    if (result?.success === false) {
      throw new Error(
        result.error || "Firecrawl could not access this product page."
      );
    }

    // Support the extraction response used by this SDK configuration.
    const extracted = result?.extract ?? result?.data?.extract;

    if (!extracted || !extracted.productName) {
      console.error("Firecrawl returned no usable product data:", {
        success: result?.success,
        keys: result ? Object.keys(result) : [],
      });

      throw new Error(
        "No product details were extracted. The store may be blocking access."
      );
    }

    const price = Number(extracted.currentPrice);

    if (!Number.isFinite(price) || price <= 0) {
      throw new Error("The extracted product price is missing or invalid.");
    }

    return {
      productName: extracted.productName,
      currentPrice: price,
      currencyCode: extracted.currencyCode || "INR",
      productImageUrl: extracted.productImageUrl || null,
    };
  } catch (error) {
    console.error("Firecrawl scrape error:", error.message);

    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}
