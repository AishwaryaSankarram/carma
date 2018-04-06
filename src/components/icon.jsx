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
        // console.log("Clicking speed icon--->" , e, index,  e.latLng);
        if(this.props.carId){
            this.props.switchCar(this.props.carId);
        }else{
            let markerPos =  e.latLng ;
            this.props.clickHandler(markerPos, index);       
        }
        
    }

	render() {
		let self = this;
        let google = window.google;
        let svg = [
                    '<?xml version="1.0"?>', 
                    '<svg height="1024" width="767.5" xmlns="http://www.w3.org/2000/svg">',
                      '<polygon stroke="#fffff" stroke-width="100" points="300,0 600,520 0,520" fill="#000000"/>',
                    '</svg>'
                ].join('\n');
	  	let icon = { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg), 
                     anchor: new google.maps.Point(12, 0),
                     scaledSize: new google.maps.Size(30, 30)};
		let zIndex = self.props.allowEdit ? 160 : 137 ;
        let markers = [];
        self.props.markerPos.forEach(function(point, index) {
            if(typeof point.speed !== 'undefined' && point.speed){     
        		 markers.push(<Marker key={"icon_" + index} position={point} zIndex={zIndex} 
                        draggable={self.props.allowEdit} icon={icon} title={"Speed: " + point.speed} 
                        onDragEnd={(event) => self.handleDrag(event, index)} 
                        onClick={(event) => self.handleClick(event, index)}
                />);
            }
        });
        console.log("Icons------------>", markers)
        return <div>{markers}</div>;
	}
}
