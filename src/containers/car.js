import React, {Component} from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
//import axios from 'axios';
import './car.css';

export class Car extends Component {
	constructor(props) {
    super(props);
    this.state = { 
      carId:"",
	    speed: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateForm() {
    return true; //TODO: Validations for the form
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const gpsCanServers = ["192.168.1.74","192.168.1.75","192.168.1.76","192.168.1.77","192.168.1.78"];
    const v2xServers = ["192.168.1.64","192.168.1.65","192.168.1.66","192.168.1.67","192.168.1.68"];
    var defaultParams = {
      stepSize:"1",
      startAtSec: new Date().getTime(), 
      v2xServer: v2xServers[this.props.carIndex % 5],
      gpsCanServer: gpsCanServers[this.props.carIndex % 5],
      remoteIp: "192.168.1.17",
      remotePath:"/tmp/",
      remotePass:"Cis_123@co",
      remoteUser:"mouli"
    };  
    let sourceCar = this.props.sourceCar;
    if(Object.keys(sourceCar).length > 0){
      defaultParams = Object.assign(defaultParams, sourceCar); //Adding old car params
      //Following params will have to be updated for new car
      defaultParams.startAtSec =  new Date().getTime();
      defaultParams.v2xServer = v2xServers[this.props.carIndex % 5];
      defaultParams.gpsCanServer = gpsCanServers[this.props.carIndex % 5];
    }
    let carData = Object.assign(defaultParams, this.state); //Adding current params
    console.log("saving carData------" , carData);
    this.props.onSave(carData);
  }

  render() {
    return (
      <div className="Car">
        <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="carId" bsSize="large">
            <ControlLabel>Car ID</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.carId}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="speed" bsSize="large">
            <ControlLabel>Speed</ControlLabel>
            <FormControl
              type="text"
              value={this.state.speed}
              onChange={this.handleChange}
            />
            </FormGroup>
          <Button
            block
            bsSize="sm"
            bsStyle="primary"
            disabled={!this.validateForm()}
            type="submit">
            Save
          </Button>
        </form>
      </div>
    );
  }
}