from pymongo import MongoClient
from datetime import datetime, timedelta
import random

# MongoDB connection
client = MongoClient("mongodb+srv://contactzcsco:Z3r0c0575k1ll%4066202@zcsproduction.zld0i.mongodb.net/?retryWrites=true&w=majority&appName=ZCSProduction")
db = client['NCCDatabase']  # Ensure this matches your database name
camp_collection = db['Camps']  # Ensure this matches your collection name

# Sample camp data
camp_data = [
    {"name": "Camp Alpha", "location": "Delhi", "date": datetime(2024, 5, 15), "status": "Scheduled", "color": "#007bff"},
    {"name": "Camp Bravo", "location": "Mumbai", "date": datetime(2024, 6, 10), "status": "Ongoing", "color": "#28a745"},
    {"name": "Camp Charlie", "location": "Chennai", "date": datetime(2024, 4, 18), "status": "Completed", "color": "#6c757d"},
    {"name": "Camp Delta", "location": "Kolkata", "date": datetime(2024, 7, 20), "status": "Scheduled", "color": "#007bff"},
    {"name": "Camp Echo", "location": "Bangalore", "date": datetime(2024, 3, 25), "status": "Completed", "color": "#6c757d"},
    {"name": "Camp Foxtrot", "location": "Hyderabad", "date": datetime(2024, 8, 5), "status": "Ongoing", "color": "#28a745"},
    {"name": "Camp Golf", "location": "Ahmedabad", "date": datetime(2024, 9, 12), "status": "Scheduled", "color": "#007bff"},
    {"name": "Camp Hotel", "location": "Pune", "date": datetime(2024, 2, 15), "status": "Completed", "color": "#6c757d"},
    {"name": "Camp India", "location": "Jaipur", "date": datetime(2024, 11, 20), "status": "Scheduled", "color": "#007bff"},
    {"name": "Camp Juliet", "location": "Chandigarh", "date": datetime(2024, 10, 18), "status": "Ongoing", "color": "#28a745"}
]

# Insert data into MongoDB
result = camp_collection.insert_many(camp_data)
print(f"Inserted {len(result.inserted_ids)} camp records.")
