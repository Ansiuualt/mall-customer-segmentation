from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI(title="Mall Customer Segmentation API")

# Setup CORS to allow frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and scaler
MODEL_PATH = "model/kmeans_model.pkl"
SCALER_PATH = "model/scaler.pkl"
DATA_PATH = "model/clustered_data.csv"

# Request model
class CustomerData(BaseModel):
    age: int
    annual_income: float
    spending_score: float

@app.get("/")
def read_root():
    return {"message": "Welcome to the Mall Customer Segmentation API"}

@app.get("/api/clusters")
def get_clusters():
    """Returns the pre-clustered dataset for visualization."""
    if not os.path.exists(DATA_PATH):
        raise HTTPException(status_code=404, detail="Clustered data not found. Please train the model first.")
    
    df = pd.read_csv(DATA_PATH)
    # Convert to list of dictionaries
    return df.to_dict(orient="records")

@app.post("/api/predict")
def predict_segment(customer: CustomerData):
    """Predicts the cluster for a new customer."""
    if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
         raise HTTPException(status_code=500, detail="Model or scaler not found. Please train the model first.")
    
    try:
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        
        # Create a dataframe for the input
        input_data = pd.DataFrame([{
            'Age': customer.age,
            'Annual Income (k$)': customer.annual_income,
            'Spending Score (1-100)': customer.spending_score
        }])
        
        # Scale the features
        scaled_input = scaler.transform(input_data)
        
        # Predict
        cluster = model.predict(scaled_input)[0]
        
        # You could also add descriptive labels based on analysis of the clusters
        segment_names = {
            0: "Standard (Average Income, Average Spending)",
            1: "Target (High Income, High Spending)",
            2: "Careful (High Income, Low Spending)",
            3: "Sensible (Low Income, Low Spending)",
            4: "Careless (Low Income, High Spending)"
        }
        
        segment_name = segment_names.get(int(cluster), f"Cluster {cluster}")
        
        return {
            "cluster": int(cluster),
            "segment_name": segment_name
        }
    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))
