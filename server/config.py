import os

class Config(object):
  SECRET_KEY = os.environ.get('SECRET_KEY') or \
  b'\x94&\x7f\x9bwh\xbf\xbd\x00\x06\xa7\xf0.\xc3\t,'

  # its mongodb settings, not mongo settings
  MONGODB_SETTINGS = { "db": "RF_recipes" }