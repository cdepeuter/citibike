import React, { Component } from 'react';
import { Map, CircleMarker, Popup, GeoJSON} from 'react-leaflet'

// function onEachFeature (component, feature, layer) {
// console.log(arguments);
//   layer.on({
//     mouseover: highlightFeature,
//     mouseout: resetHighlight.bind(null, component),
//     click: zoomToFeature
//   });
// }

class ClusterLayer extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	geodata:props.data
	    }
		this.getStyle = this.getStyle.bind(this);
		console.log(this.props)
	  }
	
	
	getStyle(feature, layer) {
		console.log("get style", this.props.stat, this.props.stat === "Predictions")
		console.log(this.state)
		return {
			fillColor: this.props.stat === "Predictions" ? feature.properties.predcolor : feature.properties.statuscolor,
		    weight: 2,
		    opacity: 1,
		    color: 'white',
		    dashArray: '3',
		    fillOpacity: 0.7
		}
	}

    render() {
        return (
        	<GeoJSON data={this.state.geodata} 
        	 style={this.getStyle} 
        	  onEachFeature={(feature, layer) => layer.bindPopup('<div>Available: ' + feature.properties.available + '</br> Capacity:' + feature.properties.capacity +'</br> Expected: '  + feature.properties.expected +' </div>')}
             />
      )
    }
}

export default ClusterLayer;