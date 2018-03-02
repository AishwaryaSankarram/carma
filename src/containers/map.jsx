import React from 'react';
import axios from 'axios';
import {MyMapComponent} from '../components/map.jsx';
import {MyModal} from '../popup/Modal.jsx';

const apiData = require('../utils/api.jsx');
const apiUrl = apiData.baseUrl;

export class MapContainer extends React.Component {
	constructor(props) {
		super(props);
		if((typeof(this.props.car.poly) !== 'undefined') && this.props.car.poly.length > 0){
			this.state = {
				markers: this.props.car.markers,
				showMarker: this.props.car.showMarker,
				markerCount: this.props.car.markerCount,
				drawPolyline: this.props.car.drawPolyline,
				car: this.props.car, 
				poly: this.props.car.poly,
				routes: this.props.routes,
				modalIsVisible: false
			};
		}else{
			this.state = {
				markers: [],
				showMarker: false,
				markerCount: 0,
				drawPolyline: false,
				car: this.props.car, 
				poly: [], 
				routes: this.props.routes,
				modalIsVisible: false 
			};
		}
		
		this.handleClick = this.handleClick.bind(this);
		this.displayMaps = this.displayMaps.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.getPolySourceDestination = this.getPolySourceDestination.bind(this);
		this.getPolyFromDirections = this.getPolyFromDirections.bind(this);
		this.constructPolyLine = this.constructPolyLine.bind(this);
		this.directionsCallback = this.directionsCallback.bind(this);
		this.deriveMapCenter = this.deriveMapCenter.bind(this);
		this.handleMarkerDrag = this.handleMarkerDrag.bind(this);
		this.handlePolyDrag = this.handlePolyDrag.bind(this);
		this.deleteMarkers = this.deleteMarkers.bind(this);
	}

	componentWillReceiveProps(nextProps) { 
		if(nextProps.car.carId !== this.state.car.carId || nextProps.routes !== this.state.routes){ //Reload the map on a different car
			console.log("Update render------------", nextProps.car);
			if(typeof nextProps.car.poly !== 'undefined' && nextProps.car.poly && nextProps.car.poly.length > 0){ //Old map props retrieved for saved cars
				let car = nextProps.car;
				this.setState({
					markers: car.markers,
					showMarker: car.showMarker,
					markerCount: car.markerCount,
					drawPolyline: car.drawPolyline,
					car: nextProps.car, 
					poly: nextProps.car.poly,
					routes: nextProps.routes,
					modalIsVisible: false 		
				});
			}else{			//Rendering new map for unsaved car
				this.setState({
					markers: [],
					showMarker: false,
					markerCount: 0,
					drawPolyline: false,
					car: nextProps.car,
					poly: [],
					routes: nextProps.routes,
					modalIsVisible: false 
				});
			}
		}
  	}

  	getGranularPts(payload){
		var loginResp = JSON.parse(this.props.loginData);
        var pwd = this.props.pwd;
  		var apiBaseUrl =  apiUrl + "granular/";
	     axios.post(apiBaseUrl +'createGranularPoints', payload, {
	     auth: {
			username: loginResp.uuid,
			password: pwd }
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
				selCar.poly =  h; 
			}
			if(typeof selCar.poly[0].speed === 'undefined'){
				selCar.poly[0].speed = selCar.speed;
			}
			let payload = selCar;
			this.getGranularPts(payload);
			console.log(payload);
			selCar['isSaved'] = true;
		 	selCar['drawPolyline']=this.state.drawPolyline;
		 	selCar['markerCount'] = this.state.markerCount;
			selCar['markers'] = [selCar.poly[0], selCar.poly[selCar.poly.length - 1]];
		 	selCar['showMarker'] = this.state.showMarker;
		 	this.props.updateCar(selCar, true);
	 	}
	}

