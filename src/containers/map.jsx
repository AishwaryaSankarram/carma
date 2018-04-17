import React from 'react';
import axios from 'axios';
import {ScenarioActions} from '../components/scenarioActions';
import {MyMapComponent} from '../components/map.jsx';
import {MyModal} from '../popup/Modal.jsx';

const apiData = require('../utils/api.jsx');
const apiUrl = apiData.baseUrl;
export class MapContainer extends React.Component {
	constructor(props) {
		super(props);
		let address = this.props.userAddress;
		this.event_name = "";
		this.state = {
				car: this.props.car,
				poly: [],
				markers: [],
				showMarker: false,
				markerCount: 0,
				drawPolyline: false,
				isDirty: false,
				routes: this.props.routes,
				modalIsVisible: false,
				address: {
				  formattedAddress: address ? address.address : null,
				  location: {
				    type: "Point",
				    coordinates: [
				      address && address.location ? address.location.coordinates[0] : null,
				      address && address.location ? address.location.coordinates[1] : null
				    ]
				  },
			  	  placeId: address ? address.placeId : null
			  }
		};
		if(this.props.car && (typeof(this.props.car.poly) !== 'undefined') && this.props.car.poly.length > 0){
			var newObj = {markers: this.props.car.markers,
				showMarker: this.props.car.showMarker,
				markerCount: this.props.car.markerCount,
				drawPolyline: this.props.car.drawPolyline,
				poly: this.props.car.poly}
			this.state = Object.assign(this.state, newObj);
		}

		this.handleClick = this.handleClick.bind(this);
		this.displayMaps = this.displayMaps.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handlePolyEvents = this.handlePolyEvents.bind(this);
		this.getPolySourceDestination = this.getPolySourceDestination.bind(this);
		this.getPolyFromDirections = this.getPolyFromDirections.bind(this);
		this.constructPolyLine = this.constructPolyLine.bind(this);
		this.directionsCallback = this.directionsCallback.bind(this);
		this.deriveMapCenter = this.deriveMapCenter.bind(this);
		this.handleMarkerDrag = this.handleMarkerDrag.bind(this);
		this.handlePolyDrag = this.handlePolyDrag.bind(this);
		this.deleteMarkers = this.deleteMarkers.bind(this);
		this.changeFocusLocation = this.changeFocusLocation.bind(this);
		this.changedScenarioName = this.changedScenarioName.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		let address = nextProps.userAddress;
		//scenario doesn't change but address does, change isDirty if required
		let isDirty = this.state.isDirty;
		if(nextProps.scenario.id === this.props.scenario.id && (address && address.address !== this.state.address.formattedAddress))
			if(!isDirty)
				isDirty = true;
		if(nextProps.scenario.id !== this.props.scenario.id)	
				this.event_name = "scenario_change";
		if(nextProps.car.carId !== this.state.car.carId || nextProps.routes !== this.state.routes || (address && address.address !== this.state.address.formattedAddress)){ //Reload the map on a different car
			let currentAddress = {
			  formattedAddress: address ? address.address : null,
			  location: {
			    type: "Point",
			    coordinates: [
			      address && address.location ? address.location.coordinates[0] : null,
			      address && address.location ? address.location.coordinates[1] : null
			    ]
			  },
  	  		   placeId: address ? address.placeId : null
			};

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
					address: currentAddress,
					modalIsVisible: false/*,
					isDirty: isDirty*/
				});
			}else{			//Rendering new map for unsaved car
				this.setState({
					markers: [],
					showMarker: false,
					markerCount: 0,
					drawPolyline: false,
					poly: [],
					car: nextProps.car,
					routes: nextProps.routes,
					modalIsVisible: false,
					address: currentAddress/*,
					isDirty: isDirty*/
				});
			}
		}
  }

  	saveRoute(payload){
  		var self = this;
		var loginResp = JSON.parse(this.props.loginData);
        var pwd = this.props.pwd;
        console.log(payload);
  		const apiBaseUrl =  apiUrl + "granular/";
  		let method = payload.carId ? 'PUT' : 'POST';
  		let context = payload.carId ? 'updateTripDetails' : 'createGranularPoints';
  		axios({
            method: method,
            url: apiBaseUrl + context,
            data: payload,
            auth: {
			  username: loginResp.uuid,
			  password: pwd
		  	}
        }).then(function (response) {
			console.log(response);
			if(response.status === 200){
				console.log("Response 200.")
			  self.updateProps(response.data.carId);
				let isDirty = self.state.isDirty;
				if(isDirty) {
					self.setState({isDirty: false});
				}
			}
			else{
			  console.log("Oops...! Rest HIT failed with--------" + response.status);
			}
		}).catch(function (error) {
			console.log("The error is------------", error);
		 });
  	}

  	updateProps(carId){
  		var self = this;
  		let selCar = self.props.car;
 		selCar.carId = carId;
 		selCar['isSaved'] = true;
 		selCar['drawPolyline']=self.state.drawPolyline;
 		selCar['markerCount'] = self.state.markerCount;
		selCar['markers'] = [selCar.poly[0], selCar.poly[selCar.poly.length - 1]];
		selCar['isDirty'] = false;
 		selCar['showMarker'] = self.state.showMarker;
 		self.props.updateCar(selCar, true);
	}

	componentDidMount() {
		this.props.mapRef(this);
	}

	componentWillUnMount() {
		this.props.mapRef(null);
	}

	handleSubmit(scenarioObj){
		console.log("Submit Clicked", scenarioObj);
		this.props.updateCar(scenarioObj, true);
		/*
		let selCar = this.props.car;
		if(this.state.drawPolyline) {
    	let h = this.child.method(); // Get path from PolyLine drawn
    	if(selCar != null){
			selCar.poly =  h;
		}
		if(typeof selCar.poly[0].speed === 'undefined' || !selCar.poly[0].speed){
			selCar.poly[0].speed = selCar.speed;
		}
		let payload = Object.assign({}, selCar);
		if(!selCar.isSaved){
		  delete(payload.carId);
		}
   		this.saveRoute(payload);
	 	}*/
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
		selCar['isDirty'] = true;
		selCar['markers'] = this.state.drawPolyline ? [selCar.poly[0], selCar.poly[selCar.poly.length - 1]] : this.state.markers;
	 	selCar['showMarker'] = this.state.showMarker;
	 	console.log("Saving car as------", selCar);
	 	this.props.updateCar(selCar, false);
	}


	handlePolyEvents(h){
		let selCar = this.props.car;
		selCar.poly = h;
		this.setState({poly: h, isDirty: true});
		console.log("Handling poly events------", selCar);
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
		poly[0].speed = self.props.car.speed;
        console.log("Draw normal poly line------" , poly);
        self.setState({
        	modalIsVisible: false,
            drawPolyline: true,
            poly: poly,
						isDirty:true
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
		let selCar = this.state.car;
		if(this.state.drawPolyline) { //Redraw routes
			this.setState({markers: markerPos});
			selCar['isDirty'] = true;
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
		let self = this;
		let selCar = this.state.car;
		selCar['isDirty'] = true;
		this.setState({
			markers: [poly[0], poly[poly.length - 1]],
			poly: poly,
			isDirty: true
		});
		setTimeout(function(){
			self.handleSave();
		}, 200);

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
		  p[0].speed = self.props.car.speed;
		  this.setState({modalIsVisible: false, poly: p, markers: [p[0], p[p.length -1]], drawPolyline: true, isDirty: true });
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
		let routeArray= this.state.routes;
		if(this.props.car && this.props.car.isSaved && this.props.car.markers && this.props.car.markers.length === 2){
			 mapCenter = {lat: ((this.props.car.markers[0].lat + this.props.car.markers[1].lat)/2),
			  lng: ((this.props.car.markers[0].lng + this.props.car.markers[1].lng)/2)}  ; //Using saved car mapCenter
		}else if(routeArray.length > 0){
			/*if(this.state.markers[0]){
				mapCenter = this.state.markers[0]; //Using current car mapCenter

			}else */
		  let lat = 0, lng = 0, counter=0;
		  for(let i=0; i<routeArray.length;i++){
		  	let routes = routeArray[i];//[0].markerPos;
		  	for(let j=0; j<routes.length; j++){
		  		let e = routes[j];
				lat += e.lat;
		  		lng += e.lng;
		  		counter += 1;
		  	}
/*		  	routes.forEach(function(e){

		  		lat += e.lat;
		  		lng += e.lng;
		  		counter += 1;
		  	});
*/	      }
	      mapCenter = {lat: lat/counter, lng: lng/counter}; //this.state.routes[this.state.routes.length - 1][0]; //Using mapCenter from first route
		}else if(this.state.address.location.coordinates[0]){	 //Using saved Address mapCenter
			mapCenter = {
						 lat: this.state.address.location.coordinates[0],
						 lng: this.state.address.location.coordinates[1]
						};
		}else{
			const constants = require("../utils/constants.jsx");
			mapCenter = constants.mapCenter; //Using mapCenter from constants
		}
		return mapCenter;
	}

	getBounds(){
		let routeArray= this.state.routes;
		let flag = true;
		var latLngBounds = new window.google.maps.LatLngBounds();
		if(routeArray.length > 0){
			for(let i=0; i<routeArray.length;i++){
				let routes = routeArray[i];//[0].markerPos;
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
    	if(this.state.address.location.coordinates[0]){
      		latLngBounds.extend(new window.google.maps.LatLng(
                            {
                              lat: this.state.address.location.coordinates[0],
                              lng:  this.state.address.location.coordinates[1]
                          	}
                        ));
      	    flag = false;
    	}
		if(flag){
			const constants = require("../utils/constants.jsx");
			let defLatLng = constants.bounds; //Using bounds from constants
			defLatLng.forEach(function(point){
              latLngBounds.extend(new window.google.maps.LatLng({ lat:point.lat, lng: point.lng}));
            });
		}
		return latLngBounds;
	}

	changeFocusLocation(place){
        let address = {
                placeId: place.place_id,
                location: {
                	type: "Point",
				    coordinates: [place.geometry.location.lat(),place.geometry.location.lng()]
				},
                address: place.formatted_address
            }
        this.event_name="location_change"; 
        this.props.updateAddress(address);
	}

	changedScenarioName(name) {
		let isDirty = this.state.isDirty;
	 	if(!isDirty) {
			this.setState({isDirty: true});
		}
	}

	displayMaps(){
		let mapCenter = this.deriveMapCenter();
		let bounds = this.getBounds();
		let pinProps = this.state.address.formattedAddress ? this.state.address : false;
		let saveBtnDisabled = !this.state.isDirty;
		console.log("display maps===>", bounds);
		let event_name = this.event_name;
		this.event_name = "";
	 	return (
	 		<div className="gMap">
			<div className="clearfix">
				{this.props.car.carLabel && <div className="pull-left route_label">Plan your route for {this.props.car.carLabel} </div> }
				<ScenarioActions handleSubmit={this.handleSubmit} addCarHandler={this.props.addCar}
								address={pinProps} onAddressChange={this.changeFocusLocation}
								onNameChange={this.changedScenarioName} handleDelete={this.props.deleteScenario}
								scenario={this.props.scenario} disabled={saveBtnDisabled}
								/>
			</div>
			<MyMapComponent onClick={this.handleClick}
							showMarker={this.state.showMarker}
							markerCount={this.state.markerCount}
							markerPos={this.state.markers}
							drawPolyline={this.state.drawPolyline} poly={this.state.poly}
							onRef={ref => (this.child = ref)}
							routes={this.state.routes} allowEdit={true}
							mapCenter={mapCenter}
							color={this.props.car.color ? this.props.car.color : ""} label={this.props.car ? this.props.car.carLabel: ""}
							onDragMarker={this.handleMarkerDrag} onDragPoly={this.handlePolyDrag}
							onChangeAttr={this.handlePolyEvents}
							bounds={bounds}
							pinProps={pinProps} onAddressChange={this.changeFocusLocation}
							disabled={this.props.car.carLabel? false : true}
							switchCar={this.props.switchCar} event_name={event_name}
			/>
			{this.state.modalIsVisible &&
		          <MyModal title="Draw Routes" modalIsOpen={this.state.modalIsVisible} content="How do you want to draw the route?"
		          okAction={this.getPolyFromDirections} cancelAction={this.deleteMarkers}
		          addBtn={this.constructPolyLine} labelOk="Use Google to draw the routes"
		          addBtnLabel="Use my own route" labelCancel="Cancel" />}
			</div>
		);
	}

	render() {
		return this.displayMaps();
	}
}
