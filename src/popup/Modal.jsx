import React, {Component} from 'react';
import Modal from 'react-modal';
import { Button } from "react-bootstrap";
import '../css/modal.css';

export class MyModal extends Component {
	constructor(props){
		super(props);
		this.state = {
			modalIsOpen: this.props.modalIsOpen
		};
    this.closeModal = this.closeModal.bind(this);
    this.onSave = this.onSave.bind(this);
    this.handleClick = this.handleClick.bind(this);
	}

  componentWillMount() {
    Modal.setAppElement('div');
  }

	closeModal() {
  	this.setState({modalIsOpen: false});
    this.props.cancelAction();
  }

  onSave() {
    this.setState({modalIsOpen: false});
    this.props.okAction(this.props.data);
  }

  handleClick(){
   this.setState({modalIsOpen: false});
   this.props.addBtn(); 
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
              <div>{this.props.content}</div>
              <div className="btn-grp">
              <Button bsSize="sm" bsStyle="success" onClick={this.onSave} type="button"> {this.props.labelOk || "Yes"} </Button>
              {this.props.addBtn && <Button bsSize="sm" bsStyle="primary" onClick={this.handleClick} type="button"> {this.props.addBtnLabel} </Button>}
              <Button bsSize="sm" onClick={this.closeModal} type="button"> {this.props.labelCancel || "No"}  </Button>
              </div>
          </div>
    </Modal>
    );
	}

}