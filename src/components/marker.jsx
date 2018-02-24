import React from 'react';
import { Marker } from "react-google-maps";
export class MyMarker extends React.Component {
	constructor(props) {
		super(props);
	    this.state = { markerCount: 0 };
	}

	componentWillReceiveProps(nextProps) {
		console.log("nextProps-----------------", nextProps, nextProps.markerPos.length);
     // if (nextProps.markerPos.length != this.state.markerCount) {
      		this.setState({markerCount: this.state.markerCount + 1});
    	// }
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
		let markers = this.props.markerPos.map(function(marker) {
            return <Marker key={marker.lat+"_"+marker.lng} position={marker} zIndex={zIndex} draggable={self.props.allowEdit} icon={icon} title={title}/>;
        });
        console.log("Markers------------>", markers)
        return <div>{markers}</div>;
	}
}
