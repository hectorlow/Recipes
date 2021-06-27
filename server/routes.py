import os
import uuid
import jwt
import base64
from datetime import datetime, timedelta
from flask import json, jsonify, request, make_response
from flask_cors import cross_origin
from functools import wraps
from werkzeug.utils import secure_filename

from mongoengine import base

from server import app
from .models import Favourite, User, Recipe, Ingredient

env = os.environ.get('FLASK_ENV')
BACKEND_URL =  "http://localhost:5000" if env == 'development' else "http://35.153.79.20"
STATIC_DIR = "static/uploaded_images"
FRONTEND_URL = "http://localhost:3000" if env == 'development' else ["http://myrecipes.cf"]

get_and_post_with_credentials_kwargs = {
  "origins": FRONTEND_URL,
  "methods": ["GET", "POST"],
  "supports_credentials": True,
}

post_with_credentials_kwargs = {
    "origins": FRONTEND_URL,
  "methods": ["POST"],
  "supports_credentials": True,
}

recipe_kwargs = {
  "origins": FRONTEND_URL,
  "methods": ["GET", "POST", "PATCH", "DELETE"],
  "supports_credentials": True,
}


# decorator for verifying JWT
def token_required(wrapped_func):
  @wraps(wrapped_func)
  def decorated(*args, **kwargs):
    token = None
    if not request.cookies.get("jwt"):
      return make_response("Token expired, login again to continue", 401)
    
    token = request.cookies.get("jwt")
    token_payload = jwt.decode(token, app.config["SECRET_KEY"], algorithms="HS256")
    current_user = User.objects(user_id=token_payload["user_id"]).first()
    
    if not current_user:
      return make_response("Username or password incorrect", 403)

    return wrapped_func(current_user, *args, **kwargs)
  return decorated

@app.route('/api/login', methods=["GET", "POST"])
@cross_origin(**get_and_post_with_credentials_kwargs)
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
      "exp": datetime.utcnow() + timedelta(minutes=120)
    }, app.config["SECRET_KEY"], algorithm="HS256")

    resp = make_response(jsonify({ "username": username }), 200)
    resp.set_cookie("jwt", value=token, max_age=60*60*2, httponly=True)
    return resp
  return make_response("Something went wrong!", 500)


