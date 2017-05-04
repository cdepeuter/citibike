import pandas as pd
from flask_restful import Resource
from scipy.spatial import ConvexHull

# get convex hull for points
def get_hull(x):

    points = list(zip(x["lat"].values, x["lon"].values))
    thisHull = ConvexHull(points)
    coords = [[points[p][1],points[p][0]] for p in reversed(thisHull.vertices) ]
    print(x)
    # complete loop
    coords.append(coords[0])
    respData = {"type": "Feature", 'id': x['station_id'].values[0], "properties": {'name': x["name"].values[0]}, "geometry": {"type": "Polygon","coordinates": [coords]}}
    
    # dont want to return hull of not clustered points
    if thisHull.area > .2:
        respData["remove"] = True
    
    return respData



class GeoJSON(Resource):

	def __init__(self, stations):
		station_url = "https://gbfs.citibikenyc.com/gbfs/en/station_information.json"
		self.stations = requests.get(station_url)

		station_json = json.loads(self.stations.text)
		stations_array = station_json["data"]["stations"]

		self.stations = pd.DataFrame.from_records(stations_array)
		self.stations.drop(['region_id', 'rental_methods', "eightd_has_key_dispenser"], axis=1, inplace=True)


	def get(self):
		# merge clusers with statuions
		stations_clusters = self.stations.merge(clusters, left_on="station_id", right_on="ID", how='left')
		stations_clusters.fillna(0, inplace=True)

		hulls = stations_clusters.groupby('cluster').apply(get_hull)
		goodHulls = [h for h in hulls if not h.get("remove")]
		response = {"type": "FeatureCollection", "features": goodHulls}
		
		return response