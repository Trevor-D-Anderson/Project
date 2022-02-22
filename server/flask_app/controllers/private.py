from flask_app import app
from flask import render_template, redirect, session, request, flash, jsonify, make_response
from flask_app.models.users import User
from flask_app.models.profiles import Profile
from flask_cors import cross_origin
import json
# other Models
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt(app)

@app.route("/create_profile", methods=["POST", "OPTIONS"])
@cross_origin(origins="*", allow_headers="*")
def make_it():
    if request.method == "OPTIONS": # CORS preflight
        return _build_cors_preflight_response()
    data = request.get_json()
    print(data)
    keyedData = {
        'profileName': data["profileName"],
        'length': data["length"],
        'width': data["width"],
        'height': data["height"],
        'weight': data['weight'],
        'numberOfPcs': data["pcs"],
        'dimensionType': data["dimensionType"],
        'weightType': data["weightType"],
        'user_id': data["user_id"]
    }
    return jsonify(Profile.create_profile(keyedData))

@app.route("/update_profile", methods=["POST", "OPTIONS"])
@cross_origin(origins="*", allow_headers="*")
def update_it():
    if request.method == "OPTIONS": # CORS preflight
        return _build_cors_preflight_response()
    data = request.get_json()
    print(data)
    keyedData = {
        'profileName': data["profileName"],
        'length': data["length"],
        'width': data["width"],
        'height': data["height"],
        'weight': data['weight'],
        'numberOfPcs': data["pcs"],
        'dimensionType': data["dimensionType"],
        'weightType': data["weightType"],
        'id': data["id"]
    }
    return jsonify(Profile.update_profile(keyedData))

@app.route("/delete_profile", methods=["POST", "OPTIONS"])
@cross_origin(origins="*", allow_headers="*")
def delete_it():
    if request.method == "OPTIONS": # CORS preflight
        return _build_cors_preflight_response()
    data = request.get_json()
    print(data)
    keyedData = {
        'id': data["id"],
    }
    return jsonify(Profile.delete(keyedData))

@app.route("/private_calculator/<int:id>", methods=["GET","OPTIONS"])
@cross_origin()
def private(id):
    if request.method == "OPTIONS": # CORS preflight
        return _build_cors_preflight_response()
    print(f"id: {id}")
    keyId = {"id": id}
    dict = Profile.get_profiles(keyId)
    return json.dumps(dict, default=str)

@app.route("/dashboard")
def dashboard():
    if session.get('logged_in') == "none":
        return redirect("/")
    if not session.get('logged_in') == True:
        return redirect("/")
    id = {"id": session['user_id']}
    return render_template('dashboard.html')

@app.route("/logout")
def logout():
    session.clear()
    return redirect('/')

def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response