
# 🛍️ PricePulse – Smart Product Price Tracker

**Track prices. Spot savings. Shop smarter.**

PricePulse is a web application that helps users track product prices from e-commerce websites, view product details, and monitor price history to make smarter shopping decisions.

## ✨ Features

- 🔗 **Product Tracking:** Add products using their URLs.
- 💰 **Price Monitoring:** View the latest extracted product prices.
- 📊 **Price History:** Visualize price changes with charts.
- 🖼️ **Product Details:** Display product names, images, and prices.
- 🔐 **User Authentication:** Secure sign-in and user-specific products.
- 🗂️ **Product Management:** Add and remove tracked products.
- 📱 **Responsive UI:** Simple interface for desktop and mobile screens.

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js Server Actions
- **Database:** Supabase
- **Authentication:** Supabase Auth
- **Web Scraping:** Firecrawl
- **Icons:** Lucide React
- **Deployment:** Vercel

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Bhawnacreative/Pricepulse.git
cd Pricepulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
FIRECRAWL_API_KEY=your_firecrawl_api_key
```

Replace the example values with your actual credentials. Keep private API keys secret and never commit `.env.local` to GitHub.

### 4. Configure Supabase

Create a Supabase project and configure the database tables, authentication, and Row Level Security (RLS) policies required by the application.

The project uses product and price-history data. Ensure the database table and column names match those used in the application code.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for production

```bash
npm run build
npm start
```

## 📁 Project Structure

```text
Pricepulse/
├── app/
│   ├── actions.js
│   ├── page.js
│   └── ...
├── components/
│   ├── AddProductForm.jsx
│   ├── ProductCard.jsx
│   └── ...
├── lib/
│   └── firecrawl.js
├── utils/
│   └── supabase/
├── public/
├── package.json
└── README.md
```

*Some filenames or extensions may differ depending on your current project structure.*

## 🔒 Security

- Store credentials in environment variables.
- Never expose Supabase secret or service-role keys in client-side code.
- Configure RLS policies to ensure users can access only their authorized data.
- Respect e-commerce websites' access policies and rate limits.

## ⚠️ Limitations

Product extraction depends on the target website's page structure and access restrictions. Some websites may block automated requests or limit access, so product details and prices may not always be available.

## 🔮 Future Enhancements

- Automatic price-drop notifications
- Target-price alerts
- Scheduled price checks
- Support for additional shopping websites
- Improved product extraction and error handling

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome. Feel free to open an issue or submit a pull request.

## 👩‍💻 Author

**Bhawna Kumari**

GitHub: [@Bhawnacreative](https://github.com/Bhawnacreative)

---

⭐ If you find PricePulse useful, consider giving the repository a star!
