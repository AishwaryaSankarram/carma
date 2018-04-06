import React from 'react';
import { Marker } from "react-google-maps";
export class MyMarker extends React.Component {
	constructor(props) {
		super(props);
	    this.state = { markerCount: 0 };
        this.handleDrag=this.handleDrag.bind(this);
	    this.handleClick=this.handleClick.bind(this);
	}

	componentWillReceiveProps(nextProps) {
       this.setState({markerCount: this.state.markerCount + 1});
  	}

    handleClick(){
        // console.log("Clicking on other marker------");
        this.props.switchCar(this.props.carId);
    }

 	handleDrag = (e, index) => {
        console.log("Dragging marker--->" , e, index,  e.latLng, this.props.markerPos[0]);
        let markerPos = this.props.markerPos;
        markerPos[index] = {lat: parseFloat(e.latLng.lat()), lng: parseFloat(e.latLng.lng())};
        this.props.dragHandler(markerPos, index);
    }



	render() {
		let self = this;
		let google = window.google;
		let svg = [
                '<?xml version="1.0"?>',
                    '<svg  viewBox="0 0 17.93 27.11" version="1.1" xmlns="http://www.w3.org/2000/svg">',
                        '<path d="M692.49,2226.38a9,9,0,0,0-9,9c0,2,1.27,5.24,3.89,9.93,1.85,3.32,3.67,6.08,3.75,6.2l1.33,2,1.33-2c0.08-.12,1.9-2.88,3.75-6.2,2.62-4.69,3.89-7.93,3.89-9.93a9,9,0,0,0-9-9h0Zm0,13.55a4.65,4.65,0,1,1,4.65-4.65,4.65,4.65,0,0,1-4.65,4.65h0Zm0,0" transform="translate(-683.52 -2226.38)" style="fill:'+ this.props.color +'"/>',
                    '</svg>'
                ].join('\n');
	  	let icon = { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg), scaledSize: new google.maps.Size(30, 30) };
		let title = self.props.title || "";
		let zIndex = self.props.allowEdit ? 150 : 137 ;
		let markers = self.props.markerPos.map((marker, index) => {
            return (
            	<Marker key={marker.lat+"_"+marker.lng} position={marker} zIndex={zIndex} 
            	draggable={self.props.allowEdit} icon={icon} title={title} 
            	onDragEnd={(event) => self.handleDrag(event, index)} onClick={this.handleClick}
            />);
        });
        console.log("Markers------------>", markers)
        return <div>{markers}</div>;
	}
}
