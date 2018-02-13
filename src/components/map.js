import React from 'react';
import { compose, withProps } from "recompose";
import {withScriptjs, withGoogleMap, GoogleMap} from "react-google-maps";
import {MyMarker} from './marker';

export const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAP7zU5-pog5MMw7dg8F24Q-QyeMDKzTwU",
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '400px' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),

  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap defaultZoom={16} defaultCenter={props.markerCount > 0 ? props.markerPos[props.markerCount] : {lat: 37.35209000546612, lng: -121.95941368730672}} mapTypeId="roadmap" onClick={props.onClick}>
    {props.showMarker && <MyMarker markerPos={props.markerPos} /> }
  </GoogleMap>
));

