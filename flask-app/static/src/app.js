import React from 'react';
import ReactDOM from 'react-dom';
import NYCMap from './components/NYCMap';
import LeafletMap from './components/LeafletMap';
import WMSTileLayerExample from './components/LeafletMap2'



//ReactDOM.render(<NYCMap  />, document.getElementById("map"));

//For leaflet example
ReactDOM.render(<WMSTileLayerExample  />, document.getElementById("container"));

