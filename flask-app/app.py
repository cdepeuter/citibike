from flask import Flask, jsonify, request, render_template
from flask_restful import Resource, Api
from flask_cache import Cache
import sys
import requests
import json
import pandas as pd
from colour import Color


app = Flask(__name__)

# set up api and caching
api = Api(app)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

with app.app_context():
	# set context for future api calls
	station_url = "https://gbfs.citibikenyc.com/gbfs/en/station_information.json"
	stations = requests.get(station_url)

	station_json = json.loads(stations.text)
	stations_array = station_json["data"]["stations"]

	stations = pd.DataFrame.from_records(stations_array)
	stations.drop(['region_id', 'rental_methods', "eightd_has_key_dispenser"], axis=1, inplace=True)

	# get color range for station status and bike angels
	red = Color("red")
	black = Color("black")
	colors = list(red.range_to(Color("green"),101))
	score_colors = list(black.range_to(Color("white"),5))


@app.route('/')
def index():
    return "hi this is the index"

@app.route("/map")
def map():
    city = request.args.get('city')

    if city == "dc":
        return render_template('dc_test.html')
    elif city == "nyc":
        return render_template('nyc_test.html')
    elif city == "reactnyc":
        return render_template('index-nyc.html')
    elif city == "leaflet":
        return render_template('leaflet.html')

    return "specify a city"

class Stations(Resource):
	@cache.cached(timeout=50)
	def get(self):
		# get current status and merge that with stations
		status_url = "https://gbfs.citibikenyc.com/gbfs/en/station_status.json"
		status_req = requests.get(status_url)

		status_json = json.loads(status_req.text)

		station_status_array = status_json["data"]["stations"]

		station_status = pd.DataFrame.from_records(station_status_array)
		station_status.drop(["eightd_has_available_keys", "last_reported", "is_installed", "is_renting", "is_returning"], axis=1, inplace=True)

		# add bike angels score
		bike_angels_url = "https://bikeangels-api.citibikenyc.com/bikeangels/v1/geojson_scores"
		angels_status_req = requests.get(bike_angels_url)

		angels_status_json = json.loads(angels_status_req.text)

		angels_station_array = angels_status_json["features"]

		angels_stations = [{"station_id" : str(stat["properties"]["id"]), "score": stat["properties"]["score"]}  for stat in angels_station_array]
		angels_stations_df = pd.DataFrame.from_records(angels_stations)



		station_status = station_status.merge(stations, on = 'station_id')
		station_status = station_status.merge(angels_stations_df, on = 'station_id',  how='left')
		
		station_status.score.fillna(0, inplace=True)

		# get color
		station_status["pct_available"] = 100 * station_status["num_bikes_available"] / station_status["capacity"]
		station_status.pct_available.fillna(0, inplace=True)
		station_status["pct_available"] = station_status["pct_available"].map(round)		
		

		station_status["status_color"] = station_status["pct_available"].map(lambda x: colors[int(x)].hex)
		station_status["score_color"] = station_status["score"].map(lambda x: score_colors[int(x)+2].hex)


		return station_status.to_dict(orient='records')



api.add_resource(Stations, '/stations')


if __name__ == "__main__":
    #app.run(debug=True) # for dev
    app.run(host='0.0.0.0') # for prod
