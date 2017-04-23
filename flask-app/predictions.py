import pandas as pd
from flask_restful import Resource

class Predictions(Resource):
	def get(self):
		return {'station1': 0}