import React, { Component } from 'react';
import { Map, CircleMarker, Popup} from 'react-leaflet'
import Toggle from 'react-toggle'
import ModelExplainer from './ModelExplainer';


// const svgMarkerAttbs  = `<svg width="50px" height="60px"><g>
// <path stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="#000" fill-opacity="1" fill-rule="evenodd"  stroke="#f71e00" stroke-opacity="1"  d="M15,15a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0"></path>
// <path stroke="#459c00" stroke-opacity="1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-opacity="1" fill-rule="evenodd" d="M15,45a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0"></path>
// </g></svg>`


export default class Legend extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	     	stations : []
	    }

	    this.handleToggleChange = this.handleToggleChange.bind(this);
	   	this.handleStatChange = this.handleStatChange.bind(this);
	    this.showLegend = this.showLegend.bind(this);
	}

	handleToggleChange() {
		this.props.changeView();
		console.log("button toggled", this.props.view);
	}

	handleStatChange() {
		this.props.changeStat();
		console.log("button toggled", this.props.stat);
	}

	showLegend(){
		this.setState({showLegend: !this.state.showLegend});
	}
  
    render() {
        return (
        	<div className="overlay">
		        <div className="legend">
		        	<div className="toggleWrap">
				        <label>
					        <Toggle
							    defaultChecked={this.props.view == "Neighborhoods"}
							    icons={false}
							    onChange={this.handleToggleChange} />
						   	<span className="viewType"> {this.props.view}</span>

						</label>
					</div>
					<div className="toggleWrap">
				        <label>
					        <Toggle
							    defaultChecked={this.props.stats == "Predictions"}
							    icons={false}
							    onChange={this.handleStatChange} />
						   	<span className="viewType"> {this.props.stat}</span>

						</label>
					</div>
					<span onClick={this.showLegend}> Models &#10067;</span>
		        </div>
		        <div>
		        {this.state.showLegend ? <ModelExplainer closeLegend={this.showLegend} /> : null}
		        	
	       		 </div>
	       </div>
      )
    }
}
