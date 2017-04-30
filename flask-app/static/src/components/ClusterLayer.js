import React, { Component } from 'react';
import { Map, CircleMarker, Popup, GeoJSON} from 'react-leaflet'
import geojson from 'json!./clusters.geojson';
class ClusterLayer extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	     	//geodata: {features:[{"id": "119", "geometry": {"coordinates": [[[-73.9842844, 40.69221589], [-73.97790759801863, 40.68506807308177], [-73.96922273, 40.68415748], [-73.96751037, 40.69610226], [-73.97100056, 40.70531194], [-73.98656928, 40.7014851], [-73.9842844, 40.69221589]]], "type": "Polygon"}, "properties": {"name": "Park Ave & St Edwards St"}, "type": "Feature"}], type:"FeatureCollection"}
	    	geodata:geojson
	    }

      this.getStyle = this.getStyle.bind(this);

	  }


	// getClusters(){
	// 	fetch("/clusters").then( (response) => {
	// 		return response.json() })   
	// 		.then( (json) => {
	// 			console.log("got geo json", json)
	// 			this.setState({geodata: json});
	// 	});
 //  	}	

  	 getStyle(feature, layer) {
	      return {
	        color: '#006400',
	        weight: 5,
	        opacity: 0.65
	      }
	   }
    render() {
        console.log("doing things");

        return (
        	<GeoJSON data={this.state.geodata} />
      )
    }
}

export default ClusterLayer;