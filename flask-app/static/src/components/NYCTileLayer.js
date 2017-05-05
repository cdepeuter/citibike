import React, { Component } from 'react'
import { Map, TileLayer, GeoJson} from 'react-leaflet';
import StationLayer from './StationLayer';
import Legend from './Legend';
import ClusterLayer from './ClusterLayer';

// light bg
//const leafletUrl = "https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2RlcGV1dGVyIiwiYSI6ImNqMWUyOXVubTAwMDQycXVzYnNrcGtmdnAifQ.7fCYPAnsWbjiR5RW4tyRKA"

//dark bg
const leafletUrl = "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2RlcGV1dGVyIiwiYSI6ImNqMWUyOXVubTAwMDQycXVzYnNrcGtmdnAifQ.7fCYPAnsWbjiR5RW4tyRKA"


export default class NYCTileLayer extends Component {
  
  constructor(props) {
    super(props);
      this.state = {
        lat: 40.71,
        lng: -73.9890297,
        zoom: 12,
        bluemarble: false,
        view: 'Neighborhoods',
        stat: 'Status',
        geojson:undefined
      }
      this.handleViewChange = this.handleViewChange.bind(this);
      this.handleStatChange = this.handleStatChange.bind(this);

  }

  handleViewChange(){
    this.setState({
      view: this.state.view === 'Neighborhoods' ? 'Stations' : 'Neighborhoods'
    })
  }

  handleStatChange(){
    this.setState({
      stat: this.state.stat === 'Status' ? 'Predictions' : 'Status'
    })
  }
  
  componentDidMount() {
    this.getData();
      setInterval(
        () => { this.getData(); },
        120000 
    );
  }

  componentDidUpdate(){
    console.log("updated, view:", this.state);
  }  

  getData() {
    fetch("/clusters").then( (response) => {
        return response.json() })   
        .then( (json) => {
          console.log(json)
          if(!!json){
            this.setState({geojson: json});
          } 
        });
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
        <Legend stat={this.state.stat} view={this.state.view} changeView={this.handleViewChange} changeStat={this.handleStatChange} />
        { this.state.view === 'Stations' ? <StationLayer stat={this.state.stat} view={this.state.view} /> : !!this.state.geojson ? <ClusterLayer data={this.state.geojson} stat={this.state.stat} />  : null}
        
      </Map>
    )
  }
}