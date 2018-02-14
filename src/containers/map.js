import React from 'react';
import axios from 'axios';
import {MyMapComponent} from '../components/map';

export class MapContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			markers: [],
			showMarker: false,
			markerCount: 0,
			drawPolyline: false
		} ;
		this.handleClick = this.handleClick.bind(this);
		this.displayMaps = this.displayMaps.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

	}

	handleSubmit(){
		console.log("Submit Clicked");
    	let h = this.child.method(); // do stuff
    	let selCar = this.props.car;
    	if(selCar != null){
    		selCar.poly =  this.createPoly(h);
    	}
	    var payload = selCar;
	    console.log(payload);
	    var apiBaseUrl = "http://192.168.1.18:8080/granular/";
	     axios.post(apiBaseUrl+'getGranularPoints', payload).then(function (response) {
			 console.log(response);
			 if(response.status === 200){
			 	console.log("Rest Hit successful");
			 }
			 else{
			 	console.log("Oops...! Rest HIT failed with--------" + response.status);
			 }
			 }).catch(function (error) {
			 console.log("The error is------------", error);
	 	});
	}

	createPoly(poly){
		let p = [];
		for(let i=0; i< poly.length; i++) {
			p.push({lat: poly[i].lat(), lng: poly[i].lng()});
		}
		return p;
	}
	handleClick = (event) => {
		console.log("Captured event------------>", event);
		let e = event;
		let point = {lat: parseFloat(e.latLng.lat()), lng: parseFloat(e.latLng.lng())};
		let existingMarkers = this.state.markers;
		existingMarkers.push(point);
		let drawPolyline = existingMarkers.length === 2;
		if(existingMarkers.length <= 2){
			this.setState({
				markerCount: this.state.markerCount + 1,
				markers: existingMarkers,
				drawPolyline: drawPolyline,
				showMarker: true
			});
		}
	}

	displayMaps(){
		console.log("Rendering maps------------" + this.state.drawPolyline + '  ' + this.state.markerCount);
	 	return (
			<div className="gMap">
			<button onClick={this.handleSubmit}> Submit </button>
			<MyMapComponent onClick={this.handleClick} 
		showMarker={this.state.showMarker} 
		markerCount={this.state.markerCount} 
		markerPos={this.state.markers}
		drawPolyline={this.state.drawPolyline}
		onRef={ref => (this.child = ref)}
		/>
		</div>
		);
	}

	


	render() {
		return this.displayMaps();
		}
}