#!/usr/bin/env python
import requests
import datetime

def get_status():
	req_text = "REQUEST FAILED"

	cur_date_time = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
	file_name = "/home/conrad/z/citibike/system_status/nyc_" + cur_date_time + ".json"

	site_url = "http://default-environment.aqivb4fk93.us-east-1.elasticbeanstalk.com/"
	local_url = "http://0.0.0.0:5000/"
	path = "stations"

	prod_request = requests.get(site_url + path)

	if prod_request.status_code == 200:
		req_text = prod_request.text
	else:
		# try local
		local_request = requests.get(site_url + path)
		if local_request.status_code == 200:
			req_text = local_request.text

	# save file
	with open(file_name, 'w') as status_file:
		status_file.write(req_text)
		status_file.close()

if __name__ == "__main__":
	get_status()