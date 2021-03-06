import React, { Component } from 'react';
import Modal from 'react-modal';
import {Car} from './containers/car';
import {MapContainer} from './containers/map';
import {MyMapComponent} from './components/map';
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
    let carId = typeof e.target.dataset.carid === 'undefined' ? e.target.parentElement.dataset.carid : e.target.dataset.carid;
    if(typeof carId !== 'undefined' && carId != null){
      let cars = this.state.cars;
      let selectedCar = cars.filter(function(car) {
         return car.carId  === carId;
       })[0];
      console.log(selectedCar);
      this.setState({mapOpen: true, selectedCar: selectedCar});
    }
  }

  componentWillMount() {
    Modal.setAppElement('div');
  }

  displayCars(){ 
    console.log("displaying cars---------");
     let buttons = [];
     for(let i = 0; i < this.state.count ; i++) {
            let t = (this.state.cars[i] === this.state.selectedCar) ? 'green' : '' ;
            buttons.push(
               <button key={this.state.cars[i].carId} data-carid={this.state.cars[i].carId} 
                       className={"pull-left load_car " + t} onClick={this.showMap}>
                   <div className="fa fa-car"></div>
                   <div className="car_name_no">Car {this.state.cars[i].carId} </div>
              </button>
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
        {<Header onBtnClick={this.openModal}/>}
        {this.displayCars()}
        <Modal isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          shouldCloseOnOverlayClick={false} 
          contentLabel="Car Details">
          <div className="modal-title" ref={subtitle => this.subtitle = subtitle}>Car Details
          <div className="modal-close"> <button className="pull-right remove icon-close fa fa-close" onClick={this.closeModal}><div></div></button></div>
          </div>
            <Car onSave={this.createCar} carIndex={this.state.count}/>
        </Modal>
        {this.state.mapOpen ?  this.drawMap() :  <MyMapComponent disabled="true" />}
        {<Footer />}
      </div>
    );
  }
}
export default App;

