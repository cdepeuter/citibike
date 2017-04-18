import React, { Component } from 'react';
import { Map, CircleMarker, Popup} from 'react-leaflet'
import 'whatwg-fetch'; 

class StationLayer extends React.Component {

    constructor(props) {
	    super(props);
	    this.state = {
	     	stations : []
	    }
	    
	  }


	  componentDidMount() {
	  	//fetch data again?
	  	this.getData();
	  	console.log("station layer mounted");
	  	setInterval(
	      () => { this.getData(); },
	      120000 
	    );
	  }

	  componentDidUpdate(){
	  	console.log("updated");
	  	//console.log(this.state.stations);
	  }

	  getData() {
	  	console.log("Fetching station data");
	  	fetch("/stations")
	        .then( (response) => {
            return response.json() })   
                .then( (json) => {
                	//TODO check if valid json
                	if(!!json && json.stations){
                		this.setState({stations: json.stations});
                	}
                    
                });
	  }
     

    render() {
       console.log("Constructing station layer");
       let markers = this.state.stations.map((station) =>
	       	<CircleMarker center={[station.lat, station.lon]} color={station.status_color} fillColor={station.score_color} fillOpacity="1" radius={5}>
	          <Popup>
	            <span>{station.name}
	            <br/>
	           	Available: {station.num_bikes_available}
	           	<br/>
	           	Capacity: {station.capacity}
	           	<br/>
	           	Bike Angels Score: {station.score}
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

export default StationLayer;