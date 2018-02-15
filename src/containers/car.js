import React, {Component} from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
//import axios from 'axios';
import './car.css';

export class Car extends Component {
	constructor(props) {
    super(props);
    this.state = { //ToDo: Remove this prefilling towards the end. Currently aids quicker testing.
      carId:"",
	  stepSize:"1",
	  startAtSec:"4434353452300",
	  /*poly:[ 
	  {"lat":13.035177,
     	"lng":80.230191    
    },    {"lat":13.037518,
     "lng":80.230921    
    }],*/
    v2xServer:"192.168.1.17",
    gpsCanServer:"192.168.1.17",
    remoteIp: "192.168.1.9",
    remotePath:"/tmp/",
    remotePass:"carma123",
    remoteUser:"mohamed"
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
    this.props.onSave(this.state);
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
          <FormGroup controlId="stepSize" bsSize="large">
            <ControlLabel>Step Size</ControlLabel>
            <FormControl
              type="text"
              value={this.state.stepSize}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="startAtSec" bsSize="large">
            <ControlLabel>Start At Seconds</ControlLabel>
            <FormControl
              type="text"
              value={this.state.startAtSec}
              onChange={this.handleChange}
            />
          </FormGroup>
		      <FormGroup controlId="v2xServer" bsSize="large">
            <ControlLabel>IP of the V2X Server</ControlLabel>
            <FormControl
              type="text"
              value={this.state.v2xServer}
              onChange={this.handleChange}
            />
          </FormGroup>          

          <FormGroup controlId="gpsCanServer" bsSize="large">
            <ControlLabel>GPS Server</ControlLabel>
            <FormControl
              type="text"
              value={this.state.gpsCanServer}
              onChange={this.handleChange}
            />
          </FormGroup>

          <FormGroup controlId="remoteIp" bsSize="large">
            <ControlLabel>Repository IP</ControlLabel>
            <FormControl
              type="text"
              value={this.state.remoteIp}
              onChange={this.handleChange}
            />
          </FormGroup>

          <FormGroup controlId="remotePath" bsSize="large">
            <ControlLabel>Remote Path</ControlLabel>
            <FormControl
              type="text"
              value={this.state.remotePath}
              onChange={this.handleChange}
            />
          </FormGroup>

          <FormGroup controlId="remoteUser" bsSize="large">
            <ControlLabel>Remote User</ControlLabel>
            <FormControl
              type="text"
              value={this.state.remoteUser}
              onChange={this.handleChange}
            />
          </FormGroup>

          <FormGroup controlId="remotePass" bsSize="large">
            <ControlLabel>Remote User Password</ControlLabel>
            <FormControl
              value={this.state.remotePass}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>

          <Button
            block
            bsSize="sm"
            bsStyle="primary"
            disabled={!this.validateForm()}
            type="submit">
            Submit
          </Button>
        </form>
      </div>
    );
  }
}