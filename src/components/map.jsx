import React from 'react';
import { compose, withProps, withHandlers, lifecycle} from "recompose";
import {withGoogleMap, withScriptjs,GoogleMap} from "react-google-maps";
import {MyMarker} from './marker.jsx';
import {PolyLine} from './PolyLine.jsx';
import {MultiPolyLine} from './multiPolyLine.jsx';

const constants = require('../utils/constants.jsx');

export const MyMapComponent = compose(
  withProps({
    // googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAP7zU5-pog5MMw7dg8F24Q-QyeMDKzTwU",
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
          // this.props.bounds.forEach((p) => {
          //   var latLng = new google.maps.LatLng(p.lat, p.lng);
          //   bounds.extend(latLng);
          // })
          console.log("setzooom===>"+this.props.bounds)
          refs.map.fitBounds(bounds)
        }
      })
    // },
    // componentWillUpdate(){
    //   const refs = {};

    //   this.setState({
    //     setZoom: ref => {
    //       refs.map = ref
    //       var bounds = this.props.bounds;
    //       // this.props.bounds.forEach((p) => {
    //       //   var latLng = new google.maps.LatLng(p.lat, p.lng);
    //       //   bounds.extend(latLng);
    //       // })
    //       console.log(this.props.bounds)
    //       refs.map.fitBounds(bounds);
    //     }
    //   })
    }
  }),

  // withScriptjs,
  withGoogleMap
)((props) => (
  
     props.disabled ?  <GoogleMap ref = {props.setZoom}
        
        defaultOptions={{
          streetViewControl: false,
          scaleControl: false,
          mapTypeControl: false,
          panControl: false,
          rotateControl: false,
          fullscreenControl: false
      }} disableDefaultUI > {console.log("---->"+props.bounds)} {props.routes && props.routes.length > 0 && <MultiPolyLine routes={props.routes} /> } </GoogleMap> : 
      <GoogleMap    
      ref = {props.setZoom}
      defaultZoom={16} 
       mapTypeId="roadmap" onClick={props.onClick}>
       {props.showMarker && <MyMarker markerPos={props.markerPos} allowEdit={props.allowEdit} title={"Route of " + props.label}
                             color={props.color} dragHandler={props.onDragMarker}/> }
       {props.drawPolyline && <PolyLine pathCoordinates={props.poly} onRef={props.onRef} allowEdit={props.allowEdit}
        color={props.color} dragHandler={props.onDragPoly} saveHandler={props.onChangeAttr} /> }
       {props.routes && props.routes.length > 0 && <MultiPolyLine routes={props.routes} color={props.color} /> }
     </GoogleMap>
));

