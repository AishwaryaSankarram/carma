import React from 'react';
import { Marker } from 'react-google-maps';
import SpeedIcon from '../images/speed-icon';

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
        let zIndex = self.props.allowEdit ? 160 : 137 ;
        let markers = [];
        self.props.markerPos.forEach(function(point, index) {
            if(typeof point.speed !== 'undefined' && point.speed && index !== self.props.markerPos.length - 1){     
                let svg = SpeedIcon.replace(/SpeedVal/g, point.speed);
                let icon = { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
                     anchor: new google.maps.Point(15, -3),
                     scaledSize: new google.maps.Size(50, 50)};
        
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
