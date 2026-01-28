# Agriculture Video Intelligence System (AVIS)
## College Project Documentation

### 1. Overview
The Agriculture Video Intelligence System (AVIS) is a backend module designed to provide farmers and agriculture students with high-quality, educational content without the clutter of entertainment or irrelevant YouTube videos. Unlike traditional systems that rely on expensive or restricted APIs (like YouTube Data API v3), this system utilizes public RSS feeds to ensure high availability and privacy.

### 2. Key Features
- **Zero-API Key Implementation**: Uses YouTube's public RSS feeds (`https://www.youtube.com/feeds/videos.xml?channel_id=...`).
- **Trusted Channel Sourcing**: Aggregates content from a pre-verified list of agriculture experts and institutions.
- **ML-Inspired Filtering**: Applies a keyword-based classification algorithm to identify "Useful" content.
- **Smart Categorization**: Automatically groups videos into Market Prices, Plant Protection, Weather, and Farming Techniques.
- **Rule-Based Noise Cancellation**: Filters out vlogs, entertainment, and clickbait content using exclusion patterns.

### 3. Folder Structure
```text
backend/
├── src/
│   ├── data/
│   │   └── agricultureChannels.js  # Verified YouTube Channel IDs
│   ├── services/
│   │   └── rssService.js           # RSS fetching & parsing logic
│   ├── ml/
│   │   └── videoClassifier.js      # Usefulness filtering & classification logic
│   ├── controllers/
│   │   └── videoController.js      # Request handling & business logic
│   ├── routes/
│   │   └── videoRoutes.js          # REST API Endpoints
│   └── server.js                   # Main application entry
```

### 4. Installation Instructions
1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install rss-parser
   ```

3. **Start the Server**:
   ```bash
   npm run dev
   ```

4. **Verify the API**:
   Open your browser or Postman and visit: `http://localhost:5000/api/agriculture-videos/latest`

### 5. Technical Implementation Details

#### RSS Parsing logic
We utilize the `rss-parser` library to fetch the XML feed from YouTube. The feed provides the latest 15 videos from any public channel. By merging results from multiple channels, we create a rich, real-time feed of agriculture content.

#### Usefulness Classification Algorithm
The filtering mechanism works on two levels:
1. **Inclusion Scoring**: Checks for keywords like `farming`, `pest control`, `mandi bhav`, `irrigation`, etc.
2. **Exclusion Filtering**: Detects words like `vlog`, `prank`, `entertainment` to immediately disqualify non-educational content.

### 6. API Endpoint Reference
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/agriculture-videos/latest` | Returns top 20 latest useful agriculture videos in JSON format. |

---
*Created for the AgroLink College Project.*
