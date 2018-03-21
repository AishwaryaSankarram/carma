import React, { Component } from 'react';
import Modal from 'react-modal';
import {Car} from './car.jsx';
import {MapContainer} from './map.jsx';
import {MyMapComponent} from '../components/map.jsx';
import {Header} from '../layouts/header.jsx';
// import {Footer} from '../layouts/footer.jsx';
import '../css/Hompage.css';
import {MyModal} from '../popup/Modal.jsx';
import {Profile} from '../popup/editProfile';
import axios from 'axios';
import Popover from "material-ui/Popover";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Mapicon from 'material-ui/svg-icons/maps/place';
import Logouticon from 'material-ui/svg-icons/action/power-settings-new';

const apiData = require('../utils/api.jsx');
const constants = require('../utils/constants.jsx');
const apiUrl = apiData.baseUrl;
const style = {
  popup: {
    display: "inline-block",
    float: "right",
    margin:"60px 0px 0px 10px",
    right:"0px",
    position:"absolute",
    align:"right"

    // margin: "16px 0px 16px 1200px"
  }
};


export default class HomePage extends Component {

  constructor(props) {
    super(props);
    this.loadCars = this.loadCars.bind(this);
    this.state = {
          islogout:false,
          modalIsOpen: false,
          cars: null, //For drawing car icons based on no.of cars set
          count: undefined,
          selectedCar: {},
          sourceCar: {},
          mapOpen: false,
          dialogVisible: false,
          action: {},
          modalHeading: "",
          isEditing: false,
          isMenuOpen:false
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.createCar = this.createCar.bind(this);
    this.displayCars = this.displayCars.bind(this);
    this.showMap = this.showMap.bind(this);
    this.updateCarProps = this.updateCarProps.bind(this);
    this.updateRoute = this.updateRoute.bind(this);
    this.cloneCar = this.cloneCar.bind(this);
    this.editCar = this.editCar.bind(this);
    this.logout = this.logout.bind(this);
    this.menuClick = this.menuClick.bind(this);

    this.displayContent = this.displayContent.bind(this);
    this.updateCarPanel = this.updateCarPanel.bind(this);
    this.displayRoutes = this.displayRoutes.bind(this);
    this.deleteCar = this.deleteCar.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleProfileSave = this.handleProfileSave.bind(this);
  }

  loadCars(){
    let self = this;
    const localData=localStorage.getItem("loginData");
    const password=localStorage.getItem("pwd");
    console.log("localData---->", localData);
    const header = JSON.parse(localData);
    let apiBaseUrl = apiUrl + 'granular/getGranularPoints/';
    let params = { page: 0, size: 10};
    let auth = { username: header.uuid, password: password  }
     axios.get(apiBaseUrl + header.id, {params: params, auth: auth}).then(function (response) {
         console.log(response);
         if(response.status === 200){
          console.log("Get Cars Hit successful");
          let cars = self.formCarArray(response.data);
          self.setState({cars: cars, count: cars.length});
         }
         else{
          console.log("Oops...! Get Cars failed with--------" + response.status);
          self.setState({cars: [], count: 0});
         }
           
      }).catch(function (error) {
          self.setState({cars: [], count: 0});
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
            c.speed = c.poly[0].speed;
            c.poly.forEach(function(p) {
               poly.push({lat: parseFloat(p.lat), lng: parseFloat(p.lng), speed: p.speed});
            });
            c.poly = poly;
            c.drawPolyline = true;
            c.markerCount = 2;
            c.showMarker = true;
            c.color = c.color || constants.color_codes[i % 10];
            let last_index = poly.length -1;
            c.markers = [];
            if(poly.length > 0){
              c.markers.push({lat: poly[0].lat, lng: poly[0].lng});
              c.markers.push({lat: poly[last_index].lat, lng: poly[last_index].lng});
            }
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
    this.setState({modalIsOpen: true, sourceCar: {}});
  }

  closeModal() {
    this.setState({modalIsOpen: false, sourceCar: {}});
  }

  createCar(carData){
    if(this.state.isEditing){
      console.log("Updating a car");
      this.updateCarProps(carData);
    }else{
      console.log("Creating a car");
      this.closeModal();
      let oldCars = this.state.cars;
      let oldCount = this.state.count;
      let index = oldCount;

      if(carData.useAsEv){
        oldCars.forEach(function(c){
          c.useAsEv = false;
        });
      }
      if(oldCount > 0){
        let oldColor = oldCars[oldCount -1].color;
        let oldIndex = constants.color_codes.indexOf(oldColor);
        if(oldIndex !== oldCount -1){
          index = oldIndex + 1;
        }
      }
      carData.carId = carData.carLabel;  
      carData.color = constants.color_codes[index % 10];
      oldCars.push(carData);
      let newCount = oldCount + 1;
      this.setState({cars: oldCars, count: newCount, selectedCar: carData, mapOpen: true});
    }
  }

  showMap(e) {
    let carId = typeof e.target.dataset.carid === 'undefined' ? e.target.parentElement.dataset.carid : e.target.dataset.carid;
    console.log("Display map for the selected car---------",  carId);
    if(typeof carId !== 'undefined' && carId != null){
      let cars = this.state.cars;
      let selectedCar = cars.filter(function(car) {
         return car.carId === carId;
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

  closeDialog(){
    console.log("Comes to cancelAction------------");
    this.setState({dialogVisible: false, action: {}, modalHeading: ""});
  }

  deleteCar(car){
    let self = this;
    let carLabel = car.carLabel ;
    console.log("carid==>"+car.carId);
    let confimation = "Do you want to delete " + carLabel + " ?";
    self.setState({dialogVisible: true, action: this.handleDelete, message: confimation, modalHeading: "Delete Car" });
  }

  handleDelete(car){
     console.log("Comes to delete------------");
     let self = this;
     let carId = car.carId;
    const localData=localStorage.getItem("loginData");
    const password=localStorage.getItem("pwd");
      const header = JSON.parse(localData);    
     if(car.isSaved){
          let url = apiUrl + 'granular/deleteCarDetails/' + header.id + '?carId=' + carId;
          let auth = { username: header.uuid, password: password  };
          axios.delete(url, { auth: auth}).then(function (response) {
            console.log(response);
             if(response.status === 200){
                console.log("Delete Cars Hit successful");
                self.updateCarPanel(carId, self);
                self.forceUpdate();
            }
             else{
              console.log("Oops...! Get Cars failed with--------" + response.status);
             }
        }).catch(function (error) {
                console.log("The error is------------" + error);
        });
      }else{
          self.updateCarPanel(carId, self);
      }
  }

  updateCarPanel(carId, self){
      console.log("Updating cars------------");
      let oldCars = self.state.cars;
      let newCars = [], carIndex;
      oldCars.forEach(function(car, index) {
          car.carId !== carId ? newCars.push(car) : carIndex = index ;
       });
      let oldCount = self.state.count;
      let newCount = oldCount- 1;
      if(newCount === 0){
        self.setState({cars: newCars, count: newCount, selectedCar: {}, mapOpen: false, dialogVisible: false});
      }else{
         //condition if the focus car is deleted
        // let selCar = (self.state.selectedCar.carId == carId) ? newCars[newCount -1] : self.state.selectedCar ;
        let selCar = (newCount === carIndex) ? newCars[newCount -1] : newCars[carIndex]
        self.setState({cars: newCars, count: newCount, selectedCar: selCar, dialogVisible: false});
      }
      console.log("Updating cars complete------------");
  }

  editCar(event, car){
    let self=this;
    self.setState({isEditing: true, modalIsOpen: true, selectedCar: car});
  }

  displayCars(){
     console.log("displaying cars---------");
     let buttons = [];
     for(let i = 0; i < this.state.count ; i++) {
            let car = this.state.cars[i];
            // let t = (car === this.state.selectedCar) ? 'car_active ' : '' ;
            let cloneIcon = (car.isSaved && car === this.state.selectedCar) ?  'car_active ' : '' ;
            let activeClass = ( car === this.state.selectedCar )? ' car_selected' : '';
            let showDelete = ( car === this.state.selectedCar )? ' ' : ' hide';
            let colorClass = constants.color_classes[constants.color_codes.indexOf(car.color)];
            let btnHtml = <div key={'div_' + car.carId}  className={"car-btn "+ cloneIcon + colorClass + activeClass}>
                        <button key={'btn_' + car.carId} data-carid={car.carId}
                       className={"pull-left load_car " } onClick={this.showMap} onDoubleClick={(event) => this.editCar(event, car)}>
                       <div className="fa fa-car "></div>
                       <div className="car_name_no">{this.state.cars[i].carLabel} </div></button>
                       <i key={'icon_' + car.carId} title="Copy" className='fa fa-copy new_car_copy ' onClick={() => this.cloneCar(car)}></i>
                       <i key={'icon_trash_' + car.carId} title="Delete" className={'fa fa-trash-o car_item_delete' + showDelete}
                        onClick={() => this.deleteCar(car)} ></i>
                       </div>
            buttons.push(
               btnHtml
            );
     }
    return <div id="car-panel">{buttons}</div> || null;
    //EOF
  }

  updateCarProps(car){
     let self = this;
     self.closeModal();
     let cars = self.state.cars;
     cars.forEach(function(c){
      if(c.carId === car.carId){
        c.carLabel = car.carLabel;
        c.speed = car.speed;
        c.useAsEv = car.useAsEv;
      }
      if(car.useAsEv && c.carId !== car.carId){
        c.useAsEv = false;
      }
     });
     self.setState({cars: cars, isEditing: false, mapOpen: true});
  }

  updateRoute(car, isRest) {
      let self = this;
      const cars = this.state.cars;
      for(let index=0; index<cars.length; index ++){
        if(cars[index].carLabel === car.carLabel){
            cars[index] = car;
            break;
        }
      }
      this.setState({
        cars: cars, showHeader: isRest
      });
      if(isRest){
       setTimeout(function(){
          self.setState({showHeader: false});
        }, 5000);
      }
  }

  drawMap(){
  	let routes = [];
    let self = this;
		let cars = this.state.cars;
		let savedCars = cars.filter(function(car) {
       	return car.isSaved && car.carId !== self.state.selectedCar.carId;
     });
    const localData=localStorage.getItem("loginData");
    const password=localStorage.getItem("pwd");
    console.log("localData---->", localData);
    routes = this.getRoutes(savedCars);
    return <MapContainer car={this.state.selectedCar} updateCar={this.updateRoute} routes={routes} loginData={localData} pwd={password} />;
    //
  }

  displayRoutes(){
    this.setState({mapOpen: false, selectedCar: {}});
  }

  logout() {
    let confimation = "Are you sure you would want to log out ?";
    this.setState({dialogVisible: true, action: this.handleLogout, message: confimation, modalHeading: "Log Out"});
  }

  handleLogout(){
    console.log("Comes to logout---------");
    localStorage.clear();
    console.log("local storage cleared---------");
    this.setState({islogout:true})
    console.log("go to login---------");
    window.location.reload();
  }

  getRoutes(cars){
    let routes = [];
    cars.forEach(function(car){
      let route = car.poly;
      if(route.length > 0){
        route[0].carLabel = car.carLabel;
        route[0].color = car.color;
        route[0].markerPos = [car.poly[0], car.poly[car.poly.length -1]];
        routes.push(route);
      }
    });
    return routes;
  } 

  getBounds(routeArray){
    var latLngBounds = new window.google.maps.LatLngBounds();
    for(let i=0; i<routeArray.length;i++){
      let routes = routeArray[i];//[0].markerPos;
      routes.forEach(function(e){
        latLngBounds.extend(new window.google.maps.LatLng({ lat:e.lat, lng: e.lng}));     
      });
    }
    return latLngBounds;
  }

  displayContent(){
    let content;
    let mapCenter = apiData.mapCenter;
    if(this.state.mapOpen){
      console.log("Displaying content for car-------");
      content = this.drawMap();
    }else{
      let cars = this.state.cars;
      let routes = [];
      let bounds;
      let mapHeader = "";
      let savedCars = cars.filter(function(car) {
          return car.isSaved;
       });
       if(savedCars.length > 0){ /* Whether to view routes or display disabled map*/
          routes = this.getRoutes(savedCars);
          // console.log("Routes-------------------->" , routes);
          bounds = this.getBounds(routes);
          mapCenter = routes[0][0];
          mapHeader = "Displaying routes for saved cars"
          console.log("Displaying routes for saved cars-------");
       }else{
           const constants = require("../utils/constants.jsx"); 
           let defLatLng = constants.bounds; //Using bounds from constants
           bounds = new window.google.maps.LatLngBounds();
           defLatLng.forEach(function(point){
              bounds.extend(new window.google.maps.LatLng({ lat:point.lat, lng: point.lng}));
           });
           console.log("Displaying disabled true map-------");
       }
       console.error("Bounds value===========>"+bounds);
        content = <div className="gMap"><div className="clearfix map_view"><div className="pull-left route_label">{mapHeader} </div> 
        </div><MyMapComponent disabled="true" routes={routes} mapCenter={mapCenter} bounds={bounds}/></div>
     }
      return content;
  }

  menuClick (){
    // This prevents ghost click.
    // this.props.preventDefault();
    console.log("menuclick called==>");
    this.setState({
      isMenuOpen: true,
      // anchorEl: event.currentTarget,
    });
 }

 handleRequestClose = () => {
    this.setState({
      isMenuOpen: false,
    });
 }

  signOutPopupClicked=()=>{
    console.log("entered");
    this.handleRequestClose();
    this.logout();
  }

  showProfile(){
    const localData=localStorage.getItem("loginData");
    const password=localStorage.getItem("pwd");
    console.log("localData---->", localData);
    const header = JSON.parse(localData);

    var content = <Profile saveAction={this.handleProfileSave} cancelAction={this.closeDialog} loginData={header} pwd={password}/>;
    //
    this.setState({isMenuOpen: false, dialogVisible: true, action: null, modalHeading: "Edit Profile Settings", message: content});
  }

  handleProfileSave(){
    this.setState({dialogVisible: false, action: "", modalHeading: "", message: ""});
  }

 render() {
    console.info("Rendering HomePage--------------");
    return (
      <div className="App">
        {<Header onBtnClick={this.openModal} menuClickIns={this.menuClick} viewRoutes={this.displayRoutes}/>}
             {this.state.dialogVisible &&
          <MyModal title={this.state.modalHeading} modalIsOpen={this.state.dialogVisible} content={this.state.message}
          okAction={this.state.action} cancelAction={this.closeDialog} data={this.state.selectedCar}  />}
        {this.state.cars && this.displayCars()}
        {this.state.showHeader && <div className="alert-success" id="hideMe">Route for {this.state.selectedCar.carLabel} has been saved</div> }
        {this.state.modalIsOpen && <Modal isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          shouldCloseOnOverlayClick={false}
          contentLabel="Car Details" className="car-details">
          <div className="modal-title" ref={subtitle => this.subtitle = subtitle}>Car Details</div>
            <div className="modal-body"> 
              <Car onSave={this.createCar} carIndex={this.state.count} 
              sourceCar={this.state.sourceCar} onClose={this.closeModal}
              car={this.state.isEditing && this.state.selectedCar}/>
            </div>
        </Modal> }
         <MuiThemeProvider >
          <Popover className="menu_header" style={style.popup}
          open={this.state.isMenuOpen}
          autoCloseWhenOffScreen={true}
          canAutoPosition={true}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          // targetOrigin={{horizontal: 'right', vertical: 'left'}}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          onRequestClose={this.handleRequestClose}>
          <Menu >
            <MenuItem primaryText="Edit address" leftIcon={<Mapicon/>} onClick={this.showProfile.bind(this)}/>
            <MenuItem primaryText="Sign out" leftIcon={<Logouticon/>} onClick={this.signOutPopupClicked} />
          </Menu>
        </Popover>
        </MuiThemeProvider>
        {this.state.cars && this.displayContent()}
      </div>
    );
  }
}
