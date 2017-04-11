import React, { Component } from 'react'
import { Map, TileLayer, WMSTileLayer } from 'react-leaflet';
import StationLayer from './StationLayer';


const leafletUrl = "https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2RlcGV1dGVyIiwiYSI6ImNqMWUyOXVubTAwMDQycXVzYnNrcGtmdnAifQ.7fCYPAnsWbjiR5RW4tyRKA"

export default class NYCTileLayer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      lat: 40.736255,
      lng: -73.9690297,
      zoom: 12,
      bluemarble: false,
    }
    //this.onClick = this.onClick.bind(this);
  }
  
  componentDidMount() {
    // code to run just after the component "mounts" / DOM elements are created
    // we could make an AJAX request for the GeoJSON data here if it wasn't stored locally
    //this.getData();
    // create the Leaflet map object
    //if (!this.state.map) this.init(this._mapNode);
    console.log("Tile layer mounted");
  }

  

  
  getData() {
    // could also be an AJAX request that results in setting state with the geojson data
    // for simplicity sake we are just importing the geojson data using webpack's json loader
    // this.setState({
    //   numEntrances: geojson.features.length,
    //   geojson
    // });

    console.log("update data");
  }

  

  render () {
    return (
      <Map
        center={[this.state.lat, this.state.lng]}
        zoom={this.state.zoom}
        onClick={this.onClick}>
        <TileLayer
          layers={this.state.bluemarble ? 'nasa:bluemarble' : 'ne:ne'}
          url={leafletUrl}
        />
        <StationLayer/>
      </Map>
    )
  }
}