import React, { Component } from 'react'
import { Map, TileLayer, WMSTileLayer } from 'react-leaflet'

export default class WMSTileLayerExample extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      lat: 40.771671,
      lng: -73.9743757,
      zoom: 11,
      bluemarble: false,
    }
    this.onClick = this.onClick.bind(this);
  }
  onClick ()  {
    this.setState({
      bluemarble: !this.state.bluemarble,
    })
  }

  render () {
    return (
      <Map
        center={[this.state.lat, this.state.lng]}
        zoom={this.state.zoom}
        onClick={this.onClick}>
        <TileLayer
          attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        <WMSTileLayer
          layers={this.state.bluemarble ? 'nasa:bluemarble' : 'ne:ne'}
          url='http://demo.opengeo.org/geoserver/ows?'
        />
      </Map>
    )
  }
}