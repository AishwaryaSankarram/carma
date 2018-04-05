import React,{Component} from 'react';
import { Marker } from "react-google-maps";
import Pin from '../images/pin';

let google = window.google;

export class MyPin extends Component {
	
    constructor(props) {
		super(props);
    let address = props.address;
    this.state = {
        label: address ? address.formattedAddress : "" ,
        placeId: address ? address.placeId : "",
        position: address ? 
                    {lat: address.location.coordinates[0], 
                     lng: address.location.coordinates[1] } 
                    : {}        
    };
    this.handleDrag = this.handleDrag.bind(this);
	  this.callEditAddressApi = this.callEditAddressApi.bind(this);
	}

  componentWillReceiveProps(nextProps){
    let address = nextProps.address;
    this.setState({
              label: address ? address.formattedAddress : "" ,
              placeId: address ? address.placeId : "",
              position: address ? {lat: address.location.coordinates[0], 
                     lng: address.location.coordinates[1] } : {}
    });
  }

  updateLocalStorage(results){
      let localData = localStorage.getItem('loginData');
      let loginData = JSON.parse(localData);
      loginData.userAddress = {
          address: results.formatted_address,
          location: { 
                      x: results.geometry.location.lat(),
                      y: results.geometry.location.lng(),
                      type: "Point",
                      coordinates: [ results.geometry.location.lat(), results.geometry.location.lng() ],
                    },
          placeId: results.place_id
      };
      localStorage.setItem("loginData",JSON.stringify(loginData));
  }

  callEditAddressApi(place){
      let self = this;
      self.props.onAddressChange(place) ;
  }

 	handleDrag = (e) => {
        console.log("Dragging pin--->" , e, e.latLng);
        var geocoder = new google.maps.Geocoder();
        let self = this;
        let pos = {lat: parseFloat(e.latLng.lat()), lng: parseFloat(e.latLng.lng())};
        let l = new window.google.maps.LatLng(pos);
        geocoder.geocode({location: l}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
              self.callEditAddressApi(results[0]);
            } else {
              console.log('No results found');
            }
          } else {
              console.log('Geocoder failed due to: ' + status);
          }
        });
    }


	render() {
		let self = this;
		let google = window.google;
		let svg = Pin;
	  	let icon = { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg), scaledSize: new google.maps.Size(50, 50) };
		let markers = <Marker key={"pin_" + self.state.position.lat+"_"+self.state.position.lng} 
                    position={self.state.position} 
            	draggable={true} icon={icon} title={this.state.label} 
            	onDragEnd={(event) => self.handleDrag(event)} />
        
        return <div>{markers}</div>;
	}
}
