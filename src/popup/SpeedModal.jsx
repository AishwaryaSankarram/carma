import React, {Component} from 'react';
import Modal from 'react-modal';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
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
	         onRequestClose={this.closeModal}
	         contentLabel={this.props.title} className="speed-collector">
	         <div className="confirmation-modal">
	         <div className="modal-title">
	         <h4 ref={subtitle => this.subtitle = subtitle}>{this.props.title}
	         <button className="btn btn-xs pull-right remove icon-close" onClick={this.closeModal}>Close</button>
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
		   	      <div className="btn-grp">
		             	<Button bsSize="sm" bsStyle="success" type="submit"> OK </Button>
		             	<Button bsSize="sm" onClick={this.closeModal} type="button"> Cancel </Button>
		           </div>
		           </div>
	             </form>
	         </div>
	   	</Modal> 
   	);
   }

}