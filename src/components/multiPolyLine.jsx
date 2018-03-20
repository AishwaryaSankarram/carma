import React from 'react';
import { Polyline } from "react-google-maps";
import {MyMarker} from './marker.jsx';
export class MultiPolyLine extends React.Component {
	constructor(props){
		super(props);
		this.state = {lineOptions: {
                                strokeColor: '#0000FF',
                                strokeOpacity: 1.0,
                                strokeWeight: 2
                          		}
	   }
	}


	render(){
    console.log("Rendering Multiple Polylines--------------");
    let pl = this.props.routes.map(function(line, index) {
		let lineOptions =  {
																strokeColor: line[0].color,
																strokeOpacity: 1.0,
																strokeWeight: 2
												};
            return (
              <div key={"multi_" + index}>
              <MyMarker markerPos={line[0].markerPos} allowEdit={false} title={"Route of " + line[0].carLabel} color={line[0].color} />
              <Polyline key={index + "_polyline"}  path={line} options={lineOptions} editable={false} draggable={false}/>
              </div>
              );
        });
    return <div>{pl}</div>;
	}
}
