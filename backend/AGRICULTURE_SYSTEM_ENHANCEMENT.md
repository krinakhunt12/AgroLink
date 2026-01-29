# Agriculture Information System: Advanced Enhancement Documentation

This document provides a logical explanation and implementation guide for the enhanced features of the Agriculture Information System, designed for a college-level project.

## 1. Overview
The system aggregates agriculture-related videos, news, and government schemes from trusted RSS feeds. The enhancement introduces intelligence via ranking, filtering, and automated scheme detection.

## 2. Key Algorithms & Logic

### A. Usefulness Scoring Algorithm
The `calculateUsefulnessScore` function ranks content on a scale of 0-100 based on three primary factors:
1.  **Keyword Relevance (40%)**: Matches the title/description against a list of critical agriculture terms (e.g., 'farming', 'irrigation', 'MSP').
2.  **Source Priority (30%)**: Grants bonus points to content originating from verified government portals (Press Information Bureau, Ministry of Agriculture) and trusted news sources.
3.  **Recency Weight (30%)**: Prioritizes fresh information. Content posted within the last 24 hours receives the maximum weight.

### B. Smart Keyword Search
Unlike simple string matching, the search logic searches across:
-   **Crop names**: Wheat, Rice, Cotton, etc.
-   **Farming Activities**: Irrigation, Fertilization, Harvesting.
-   **Topic Tags**: Insurance, Markets, Subsidies.

### C. Automated Government Scheme Detection
The system uses a **Pattern Matching Algorithm** to detect specific schemes. It scans titles and descriptions for synonyms of major schemes like:
-   **PM-KISAN**: Detects keywords like "Samman Nidhi", "Installment".
-   **PMFBY**: Detects "Fasal Bima", "Crop Insurance".
-   **MSP**: Detects "Minimum Support Price", "Bhav".

## 3. Modular Architecture

The system follows a CLEAN architecture for scalability:

-   **`rssService.js`**: Low-level RSS fetching and parsing logic.
-   **`agricultureContentEnhancer.js`**: Business logic for scoring, searching, and filtering.
-   **`agricultureDashboardController.js`**: Aggregates data from multiple sources into a categorized dashboard structure.
-   **`agricultureDashboardRoutes.js`**: Exposes the RESTful API endpoints.

## 4. API Documentation

### Get Dashboard Data
**Endpoint**: `GET /api/agriculture/dashboard`

**Query Parameters**:
-   `search` (optional): Query string for searching content.
-   `dateFilter` (optional): 'Today', 'Last 7 Days', or 'Last 30 Days'.
-   `language` (optional): Set to 'gu' for Gujarati translation simulation.

**Response Structure**:
```json
{
  "success": true,
  "filtersApplied": { ... },
  "data": {
    "videos": [...],
    "news": [...],
    "schemes": [...],
    "topFeatured": [...]
  }
}
```

## 5. Frontend UI Features
The frontend dashboard (`AgricultureDashboard.tsx`) is built with React and TanStack Query, offering:
- **Unified Feed**: A combined view of all content types ranked by usefulness.
- **Categorized Tabs**: Quick access to Videos, News, or Schemes.
- **Trusted Badges**: Visual indicators (Verified) for government and trusted sources.
- **Scheme Tagging**: Automatic extraction and highlighting of scheme names as tags.
- **Smart Filtering**: On-demand search and date-based filtering.

## 6. Viva Preparation Tips
-   **Why RSS?**: It allows fetching real-time data without expensive API keys or complex authentication.
-   **Role of Scoring**: It helps farmers avoid "clickbait" or irrelevant content (Vlogs) by prioritizing high-quality educational material.
-   **Scalability**: New sources can be added simply by updating the data files (`agricultureChannels.js`, etc.) without changing code logic.

---

### **Related Documentation**
For details on performance optimization and user personalization, refer to:
[AGRICULTURE_SYSTEM_CACHE_COOKIE.md](./AGRICULTURE_SYSTEM_CACHE_COOKIE.md)
