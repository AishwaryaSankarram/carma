import React,{Component} from 'react';
import { Marker } from "react-google-maps";
import axios from 'axios';
import Pin from '../images/pin';

let google = window.google;
const apiData = require('../utils/api.jsx');
const apiUrl = apiData.baseUrl;

export class MyPin extends Component {
	
    constructor(props) {
		super(props);
        this.state = {
            label: this.props.loginData.userAddress ? this.props.loginData.userAddress.address : "" ,
            placeId: this.props.loginData.userAddress ? this.props.loginData.userAddress.placeId : "",
            position: this.props.loginData.userAddress ? 
                        {lat: this.props.loginData.userAddress.location.coordinates[0], 
                         lng: this.props.loginData.userAddress.location.coordinates[1] } 
                        : {}        
        };
        this.handleDrag = this.handleDrag.bind(this);
	    this.callEditAddressApi = this.callEditAddressApi.bind(this);
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
        const apiBaseUrl = apiUrl;
        let payload = {
           userAddress: {
             address: place.formatted_address,
             placeId: place.place_id,
             location: {type:"point", coordinates:[place.geometry.location.lat(),place.geometry.location.lng()]}
           }
        };
        const localData = localStorage.getItem('loginData');
        const loginData = JSON.parse(localData);
           let config = {
             auth: {
               username: loginData.uuid,
               password: self.props.loginData.pwd
            }
        };
        console.log("payload : " , payload);
        axios.put(apiBaseUrl + 'granular/updateAddress', payload, config).then(function (response) {
            console.log(response);
            if(response.status === 200){
                self.updateLocalStorage(place) ;
                self.setState({
                    placeId: place.place_id,
                    position: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
                    label: place.formatted_address
                });
             }else{
                console.log("some error ocurred",response.status);
                self.setState({
                    label: loginData.userAddress ? loginData.userAddress.address : "" ,
                    placeId: loginData.userAddress ? loginData.userAddress.placeId : "",
                    position: loginData.userAddress ? 
                        {lat: loginData.userAddress.location.coordinates[0], 
                         lng: loginData.userAddress.location.coordinates[1] } 
                        : {}  
                });
             }
        }).catch(function (error) {
            console.log("Catch block------", error);
            self.setState({
                    label: loginData.userAddress ? loginData.userAddress.address : "" ,
                    placeId: loginData.userAddress ? loginData.userAddress.placeId : "",
                    position: loginData.userAddress ? 
                        {lat: loginData.userAddress.location.coordinates[0], 
                         lng: loginData.userAddress.location.coordinates[1] } 
                        : {}  
            });
        });
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
