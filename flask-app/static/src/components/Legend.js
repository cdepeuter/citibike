import React, { Component } from 'react';
import ModelExplainer from './ModelExplainer';
import Toggle from 'react-bootstrap-toggle';
// const svgMarkerAttbs  = `<svg width="50px" height="60px"><g>
// <path stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="#000" fill-opacity="1" fill-rule="evenodd"  stroke="#f71e00" stroke-opacity="1"  d="M15,15a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0"></path>
// <path stroke="#459c00" stroke-opacity="1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-opacity="1" fill-rule="evenodd" d="M15,45a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0"></path>
// </g></svg>`


export default class Legend extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	     	radioOptions: ["Status", "Predictions"],
	     	toggleActive: false,
	     	stat: true
	    }

	    this.handleToggleChange = this.handleToggleChange.bind(this);
	   	this.handleStatChange = this.handleStatChange.bind(this);
	    this.showLegend = this.showLegend.bind(this);
	}

	handleToggleChange() {
		this.props.changeView();
		this.setState({ toggleActive: !this.state.toggleActive });
		console.log("button toggled", this.props.view);
	}

	handleStatChange() {
		this.props.changeStat();
		this.setState({ stat: !this.state.stat });
		console.log("button toggled", this.props.stat);
	}

	showLegend(){
		this.setState({showLegend: !this.state.showLegend});
	}
  
    render() {
        return (
        	<div className="overlay">
		        <div className="legend">
		        	<div className="togggleWrap">
						<div className="tog stattype">  
							<Toggle
							  onClick={this.handleStatChange}
							  on={<h2>Status</h2>}
							  off={<h2>Forecast</h2>}
							  size="lg"
							  offstyle="primary"
							  onstyle="default"
							  active={this.state.stat}
							/>
						</div>
			        	<div className="tog">      
						    <Toggle
					          onClick={this.handleToggleChange}
					          on={<h2>Stations</h2>}
					          off={<h2>Clusters</h2>}
					          size="lg"
					          offstyle="primary"
					          onstyle="default"
					          active={this.state.toggleActive}
					        />		
						</div>
					</div>
		        </div>   
	       </div>
      )
    }
}
