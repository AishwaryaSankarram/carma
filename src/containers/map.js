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
			drawPolyline: false,
			car: this.props.car
		} ;
		this.handleClick = this.handleClick.bind(this);
		this.displayMaps = this.displayMaps.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

	}

	componentWillReceiveProps(nextProps) { 
		if(nextProps.car.carId !== this.state.car.carId){ //Reload the map on a different car
			if(typeof nextProps.car.isSaved !== 'undefined' && nextProps.car.isSaved){ //Old map props retrieved for saved cars
				let car = nextProps.car;
				this.setState({
					markers: car.markers,
					showMarker: car.showMarker,
					markerCount: car.markerCount,
					drawPolyline: car.drawPolyline,
					car: nextProps.car
				});
			}else{			//Rendering new map for unsaved car
				this.setState({
					markers: [],
					showMarker: false,
					markerCount: 0,
					drawPolyline: false,
					car: nextProps.car
				});
			}
		}
  	}

	handleSubmit(){
		console.log("Submit Clicked");
    	let h = this.child.method(); // do stuff
    	let selCar = this.props.car;
    	if(selCar != null){
    		selCar.poly =  this.createPoly(h);
    	}
    	selCar.poly[0].speed = selCar.speed;
	    var payload = selCar;
	    console.log(payload);
	    var apiBaseUrl = "http://192.168.1.17:8080/granular/";
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
	 	selCar['isSaved'] = true;
	 	selCar['drawPolyline']=this.state.drawPolyline;
	 	selCar['markerCount'] = this.state.markerCount;
		selCar['markers'] = this.state.markers;
	 	selCar['showMarker'] = this.state.showMarker;
	 	this.props.updateCar(selCar);
	}

	createPoly(poly){
		let p = [];
		for(let i=0; i< poly.length; i++) {
			p.push({lat: poly[i].lat(), lng: poly[i].lng()});
		}
		return p;
	}
	handleClick = (event) => {
		console.log("Captured click event------------>", event);
		if(this.state.markerCount < 2){
		let e = event;
		let point = {lat: parseFloat(e.latLng.lat()), lng: parseFloat(e.latLng.lng())};
		let existingMarkers = this.state.markers;
		existingMarkers.push(point);
		let drawPolyline = existingMarkers.length === 2;
		if(existingMarkers.length <= 2){
			this.setState({
				car: this.props.car,
				markerCount: this.state.markerCount + 1,
				markers: existingMarkers,
				drawPolyline: drawPolyline,
				showMarker: true
			});
		}
	}
	}

	displayMaps(){
		let p = (typeof(this.props.car.poly) !== 'undefined' && this.props.car.poly && this.props.car.poly.length > 0) ? this.props.car.poly : this.state.markers;
	 	return (
			<div className="gMap">
			<span>Routes for car {this.props.car.carId} </span>
			<div id="btn-submit-container">
				<button onClick={this.handleSubmit}> Submit </button>
			</div>
			<MyMapComponent onClick={this.handleClick} 
		showMarker={this.state.showMarker} 
		markerCount={this.state.markerCount} 
		markerPos={this.state.markers}
		drawPolyline={this.state.drawPolyline} poly={p}
		onRef={ref => (this.child = ref)}
		/>
		</div>
		);
	}

	


	render() {
		return this.displayMaps();
		}
}