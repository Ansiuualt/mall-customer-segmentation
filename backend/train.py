import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib
import os

# Create model directory if it doesn't exist
os.makedirs('model', exist_ok=True)

def train_and_save_model():
    print("Loading data...")
    # Go up one level to find the original csv
    df = pd.read_csv('../Mall_Customers.csv')
    
    print("Preprocessing data...")
    # typically segmentation is done on Annual Income and Spending Score, but let's use Age as well
    features = df[['Age', 'Annual Income (k$)', 'Spending Score (1-100)']]
    
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(features)
    
    print("Training K-Means model...")
    # For Mall Customers, k=5 or k=6 is usually optimal
    kmeans = KMeans(n_clusters=5, init='k-means++', random_state=42)
    clusters = kmeans.fit_predict(scaled_features)
    
    df['Cluster'] = clusters
    
    print("Saving model and scaler...")
    joblib.dump(kmeans, 'model/kmeans_model.pkl')
    joblib.dump(scaler, 'model/scaler.pkl')
    
    # Save the clustered dataset for the frontend visualization
    df.to_csv('model/clustered_data.csv', index=False)
    
    print("Model training complete.")

if __name__ == "__main__":
    train_and_save_model()
