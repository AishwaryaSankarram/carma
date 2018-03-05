import React, {Component} from 'react';
import { Button, FormGroup, FormControl, ControlLabel,Checkbox } from "react-bootstrap";
//import axios from 'axios';
import '../css/car.css';
const apiData = require('../utils/api.jsx');


export class Car extends Component {
	constructor(props) {
    super(props);
    let carId = this.props.sourceCar.carId ? this.props.sourceCar.carId + "_1" : "";
    carId = carId.length === 0 ? this.props.carId || "" : carId ;
    let speed = this.props.sourceCar.speed || "";
    speed = speed.length === 0 ? this.props.speed || ""  : speed ;
    this.state = { 
      carId: carId,
	    speed: speed,
      useAsEv: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateForm() {
    return true; //TODO: Validations for the form
  }

  handleChange = (event, item) => {
    if(item){
      this.setState({
        [item]: event.target.checked
      });
    }else{
      this.setState({
        [event.target.id]: event.target.value
      });  
    }
    
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
      remoteIp: apiData.remoteIp,
      remotePath:apiData.remotePath,
      remotePass:apiData.remotePass,
      remoteUser:apiData.remoteUser
    };  
    let sourceCar = this.props.sourceCar;
    if(Object.keys(sourceCar).length > 0){
      defaultParams = Object.assign(defaultParams, sourceCar); //Adding old car params
      //Following params will have to be updated for new car
      defaultParams.startAtSec =  new Date().getTime();
      defaultParams.v2xServer = v2xServers[this.props.carIndex % 5];
      defaultParams.gpsCanServer = gpsCanServers[this.props.carIndex % 5];
      defaultParams.isSaved = false;
    }
    let carData = Object.assign(defaultParams, this.state); //Adding current params
    console.log("saving carData------" , carData);
    this.props.onSave(carData);
  }

  handleCancel(){
    this.props.onClose();
  }

  render() {
    return (
      <div className="Car">
        <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="carId" bsSize="sm">
            <ControlLabel>Car Label</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.carId}
              placeholder="Car Label"
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="speed" bsSize="sm">
            <ControlLabel>Initial Speed</ControlLabel>
            <FormControl
              type="text"
              value={this.state.speed}
              placeholder="Miles per hour"
              onChange={this.handleChange}
            />
            </FormGroup>        
          <Checkbox checked={this.state.useAsEv} onChange={(event) => this.handleChange(event, "useAsEv")}>Use as EV </Checkbox> 
          <Button
            block
            bsSize="sm"
            bsStyle="primary"
            disabled={!this.validateForm()}
            type="submit">
            Save
          </Button>
          <Button
            block
            bsSize="sm"
            bsStyle="default" onClick={this.handleCancel}
            type="button">
            Cancel
          </Button>
        </form>
      </div>
    );
  }
}