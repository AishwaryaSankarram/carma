import React from 'react';
import { Marker } from "react-google-maps";
export class Icon extends React.Component {
	constructor(props) {
		super(props);
        this.handleDrag=this.handleDrag.bind(this);
	    this.handleClick=this.handleClick.bind(this);
	}

 	handleDrag = (e, index) => {
        console.log("Dragging marker--->" , e, index,  e.latLng);
        let markerPos =  e.latLng ;//{lat: parseFloat(e.latLng.lat()), lng: parseFloat(e.latLng.lng())};
        this.props.dragHandler(markerPos, index);
    }

    handleClick = (e, index) => {
        console.log("Clicking marker--->" , e, index,  e.latLng);
        let markerPos =  e.latLng ;//{lat: parseFloat(e.latLng.lat()), lng: parseFloat(e.latLng.lng())};
        this.props.clickHandler(markerPos, index);   
    }

	render() {
		let self = this;
        let google = window.google;
        let svg = [
                    '<?xml version="1.0"?>', 
                    '<svg height="1024" width="767.5" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(180deg);" >',
                      '<path stroke="#fffff" stroke-width="100"  d="M0 384l383.75 383.75L767.5 384H0z" style="fill:#000000;"/>',
                    '</svg>'
                ].join('\n');
	  	let icon = { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg), 
                     anchor: new google.maps.Point(15, 5),
                     scaledSize: new google.maps.Size(30, 30)};
		let zIndex = self.props.allowEdit ? 160 : 137 ;
        let markers = [];
        self.props.markerPos.forEach(function(point, index) {
            if(typeof point.speed !== 'undefined' && point.speed){     
        		 markers.push(<Marker key={"icon_" + index} position={point} zIndex={zIndex} 
                        draggable={self.props.allowEdit} icon={icon} title={"Speed: " + point.speed} 
                        onDragEnd={(event) => self.handleDrag(event, index)} onClick={(event) => self.handleClick(event, index)}
                />);
            }
        });
        console.log("Icons------------>", markers)
        return <div>{markers}</div>;
	}
}
