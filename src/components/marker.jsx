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
		let icon = self.props.icon || ""
		let title = self.props.title || "";
		let markers = this.props.markerPos.map(function(marker) {
            return <Marker key={marker.lat+"_"+marker.lng} position={marker} draggable={self.props.allowEdit} icon={icon} title={title}/>;
        });
        console.log("Markers------------>", markers)
        return <div>{markers}</div>;
	}
}