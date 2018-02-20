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
			car: this.props.car, 
			poly: [], 
			routes: this.props.routes 
		} ;
		this.handleClick = this.handleClick.bind(this);
		this.displayMaps = this.displayMaps.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.getPolySourceDestination = this.getPolySourceDestination.bind(this);
		this.getPolyFromDirections = this.getPolyFromDirections.bind(this);
		this.directionsCallback = this.directionsCallback.bind(this);

	}

	componentWillReceiveProps(nextProps) { 
		if(nextProps.car.carId !== this.state.car.carId){ //Reload the map on a different car
			if(typeof nextProps.car.poly !== 'undefined' && nextProps.car.poly && nextProps.car.poly.length > 0){ //Old map props retrieved for saved cars
				let car = nextProps.car;
				this.setState({
					markers: car.markers,
					showMarker: car.showMarker,
					markerCount: car.markerCount,
					drawPolyline: car.drawPolyline,
					car: nextProps.car, 
					poly: nextProps.car.poly,
					routes: nextProps.routes
				});
			}else{			//Rendering new map for unsaved car
				this.setState({
					markers: [],
					showMarker: false,
					markerCount: 0,
					drawPolyline: false,
					car: nextProps.car,
					poly: [],
					routes: nextProps.routes
				});
			}
		}
  	}

  	getGranularPts(payload){
  		var apiBaseUrl = "http://192.168.1.18:8090/granular/";
	     axios.post(apiBaseUrl+'getGranularPoints', payload, {
	     auth: {
		    username: '5a8bcb8fbc66197777de2d90',
		    password: 'test' }
		  }).then(function (response) {
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

	handleSubmit(){
		console.log("Submit Clicked");
		let selCar = this.props.car;
		if(this.state.drawPolyline) {
	    	let h = this.child.method(); // Get path from PolyLine drawn
	    	if(selCar != null){
				selCar.poly =  this.createPoly(h);
			}
	    	selCar.poly[0].speed = selCar.speed;
			let payload = selCar;
			this.getGranularPts(payload);
			console.log(payload);
			selCar['isSaved'] = true;
		 	selCar['drawPolyline']=this.state.drawPolyline;
		 	selCar['markerCount'] = this.state.markerCount;
			selCar['markers'] = this.state.markers;
		 	selCar['showMarker'] = this.state.showMarker;
		 	this.props.updateCar(selCar);
	 	}
	}

	createPoly(poly){
		let p = [];
		for(let i=0; i< poly.length; i++) {
			p.push({lat: poly[i].lat(), lng: poly[i].lng()});
		}
		return p;
	}

	getPolySourceDestination() {
		let markers = this.state.markers;
		let origin=false, destination=false;
		if(markers.length === 2){
  		 origin = [markers[0].lat ,markers[0].lng];
		 destination = [markers[1].lat , markers[1].lng];
		}
		console.log("sending props-----" , origin, destination);
		return [origin, destination];
	}

	handleClick = (event) => {
		console.log("Captured click event------------>", event);
		if(this.state.markerCount < 2){
		let e = event;
		let poly = [];
		let point = {lat: parseFloat(e.latLng.lat()), lng: parseFloat(e.latLng.lng())};
		let existingMarkers = this.state.markers;
		existingMarkers.push(point);
		let drawPolyline, routeApiBeCalled;
		if(existingMarkers.length <= 2){
            if(existingMarkers.length === 2) {
            	drawPolyline = true;
                routeApiBeCalled = confirm("Do you want Google to draw the route ?");
	            if(routeApiBeCalled) {
	            	console.log("Will call the web service");
					this.getPolyFromDirections();	                
            	}else{
            		poly = (typeof(this.props.car.poly) !== 'undefined' && this.props.car.poly && this.props.car.poly.length > 0) ? 
					this.props.car.poly : existingMarkers;
            	}
        	}
        	this.setState({
                car: this.props.car,
                markerCount: this.state.markerCount + 1,
                markers: existingMarkers,
                drawPolyline: drawPolyline,
                poly: poly,
                showMarker: true
            });
       	 }
	  }	
	}

	getPolyFromDirections(){
		  const google = window.google;
	      const DirectionsService = new google.maps.DirectionsService();
	      let points = this.getPolySourceDestination();
	      
	      let o = points[0];
	      let d = points[1];
	      if(o && d) {
	      	let directionsRequest = {
	        origin: new google.maps.LatLng(parseFloat(o[0]), parseFloat(o[1])),
	        destination: new google.maps.LatLng(parseFloat(d[0]), parseFloat(d[1])),
	        travelMode: 'DRIVING'
	      };
	      DirectionsService.route(directionsRequest, this.directionsCallback);
	  }
	}

	directionsCallback(result, status) {
		console.log("result-------->", result);
        console.log("status----------->", status);
        let p = [];
        if (status === "OK") {
          let polyline = require('polyline');
	      let z = polyline.decode(result.routes[0].overview_polyline); // returns an array of lat, lng pairs 
	      for(let k=0; k < z.length; k++) {
		  	p[k] = {lat: parseFloat(z[k][0]), lng: parseFloat(z[k][1])}
		  }
		  this.setState({poly: p}); //ToDo: Handle this so that the component gets rendered only once
		}else {
          console.error('error fetching directions ');
        }
	}

	displayMaps(){
	 	return (
			<div className="gMap">
			<div className="clearfix">
			<div className="pull-left route_label">Route for Car {this.props.car.carId} </div>
			<div id="btn-submit-container"  className="pull-right ">
				<button onClick={this.handleSubmit} className={this.props.car.isSaved ? "car_submit_disable" : ""}> Submit </button>
			</div>
			</div>
			<MyMapComponent onClick={this.handleClick} 
							showMarker={this.state.showMarker} 
							markerCount={this.state.markerCount} 
							markerPos={this.state.markers}
							drawPolyline={this.state.drawPolyline} poly={this.state.poly}
							onRef={ref => (this.child = ref)} 
							routes={this.state.routes} 
			/>
		</div>
		);
	}

	render() {
		return this.displayMaps();
	}
}