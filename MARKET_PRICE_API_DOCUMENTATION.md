# Market Price API Integration Guide

## Overview

This document provides comprehensive information about the Market Price API integration in the AgroLink backend. The API fetches real-time commodity prices from various mandis (markets) across India using the Government of India's Open Data API.

## Data Source

- **API Provider**: Government of India - data.gov.in
- **API Resource**: https://www.data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi
- **API URL**: https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
- **Resource ID**: `9ef84268-d588-465a-a308-a864a43d0070`
- **Title**: Current Daily Price of Various Commodities from Various Markets (Mandi)
- **Organization**: Ministry of Agriculture and Farmers Welfare
- **Update Frequency**: Daily
- **Total Records**: 14,556+ (as of January 2026)

## API Configuration

### Environment Variables

Add the following to your `.env` file:

```env
# Market Price API (data.gov.in)
MARKET_PRICE_API_KEY=579b464db66ec23bdd000001ac8e7840678a434e6c77797f9230665b
```

### Base URL

```
https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
```

## Data Structure

### Fields Available

| Field Name | ID | Type | Description |
|------------|-----|------|-------------|
| State | `state` | keyword | State name |
| District | `district` | keyword | District name |
| Market | `market` | keyword | Market/Mandi name |
| Commodity | `commodity` | keyword | Commodity name (e.g., Wheat, Rice) |
| Variety | `variety` | keyword | Variety of the commodity |
| Grade | `grade` | keyword | Grade (e.g., FAQ, Grade A) |
| Arrival_Date | `arrival_date` | date | Date of price record (DD/MM/YYYY) |
| Min_Price | `min_price` | double | Minimum price in INR per quintal |
| Max_Price | `max_price` | double | Maximum price in INR per quintal |
| Modal_Price | `modal_price` | double | Modal/Average price in INR per quintal |

### Sample Response

```json
{
  "state": "Madhya Pradesh",
  "district": "Hoshangabad",
  "market": "Pipariya APMC",
  "commodity": "Wheat",
  "variety": "Wheat",
  "grade": "FAQ",
  "arrival_date": "19/01/2026",
  "min_price": 2230,
  "max_price": 2600,
  "modal_price": 2536
}
```

## API Endpoints

### 1. Get Market Prices

**Endpoint**: `GET /api/market-prices`

**Description**: Fetch market prices with optional filters

**Query Parameters**:
- `state` (optional): Filter by state name
- `district` (optional): Filter by district name
- `market` (optional): Filter by market name
- `commodity` (optional): Filter by commodity name
- `limit` (optional, default: 10): Number of records to return
- `offset` (optional, default: 0): Pagination offset
- `format` (optional, default: json): Response format

**Example Request**:
```bash
GET /api/market-prices?commodity=Wheat&state=Madhya Pradesh&limit=20
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "total": 14556,
    "count": 20,
    "limit": "20",
    "offset": "0",
    "records": [...]
  }
}
```

---

### 2. Get States

**Endpoint**: `GET /api/market-prices/states`

**Description**: Get a list of all unique states available in the market price data

**Example Request**:
```bash
GET /api/market-prices/states
```

**Example Response**:
```json
{
  "success": true,
  "count": 28,
  "data": [
    "Andhra Pradesh",
    "Gujarat",
    "Madhya Pradesh",
    "Maharashtra",
    "Uttar Pradesh",
    ...
  ]
}
```

---

### 3. Get Districts by State

**Endpoint**: `GET /api/market-prices/districts/:state`

**Description**: Get all districts for a specific state

**Path Parameters**:
- `state`: State name

**Example Request**:
```bash
GET /api/market-prices/districts/Madhya Pradesh
```

**Example Response**:
```json
{
  "success": true,
  "state": "Madhya Pradesh",
  "count": 15,
  "data": [
    "Bhopal",
    "Harda",
    "Hoshangabad",
    "Indore",
    ...
  ]
}
```

---

### 4. Get Markets by District

**Endpoint**: `GET /api/market-prices/markets/:state/:district`

**Description**: Get all markets for a specific district in a state

