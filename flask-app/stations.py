import pandas as pd
import requests
import json
import datetime
from flask_restful import Resource

def boundRoundPercentage(x):
		# for a percentage, make sure its >= 0, <= 100, an integer
		x = round(x)
		if x < 0:
			x = 0
		if x > 100:
			x = 100

		return x


class Stations(Resource):	
	@cache.cached(timeout=50)
	def get(self):
		# get current status and merge that with stations
		status_url = "https://gbfs.citibikenyc.com/gbfs/en/station_status.json"
		status_req = requests.get(status_url)
		status_json = json.loads(status_req.text)
		station_status_array = status_json["data"]["stations"]

		# put into data frame
		station_status = pd.DataFrame.from_records(station_status_array)
		station_status.drop(["eightd_has_available_keys", "last_reported", "is_installed", "is_renting", "is_returning"], axis=1, inplace=True)

		# add bike angels score, put into data frame
		bike_angels_url = "https://bikeangels-api.citibikenyc.com/bikeangels/v1/geojson_scores"
		angels_status_req = requests.get(bike_angels_url)
		angels_status_json = json.loads(angels_status_req.text)
		angels_station_array = angels_status_json["features"]
		angels_stations = [{"station_id" : str(stat["properties"]["id"]), "score": stat["properties"]["score"]}  for stat in angels_station_array]
		angels_stations_df = pd.DataFrame.from_records(angels_stations)
		
		# merge stations and scores
		station_status = station_status.merge(stations, on = 'station_id')
		station_status = station_status.merge(angels_stations_df, on = 'station_id',  how='left')
		station_status.score.fillna(0, inplace=True)

		# merge predictions
		today = datetime.datetime.today()
		thisHour = today.hour
		thisWeekday = today.weekday() < 6

		relevant_preds = preds[(preds["weekday"] == thisWeekday) & (preds["hour"] == thisHour)].copy()

		relevant_preds.drop(["weekday", "hour"], inplace=True, axis=1)
		station_status = station_status.merge(relevant_preds, on = 'station_id',  how='left')

		station_status["avg(out_count)"].fillna(0, inplace=True)
		station_status["avg(in_count)"].fillna(0, inplace=True)
		station_status["bike_delta"].fillna(0, inplace=True)

		station_status["future_stock"] = station_status["num_bikes_available"] + station_status["bike_delta"]

		station_status["future_pct_available"] = 100 * station_status["future_stock"] / station_status["capacity"]
		station_status["future_pct_available"].fillna(0, inplace=True)
		station_status["future_pct_available"] = station_status["future_pct_available"].map(boundRoundPercentage)	
		

		station_status["pct_available"] = 100 * station_status["num_bikes_available"] / station_status["capacity"]
		station_status.pct_available.fillna(0, inplace=True)
		station_status["pct_available"] = station_status["pct_available"].map(boundRoundPercentage)	


		# add cluster assignemnt
		station_status = station_status.merge(clusters, left_on="station_id", right_on="ID", how='left')
		station_status.cluster.fillna(0, inplace=True)
		station_status.ID.fillna(0, inplace=True)

		# get color for dashboard
		station_status["status_color"] = station_status["pct_available"].map(lambda x: colors[int(x)].hex)
		station_status["score_color"] = station_status["score"].map(lambda x: score_colors[int(x)+2].hex)
		station_status["prediction_color"] = station_status["future_pct_available"].map(lambda x: colors[int(x)].hex)
		station_status["cluster_color"] = station_status["cluster"].map(lambda x: cluster_colors[int(x)].hex)

		response_json = {"time" : datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "stations" : station_status.to_dict(orient='records')}

		return response_json
