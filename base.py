import pandas as pd
import numpy as np
import requests
import json


def merge_stations_and_coords(data, coords):
    # merge start station, rename cols
    data = pd.merge(data, coords, left_on = "start station name", right_on = "station")
    data.rename(columns={"lat":"start station latitude", "lon": "start station longitude", "docks": "start_docks"}, inplace=True)
    data.drop(["station"], axis=1, inplace=True)
    
    # merge end station, rename cols
    data = pd.merge(data, coords, left_on = "end station name", right_on = "station")
    data.rename(columns={"lat":"end station latitude", "lon": "end station longitude", "docks": "end_docks"}, inplace=True)
    data.drop(["station", "id_x", "id_y"], axis=1, inplace=True)
    
    return data



def get_elevations(data):
	# given a data frame with coordinates, get elevations for every station in that frame

    # get all stations, just the coordinates
    
    start_coords = data.loc[:, ["start station name", "start station latitude", "start station longitude"]].drop_duplicates()
    start_coords.rename(columns = {"start station name": "name", "start station latitude": "latitude", "start station longitude": "longitude"}, inplace=True)

    end_coords = data.loc[:, ["end station name", "end station latitude", "end station longitude"]].drop_duplicates()
    end_coords.rename(columns = {"end station name": "name", "end station latitude": "latitude", "end station longitude": "longitude"}, inplace=True)

    
    station_coords_ = pd.concat([start_coords, end_coords]).drop_duplicates()
    elevations = []
    # should be able to make 512 requests in one, but its only letting me do 250
    for i in range(0, station_coords_.shape[0], 250):
        
        loc_string = (station_coords_["latitude"][i:i+250].map(str) + "," + station_coords_["longitude"][i:i+250].map(str)).str.cat(sep="|")
        url_str = "https://maps.googleapis.com/maps/api/elevation/json?locations=" + loc_string +"&key=AIzaSyCkvgJiZL-cYebG_VUsZT8Af6mpL9SdC3w"
        
        # make request 
        elevation_req = requests.get(url_str)
        if elevation_req.status_code == 200:
            resp = json.loads(elevation_req.text)
            elevations += [r["elevation"] for r in resp["results"]]
        else:
            print("BAD REQUESTTTTT")
            
    elevations = np.array(elevations)
    
    station_coords_["elevation"] = elevations
    
    return station_coords_



def merge_elevations(data, elevations):
    # merge elevation data into trip data
    # return trip data
    
    data = pd.merge(data, elevations.loc[:, ["name", "elevation"]], left_on = "start station name", right_on = "name")
    data.rename(columns = {"elevation":"start elevation"}, inplace=True)
    data = pd.merge(data, elevations.loc[:, ["name", "elevation"]], left_on = "end station name", right_on = "name")
    data.rename(columns = {"elevation":"end elevation"}, inplace=True)
    
    #print(data.columns)
    data.drop(["name_x", "name_y"], axis=1, inplace=True)
    data.head()
    
    
    return data


