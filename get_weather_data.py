import json
import requests
import os.path
from datetime import datetime
from datetime import timedelta
import time
import sys


def getWeatherData(date):
    file_name = "./weather/ny-{}.json".format(date)
    print("get weather for date", date)
    if os.path.isfile(file_name):
        print("file_exists", file_name)
        json_data=open(file_name).read()

    else:
        url_str = "http://api.wunderground.com/api/8569324e20ad844f/history_{}/q/40.72548,-73.9818847.json".format(date)
        print("getting from url", url_str)
        req = requests.get(url_str)
        json_data = req.text

        # save to file
        with open(file_name, 'w') as weather_file:
            weather_file.write(json_data)
            weather_file.close()

    return json_data

def getWeatherDateRange(start, end):

    start_date = datetime.strptime(start, "%Y%m%d")
    end_date = datetime.strptime(end, "%Y%m%d")
    range_size = end_date - start_date


    dates = [(start_date + timedelta(days=t)).strftime("%Y%m%d") for t in range(0, range_size.days)]

    return dates

def makeRequestsHandleLimiting(dates):
    wd = []
    for i in range(0, len(dates)):
        wd.append(getWeatherData(dates[i]))

        if i % 10 == 9:
            print("sleeping", i)
            time.sleep(60)

    return wd


if __name__ == "__main__":
	start_d = str(sys.argv[1])
	end_d = str(sys.argv[2])
	dates = getWeatherDateRange(start_d, end_d)
	d = makeRequestsHandleLimiting(dates)


