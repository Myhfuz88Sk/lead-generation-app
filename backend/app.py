# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from flask_pymongo import PyMongo
# from bson import ObjectId
# from datetime import datetime
# import os

# app = Flask(__name__)
# CORS(app)

# # MongoDB Configuration
# app.config["MONGO_URI"] = os.environ.get("MONGO_URI", "mongodb://localhost:27017/realtrust")
# mongo = PyMongo(app)

# # Helper function to serialize MongoDB documents
# def serialize_doc(doc):
#     if doc:
#         doc['_id'] = str(doc['_id'])
#         return doc
#     return None

# # ========== HOME ROUTE ==========
# @app.route('/')
# def home():
#     return jsonify({
#         'message': 'Real Trust API is running!',
#         'version': '1.0.0',
#         'endpoints': {
#             'projects': '/api/projects',
#             'clients': '/api/clients',
#             'contacts': '/api/contacts',
#             'subscribers': '/api/subscribers'
#         }
#     })

# # ========== PROJECTS ROUTES ==========

# @app.route('/api/projects', methods=['GET'])
# def get_projects():
#     try:
#         projects = list(mongo.db.projects.find().sort('createdAt', -1))
#         return jsonify([serialize_doc(p) for p in projects])
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/projects', methods=['POST'])
# def create_project():
#     try:
#         data = request.get_json()
        
#         if not all(key in data for key in ['name', 'description', 'image']):
#             return jsonify({'error': 'All fields are required'}), 400
        
#         project = {
#             'name': data['name'],
#             'description': data['description'],
#             'image': data['image'],
#             'createdAt': datetime.utcnow()
#         }
        
#         result = mongo.db.projects.insert_one(project)
#         project['_id'] = str(result.inserted_id)
        
#         return jsonify({'message': 'Project created successfully', 'project': project}), 201
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/projects/<id>', methods=['DELETE'])
# def delete_project(id):
#     try:
#         result = mongo.db.projects.delete_one({'_id': ObjectId(id)})
        
#         if result.deleted_count == 0:
#             return jsonify({'error': 'Project not found'}), 404
        
#         return jsonify({'message': 'Project deleted successfully'})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# # ========== CLIENTS ROUTES ==========

# @app.route('/api/clients', methods=['GET'])
# def get_clients():
#     try:
#         clients = list(mongo.db.clients.find().sort('createdAt', -1))
#         return jsonify([serialize_doc(c) for c in clients])
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/clients', methods=['POST'])
# def create_client():
#     try:
#         data = request.get_json()
        
#         required_fields = ['name', 'designation', 'description', 'image']
#         if not all(key in data for key in required_fields):
#             return jsonify({'error': 'All fields are required'}), 400
        
#         client = {
#             'name': data['name'],
#             'designation': data['designation'],
#             'description': data['description'],
#             'image': data['image'],
#             'createdAt': datetime.utcnow()
#         }
        
#         result = mongo.db.clients.insert_one(client)
#         client['_id'] = str(result.inserted_id)
        
#         return jsonify({'message': 'Client created successfully', 'client': client}), 201
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/clients/<id>', methods=['DELETE'])
# def delete_client(id):
#     try:
#         result = mongo.db.clients.delete_one({'_id': ObjectId(id)})
        
#         if result.deleted_count == 0:
#             return jsonify({'error': 'Client not found'}), 404
        
#         return jsonify({'message': 'Client deleted successfully'})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# # ========== CONTACTS ROUTES ==========

# @app.route('/api/contacts', methods=['GET'])
# def get_contacts():
#     try:
#         contacts = list(mongo.db.contacts.find().sort('submittedAt', -1))
#         return jsonify([serialize_doc(c) for c in contacts])
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/contacts', methods=['POST'])
# def create_contact():
#     try:
#         data = request.get_json()
        
#         required_fields = ['fullName', 'email', 'mobile', 'city']
#         if not all(key in data for key in required_fields):
#             return jsonify({'error': 'All fields are required'}), 400
        
#         contact = {
#             'fullName': data['fullName'],
#             'email': data['email'],
#             'mobile': data['mobile'],
#             'city': data['city'],
#             'submittedAt': datetime.utcnow()
#         }
        
#         result = mongo.db.contacts.insert_one(contact)
#         contact['_id'] = str(result.inserted_id)
        
#         return jsonify({'message': 'Contact submitted successfully', 'contact': contact}), 201
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/contacts/<id>', methods=['DELETE'])
# def delete_contact(id):
#     try:
#         result = mongo.db.contacts.delete_one({'_id': ObjectId(id)})
        
#         if result.deleted_count == 0:
#             return jsonify({'error': 'Contact not found'}), 404
        
#         return jsonify({'message': 'Contact deleted successfully'})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# # ========== SUBSCRIBERS ROUTES ==========

# @app.route('/api/subscribers', methods=['GET'])
# def get_subscribers():
#     try:
#         subscribers = list(mongo.db.subscribers.find().sort('subscribedAt', -1))
#         return jsonify([serialize_doc(s) for s in subscribers])
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/subscribers', methods=['POST'])
# def create_subscriber():
#     try:
#         data = request.get_json()
        
#         if 'email' not in data:
#             return jsonify({'error': 'Email is required'}), 400
        
#         # Check if email already exists
#         existing = mongo.db.subscribers.find_one({'email': data['email']})
#         if existing:
#             return jsonify({'error': 'Email already subscribed'}), 409
        
#         subscriber = {
#             'email': data['email'],
#             'subscribedAt': datetime.utcnow()
#         }
        
#         result = mongo.db.subscribers.insert_one(subscriber)
#         subscriber['_id'] = str(result.inserted_id)
        
#         return jsonify({'message': 'Subscribed successfully', 'subscriber': subscriber}), 201
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/subscribers/<id>', methods=['DELETE'])
# def delete_subscriber(id):
#     try:
#         result = mongo.db.subscribers.delete_one({'_id': ObjectId(id)})
        
#         if result.deleted_count == 0:
#             return jsonify({'error': 'Subscriber not found'}), 404
        
#         return jsonify({'message': 'Subscriber deleted successfully'})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# # ========== STATS ROUTE ==========

# @app.route('/api/stats', methods=['GET'])
# def get_stats():
#     try:
#         stats = {
#             'projects': mongo.db.projects.count_documents({}),
#             'clients': mongo.db.clients.count_documents({}),
#             'contacts': mongo.db.contacts.count_documents({}),
#             'subscribers': mongo.db.subscribers.count_documents({})
#         }
#         return jsonify(stats)
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# # Error handlers
# @app.errorhandler(404)
# def not_found(e):
#     return jsonify({'error': 'Route not found'}), 404

# @app.errorhandler(500)
# def server_error(e):
#     return jsonify({'error': 'Internal server error'}), 500

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5000)









































from flask import Flask, render_template, url_for
import os

# Set paths relative to this script's location
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "frontend"),
    static_folder=os.path.join(BASE_DIR, "frontend")
)

@app.route("/")
def login():
    return render_template("login.html")

@app.route("/signup.html")
def signup():
    return render_template("signup.html")

@app.route("/index.html")
def index():
    return render_template("index.html")

@app.route("/admin.html")
def admin():
    return render_template("admin.html")

if __name__ == "__main__":
    app.run(debug=True, port=5000)

