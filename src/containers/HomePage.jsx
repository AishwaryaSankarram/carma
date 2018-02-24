import React, { Component } from 'react';
import Modal from 'react-modal';
import {Car} from './car.jsx';
import {MapContainer} from './map.jsx';
import {MyMapComponent} from '../components/map.jsx';
import {Header} from '../layouts/header.jsx';
import {Footer} from '../layouts/footer.jsx';
import '../css/Hompage.css';
import Login from './LoginPage.jsx'
import axios from 'axios';
const apiData = require('../utils/api.jsx');
const constants = require('../utils/constants.jsx');
const apiUrl = apiData.baseUrl;

export default class HomePage extends Component {

  constructor(props) {
    super(props);
    this.loadCars = this.loadCars.bind(this);
    this.state = {
          islogout:false,
          modalIsOpen: false,
          cars: this.props.cars, //For drawing car icons based on no.of cars set
          count: this.props.count,
          selectedCar: {},
          sourceCar: {},
          mapOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.createCar = this.createCar.bind(this);
    this.displayCars = this.displayCars.bind(this);
    this.showMap = this.showMap.bind(this);
    this.updateCar = this.updateCar.bind(this);
    this.cloneCar = this.cloneCar.bind(this);
    this.logout=this.logout.bind(this);
    this.displayContent=this.displayContent.bind(this);
    this.displayRoutes=this.displayRoutes.bind(this);
  }

  loadCars(){
    let self = this;
    // let localData=localStorage.getItem("loginData");
    // let password=localStorage.getItem("pwd");
    // let header = JSON.parse(localData);
    const localData=localStorage.getItem("loginData");
    const password=localStorage.getItem("pwd");
    console.log("Component bef render---->", localData);
    const header = JSON.parse(localData);

    let apiBaseUrl = apiUrl + 'granular/getGranularPoints/';
    let params = { page: 0, size: 10};
    let auth = { username: header.uuid, password: password  }
     axios.get(apiBaseUrl + header.id, {params: params, auth: auth}).then(function (response) {
          console.log(response);
          let cars = self.formCarArray(response.data);
           if(response.status === 200){
            console.log("Get Cars Hit successful");
           }
           else{
            console.log("Oops...! Get Cars failed with--------" + response.status);
           }
           self.setState({cars: cars, count: cars.length});
      }).catch(function (error) {
              console.log("The error is------------", error);
      });
  }


  formCarArray(cars){
      let carArray= [], ids = [];
      for(let i=0; i< cars.length; i++){
          let c=cars[i];
          if(ids.indexOf(c.carId) === -1){
            c.isSaved=true;
            let poly = [];
            c.poly.map(function(p) {
                if(p.parent){
                  poly.push({lat: parseFloat(p.lat), lng: parseFloat(p.lng)});
                }
            });
            c.poly = poly;
            c.drawPolyline = true;
            c.markerCount = 2;
            c.showMarker = true;
            c.color = constants.color_codes[i % 10];
            let last_index = poly.length -1;
            c.markers = [];
            c.markers.push({lat: poly[0].lat, lng: poly[0].lng});
            c.markers.push({lat: poly[last_index].lat, lng: poly[last_index].lng});
            carArray.push(c);
            ids.push(c.carId);
          }
      }
      return carArray;
    }

  componentWillReceiveProps(nextProps){
      if(nextProps.cars && nextProps.cars !== this.props.cars) {
        this.setState({cars: nextProps.cars, count: nextProps.count});
      }else{
        this.loadCars();
      }
  }

  openModal() {
     this.setState({modalIsOpen: true, sourceCar: {}})
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  createCar(carData){
    console.log("Creating a car");
    this.closeModal();
    let oldCars = this.state.cars;
    let oldCount = this.state.count;
    carData.color = constants.color_codes[oldCount % 10];
    oldCars.push(carData);
    let newCount = oldCount + 1;
    this.setState({cars: oldCars, count: newCount});
  }

  showMap(e) {
    let carId = typeof e.target.dataset.carid === 'undefined' ? e.target.parentElement.dataset.carid : e.target.dataset.carid;
    console.log("Display map for the selected car---------",  carId);
    if(typeof carId !== 'undefined' && carId != null){
      let cars = this.state.cars;
      let selectedCar = cars.filter(function(car) {
         return car.carId  == carId;
       })[0];
      console.log(selectedCar);
      this.setState({mapOpen: true, selectedCar: selectedCar});
    }
  }

  componentWillMount() {
    Modal.setAppElement('div');
    this.loadCars();
  }

  cloneCar(car) {
    this.setState({sourceCar: car, modalIsOpen: true});
  }

  deleteCar(car){
    const localData=localStorage.getItem("loginData");
    const password=localStorage.getItem("pwd");
    const header = JSON.parse(localData);

    let self = this;
    let url = apiUrl + 'granular/deleteCarDetails/'+ header.id+'?carId='+car.carId;
    let auth = { username: header.uuid, password: password  }
    console.log("carid==>"+car.carId);
    let confimation="Do you want to delete the car "+car.carId+" ?";
    let isDelete=confirm(confimation);
    if(isDelete){
      axios.delete(url, { auth: auth}).then(function (response) {
        console.log(response);
         if(response.status === 200){
          console.log("Get Cars Hit successful");
          // do the stuff after deleted....
          window.location.reload();
        }
         else{
          console.log("Oops...! Get Cars failed with--------" + response.status);
         }
    }).catch(function (error) {
            console.log("The error is------------", error);
    });
    }
    
  }

  displayCars(){
     console.log("displaying cars---------");
     let buttons = [];
     for(let i = 0; i < this.state.count ; i++) {
            let car = this.state.cars[i];
            // let t = (car === this.state.selectedCar) ? 'car_active ' : '' ;
            let cloneIcon = (car.isSaved && car === this.state.selectedCar) ?  'car_active ' : '' ;
            // let hideClass = (car.isSaved && car === this.state.selectedCar)? '' : '';
            let colorClass = constants.color_classes[constants.color_codes.indexOf(car.color)];
            let btnHtml = <div key={'div_' + car.carId}  className={"car-btn "+ cloneIcon + colorClass}>
                        <button key={'btn_' + car.carId} data-carid={car.carId}
                       className={"pull-left load_car " } onClick={this.showMap}><div className="fa fa-car "></div>
                       <div className="car_name_no">Car {this.state.cars[i].carId} </div></button>
                       <i key={'icon_' + car.carId} title="Copy" className='fa fa-copy new_car_copy ' onClick={() => this.cloneCar(car)}></i>
                       <i key={'icon_trash_' + car.carId} title="Delete" className='fa fa-trash-o car_item_delete '></i>
                       </div>
            buttons.push(
               btnHtml
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
    var loginData=localStorage.getItem("loginData");
    var password=localStorage.getItem("pwd");
  	let isSaved = this.state.selectedCar.isSaved ;
  	let routes = [];
    let self = this;
/*  	if(isSaved){
  		routes = [];
  	}else{*/
  		let cars = this.state.cars;
  		let savedCars = cars.filter(function(car) {
         	return car.isSaved && car.carId != self.state.selectedCar.carId;
       });
  		savedCars.map((car) => {
  			let route = car.poly;
  			route[0].carId = car.carId;
        route[0].color = car.color;
        route[0].markerPos = [car.poly[0], car.poly[car.poly.length -1]];
  			routes.push(route);
  		});
  	// }
    return <MapContainer car={this.state.selectedCar} updateCar={this.updateCar} routes={routes} loginData={loginData} pwd={password} />;
  }

  displayRoutes(){
    this.setState({mapOpen: false, selectedCar: {}});
  }

  logout(){
    localStorage.clear();
    console.log("local storage cleared---------");
    this.setState({islogout:true})
    console.log("go to login---------");
    window.location.reload();
  }

  displayContent(){
    let content;
    let mapCenter = apiData.mapCenter;
    if(this.state.mapOpen){
      content = this.drawMap();
    }else{
      let cars = this.state.cars;
      let routes = [];
      let mapHeader = "";
      let savedCars = cars.filter(function(car) {
          return car.isSaved;
       });
       if(savedCars.length > 0){ /* Whether to view routes or display disabled map*/
            savedCars.map((car) => {
              let route = car.poly;
              route[0].carId = car.carId;
              route[0].markerPos = [car.poly[0], car.poly[car.poly.length -1]];
              route[0].color = car.color;
              routes.push(route);
          });
          mapCenter = routes[0][0];
          mapHeader = "Displaying routes for saved cars"
       }
        content = <div className="gMap"><div className="clearfix map_view"><div className="pull-left route_label">{mapHeader} </div> </div><MyMapComponent disabled="true" routes={routes} mapCenter={mapCenter}/></div>
    }
      return content;
  }

 render() {
    return (
      <div className="App">
        {<Header onBtnClick={this.openModal} logout={this.logout} viewRoutes={this.displayRoutes}/>}
        {this.displayCars()}
        <Modal isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          shouldCloseOnOverlayClick={false}
          contentLabel="Car Details">
          <div className="modal-title" ref={subtitle => this.subtitle = subtitle}>Car Details
          <div className="modal-close"> <button className="pull-right remove icon-close fa fa-close" onClick={this.closeModal}><div></div></button></div>
          </div>
            <Car onSave={this.createCar} carIndex={this.state.count} sourceCar={this.state.sourceCar}/>
        </Modal>
        {this.displayContent()}
      </div>
    );
  }
}

HomePage.defaultProps = {
  cars: [],
  count: 0
};
