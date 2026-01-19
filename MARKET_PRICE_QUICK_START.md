# Market Price API - Quick Start Guide

## 🚀 Quick Setup

### 1. Backend Setup (Already Configured)

The Market Price API integration is already set up in your backend. Here's what was added:

✅ **Controller**: `backend/src/controllers/marketPrice.controller.js`  
✅ **Routes**: `backend/src/routes/marketPrice.routes.js`  
✅ **API Key**: Added to `backend/.env`  
✅ **Dependencies**: `axios` installed  
✅ **Server**: Routes registered in `server.js`

### 2. Environment Variable

Your `.env` file already contains:
```env
MARKET_PRICE_API_KEY=579b464db66ec23bdd000001ac8e7840678a434e6c77797f9230665b
```

### 3. Start the Backend

```bash
cd backend
npm run dev
```

The API will be available at: `http://localhost:5000/api/market-prices`

---

## 🧪 Test the API

### Quick Test with Browser

Open your browser and visit:
```
http://localhost:5000/api/market-prices?commodity=Wheat&limit=5
```

### Test with cURL

```bash
# Get market prices for Wheat
curl "http://localhost:5000/api/market-prices?commodity=Wheat&limit=5"

# Get all states
curl "http://localhost:5000/api/market-prices/states"

# Get commodity statistics
curl "http://localhost:5000/api/market-prices/stats/Wheat"
```

---

## 📱 Frontend Integration

### Step 1: Import the Service

The service is already created at `AgroLink/src/services/marketPriceService.ts`

```typescript
import { marketPriceService } from '../services/marketPriceService';
```

### Step 2: Use in Your Components

#### Example 1: Display Market Prices

```typescript
import React, { useEffect, useState } from 'react';
import { marketPriceService, MarketPriceRecord } from '../services/marketPriceService';

const MarketPrices: React.FC = () => {
  const [prices, setPrices] = useState<MarketPriceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await marketPriceService.getMarketPrices({
          commodity: 'Wheat',
          limit: 10
        });
        setPrices(response.data.records);
      } catch (error) {
        console.error('Failed to fetch prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  if (loading) return <div>Loading market prices...</div>;

  return (
    <div className="market-prices">
      <h2>Current Market Prices</h2>
      <div className="price-grid">
        {prices.map((price, index) => (
          <div key={index} className="price-card">
            <h3>{price.commodity}</h3>
            <p><strong>Market:</strong> {price.market}</p>
            <p><strong>District:</strong> {price.district}, {price.state}</p>
            <p><strong>Price:</strong> ₹{price.modal_price}/quintal</p>
            <p><strong>Range:</strong> ₹{price.min_price} - ₹{price.max_price}</p>
            <p><strong>Date:</strong> {price.arrival_date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketPrices;
```

#### Example 2: State/District/Market Selector

```typescript
import React, { useEffect, useState } from 'react';
import { marketPriceService } from '../services/marketPriceService';

const LocationSelector: React.FC = () => {
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [markets, setMarkets] = useState<string[]>([]);
  
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // Load states on mount
  useEffect(() => {
    marketPriceService.getStates().then(res => setStates(res.data));
  }, []);

  // Load districts when state changes
  useEffect(() => {
    if (selectedState) {
      marketPriceService.getDistrictsByState(selectedState)
        .then(res => setDistricts(res.data));
    }
  }, [selectedState]);

  // Load markets when district changes
  useEffect(() => {
    if (selectedState && selectedDistrict) {
      marketPriceService.getMarketsByDistrict(selectedState, selectedDistrict)
        .then(res => setMarkets(res.data));
    }
  }, [selectedState, selectedDistrict]);

  return (
    <div className="location-selector">
      <select onChange={(e) => setSelectedState(e.target.value)}>
        <option value="">Select State</option>
        {states.map(state => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>

      <select onChange={(e) => setSelectedDistrict(e.target.value)}>
        <option value="">Select District</option>
        {districts.map(district => (
          <option key={district} value={district}>{district}</option>
        ))}
      </select>

      <select>
        <option value="">Select Market</option>
        {markets.map(market => (
          <option key={market} value={market}>{market}</option>
        ))}
      </select>
    </div>
  );
};
```

#### Example 3: Commodity Statistics Dashboard

