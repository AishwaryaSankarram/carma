import React from 'react';
import { Polyline, Marker } from "react-google-maps";
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
    let pl = this.props.routes.map(function(line, index) {
            return (
              <div key={"multi_" + index}>
              <Marker key={line[0].lat+"_"+line[1].lng} position={line[0]} title={"Route of Car " + line[0].carId} icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"/>
              <Polyline key={index + "_polyline"}  path={line} options={that.state.lineOptions} editable={false} draggable={false}/> 
              </div>
              );
        });
    return <div>{pl}</div>;
	}
}