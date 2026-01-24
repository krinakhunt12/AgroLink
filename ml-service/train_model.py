import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
import os

# 1. Prepare Synthetic Dataset
# In a real project, replace this with a large CSV file of labeled YouTube data
data = {
    'text': [
        "How to grow wheat in winter season step by step",
        "Top 10 funny farm animals compilation 2024",
        "Modern drip irrigation system installation guide",
        "Kisan news: government increases MSP for cotton",
        "Best tractor features and price in India",
        "Cute puppy playing in the mud at farm",
        "Natural pesticide making process at home",
        "Minecraft farming tutorial Episode 1",
        "Weather update for farmers today",
        "How to make money fast using this farming hack (clickbait)",
        "Disease control in potato crops",
        "Vlog: A day in my life as a city guy",
        "Advanced organic farming techniques for beginners",
        "Pruning techniques for mango trees",
        "Song: Chill lo-fi beats for farmers",
        "Soil health testing and management tips"
    ],
    'label': [
        1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1
    ] # 1 = Useful (Practical), 0 = Not Useful (Vlog, Humor, Game, Clickbait)
}

df = pd.DataFrame(data)

# 2. Split Data
X_train, X_test, y_train, y_test = train_test_split(df['text'], df['label'], test_size=0.2, random_state=42)

# 3. Create Pipeline (TF-IDF + Logistic Regression)
model_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(stop_words='english', lowercase=True)),
    ('clf', LogisticRegression())
])

# 4. Train Model
print("Training model...")
model_pipeline.fit(X_train, y_train)

# 5. Evaluate (Optional)
score = model_pipeline.score(X_test, y_test)
print(f"Model Accuracy: {score * 100:.2f}%")

# 6. Save Model and Vectorizer
if not os.path.exists('models'):
    os.makedirs('models')

joblib.dump(model_pipeline, 'models/agri_classifier.pkl')
print("Model saved to models/agri_classifier.pkl")
