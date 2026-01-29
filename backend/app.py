# from flask import Flask, render_template, request, jsonify
# from flask_cors import CORS
# from pymongo import MongoClient
# from datetime import datetime

# app = Flask(
#     __name__,
#     template_folder="../frontend",
#     static_folder="../css",
#     static_url_path="/css"
# )


# CORS(app)

# # ---------------- MongoDB ----------------
# client = MongoClient("mongodb://127.0.0.1:27017/")
# db = client["leadgen"]
# contacts = db.contacts

# # ---------------- ROUTES ----------------

# @app.route("/")
# def home():
#     return render_template("index.html")

# @app.route("/admin")
# def admin():
#     return render_template("admin.html")

# @app.route("/contact", methods=["POST"])
# def contact():
#     data = {
#         "name": request.json["name"],
#         "email": request.json["email"],
#         "mobile": request.json["mobile"],
#         "city": request.json["city"],
#         "created_at": datetime.utcnow()
#     }
#     contacts.insert_one(data)
#     return jsonify({"message": "Lead saved successfully"})

# @app.route("/contacts", methods=["GET"])
# def get_contacts():
#     data = list(contacts.find({}, {"_id": 0}))
#     return jsonify(data)

# # ---------------- RUN ----------------
# if __name__ == "__main__":
#     app.run(debug=True)




from flask import Flask, render_template

app = Flask(
    __name__,
    template_folder="frontend",
    static_folder="css",
    static_url_path="/css"
)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/admin")
def admin():
    return render_template("admin.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
