import React, { Component } from 'react';
import Modal from 'react-modal';
import {Car} from './containers/car';
import './App.css';

class App extends Component {


  constructor(props) {
    super(props);
      this.state = {
      modalIsOpen: false,
      cars: [], //For drawing car icons based on no.of cars set
      count: 0
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.createCar = this.createCar.bind(this);
    this.displayCars = this.displayCars.bind(this);
    this.showMap = this.showMap.bind(this);

  }

  openModal() {
     this.setState({modalIsOpen: true})
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  createCar(carData){ //Causes a state change on form submit of a car ---> ToDo: Doesn't re-rerender the page
    console.log("Creating a car");
    this.closeModal();
    let oldCars = this.state.cars;
    oldCars.push(carData.carId);
    let oldCount = this.state.count;
    let newCount = oldCount + 1;
    this.setState({cars: oldCars, count: newCount});
  }

  showMap() {
    console.log("Display map for the selected car---------");
  }

  componentWillMount() {
    Modal.setAppElement('div');
  }

  displayCars(){  //---> ToDo: Doesn't re-rerender the page --Check
     let buttons = [];
     for(let i = 0; i < this.state.count ; i++) {
               buttons.push(
               <button key={i} className="pull-left" onClick={this.showMap}>Car - {this.state.cars[i]} </button>
            );
     }
    return <div id="test">{buttons}</div> || null;
  }

 render() {
    return (
      <div className="App">
        <button onClick={this.openModal}>Add Car</button>
        {this.displayCars()}
        <Modal isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Car Details">
          <h2 ref={subtitle => this.subtitle = subtitle}>Car Details
          <button className="btn btn-xs pull-right remove icon-close" onClick={this.closeModal}>Close</button>
          </h2>
            <Car onSave={this.createCar}/>
        </Modal>
      </div>
    );
  }
}
export default App;

