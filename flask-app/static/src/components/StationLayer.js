import React, { Component } from 'react';
import { Map, CircleMarker, Popup, GeoJson} from 'react-leaflet'
import 'whatwg-fetch'; 

export default class StationLayer extends React.Component {

    constructor(props) {
	    super(props);
	    this.state = {
	     	stations : []
	    }
	  }

	  componentDidMount() {
	  	// grab data immediately, again every 2 mins
	  	this.getData();
		setInterval(
			() => { this.getData(); },
			120000 
		);
	  }

	  componentDidUpdate(){
	  	console.log("updated stations view:", this.props.stat === "Status", this.props);

	  }

	  getData() {
	  	fetch("/stations").then( (response) => {
        	return response.json() })   
				.then( (json) => {
					if(!!json && json.stations){
						this.setState({stations: json.stations});
					} 
				});
	  }

    render() {
       let markers = this.state.stations.map((station) =>
	       	<CircleMarker center={[station.lat, station.lon]} color={ this.props.stat == "Status" ? station.status_color : station.prediction_color} fillColor={ this.props.stat == "Status" ? station.status_color : station.prediction_color} fillOpacity="1" radius={5}>
	          <Popup>

	            <span>{station.name} - {station.station_id}
	            <br/>
	           	Available: {station.num_bikes_available}
	           	<br/>
	           	Capacity: {station.capacity}
	           	<br/>
	           	Predicted Stock: {station.future_stock}
	           	<br/>
	           	Cluster: {station.cluster}
	           	</span>
	          </Popup>
	        </CircleMarker> 
       );
        

        return (
        	<div>
        		{markers}
        	</div>
         
      )
    }
}
