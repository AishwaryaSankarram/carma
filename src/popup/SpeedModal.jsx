import React, {Component} from 'react';
import Modal from 'react-modal';
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import {MuiThemeProvider}  from 'material-ui';
import '../css/modal.css';

export class SpeedModal extends Component {
  
  constructor(props){
		super(props);
		this.state = {
			modalIsOpen: this.props.modalIsOpen, 
			speed: this.props.speed || ""
		};
	this.closeModal = this.closeModal.bind(this);
	this.onSave = this.onSave.bind(this);
  }

  componentWillMount() {
    Modal.setAppElement('div');
  }

  closeModal() {
  	this.setState({modalIsOpen: false});
    this.props.cancelAction();
  }

  onSave = (event) => {
  	event.preventDefault();
    this.setState({modalIsOpen: false});
    this.props.okAction(this.state.speed, this.props.vertex);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  render(){
   	return (
	   	<Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}
	         contentLabel={this.props.title} className="speed-collector">
	         <MuiThemeProvider>
	         <form onSubmit={this.onSave}>
	           <FormGroup controlId="speed" bsSize="sm">
	               <ControlLabel>Speed</ControlLabel>
	               <FormControl
	                 autoFocus
	                 type="text"
	                 maxLength={3}
	                 style={{width: "50px"}}
	                 value={this.state.speed}
	                 placeholder="Miles per hour"
	                 onChange={this.handleChange}
	                 onKeyPress={this.onKeyPress}
	               />
	             </FormGroup>
	             </form>
	         </MuiThemeProvider>
	   	</Modal> 
   	);
   }

}