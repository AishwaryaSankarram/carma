import React from 'react';
import {MyMapComponent} from '../components/map';

export class MapContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			markers: [],
			showMarker: false,
			markerCount: 0
		} ;
		this.handleClick = this.handleClick.bind(this);
		this.displayMaps = this.displayMaps.bind(this);

	}

	handleClick = (event) => {
		console.log("Captured event------------>", event);
		let e = event;
		let point = {lat: parseFloat(e.latLng.lat()), lng: parseFloat(e.latLng.lng())};
		let existingMarkers = this.state.markers;
		existingMarkers.push(point);
		this.setState({
			markerCount: this.state.markerCount + 1,
			markers: existingMarkers,
			showMarker: true
		});
	}

	displayMaps(){
		console.log("Rendering maps------------");
		
		return <MyMapComponent onClick={this.handleClick} showMarker={this.state.showMarker} markerCount={this.state.markerCount} markerPos={this.state.markers}/>;
	}
	render() {
		return this.displayMaps();
	}
}