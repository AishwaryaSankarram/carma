import React, {Component} from 'react';
import Modal from 'react-modal';
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import {MuiThemeProvider,RaisedButton}  from 'material-ui';
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
	   	<Modal isOpen={this.state.modalIsOpen}
	         contentLabel={this.props.title} className="speed-collector">
	         <MuiThemeProvider>
	         <div className="confirmation-modal">
	         <div className="modal-title">
	         <h4 ref={subtitle => this.subtitle = subtitle}>{this.props.title}
	         </h4>
	         </div>
	         	<form onSubmit={this.onSave}>
	         	<div className="modal-body">
	           <FormGroup controlId="speed" bsSize="sm">
	               <ControlLabel>Speed at the point</ControlLabel>
	               <FormControl
	                 autoFocus
	                 type="text"
	                 value={this.state.speed}
	                 placeholder="Miles per hour"
	                 onChange={this.handleChange}
	               />
	             </FormGroup>
	             </div>
	             <div className="modal-footer">
		   	      		<RaisedButton className="action-btns" label="OK" primary={true} type="submit"  onClick={this.onSave}/>
		   	      		<RaisedButton className="action-btns" label="Cancel" onClick={this.closeModal}/>
		         </div>
	             </form>
	         </div>
	         </MuiThemeProvider>
	   	</Modal> 
   	);
   }

}