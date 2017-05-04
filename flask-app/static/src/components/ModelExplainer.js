import React, { Component } from 'react';



class ModelExplainer extends React.Component {

	constructor(props) {
	    super(props);
	   
	}

    render() {
        
        return (

        <div className="explain">
        	<div onClick={this.props.closeLegend} className="close">&#10006;</div>
        	<div className="explain-content">
	            <h3 className="exp-header">Station Model</h3>
	            <div>Poisson Model</div>



	            <h3>Neighborhood Model</h3>
	            <div> Clustering!</div>
	        </div>
        </div>
      )
    }
}

export default ModelExplainer;