import React from 'react';
import ReactDOM from 'react-dom';
import NYCTileLayer from './components/NYCTileLayer'
 

 let accessToken = 'pk.eyJ1IjoiY2RlcGV1dGVyIiwiYSI6ImNqMWUyOXVubTAwMDQycXVzYnNrcGtmdnAifQ.7fCYPAnsWbjiR5RW4tyRKA';


//ReactDOM.render(<NYCMap  />, document.getElementById("map"));

//For leaflet example
ReactDOM.render(<NYCTileLayer  />, document.getElementById("container"));

