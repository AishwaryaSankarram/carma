import React, {Component} from 'react';
import Modal from 'react-modal';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import '../css/modal.css';

export class SpeedModal extends Component {
  
  constructor(props){
		super(props);
		this.state = {
			modalIsOpen: this.props.modalIsOpen, 
			speed: ""
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
	         contentLabel={this.props.title}>
	         <h2 ref={subtitle => this.subtitle = subtitle}>{this.props.title}
	         <button className="btn btn-xs pull-right remove icon-close" onClick={this.closeModal}>Close</button>
	         </h2>
	         <div>
	         	<form onSubmit={this.onSave}>
	           <FormGroup controlId="speed" bsSize="large">
	               <ControlLabel>Speed at the point</ControlLabel>
	               <FormControl
	                 autoFocus
	                 type="text"
	                 value={this.state.speed}
	                 placeholder="Miles per hour"
	                 onChange={this.handleChange}
	               />
	             </FormGroup>
		   	      <div className="btn-grp">
		             	<Button bsSize="sm" bsStyle="success" type="submit"> OK </Button>
		             	<Button bsSize="sm" onClick={this.closeModal} type="button"> Cancel </Button>
		           </div>
	             </form>
	         </div>
	   	</Modal> 
   	);
   }

}