import pandas as pd
from flask_restful import Resource

class GeoJSON(Resource):
	def get(self):
		print(clusters.head())
		return {'station1': 0}