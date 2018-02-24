import React from 'react';
import { Polyline } from "react-google-maps";
import {MyMarker} from './marker.jsx';
export class MultiPolyLine extends React.Component {
	constructor(props){
		super(props);
		this.state = {lineOptions: {
                                strokeColor: '#0000FF',
                                strokeOpacity: 1.0,
                                strokeWeight: 2,
                          		}
	   }
	}


	render(){
    console.log("Rendering Multiple Polylines--------------");
    let that = this;
    let lineOptions = that.state.lineOptions;

    let pl = this.props.routes.map(function(line, index) {
    lineOptions.strokeColor = '#0000FF' ; //ToDo set strokeColor from props
            return (
              <div key={"multi_" + index}>
              <MyMarker markerPos={line[0].markerPos} allowEdit={false} title={"Route of Car " + line[0].carId} icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" />
              <Polyline key={index + "_polyline"}  path={line} options={that.state.lineOptions} editable={false} draggable={false}/> 
              </div>
              );
        });
    return <div>{pl}</div>;
	}
}