import React from 'react';
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