```typescript
import React, { useEffect, useState } from 'react';
import { marketPriceService, CommodityStats } from '../services/marketPriceService';

const CommodityDashboard: React.FC<{ commodity: string }> = ({ commodity }) => {
  const [stats, setStats] = useState<CommodityStats | null>(null);

  useEffect(() => {
    marketPriceService.getCommodityStats(commodity)
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, [commodity]);

  if (!stats) return <div>Loading statistics...</div>;

  return (
    <div className="commodity-dashboard">
      <h2>{stats.commodity} Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Average Price</h3>
          <p className="price">₹{stats.modalPrice.average}</p>
        </div>
        <div className="stat-card">
          <h3>Price Range</h3>
          <p>₹{stats.modalPrice.min} - ₹{stats.modalPrice.max}</p>
        </div>
        <div className="stat-card">
          <h3>Markets</h3>
          <p>{stats.markets} markets</p>
        </div>
        <div className="stat-card">
          <h3>Last Updated</h3>
          <p>{stats.lastUpdated}</p>
        </div>
      </div>
    </div>
  );
};
```

#### Example 4: Price Comparison

```typescript
import React, { useEffect, useState } from 'react';
import { marketPriceService, MarketComparison } from '../services/marketPriceService';

const PriceComparison: React.FC<{ commodity: string }> = ({ commodity }) => {
  const [comparison, setComparison] = useState<MarketComparison[]>([]);

  useEffect(() => {
    marketPriceService.comparePrices(commodity)
      .then(res => setComparison(res.data))
      .catch(err => console.error(err));
  }, [commodity]);

  return (
    <div className="price-comparison">
      <h2>Price Comparison - {commodity}</h2>
      <table>
        <thead>
          <tr>
            <th>Market</th>
            <th>District</th>
            <th>State</th>
            <th>Average Price</th>
            <th>Records</th>
          </tr>
        </thead>
        <tbody>
          {comparison.map((market, index) => (
            <tr key={index}>
              <td>{market.market}</td>
              <td>{market.district}</td>
              <td>{market.state}</td>
              <td>₹{market.averagePrice}</td>
              <td>{market.recordCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

## 🎯 Common Use Cases

### 1. Show Latest Prices on Homepage

```typescript
const latestPrices = await marketPriceService.getLatestPrices('Wheat', 5);
```

### 2. Filter by Location

```typescript
const prices = await marketPriceService.getPricesByLocation(
  'Madhya Pradesh',
  'Hoshangabad',
  'Pipariya APMC'
);
```

### 3. Search with Multiple Filters

```typescript
const results = await marketPriceService.searchPrices({
  state: 'Gujarat',
  commodity: 'Groundnut',
  minPrice: 6000,
  maxPrice: 7000,
  limit: 20
});
```

### 4. Get Commodity List for Dropdown

```typescript
const commodities = await marketPriceService.getCommodities();
// Use commodities.data for your dropdown options
```

---

## 📊 Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/market-prices` | GET | Get market prices with filters |
| `/api/market-prices/states` | GET | Get all states |
| `/api/market-prices/districts/:state` | GET | Get districts by state |
| `/api/market-prices/markets/:state/:district` | GET | Get markets by district |
| `/api/market-prices/commodities` | GET | Get all commodities |
| `/api/market-prices/stats/:commodity` | GET | Get commodity statistics |
| `/api/market-prices/compare/:commodity` | GET | Compare prices across markets |
| `/api/market-prices/search` | POST | Advanced search |

---

## 🎨 Sample UI Components to Build

1. **Market Price Dashboard** - Show current prices for multiple commodities
2. **Price Tracker** - Track price changes over time
3. **Location-based Prices** - Show prices for user's location
4. **Commodity Comparison** - Compare prices across different markets
5. **Price Alerts** - Notify users when prices change
6. **Market Finder** - Help users find nearest markets with best prices

---

## 💡 Tips & Best Practices

1. **Caching**: Cache states, districts, and commodities lists as they don't change frequently
2. **Error Handling**: Always wrap API calls in try-catch blocks
3. **Loading States**: Show loading indicators while fetching data
4. **Pagination**: Use limit and offset for large datasets
5. **User Experience**: Provide filters to help users find relevant prices quickly

---

## 🔍 Debugging

### Check if Backend is Running
```bash
curl http://localhost:5000/health
```

### Test Market Price Endpoint
```bash
curl http://localhost:5000/api/market-prices/states
```

### Check Backend Logs
Look for any errors in the terminal where you ran `npm run dev`

---

## 📚 Additional Resources

- **Full Documentation**: See `MARKET_PRICE_API_DOCUMENTATION.md`
- **API Source**: [data.gov.in](https://data.gov.in)
- **Backend Code**: `backend/src/controllers/marketPrice.controller.js`
- **Frontend Service**: `AgroLink/src/services/marketPriceService.ts`

---

## 🆘 Need Help?

If you encounter any issues:

1. Check that the backend is running on port 5000
2. Verify the API key in `.env` file
3. Check browser console for errors
4. Review backend terminal for error logs
5. Ensure axios is installed: `npm install axios`

---

**Happy Coding! 🚜🌾**
