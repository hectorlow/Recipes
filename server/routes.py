import http
import re
from sys import meta_path
import uuid
import jwt
from datetime import datetime, timedelta
from flask import jsonify, request, make_response
from flask_cors import cross_origin
from functools import wraps

from werkzeug.wrappers import response
from server import app
from .models import User, Recipe

login_signup_kwargs = {
  "origins": "http://localhost:3000",
  "methods": ["GET", "POST"],
}

recipe_kwargs = {
  "origins": "http://localhost:3000",
  "methods": ["GET", "POST", "PATCH", "DELETE"],
}


# decorator for verifying JWT
def token_required(wrapped_func):
  @wraps(wrapped_func)
  def decorated(*args, **kwargs):
    token = None
    if not request.cookies.get("jwt"):
      return make_response("Token expired or no token provided", 401)
    
    token = request.cookies.get("jwt")
    token_payload = jwt.decode(token, app.config["SECRET_KEY"], algorithms="HS256")
    current_user = User.objects(user_id=token_payload["user_id"]).first()
    
    if not current_user:
      return make_response("Username or password incorrect", 403)

    return wrapped_func(current_user, *args, **kwargs)
  return decorated

@app.route('/api/login', methods=["GET", "POST"])
@cross_origin(**login_signup_kwargs, supports_credentials=True)
def login():
  if request.method == "POST":
    username = request.json.get("username")
    password = request.json.get("password")
    user = User.objects(username=username).first()

    if not user:
      return make_response("No such username!", 403)
    if not user.verify_password(password):
      return make_response("Incorrect password!", 403)

    token = jwt.encode({
      "user_id": user.user_id,
      "exp": datetime.utcnow() + timedelta(minutes=30)
    }, app.config["SECRET_KEY"], algorithm="HS256")

    resp = make_response(jsonify({ "username": username }), 200)
    resp.set_cookie("jwt", value=token, max_age=60*30, httponly=True, secure=True)
    return resp
  return make_response("Something went wrong!", 500)


@app.route('/api/signup', methods=["GET", "POST"])
@cross_origin(**login_signup_kwargs)
def signup():
  if request.method == "POST":
    username = request.json.get("username")
    password = request.json.get("password")
    if not username:
      return make_response("Username is missing!", 401)
    if not password:
      return make_response("Password is missng!", 401)

    users = User.objects(username=username).all()
    if users:
      return make_response("Username already in use!", 409)
    
    # save new user
    new_user = User(
      user_id=str(uuid.uuid4()),
      username=username,
    )

    # set hashed password
    new_user.set_password(password)
    new_user.save()
  return make_response("Registered successfully!", 201)

  
@app.route('/api/recipes', methods=["GET"])
@cross_origin(**login_signup_kwargs)
def recipes():
  recipes = Recipe.objects.all()
  return make_response(jsonify(recipes), 200)


@app.route('/api/recipe', methods=["GET", "POST", "PATCH", "DELETE"])
@cross_origin(**recipe_kwargs, supports_credentials=True)
@token_required
def add_recipe(current_user):
  if request.method == "GET":
    return make_response("Get single recipe", 200)

  if request.method == "DELETE":
    recipe_id = request.json.get('recipe_id')
    recipe = Recipe.objects(recipe_id=recipe_id).first()
    recipe.delete()
    return make_response("Recipe deleted", 202)
      
  author = current_user.username
  name = request.json.get('name')
  time_taken = request.json.get('time_taken')
  ingredients = request.json.get('ingredients')
  instructions = request.json.get('instructions')

  if request.method == "POST":
    new_recipe = Recipe(
      recipe_id=str(uuid.uuid4()),
      name=name,
      time_taken=time_taken,
      ingredients=ingredients,
      instructions=instructions,
      author=author,
    )
    new_recipe.save()
    return make_response(jsonify(new_recipe), 201)
  
  # get desired recipe using passed recipe_id
  recipe_id = request.json.get('recipe_id')
  recipe = Recipe.objects(recipe_id=recipe_id).first()

  if request.method == "PATCH":
    if not recipe:
      return make_response("Recipe not found", 400)

    recipe.name = name
    recipe.time_taken = time_taken
    recipe.ingredient = ingredients
    recipe.instructions = instructions
    recipe.save()
    return make_response(f"{name} recipe updated", 204)


@app.route('/api/logout', methods=["POST"])
@cross_origin(**login_signup_kwargs, supports_credentials=True)
@token_required
def logout(current_user):
  print("logout endpoint")
  resp = make_response("Logout successfully", 204)
  resp.set_cookie("jwt", 'expired', max_age=0)
  return resp


# apis for testing and development purposes
@app.route('/cookie', methods=["GET"])
@cross_origin(**login_signup_kwargs)
def cookie():
  resp = make_response("Setting cookie", 200)
  resp.set_cookie("server", value="server set cookie", max_age=360, domain=".app.localhost")
  return resp