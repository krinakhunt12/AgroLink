# Agriculture Content Intelligence System (ACIS)
## College Project Documentation

### 1. Overview
The Agriculture Content Intelligence System (ACIS) is an advanced backend module designed to provide farmers and agriculture enthusiasts with verified, high-quality educational videos and news articles. The system operates entirely without the need for expensive API keys (like YouTube Data API or NewsAPI), ensuring it is cost-effective and easy to maintain for sustainable agriculture platforms.

### 2. Key Features
- **Zero-API Key Architecture**: Uses public RSS feeds for both YouTube videos and major agriculture news portals.
- **Trusted Source Aggregation**: Combined feed from verified YouTube channels (e.g., Krishi Jagran, Indian Farmer) and news portals (e.g., ICAR, Agri-Pulse).
- **ML-Inspired Intelligent Filtering**: a hybrid rule-based and keyword-frequency algorithm to identify "Useful" content.
- **Noise Cancellation**: Automatically filters out non-agriculture content like vlogs, pranks, and entertainment using negative keyword matching.
- **Smart Categorization**: Groups content into logical agriculture branches like Market Prices, Plant Protection, Weather, and Govt Schemes.

### 3. Folder Structure
The system follows a modular architecture for scalability and clean code separation:
```text
backend/
├── src/
│   ├── data/
│   │   ├── agricultureChannels.js    # Verified YouTube Channel IDs
│   │   ├── agricultureNewsSources.js # Verified News Portal RSS feeds
│   │   └── govtSchemeSources.js      # Official Govt RSS feeds
│   ├── services/
│   │   └── rssService.js             # Generic RSS fetching logic
│   ├── ml/
│   │   ├── videoClassifier.js        # Video/News filtering logic
│   │   └── schemeClassifier.js       # Specialized Scheme filtering logic
│   ├── controllers/
│   │   ├── videoController.js        # Video logic
│   │   ├── newsController.js         # News logic
│   │   └── schemeController.js       # Govt Schemes logic
│   ├── routes/
│   │   ├── videoRoutes.js            # Video API
│   │   ├── newsRoutes.js             # News API
│   │   └── schemeRoutes.js           # Govt Schemes API
│   └── server.js                     # Main application entry point
```

### 4. Technical Implementation Details

#### RSS Component
The system uses the `rss-parser` library. It connects directly to official XML feeds provided by agriculture institutions and government bodies.

#### Filtering & ML Logic
The system uses specialized classifiers for different content types:
1. **News/Video Classifier**: Focuses on crop management, market prices, and farming techniques.
2. **Scheme Classifier**: Tuned for keywords like `subsidy`, `MSP`, `insurance`, and `PM-Kisan` to identify farmer-welfare initiatives.

### 5. API Endpoint Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/agriculture-videos/latest` | Returns top 20 latest useful agriculture videos. |
| `GET` | `/api/agriculture-news/latest` | Returns latest verified agriculture news. |
| `GET` | `/api/agriculture-schemes/latest` | Returns latest official govt schemes and updates for farmers. |

### 6. Installation & Execution
1. **Navigate to the backend folder**: `cd backend`
2. **Install Dependencies**: `npm install rss-parser`
3. **Run in Development**: `npm run dev`
4. **Endpoint Test**: Visit `http://localhost:5000/api/agriculture-news/latest`

---
*Created for the AgroLink Agriculture Empowerment Platform.*
