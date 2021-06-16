import http
import uuid
import jwt
from datetime import datetime, timedelta
from flask import jsonify, request, make_response
from flask_cors import cross_origin
from functools import wraps
from server import app
from .models import User, Recipe

login_signup_kwargs = {
  "origins": "http://localhost:3000",
  "methods": ["GET", "POST"],
}

# decorator for verifying JWT
def token_required(wrapped_func):
  @wraps(wrapped_func)
  def decorated(*args, **kwargs):
    token = None
    print(request.headers, 'headers')
    if "Authorization" not in request.headers:
      print('Authorization not in headers')
      return make_response("Authorization credentials not provided", 401)
    
    token = request.headers["Authorization"]
    print(token, 'token')
    payload = jwt.decode(token, app.config["SECRET_KEY"], algorithms="HS256")
    current_user = User.objects(user_id=payload["user_id"]).first()
    
    if not current_user:
      return make_response("Something wrong happened, please login again ", 403)

    return wrapped_func(current_user, *args, **kwargs)
  return decorated

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

    resp = make_response("Login successful", 200)
    resp.set_cookie("jwt", token, httponly=True, secure=True)
    resp.set_cookie("see", token,)
    return resp
    # return make_response(jsonify({ "token": token }), 201)
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

  
@app.route('/api/recipes', methods=["GET"])
@cross_origin(**login_signup_kwargs)
def recipes():
  recipes = Recipe.objects.all()
  return make_response(jsonify(recipes), 200)


@app.route('/api/recipe', methods=["GET", "POST"])
@cross_origin(**login_signup_kwargs)
@token_required
def add_recipe(current_user):
  print("is this running")
  author = current_user.username
  name = request.json.get('name')
  time_taken = request.json.get('time_taken')
  ingredients = request.json.get('ingredients')
  new_recipe = Recipe(
    recipe_id=str(uuid.uuid4()),
    name=name,
    time_taken=time_taken,
    ingredients=ingredients,
    author=author,
  )
  new_recipe.save()
  print(jsonify(new_recipe), "new recipe")
  return make_response("Reciped added", 200)
