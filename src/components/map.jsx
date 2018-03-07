import React from 'react';
import { compose, withProps, lifecycle} from "recompose";
import {withGoogleMap, GoogleMap} from "react-google-maps";
import {MyMarker} from './marker.jsx';
import {PolyLine} from './PolyLine.jsx';
import {MultiPolyLine} from './multiPolyLine.jsx';

// const constants = require('../utils/constants.jsx');

export const MyMapComponent = compose(
  withProps({
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div className="map-container" style={{ height: '100%' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        setZoom: ref => {
          refs.map = ref
          if (!ref) { return }
          var bounds = this.props.bounds;
          console.log("setzooom===>" + bounds)
          refs.map.fitBounds(bounds)
        }
      })
    }
  }),

  withGoogleMap
)((props) => (
     props.disabled ?  <GoogleMap ref={props.setZoom}
        defaultZoom={16} 
        defaultOptions={{
          streetViewControl: false,
          scaleControl: false,
          mapTypeControl: false,
          panControl: false,
          rotateControl: false,
          fullscreenControl: false
      }} disableDefaultUI >{props.routes && props.routes.length > 0 && <MultiPolyLine routes={props.routes} /> } </GoogleMap> : 
      <GoogleMap    
      ref={props.setZoom}
      defaultZoom={16} 
       mapTypeId="roadmap" onClick={props.onClick}>
       {props.showMarker && <MyMarker markerPos={props.markerPos} allowEdit={props.allowEdit} title={"Route of " + props.label}
                             color={props.color} dragHandler={props.onDragMarker}/> }
       {props.drawPolyline && <PolyLine pathCoordinates={props.poly} onRef={props.onRef} allowEdit={props.allowEdit}
        color={props.color} dragHandler={props.onDragPoly} saveHandler={props.onChangeAttr} /> }
       {props.routes && props.routes.length > 0 && <MultiPolyLine routes={props.routes} color={props.color} /> }
     </GoogleMap>
));

