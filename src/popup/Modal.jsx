import React, {Component} from 'react';
import Modal from 'react-modal';
import { Button } from "react-bootstrap";
import '../css/modal.css';

export class MyModal extends Component {
	constructor(props){
		super(props);
		this.state = {
			modalIsOpen: this.props.modalIsOpen,
      className: this.props.title.toLowerCase().replace(/\s/g, "-")
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
//className={)}
	render(){
		return (
		<Modal isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel={this.props.title} className={" " + this.state.className} >
					 <div className="confirmation-modal">
					<div className="modal-header">
					<h4 className="modal-title" ref={subtitle => this.subtitle = subtitle}>{this.props.title}</h4>
					<button className="btn btn-xs pull-right remove icon-close fa fa-close" onClick={this.closeModal}></button>
					</div>
          <div className="modal-body">
              {this.props.content}
							</div>
            <div className="modal-footer">
              <Button bsSize="sm" bsStyle="success" onClick={this.onSave} type="button"> {this.props.labelOk || "Yes"} </Button>
              {this.props.addBtn && <Button bsSize="sm" bsStyle="primary" onClick={this.handleClick} type="button"> {this.props.addBtnLabel} </Button>}
              <Button bsSize="sm" onClick={this.closeModal} type="button"> {this.props.labelCancel || "No"}  </Button>
              </div>
					</div>
    </Modal>
    );
	}

}
