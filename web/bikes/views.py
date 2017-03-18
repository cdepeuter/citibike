from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
#import folium
from web.settings import BASE_DIR
from django.shortcuts import render_to_response

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")



def map(request, city):
    #response = "You're looking at the map of question %s."
	#map = folium.Map(location=[38.910100, -77.044400])


	if city == "dc":
		template = loader.get_template('bikes/dc_test.html')
	elif city == "nyc":
		template = loader.get_template('bikes/nyc_test.html')
	
	return HttpResponse(template.render())

