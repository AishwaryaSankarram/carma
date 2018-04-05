import React from 'react';
import { compose, withProps, lifecycle} from "recompose";
import {withGoogleMap, GoogleMap} from "react-google-maps";
import {MyMarker} from './marker.jsx';
import {PolyLine} from './PolyLine.jsx';
import {MultiPolyLine} from './multiPolyLine.jsx';
import {MyPin} from './pin';


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
     props.disabled ?  <GoogleMap ref={props.setZoom} mapTypeId="roadmap"
        defaultZoom={16} 
        defaultOptions={{
          streetViewControl: false,
          scaleControl: false,
          mapTypeControl: false,
          panControl: false,
          rotateControl: false,
          fullscreenControl: false,
          maxZoom: 18,
          minZoom: 12
      }} 
      options={{
        maxZoom: 18,
        minZoom: 12
      }}
      disableDefaultUI >
          {props.routes && props.routes.length > 0 && <MultiPolyLine routes={props.routes} /> }
          {props.pinProps && <MyPin address={props.pinProps} onAddressChange={props.onAddressChange}/>}
       </GoogleMap> : 
      <GoogleMap    
      ref={props.setZoom}
       defaultOptions={{
          maxZoom: 18,
          minZoom: 16
       }}
       options={{
        maxZoom: 18,
        minZoom: 12
      }}
      defaultZoom={16} 
       mapTypeId="roadmap" onClick={props.onClick}>
       {props.showMarker && <MyMarker markerPos={props.markerPos} allowEdit={props.allowEdit} title={"Route of " + props.label}
                             color={props.color} dragHandler={props.onDragMarker}/> }
       {props.drawPolyline && <PolyLine pathCoordinates={props.poly} onRef={props.onRef} allowEdit={props.allowEdit}
        color={props.color} dragHandler={props.onDragPoly} saveHandler={props.onChangeAttr} /> }
       {props.routes && props.routes.length > 0 && <MultiPolyLine routes={props.routes} color={props.color} /> }
       {props.pinProps && <MyPin address={props.pinProps} onAddressChange={props.onAddressChange}/>}
     </GoogleMap>
));

