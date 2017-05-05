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
	            <h3 className="exp-header">Poisson!</h3>
	            Both models on diplay are <a href="https://en.wikipedia.org/wiki/Autoregressive_model">AR</a> models, with one model fit for incoming rate, and
	            one model for outgoing rate, both hourly, fit on data from this month last year.
	            The expected station stock is the expected level an hour from the current time.
	            
	            Some of the stations have been installed in the past year, have changed ID, or did not get much traffic at certain times,
	            so you may notice that there is no predicted change for a lot of stations outside of Manhattan. 
	            Getting predictions for these stations and improving our models are works in progress. 
	            For any info email <a href="mailto:conrad.depeuter@columbia.edu">Conrad</a> or <a href="mailto:rp2816@columbia.edu">Rohan</a>


	        </div>
        </div>
      )
    }
}

export default ModelExplainer;