**Path Parameters**:
- `state`: State name
- `district`: District name

**Example Request**:
```bash
GET /api/market-prices/markets/Madhya Pradesh/Hoshangabad
```

**Example Response**:
```json
{
  "success": true,
  "state": "Madhya Pradesh",
  "district": "Hoshangabad",
  "count": 3,
  "data": [
    "Hoshangabad APMC",
    "Pipariya APMC",
    "Sohagpur APMC"
  ]
}
```

---

### 5. Get Commodities

**Endpoint**: `GET /api/market-prices/commodities`

**Description**: Get a list of all unique commodities

**Query Parameters**:
- `state` (optional): Filter commodities by state
- `district` (optional): Filter commodities by district

**Example Request**:
```bash
GET /api/market-prices/commodities?state=Gujarat
```

**Example Response**:
```json
{
  "success": true,
  "count": 45,
  "data": [
    "Arhar(Tur/Red Gram)(Whole)",
    "Bengal Gram(Gram)(Whole)",
    "Brinjal",
    "Carrot",
    "Corriander seed",
    "Groundnut",
    "Maize",
    "Mustard",
    "Wheat",
    ...
  ]
}
```

---

### 6. Get Commodity Statistics

**Endpoint**: `GET /api/market-prices/stats/:commodity`

**Description**: Get price statistics for a specific commodity

**Path Parameters**:
- `commodity`: Commodity name

**Query Parameters**:
- `state` (optional): Filter by state
- `district` (optional): Filter by district

**Example Request**:
```bash
GET /api/market-prices/stats/Wheat?state=Madhya Pradesh
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "commodity": "Wheat",
    "totalRecords": 45,
    "modalPrice": {
      "average": "2485.50",
      "min": 2230,
      "max": 2600
    },
    "priceRange": {
      "lowestMin": 2100,
      "highestMax": 2650
    },
    "markets": 12,
    "lastUpdated": "19/01/2026"
  }
}
```

---

### 7. Compare Prices Across Markets

**Endpoint**: `GET /api/market-prices/compare/:commodity`

**Description**: Compare prices for a commodity across different markets

**Path Parameters**:
- `commodity`: Commodity name

**Query Parameters**:
- `state` (optional): Filter by state

**Example Request**:
```bash
GET /api/market-prices/compare/Wheat?state=Madhya Pradesh
```

**Example Response**:
```json
{
  "success": true,
  "commodity": "Wheat",
  "totalMarkets": 8,
  "data": [
    {
      "state": "Madhya Pradesh",
      "district": "Hoshangabad",
      "market": "Pipariya APMC",
      "averagePrice": "2536.00",
      "recordCount": 3,
      "prices": [
        {
          "variety": "Wheat",
          "grade": "FAQ",
          "minPrice": 2230,
          "maxPrice": 2600,
          "modalPrice": 2536,
          "arrivalDate": "19/01/2026"
        }
      ]
    },
    ...
  ]
}
```

---

### 8. Advanced Search

**Endpoint**: `POST /api/market-prices/search`

**Description**: Search market prices with multiple filters and price range

**Request Body**:
```json
{
  "state": "Gujarat",
  "district": "Surendranagar",
  "market": "Dhragradhra APMC",
  "commodity": "Groundnut",
  "variety": "Other",
  "minPrice": 6000,
  "maxPrice": 7000,
  "limit": 50,
  "offset": 0
}
```

**Example Response**:
```json
{
  "success": true,
  "total": 14556,
  "count": 5,
  "limit": 50,
  "offset": 0,
  "data": [
    {
      "state": "Gujarat",
      "district": "Surendranagar",
      "market": "Dhragradhra APMC",
      "commodity": "Groundnut",
      "variety": "Other",
      "grade": "FAQ",
      "arrival_date": "19/01/2026",
      "min_price": 6250,
      "max_price": 6275,
      "modal_price": 6275
    }
  ]
}
```

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common HTTP Status Codes

- `200 OK`: Request successful
- `404 Not Found`: No data found for the specified parameters
- `500 Internal Server Error`: API request failed or server error

