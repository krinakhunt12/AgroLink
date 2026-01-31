
import pandas as pd
import numpy as np
from datetime import datetime

class FarmerProfitAnalyzer:
    """
    Intelligent Dashboard Module for Long-term Profit Analytics.
    Helps farmers identify high-margin crops and optimal selling windows.
    """

    def __init__(self, transactions_df, cost_basis=None):
        """
        Args:
            transactions_df (pd.DataFrame): Historical sales data
            cost_basis (dict): Estimated production cost per Quintal [Rs]
        """
        self.df = transactions_df
        # Default cost basis if not provided (Avg costs in Gujarat region)
        self.cost_basis = cost_basis or {
            'Onion': 800,
            'Potato': 500,
            'Tomato': 600,
            'Wheat': 1200,
            'Cotton': 4000
        }
        self._calculate_net_profit()

    def _calculate_net_profit(self):
        """Applies production cost mapping and calculates net profit."""
        self.df['Production_Cost_Total'] = self.df.apply(
            lambda x: self.cost_basis.get(x['Crop'], 1000) * x['Quantity_Quintals'], axis=1
        )
        self.df['Net_Profit'] = self.df['Total_Revenue'] - self.df['Production_Cost_Total']
        self.df['Profit_Margin_%'] = (self.df['Net_Profit'] / self.df['Total_Revenue']) * 100
        self.df['Date'] = pd.to_datetime(self.df['Date'])
        self.df['Month'] = self.df['Date'].dt.month
        self.df['MonthName'] = self.df['Date'].dt.strftime('%B')

    def generate_dashboard(self):
        """Generates a structured analytical summary."""
        
        # 1. Overall Performance
        total_profit = self.df['Net_Profit'].sum()
        avg_margin = self.df['Profit_Margin_%'].mean()
        
        # 2. Crop Performance
        crop_stats = self.df.groupby('Crop').agg({
            'Net_Profit': 'sum',
            'Profit_Margin_%': 'mean',
            'Quantity_Quintals': 'sum'
        }).sort_values('Net_Profit', ascending=False)
        
        most_profitable_crop = crop_stats.index[0]
        
        # 3. Seasonal Patterns (Best Month per Crop)
        best_months = {}
        for crop in self.df['Crop'].unique():
            crop_data = self.df[self.df['Crop'] == crop]
            best_month = crop_data.groupby('MonthName')['Price_Per_Quintal'].mean().idxmax()
            best_months[crop] = best_month

        # 4. Monthly Distribution
        monthly_trend = self.df.groupby(['Month', 'MonthName'])['Net_Profit'].sum().reset_index().sort_values('Month')

        return {
            "overall": {
                "total_net_profit": round(total_profit, 2),
                "avg_profit_margin": f"{round(avg_margin, 2)}%",
                "most_profitable_crop": most_profitable_crop
            },
            "crop_analytics": crop_stats.to_dict('index'),
            "optimal_selling_windows": best_months,
            "monthly_distribution": monthly_trend[['MonthName', 'Net_Profit']].to_dict('records')
        }

# --- DEMONSTRATION & DATA AGGREGATION ---

if __name__ == "__main__":
    # Mock Historical Data (1 Year of cycles)
    data = {
        'Date': [
            '2025-01-10', '2025-01-25', '2025-02-15', '2025-03-05', 
            '2025-05-10', '2025-06-12', '2025-08-20', '2025-10-15',
            '2025-11-20', '2025-12-05'
        ],
        'Crop': [
            'Onion', 'Onion', 'Potato', 'Onion', 
            'Tomato', 'Tomato', 'Wheat', 'Cotton',
            'Potato', 'Onion'
        ],
        'Quantity_Quintals': [50, 40, 100, 60, 30, 25, 80, 20, 120, 50],
        'Price_Per_Quintal': [1500, 1800, 1100, 1200, 1400, 900, 2400, 6500, 1300, 2200],
        'Total_Revenue': []
    }
    
    # Calculate revenue
    data['Total_Revenue'] = [q * p for q, p in zip(data['Quantity_Quintals'], data['Price_Per_Quintal'])]
    
    df = pd.DataFrame(data)
    analyzer = FarmerProfitAnalyzer(df)
    dashboard = analyzer.generate_dashboard()

    print("\n" + "="*65)
    print("      AGROLINK INTELLIGENT FARMER PROFIT DASHBOARD      ")
    print("="*65)
    print(f"TOTAL NET PROFIT     : Rs.{dashboard['overall']['total_net_profit']}")
    print(f"AVG MARGIN           : {dashboard['overall']['avg_profit_margin']}")
    print(f"MOST PROFITABLE CROP : {dashboard['overall']['most_profitable_crop']}")
    print("-" * 65)
    
    print("CROP-WISE ANALYTICS:")
    for crop, stats in dashboard['crop_analytics'].items():
        print(f" - {crop:<10}: Profit Rs.{stats['Net_Profit']:>8.2f} | Margin {stats['Profit_Margin_%']:>5.1f}%")

    print("-" * 65)
    print("OPTIMAL SELLING WINDOWS (Best Prices Found):")
    for crop, month in dashboard['optimal_selling_windows'].items():
        print(f" - {crop:<10}: {month}")

    print("-" * 65)
    print("MONTHLY PROFIT DISTRIBUTION:")
    for entry in dashboard['monthly_distribution']:
        print(f" - {entry['MonthName']:<10}: Rs.{entry['Net_Profit']:>10.2f}")
    
    print("="*65 + "\n")
