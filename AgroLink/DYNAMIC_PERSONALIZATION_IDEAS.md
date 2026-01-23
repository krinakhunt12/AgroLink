# Dynamic Personalization Strategy for AgroLink

To make features like **Weather** and **Video** responsive to a user's profile, we can implement a personalized data fetching and filtering layer within the application logic.

---

## 1. Core Profile Data Requirements
To enable personalization, the user profile (likely stored in a database like Supabase) should include:
- **Location**: `village`, `district`, or `taluka` (for Weather/Local News).
- **Interests**: `primary_crops` (e.g., Cotton, Wheat) or `farming_type` (Organic, Dairy).
- **User Role**: `Farmer` or `Buyer` (to show relevant tutorial videos).
- **Demographics**: `land_size` (in acres) and `farmer_category` (General/SC/ST/OBC) for subsidy eligibility.

---

## 2. Implementation Strategy

### A. Dynamic Weather Widget
Instead of showing weather for all cities, we should prioritize the user's home location.

**The Idea:**
1. Fetch the user's `district` from their profile context.
2. Compare the `district` with the available weather data.
3. **Primary Display**: Show the user's local weather first.
4. **Fallback**: If the specific location isn't available, show the nearest regional cluster.

```typescript
// Conceptual Logic in useHome hook
const userProfile = useUserProfile(); // Custom hook fetching profile
const personalizedWeather = useMemo(() => {
    if (!userProfile?.location) return MOCK_WEATHER;
    
    // Sort or Filter to put user's location at index 0
    return [...MOCK_WEATHER].sort((a, b) => 
        a.city === userProfile.location ? -1 : 1
    );
}, [userProfile]);
```

### B. Personalized Video Recommendations
Videos should help farmers grow what they are actually planting.

**The Idea:**
1. Tag each video with `category` keywords (e.g., "Smart Irrigation", "Cotton Farming").
2. Match these tags against the user's `primary_crops`.
3. **Logic**:
   - If User is a **Cotton Farmer**: Show Top 2 videos about Cotton.
   - If User is a **Buyer**: Show "How to verify quality" videos.
   - **New Users**: Show "How to get started" onboarding videos.

### C. Smart Government Schemes (Yojana)
Government schemes are often complex. We can simplify them by showing only what the user qualifies for.

**The Idea:**
1. **Category Matching**: Match schemes based on the user's `farmer_type` (Small/Marginal/Large) and `category` (General/SC/ST).
2. **Impact Score**: Tag schemes with "High Impact" based on the user's current crops (e.g., if they grow fruits, prioritize "Pradhan Mantri Krishi Sinchai Yojana" for drip irrigation).
3. **Deadlines**: Highlight schemes with upcoming application deadlines in the user's specific district.

**Example Logic:**
- **Scheme**: "Solar Pump Subsidy"
- **Condition**: User must have > 2 acres of land + Borewell.
- **Personalization**: If user profile shows 5 acres, show this scheme with a "You are Eligible!" badge.

---

## 3. Updated Architecutre (Hooks Pattern)

The `useHome` hook should be updated to depend on a `useAuth` or `useUser` hook:

```typescript
export const useHome = () => {
    const { user } = useAuth(); // Access global user state
    
    const personalizedVideos = useMemo(() => {
        if (!user) return MOCK_VIDEOS; // Default for guests
        
        return MOCK_VIDEOS.filter(video => 
            video.tags.includes(user.primaryCrop) || 
            video.targetRole === user.role
        );
    }, [user]);

    return {
        videos: personalizedVideos,
        // ... other data
    };
};
```

---

## 6. AI & Machine Learning Integration

Taking personalization to the next level involves moving from "Static Rules" to "Predictive Intelligence."

### A. Intelligent Recommendation Engine (Collaborative Filtering)
Instead of just matching tags, we can use ML to suggest content based on what "Farmers like you" are doing.
- **Concept**: If other farmers in your district with similar land size are watching videos about "Organic Fertilizer," the AI can proactively suggest that video even if it's not in your "Interests" yet.

### B. Computer Vision for "Visual Diagnostics"
Integrating AI directly into the **Video Gallery** and **Scheme** sections.
- **Feature**: A "Scan my Crop" button.
- **Action**: Farmer takes a photo of a leaf. The AI (e.g., Gemini or TensorFlow) identifies a pest. 
- **Personalized Result**: The app immediately shows a video on how to treat that pest and checks if there are any current government subsidies for the necessary pesticides or equipment.

### C. Predictive Market Price Analysis
Using ML models (e.g., LSTMs) to analyze historical `MARKET_RATES_TICKER` data.
- **Idea**: "Price Prediction" badge.
- **Action**: In the **Live Features** section, the AI shows a trend line. "Wheat prices are predicted to rise by 10% in the next 14 days. We suggest you wait before selling."

### D. Natural Language Chat for Yojanas (RAG)
Large Language Models (LLMs) like **Gemini** can be used to make government documents readable.
- **Idea**: "Ask anything about this Scheme."
- **Action**: Instead of reading a 20-page PDF, a farmer asks, "Do I need a passport to apply for this?" The AI scans the specific document and answers in simple Gujarati/English.

### E. Micro-Climate AI Weather
Using IoT and ML to provide "Hyper-Local" weather.
- **Action**: Analyze regional weather data + historical patterns to predict rain not just for the "District," but for the specific 5km radius of the farm.

## 5. Next Steps
1. **Schema Update**: Ensure your User table has `location` and `crop_interests`.
2. **Metadata Tagging**: Add tags to your static constants (`MOCK_VIDEOS`, `MOCK_NEWS`).
3. **API Integration**: Eventually replace `MOCK_WEATHER` with a call to a Weather API passing the user's coordinates.