## Usage Examples

### Frontend Integration (React/TypeScript)

```typescript
// services/marketPriceService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/market-prices';

export const marketPriceService = {
  // Get all market prices
  getMarketPrices: async (filters?: {
    state?: string;
    district?: string;
    commodity?: string;
    limit?: number;
    offset?: number;
  }) => {
    const response = await axios.get(API_BASE_URL, { params: filters });
    return response.data;
  },

  // Get states
  getStates: async () => {
    const response = await axios.get(`${API_BASE_URL}/states`);
    return response.data;
  },

  // Get commodity statistics
  getCommodityStats: async (commodity: string, state?: string) => {
    const response = await axios.get(`${API_BASE_URL}/stats/${commodity}`, {
      params: { state }
    });
    return response.data;
  },

  // Compare prices
  comparePrices: async (commodity: string, state?: string) => {
    const response = await axios.get(`${API_BASE_URL}/compare/${commodity}`, {
      params: { state }
    });
    return response.data;
  },

  // Advanced search
  searchPrices: async (searchParams: any) => {
    const response = await axios.post(`${API_BASE_URL}/search`, searchParams);
    return response.data;
  }
};
```

### Example Component Usage

```typescript
import React, { useEffect, useState } from 'react';
import { marketPriceService } from '../services/marketPriceService';

const MarketPrices: React.FC = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await marketPriceService.getMarketPrices({
          commodity: 'Wheat',
          limit: 20
        });
        setPrices(data.data.records);
      } catch (error) {
        console.error('Failed to fetch prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Market Prices</h2>
      {prices.map((price, index) => (
        <div key={index}>
          <h3>{price.commodity}</h3>
          <p>Market: {price.market}</p>
          <p>Price: ₹{price.modal_price}/quintal</p>
        </div>
      ))}
    </div>
  );
};
```

## Best Practices

1. **Caching**: Implement caching for frequently accessed data (states, districts, commodities) to reduce API calls
2. **Pagination**: Always use pagination for large datasets
3. **Error Handling**: Implement proper error handling in your frontend
4. **Rate Limiting**: Be mindful of API rate limits
5. **Data Freshness**: The data is updated daily, so cache accordingly

## Testing the API

### Using cURL

```bash
# Get market prices
curl -X GET "http://localhost:5000/api/market-prices?commodity=Wheat&limit=5"

# Get states
curl -X GET "http://localhost:5000/api/market-prices/states"

# Get commodity stats
curl -X GET "http://localhost:5000/api/market-prices/stats/Wheat"

# Search with filters
curl -X POST "http://localhost:5000/api/market-prices/search" \
  -H "Content-Type: application/json" \
  -d '{
    "commodity": "Wheat",
    "state": "Madhya Pradesh",
    "minPrice": 2000,
    "maxPrice": 3000
  }'
```

### Using Postman

1. Import the endpoints into Postman
2. Set the base URL to `http://localhost:5000/api/market-prices`
3. Test each endpoint with different parameters
4. Save successful requests to a collection for future use

## Troubleshooting

### Common Issues

1. **API Key Error**
   - Ensure `MARKET_PRICE_API_KEY` is set in `.env`
   - Verify the API key is correct

2. **No Data Returned**
   - Check if filters are too restrictive
   - Verify the commodity/state/district names match exactly (case-sensitive)

3. **Timeout Errors**
   - The external API might be slow; consider increasing timeout
   - Implement retry logic for failed requests

## Future Enhancements

- [ ] Add caching layer (Redis) for frequently accessed data
- [ ] Implement WebSocket for real-time price updates
- [ ] Add price trend analysis endpoints
- [ ] Create price alerts/notifications system
- [ ] Add historical price data tracking
- [ ] Implement predictive price analytics using ML

## Support

For issues or questions regarding the Market Price API integration:
- Check the official data.gov.in documentation
- Review the error logs in the backend console
- Contact the development team

---

**Last Updated**: January 19, 2026  
**Version**: 1.0.0  
**Maintained By**: AgroLink Development Team
