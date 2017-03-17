import pandas as pd
import json
import requests
import re




def get_dc_coordinates(data):
    # pretty sure this is only necessary for dc data right now so this is specific to that
    
    # get all stations
    unique_stations = set(list(data["start station name"].values) + list(data["end station name"].values))
    unique_stations = [s for s in unique_stations if type(s) is str]
    station_names = [re.split(r'\(\d+\)', s)[0].strip() for s in unique_stations]
    
    # get data
    live_json = "http://feeds.capitalbikeshare.com/stations/stations.json"
    json_feed = requests.get(live_json)
    station_data = json.loads(json_feed.text)

    station_coords = {}
    for station in station_data["stationBeanList"]:
        station_coords[station["stationName"]] = (station["latitude"], station["longitude"], station["id"] ,station["totalDocks"])

    
    # make df of original station names + latlong
    coords_array = []

    for s in station_names:
        if s in station_coords.keys():
            this_coords = station_coords[s]
            coords_array.append({"station": s, "lat": this_coords[0], "lon" : this_coords[1], "id" : this_coords[2], "docks": this_coords[3]})


    coords_df_ = pd.DataFrame(coords_array)
    
    return coords_df_


dc_to_ny_columns = {"Duration (ms)": "tripduration", "Start date" : "starttime", "End date" : "endtime", 
                "Start station number": "start station id", "Start station" : "start station name", 
                "End station number": "end station id", "End station": "end station name", "Bike number": "bikeid",
                "Member Type": "usertype"
               }