	handleSave(){
		let selCar = this.props.car;
		if(this.state.drawPolyline) {
	    	let h = this.child.method(); // Get path from PolyLine drawn
	    	if(selCar != null){
				selCar.poly =  h; 
			}
			if(typeof selCar.poly[0].speed === 'undefined'){
				selCar.poly[0].speed = selCar.speed;
			}
		}
	 	selCar['drawPolyline']=this.state.drawPolyline;
	 	selCar['markerCount'] = this.state.markerCount;
		selCar['markers'] = this.state.drawPolyline ? [selCar.poly[0], selCar.poly[selCar.poly.length - 1]] : this.state.markers;
	 	selCar['showMarker'] = this.state.showMarker;
	 	console.log("Saving car as------", selCar);
	 	this.props.updateCar(selCar, false);
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

	handleClick = (e) => {
		console.log("Captured click event------------>", e);
		let self = this;
        if(this.state.markerCount < 2){
            let poly = [];
            let point = {lat: parseFloat(e.latLng.lat()), lng: parseFloat(e.latLng.lng())};
            let existingMarkers = this.state.markers;
            existingMarkers.push(point);
            let drawPolyline = false;
            if(existingMarkers.length <= 2){
            	if(this.state.markerCount === 0){ //adding first marker
                	this.setState({
                    	markerCount: this.state.markerCount + 1,
                    	markers: existingMarkers,
                    	car: self.props.car,
	                    drawPolyline: drawPolyline,
	                    poly: poly,
	                    showMarker: true
               		 });
            	   	return;	
            	}else{ //Adding 2nd marker
            	self.setState({ //Add the markers first
                	markerCount: self.state.markerCount + 1,
                	markers: existingMarkers
            	});
                setTimeout(function(){ //Load the confirm box and start drawing routes after a delay so that the user can see the marker
                   self.setState({modalIsVisible: true});
                },200);	
            }
          }
        }
	}

	constructPolyLine(){
		let self = this;
		let poly =  self.state.markers;           
        console.log("Draw normal poly line------" , poly);
        self.setState({
        	modalIsVisible: false,
            drawPolyline: true,
            poly: poly
   		 });
        setTimeout(function(){
        	self.handleSave();
        }, 200);
        
	}

	deleteMarkers(){
		console.log("The new cancel btn------------");
		let self = this;
		if(self.state.drawPolyline){
			let poly = this.child.method();
			self.setState({
				modalIsVisible: false,
				markers: [poly[0], poly[poly.length -1]]
			});
		}else{
			self.setState({
	        	modalIsVisible: false,
	            drawPolyline: false,
	            showMarker: false,
	            markers: [], 
	            markerCount: 0
   		 	});	
		}
		setTimeout(function(){
        	self.handleSave();
        }, 200);
	}

	handleMarkerDrag(markerPos, index) {
		let self = this;
		if(this.state.drawPolyline) { //Redraw routes
			this.setState({markers: markerPos});
			setTimeout(function(){ //Load the confirm box and start drawing routes after a delay so that the user can see the marker
              self.setState({modalIsVisible: true});
            },200);	
		  	/*let poly = this.child.method(); 
		  	poly[0] = markerPos[0];
		  	if(index === 1){  //Extend the poly line 
		  		poly.pop();
		  		poly.push(markerPos[1]);	
		  	}else{ // alter the source of the poly line
		  		poly.shift();
		  		poly.unshift(markerPos[0]);
		  	}
			this.setState({
				markers: markerPos,
				poly: poly
			});	 */ 	
		}else{  //Maintain consistent marker states
		  	this.setState({
				markers: markerPos
			});
			setTimeout(function(){
				self.handleSave();
			}, 200);
		}
	}

	handlePolyDrag(poly){
		this.setState({
			markers: [poly[0], poly[poly.length - 1]]
		});
		this.handleSave();
	}

	getPolyFromDirections(){
		console.log("call the web service");
		  const google = window.google;
	      const DirectionsService = new google.maps.DirectionsService();
	      let points = this.getPolySourceDestination();
	      
	      let o = points[0];
	      let d = points[1];
	      if(o && d) {
	      	let directionsRequest = {
	        origin: new google.maps.LatLng(parseFloat(o[0]), parseFloat(o[1])),
	        destination: new google.maps.LatLng(parseFloat(d[0]), parseFloat(d[1])),
	        travelMode: 'DRIVING',
			provideRouteAlternatives: true
	      };
	      DirectionsService.route(directionsRequest, this.directionsCallback);
	  }
	}

	directionsCallback(result, status) {
		console.log("result-------->", result);
        console.log("status----------->", status);
        let p = [], self=this;
        if (status === "OK") { 
          let key=this.getShortestPath(result);
          let polyline = require('polyline');
	      let z = polyline.decode(result.routes[key].overview_polyline); // returns an array of lat, lng pairs 
	      for(let k=0; k < z.length; k++) {
		  	p[k] = {lat: parseFloat(z[k][0]), lng: parseFloat(z[k][1])}
		  }
		  this.setState({modalIsVisible: false, poly: p, markers: [p[0], p[p.length -1]], drawPolyline: true });
		  setTimeout(function(){
	        self.handleSave();
          }, 200);
		}else {
          console.error('error fetching directions ');
        }
	}


	getShortestPath(result){
		let distanceIndexObj={};
		let count=0;
		console.log(result.routes.length);
		result.routes.forEach(route => {
			let dist=route.legs[0].distance.value;
			distanceIndexObj[dist]=count;
			count += 1;
			console.log("dist===>"+JSON.stringify(distanceIndexObj));
		});
		let distObj=[];
		distObj=Object.keys(distanceIndexObj);//Fetch all distances
		let minVal=Math.min.apply(null,distObj); //Get the min distance
		console.log(distanceIndexObj[minVal]); //Get the key in routes for the distance
		return distanceIndexObj[minVal];
	}

	deriveMapCenter(){
		let mapCenter;
		if(this.props.car.isSaved){
			 mapCenter = this.props.car.markers[0]; //Using saved car mapCenter
		}else{
			/*if(this.state.markers[0]){
				mapCenter = this.state.markers[0]; //Using current car mapCenter
			}else */if(this.state.routes[0]){
				mapCenter = this.state.routes[0][0]; //Using mapCenter from first route
			}else{
				const constants = require("../utils/constants.jsx"); 
				mapCenter = constants.mapCenter; //Using mapCenter from constants
			}
		}
		return mapCenter;
	}
	getBounds(){
		let routeArray= this.state.routes;
		let flag = true;
		var latLngBounds = new window.google.maps.LatLngBounds();
		if(routeArray.length > 0){
			for(let i=0; i<routeArray.length;i++){
				let routes = routeArray[i][0].markerPos;
				routes.forEach(function(e){
					latLngBounds.extend(new window.google.maps.LatLng({ lat:e.lat, lng: e.lng}));			
				});
			}
			flag=false;
		}
		if(this.state.drawPolyline || (this.state.markerCount > 0)){
			let markers = this.state.markers;
			markers.forEach(function(e){
				latLngBounds.extend(new window.google.maps.LatLng({ lat:e.lat, lng: e.lng}));			
			});	
			flag = false;
		}
		if(flag){
			const constants = require("../utils/constants.jsx"); 
			let mapCenter = constants.mapCenter; //Using mapCenter from constants
			latLngBounds.extend(new window.google.maps.LatLng({ lat:mapCenter.lat, lng: mapCenter.lng}));
		}
		return latLngBounds;
	}

	displayMaps(){
		let mapCenter = this.deriveMapCenter();
		let saveBtnClass = this.props.car.isSaved ? "car_submit_disable" : (this.state.drawPolyline ? "save-highlight" : "") ;
		let bounds = this.getBounds();
		console.log("display maps===>"+bounds);
	 	return (
	 		<div className="gMap">
			<div className="clearfix">
			<div className="pull-left route_label">Plan your route for {this.props.car.carId} </div>
			<div id="btn-submit-container"  className="pull-right ">
				<button onClick={this.handleSubmit} className={saveBtnClass}> Save </button>
			</div>
			</div>
			<MyMapComponent onClick={this.handleClick} 
							showMarker={this.state.showMarker} 
							markerCount={this.state.markerCount} 
							markerPos={this.state.markers}
							drawPolyline={this.state.drawPolyline} poly={this.state.poly}
							onRef={ref => (this.child = ref)} 
							routes={this.state.routes} allowEdit={true}
							mapCenter={mapCenter} color={this.props.car.color} label={this.props.car.carId}
							onDragMarker={this.handleMarkerDrag} onDragPoly={this.handlePolyDrag}
							onChangeAttr={this.handleSave}
							 bounds={bounds}
			/>
			{this.state.modalIsVisible && 
		          <MyModal title="Draw Routes" modalIsOpen={this.state.modalIsVisible} content="Do you want us to draw the route ?" 
		          okAction={this.getPolyFromDirections} cancelAction={this.deleteMarkers} 
		          addBtn={this.constructPolyLine} labelOk="Use Google to draw the routes"  
		          addBtnLabel="Draw free hand route" labelCancel="Cancel" />}
			</div>	
		);
	}

	render() {
		return this.displayMaps();
	}
}