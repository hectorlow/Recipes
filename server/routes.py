import uuid
import jwt
from datetime import datetime, timedelta
from flask import jsonify, request, make_response
from flask_cors import cross_origin
from functools import wraps
from server import app
from .models import User

login_signup_kwargs = {
  "origins": "http://localhost:3000",
  "methods": ["GET", "POST"],
}

@app.route('/api/login', methods=["GET", "POST"])
@cross_origin(**login_signup_kwargs)
def login():
  if request.method == "POST":
    username = request.json.get("username")
    password = request.json.get("password")
    user = User.objects(username=username).first()
    if not user.verify_password(password):
      return make_response("Cannot login with provided credentials", 403)

    token = jwt.encode({
      "user_id": user.user_id,
      "exp": datetime.utcnow() + timedelta(minutes=30)
    }, app.config["SECRET_KEY"], algorithm="HS256")

    return make_response(jsonify({ "token": token }), 201)
  return make_response("Something went wrong", 500)


@app.route('/api/signup', methods=["GET", "POST"])
@cross_origin(**login_signup_kwargs)
def signup():
  if request.method == "POST":
    username = request.json.get("username")
    email = request.json.get("email")
    password = request.json.get("password")
    if not username or not email or not password:
      return "One of the required fields is missing"

    users = User.objects(username=username).all()
    if users:
      return make_response("Username already in use", 409)
    
    # save new user
    new_user = User(
      user_id=str(uuid.uuid4()),
      username=username,
      email=email,
    )
    # set hashed password
    new_user.set_password(password)
    new_user.save()
  return make_response("Register successful", 201)

  
# once user is logged in, use token to verify his access
@app.route('/api/recipes')
def recipes():
  return "Recipes endpoint"


# decorator for verifying JWT
def token_required(wrapped_func):
  @wraps(wrapped_func)
  def decorated(*args, **kwargs):
    token = None
    if "Authorization" not in request.headers:
      return make_response("Authorization credentials not provided", 401)
    
    token = request.headers["Authorization"]
    payload = jwt.decode(token, app.config["SECRET_KEY"])
    active_user = User.objects(user_id=payload["user_id"]).first()
    
    if not active_user:
      return make_response("Something wrong happened, please login again ", 403)

    return wrapped_func(active_user, *args, **kwargs)
  return decorated