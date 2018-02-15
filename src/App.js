import React, { Component } from 'react';
import Modal from 'react-modal';
import {Car} from './containers/car';
import {MapContainer} from './containers/map';
import {Header} from './layouts/header';
import {Footer} from './layouts/footer';
import './App.css';

class App extends Component {


  constructor(props) {
    super(props);
      this.state = {
      modalIsOpen: false,
      cars: [], //For drawing car icons based on no.of cars set
      count: 0,
      selectedCar: {},
      mapOpen: false
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.createCar = this.createCar.bind(this);
    this.displayCars = this.displayCars.bind(this);
    this.showMap = this.showMap.bind(this);
    this.updateCar = this.updateCar.bind(this);

  }

  openModal() {
     this.setState({modalIsOpen: true})
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  createCar(carData){ 
    console.log("Creating a car");
    this.closeModal();
    let oldCars = this.state.cars;
    oldCars.push(carData);
    let oldCount = this.state.count;
    let newCount = oldCount + 1;
    this.setState({cars: oldCars, count: newCount});
  }

  showMap(e) {
    console.log("Display map for the selected car---------",  e.target.dataset.carid);
    let carId = e.target.dataset.carid;
    let cars = this.state.cars;
    let selectedCar = cars.filter(function(car) {
       return car.carId  === carId;
     })[0];
    console.log(selectedCar);
    this.setState({mapOpen: true, selectedCar: selectedCar});
  }

  componentWillMount() {
    Modal.setAppElement('div');
  }

  displayCars(){ 
     let buttons = [];
     for(let i = 0; i < this.state.count ; i++) {
               buttons.push(
               <button key={this.state.cars[i].carId} data-carid={this.state.cars[i].carId}  className="pull-left fa fa-car" onClick={this.showMap}> Car - {this.state.cars[i].carId} </button>
            );
     }
    return <div id="car-panel">{buttons}</div> || null;
  }

  updateCar(car) {
      const cars = this.state.cars;
      cars.map((obj) => {
      if(obj.carId === car.carId){
          obj = car;
          return obj;
        }
      });
      this.setState({
        cars: cars
      });
  }

  drawMap(){
    return <MapContainer car={this.state.selectedCar} updateCar={this.updateCar}/>;
  }

 render() {
    return (
      <div className="App">
        {<Header />}
        <button onClick={this.openModal} className="new_car"><i className="fa fa-plus">Add Car</i></button>
        {this.displayCars()}
        <Modal isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Car Details">
          <h2 ref={subtitle => this.subtitle = subtitle}>Car Details
          <button className="btn btn-xs pull-right remove icon-close" onClick={this.closeModal}>Close</button>
          </h2>
            <Car onSave={this.createCar}/>

        </Modal>
        {this.state.mapOpen ?  this.drawMap() :  null}
        {<Footer />}
      </div>
    );
  }
}
export default App;

