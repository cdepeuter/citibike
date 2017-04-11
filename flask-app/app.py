from flask import Flask, jsonify, request, render_template
from flask_restful import Resource, Api
import sys
import requests
import json
import pandas as pd
from colour import Color


app = Flask(__name__)
api = Api(app)

# get stations
#TODO generalize this for cities
station_url = "https://gbfs.citibikenyc.com/gbfs/en/station_information.json"
stations = requests.get(station_url)

station_json = json.loads(stations.text)
stations_array = station_json["data"]["stations"]

stations = pd.DataFrame.from_records(stations_array)
stations.drop(['region_id', 'rental_methods', "eightd_has_key_dispenser"], axis=1, inplace=True)

# get color range
red = Color("red")
colors = list(red.range_to(Color("green"),101))

###########
### APP ###
###########
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



	def get(self):
		# get current status and merge that with stations
		status_url = "https://gbfs.citibikenyc.com/gbfs/en/station_status.json"
		status_req = requests.get(status_url)

		status_json = json.loads(status_req.text)

		station_status_array = status_json["data"]["stations"]

		station_status = pd.DataFrame.from_records(station_status_array)
		station_status.drop(["eightd_has_available_keys", "last_reported", "is_installed", "is_renting", "is_returning"], axis=1, inplace=True)

		

		station_status = pd.merge(station_status, stations, on = 'station_id')

		# get color
		station_status["pct_available"] = round(100 * station_status["num_bikes_available"] / station_status["capacity"])
		station_status["pct_available"].fillna(0, inplace=True)

		station_status["status_color"] = station_status["pct_available"].map(lambda x: colors[int(x)].hex)

		return station_status.to_dict(orient='records')



api.add_resource(Stations, '/stations')


if __name__ == "__main__":
    #app.run(debug=True) # for dev
    app.run() # for prod
