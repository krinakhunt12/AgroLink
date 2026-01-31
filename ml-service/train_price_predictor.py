
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import os

def clean_price(price):
    if isinstance(price, str):
        return float(price.replace(',', '').replace('"', ''))
    return float(price)

def train_model():
    # 1. Load Data
    csv_path = r"d:\Agro Link\Vegetables  price 01-01-26 to 25-01-26.csv"
    print(f"Loading data from {csv_path}...")
    
    # Skip the first line
    df = pd.read_csv(csv_path, skiprows=1)
    
    # 2. Basic Cleaning
    print("Cleaning and engineering new features...")
    df['Min Price'] = df['Min Price'].apply(clean_price)
    df['Max Price'] = df['Max Price'].apply(clean_price)
    df['Modal Price'] = df['Modal Price'].apply(clean_price)
    df['Arrival Quantity'] = df['Arrival Quantity'].apply(clean_price)
    
    # Date features
    df['Arrival Date'] = pd.to_datetime(df['Arrival Date'], format='%d-%m-%Y')
    df = df.sort_values(['Market', 'Commodity', 'Variety', 'Arrival Date'])
    
    # --- NEW FEATURES ---
    
    # A. Price Volatility (Range)
    df['Price Range'] = df['Max Price'] - df['Min Price']
    
    # B. Lag Features (Previous Price)
    # Group by Market/Commodity/Variety to get the previous price for the SAME item
    df['Prev_Day_Price'] = df.groupby(['Market', 'Commodity', 'Variety'])['Modal Price'].shift(1)
    
    # C. 3-Day Moving Average
    df['Rolling_Mean_3'] = df.groupby(['Market', 'Commodity', 'Variety'])['Modal Price'].transform(lambda x: x.rolling(window=3, min_periods=1).mean())
    
    # D. Arrival Momentum (Is supply increasing or decreasing?)
    df['Prev_Day_Arrival'] = df.groupby(['Market', 'Commodity', 'Variety'])['Arrival Quantity'].shift(1)
    
    # E. Weekend Flag
    df['Is_Weekend'] = df['Arrival Date'].dt.dayofweek.isin([5, 6]).astype(int)
    
    # F. Date Components
    df['Day'] = df['Arrival Date'].dt.day
    df['Month'] = df['Arrival Date'].dt.month
    df['DayOfWeek'] = df['Arrival Date'].dt.dayofweek
    
    # Drop rows where we don't have lag data (first day of each group)
    # Or just fill them with current price to keep data
    df['Prev_Day_Price'] = df['Prev_Day_Price'].fillna(df['Modal Price'])
    df['Prev_Day_Arrival'] = df['Prev_Day_Arrival'].fillna(df['Arrival Quantity'])
    df['Rolling_Mean_3'] = df['Rolling_Mean_3'].fillna(df['Modal Price'])
    
    # 3. Encoding
    cat_columns = ['State', 'District', 'Market', 'Commodity Group', 'Commodity', 'Variety', 'Grade']
    encoders = {}
    
    for col in cat_columns:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        encoders[col] = le
        
    # 4. Define Features for Prediction
    # We exclude current day's Min/Max Price as we won't know them in advance 
    # if we are predicting Modal Price for the future.
    features = cat_columns + [
        'Day', 'Month', 'DayOfWeek', 'Arrival Quantity', 
        'Price Range', 'Prev_Day_Price', 'Rolling_Mean_3', 
        'Prev_Day_Arrival', 'Is_Weekend'
    ]
    
    # Ensure no infinite values and fill all NaNs with 0 as a last resort
    df = df.replace([np.inf, -np.inf], np.nan)
    X = df[features].fillna(0)
    y = df['Modal Price'].fillna(0)
    
    print(f"Dataset size: {len(df)} rows")
    print(f"Features mapped: {features}")
    print(f"Total NaNs in X: {X.isna().sum().sum()}")
    
    # 5. Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 6. Train Model
    print(f"Training advanced Random Forest Regressor...")
    model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train, y_train)
    
    # 7. Evaluate and Print Accuracy
    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
    print("\n--- Model Accuracy Metrics ---")
    print(f"R2 Score (Confidence): {r2:.4f} ({r2*100:.2f}%)")
    print(f"Mean Absolute Error: {mae:.2f}")
    print(f"Root Mean Squared Error: {rmse:.2f}")
    print("------------------------------\n")
    
    # 8. Save
    if not os.path.exists('models'):
        os.makedirs('models')
        
    joblib.dump(model, 'models/price_regressor.pkl')
    joblib.dump(encoders, 'models/price_encoders.pkl')
    joblib.dump(features, 'models/price_features.pkl')
    
    print("Model and features saved successfully.")

if __name__ == "__main__":
    try:
        train_model()
    except Exception as e:
        import traceback
        print(f"An error occurred: {e}")
        traceback.print_exc()
