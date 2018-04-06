import React from 'react';
import {MyMarker} from './marker.jsx';
import {Route} from './route.jsx';

export class MultiPolyLine extends React.Component {
	
  render(){
    let self = this;
    let pl = this.props.routes.map(function(line, index) {
      return (
        <div key={"multi_" + index}>
          <MyMarker markerPos={line[0].markerPos} allowEdit={false} 
                    title={"Route of " + line[0].carLabel} color={line[0].color} carId={line[0].carId} switchCar={self.props.switchCar} />
          <Route pathCoordinates={line} allowEdit={false} color={line[0].color} carId={line[0].carId} switchCar={self.props.switchCar} />
        </div>
      );
    });
    return <div>{pl}</div>;
	}
}
