import React, { Component } from 'react'
import { Map, TileLayer, WMSTileLayer } from 'react-leaflet';
import StationLayer from './StationLayer';
import Legend from './Legend';
import { createStore } from 'redux'

// light bg
//const leafletUrl = "https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2RlcGV1dGVyIiwiYSI6ImNqMWUyOXVubTAwMDQycXVzYnNrcGtmdnAifQ.7fCYPAnsWbjiR5RW4tyRKA"

//dark bg
const leafletUrl = "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2RlcGV1dGVyIiwiYSI6ImNqMWUyOXVubTAwMDQycXVzYnNrcGtmdnAifQ.7fCYPAnsWbjiR5RW4tyRKA"

// get state, use for showing predictions vs bike angels
// window.store = createStore();
// store.subscribe(() =>{
//   console.log(store.getState());
// })  


export default class NYCTileLayer extends Component {
  
  constructor(props) {
    super(props);
      this.state = {
        lat: 40.736255,
        lng: -73.9690297,
        zoom: 12,
        bluemarble: false,
        view: 'Bike Angels'
      }
      this.handleViewChange = this.handleViewChange.bind(this);
  }

  handleViewChange(){
    this.setState({
      view: this.state.view === 'Bike Angels' ? 'Predictions' : 'Bike Angels'
    })
  }
  
  componentDidMount() {
    console.log("Tile layer mounted");
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
        <StationLayer view={this.state.view} />
        <Legend view={this.state.view} changeView={this.handleViewChange} />
      </Map>
    )
  }
}