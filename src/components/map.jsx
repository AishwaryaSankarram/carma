import React from 'react';
import { compose, withProps} from "recompose";
import {withScriptjs, withGoogleMap, GoogleMap} from "react-google-maps";
import {MyMarker} from './marker.jsx';
import {PolyLine} from './PolyLine.jsx';
import {MultiPolyLine} from './multiPolyLine.jsx';

const constants = require('../utils/constants.jsx');

export const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAP7zU5-pog5MMw7dg8F24Q-QyeMDKzTwU",
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div className="map-container" style={{ height: '100%' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),

  withScriptjs,
  withGoogleMap
)((props) => (
     props.disabled ?  <GoogleMap
        defaultZoom={16}
        defaultCenter={props.mapCenter || constants.mapCenter}
        center={props.mapCenter || constants.mapCenter}
        defaultOptions={{
          streetViewControl: false,
          scaleControl: false,
          mapTypeControl: false,
          panControl: false,
          zoomControl: false,
          rotateControl: false,
          fullscreenControl: false
      }} disableDefaultUI >  {props.routes && props.routes.length > 0 && <MultiPolyLine routes={props.routes} /> } </GoogleMap> : 
      <GoogleMap defaultZoom={16} defaultCenter={props.mapCenter || constants.mapCenter} center={props.mapCenter || constants.mapCenter} mapTypeId="roadmap"
       onClick={props.onClick}>
       {props.showMarker && <MyMarker markerPos={props.markerPos} allowEdit={props.allowEdit} title={"Route of " + props.label}
                             color={props.color} dragHandler={props.onDragMarker}/> }
       {props.drawPolyline && <PolyLine pathCoordinates={props.poly} onRef={props.onRef} allowEdit={props.allowEdit}
        color={props.color} dragHandler={props.onDragPoly} saveHandler={props.onChangeAttr} /> }
       {props.routes && props.routes.length > 0 && <MultiPolyLine routes={props.routes} color={props.color} /> }
     </GoogleMap>
));

