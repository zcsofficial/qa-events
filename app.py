from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for local development

# MongoDB connection
client = MongoClient("mongodb+srv://contactzcsco:Z3r0c0575k1ll%4066202@zcsproduction.zld0i.mongodb.net/?retryWrites=true&w=majority&appName=ZCSProduction")
db = client['NCCDatabase']
camp_collection = db['Camps']

# API endpoint to fetch camp data
@app.route('/api/camps', methods=['GET'])
def get_camps():
    try:
        # Query to find all camps and sort by date in descending order
        camps = camp_collection.find({}, {'_id': 0}).sort("date", -1)
        camp_list = list(camps)
        return jsonify(camp_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API endpoint to add a new camp
@app.route('/api/camps', methods=['POST'])
def add_camp():
    try:
        camp_data = request.json
        camp_collection.insert_one(camp_data)
        return jsonify({"message": "Camp added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API endpoint to edit a camp
@app.route('/api/camps/<string:camp_name>', methods=['PUT'])
def edit_camp(camp_name):
    try:
        camp_data = request.json
        result = camp_collection.update_one({"name": camp_name}, {"$set": camp_data})

        if result.matched_count:
            return jsonify({"message": "Camp updated successfully!"}), 200
        else:
            return jsonify({"message": "Camp not found!"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API endpoint to delete a camp
@app.route('/api/camps/<string:camp_name>', methods=['DELETE'])
def delete_camp(camp_name):
    try:
        result = camp_collection.delete_one({"name": camp_name})

        if result.deleted_count:
            return jsonify({"message": "Camp deleted successfully!"}), 200
        else:
            return jsonify({"message": "Camp not found!"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