@app.route('/api/signup', methods=["GET", "POST"])
@cross_origin(origins=FRONTEND_URL, methods=["GET", "POST"])
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
@cross_origin(origin=FRONTEND_URL, methods=["GET"], supports_credentials=True)
def recipes():
  # i need to return an aggregation of recipes and if the recipe is favourited
  # by the current user
  if request.cookies.get('jwt'):
    token = request.cookies.get('jwt')
    token_payload = jwt.decode(token, app.config["SECRET_KEY"], algorithms="HS256")
    current_user = User.objects(user_id=token_payload["user_id"]).first()

    if not current_user:
      return make_response("Invalid token", 403)
    
    recipes = list(Recipe.objects().aggregate(*[
        {
            '$lookup': {
                'from': 'user', 
                'localField': 'user_id', 
                'foreignField': 'user_id', 
                'as': 'author'
            }
        }, {
            '$addFields': {
                'author': {
                    '$first': '$author'
                }
            }
        }, {
            '$addFields': {
                'author': '$author.username'
            }
        }, {
            '$lookup': {
                'from': 'favourite', 
                'localField': 'recipe_id', 
                'foreignField': 'recipe_id', 
                'as': 'favourite'
            }
        }, {
            '$project': {
                'recipe_id': 1, 
                'name': 1, 
                'time_taken': 1, 
                'ingredients': 1, 
                'serving_size': 1, 
                'instructions': 1, 
                'author': 1, 
                'image': 1, 
                'favourite': {
                    '$reduce': {
                        'input': '$favourite', 
                        'initialValue': False, 
                        'in': {
                            '$or': [
                                '$$value', {
                                    '$eq': [
                                        '$$this.user_id', current_user.user_id
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        }, {
            '$project': {
                '_id': 0
            }
        }
    ]))

    return make_response(jsonify(recipes), 200)

  recipes = list(Recipe.objects().aggregate(*[
        {
            '$lookup': {
                'from': 'user', 
                'localField': 'user_id', 
                'foreignField': 'user_id', 
                'as': 'author'
            }
        }, {
            '$addFields': {
                'author': {
                    '$first': '$author'
                }
            }
        }, {
            '$addFields': {
                'author': '$author.username'
            }
        }, {
            '$project': {
                'recipe_id': 1, 
                'name': 1, 
                'time_taken': 1, 
                'ingredients': 1, 
                'serving_size': 1, 
                'instructions': 1, 
                'author': 1, 
                'image': 1, 
            }
        }, {
            '$project': {
                '_id': 0
            }
        }
    ]))
  return make_response(jsonify(recipes), 200)


@app.route('/api/recipe', methods=["GET", "POST", "PATCH", "DELETE"])
@cross_origin(**recipe_kwargs)
@token_required
def add_recipe(current_user):
  # print(request.json, 'request json')
  if request.method == "GET":
    return make_response("Get single recipe", 200)

  if request.method == "DELETE":
    recipe_id = request.json.get('recipe_id')
    recipe = Recipe.objects(recipe_id=recipe_id).first()
    recipe.delete()

    # cascading delete for favourites of recipe
    recipe_favourites = Favourite.objects(recipe_id=recipe_id)
    print(recipe_favourites, 'FAV')
    recipe_favourites.delete()
    return make_response("Recipe deleted", 202)
      
  name = request.json.get('name')
  time_taken = request.json.get('time_taken')
  ingredients = request.json.get('ingredients')
  serving_size = request.json.get('serving_size');
  instructions = request.json.get('instructions')

  if request.method == "POST":
    # user_recipes = Recipe(author=current_user.username)
    new_recipe = Recipe(
      recipe_id=str(uuid.uuid4()),
      name=name,
      time_taken=time_taken,
      ingredients=ingredients,
      serving_size=serving_size,
      instructions=instructions,
      user_id = current_user.user_id
    )
    new_recipe.save()
    return make_response(jsonify(new_recipe), 201)
  
  # get desired recipe using passed recipe_id
  recipe_id = request.json.get('recipe_id')
  recipe = Recipe.objects(recipe_id=recipe_id).first()
  print(recipe.ingredients, 'old ingredients')

  if request.method == "PATCH":
    if not recipe:
      return make_response("Recipe not found", 400)

    print(ingredients, 'sent ingrediets')

    ingredientsArray = []
    for item in ingredients:
      if item['quantity'] == '':
        item['quantity'] = 0
      ingredientsArray.append(
        Ingredient(id=item['id'], name=item['name'], quantity=item['quantity'], unit=item['unit'])
      )

    recipe.name = name
    recipe.time_taken = time_taken
    recipe.ingredients = ingredientsArray
    recipe.serving_size = serving_size
    recipe.instructions = instructions
    # recipe.image = ''
    recipe.save()
    return make_response(jsonify(recipe), 201)


@app.route('/api/upload-recipe-image', methods=["POST"])
@cross_origin(origin=FRONTEND_URL, methods=["POST"], supports_credentials=True)
@token_required
def upload_recipe_image(current_user):
  recipe_id = request.form.get('recipe_id')
  image = request.files.get('image')
  if not recipe_id:
    return make_response("Recipe_id not provided", 400)
  if not image:
    return make_response("No image sent", 400)

  existing_recipe = Recipe.objects(recipe_id=recipe_id).first()
  if not existing_recipe:
    return make_response("Invalid recipe_id passed", 400)
  
  # image path relative to current folder
  img_path = os.path.join(STATIC_DIR, recipe_id) + "-" + image.filename

  # make static/uploaded_images directory if does not exist
  if not os.path.exists('server/static'):
    os.mkdir('server/static')
  if not os.path.exists('server/static/uploaded_images'):
    os.mkdir('server/static/uploaded_images')
  
  img_upload_directory = './server/static/uploaded_images'
  for root, dirs, files in os.walk(img_upload_directory):
    for name in files:
      if recipe_id in name:
        os.remove(os.path.join(img_upload_directory, name))  

  # gunicorn runs on Recipes dir not server, so need to add server
  # infront of image path
  image.save(os.path.join('server', img_path))

  # image path to serve from frontend
  img_full_path = os.path.join(BACKEND_URL, img_path)
  existing_recipe.image = img_full_path
  existing_recipe.save()

  return make_response(jsonify(existing_recipe), 201)


@app.route('/api/favourites', methods=["GET", "POST"])
@cross_origin(**get_and_post_with_credentials_kwargs)
@token_required
def favourite(current_user):

  # return list of favourite recipes of current user
  if request.method == "GET":
    # aggregation returns list of favourite recipes with index "fav_index"
    favourites = list( User.objects().aggregate(*[
        {
            '$lookup': {
                'from': 'favourite', 
                'localField': 'user_id', 
                'foreignField': 'user_id', 
                'as': 'fav_pair'
            }
        }, {
            '$unwind': {
                'path': '$fav_pair', 
                'preserveNullAndEmptyArrays': False
            }
        }, {
            '$lookup': {
                'from': 'recipe', 
                'localField': 'fav_pair.recipe_id', 
                'foreignField': 'recipe_id', 
                'as': 'fav_recipe'
            }
        }, {
            '$unwind': {
                'path': '$fav_recipe', 
                'preserveNullAndEmptyArrays': False
            }
        }, {
            '$match': {
                'user_id': current_user.user_id
            }
        }, {
            '$project': {
                'recipe_id': '$fav_recipe.recipe_id', 
                'name': '$fav_recipe.name', 
                'time_taken': '$fav_recipe.time_taken', 
                'ingredients': '$fav_recipe.ingredients', 
                'serving_size': '$fav_recipe.serving_size', 
                'instructions': '$fav_recipe.instructions', 
                'author_id': '$fav_recipe.user_id', 
                'image': '$fav_recipe.image', 
                'favourite': {
                    '$eq': [
                        '5', '5'
                    ]
                }
            }
        }, {
            '$lookup': {
                'from': 'user', 
                'localField': 'author_id', 
                'foreignField': 'user_id', 
                'as': 'author'
            }
        }, {
            '$unwind': {
                'path': '$author', 
                'preserveNullAndEmptyArrays': False
            }
        }, {
            '$addFields': {
                'author': '$author.username'
            }
        }, {
            '$project': {
                '_id': 0, 
                'author_id': 0
            }
        }
    ]))
    return make_response(jsonify(favourites), 200)

  # add or remove favourite recipe for current user
  if request.method == "POST":
    recipe_id = request.json.get('recipe_id')
    user_id = current_user.user_id
    set_as_favourite = request.json.get('favourite')

    if set_as_favourite:
      if Favourite.objects(recipe_id=recipe_id, user_id=user_id).first():
        return make_response("Favourite already exist", 400)

      Favourite(recipe_id=recipe_id, user_id=user_id).save()
      return make_response("Favourite created", 201)
    
    # remove favourite
    favourite = Favourite.objects(recipe_id=recipe_id, user_id=user_id).first()
    favourite.delete()
    return make_response("Favourite removed", 201)


@app.route('/api/logout', methods=["POST"])
@cross_origin(origin=FRONTEND_URL, methods=["POST"], supports_credentials=True)
@token_required
def logout(current_user):
  resp = make_response("Logout successfully", 204)
  resp.set_cookie("jwt", 'expired', max_age=0)
  return resp


@app.route('/api/username-change', methods=["POST"])
@cross_origin(**post_with_credentials_kwargs)
@token_required
def change_username(current_user):
  new_username = request.json.get('username')
  check_existing_user = User.objects(username=new_username).first()
  if check_existing_user:
    return make_response("Username already taken. Try a different one!", 409)

  current_user.username = new_username
  current_user.save()
  return make_response("Username changed", 201)


@app.route('/api/password-change', methods=["POST"])
@cross_origin(**post_with_credentials_kwargs)
@token_required
def change_password(current_user):
  old_password = request.json.get('old_password')
  new_password = request.json.get('new_password')
  if not current_user.verify_password(old_password):
    return make_response("Incorrect password", 403)

  current_user.set_password(new_password)
  current_user.save()
  return make_response("Password changed", 201)


# apis for testing and development purposes
@app.route('/cookie', methods=["GET"])
@cross_origin(origon=FRONTEND_URL)
def cookie():
  resp = make_response("Setting cookie", 200)
  resp.set_cookie("server", value="server set cookie", max_age=60, domain=".app.localhost")
  return resp
