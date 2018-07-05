import React, { Component } from 'react';
import Modal from 'react-modal';
import {Car} from './car.jsx';
import {MapContainer} from './map.jsx';
import {Header} from '../layouts/header.jsx';
// import {Footer} from '../layouts/footer.jsx';
import '../css/HomePage.css';
import {MyModal} from '../popup/Modal.jsx';
import {Profile} from '../popup/editProfile';
import {NewScenario} from '../popup/switchScenario';
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
          scenarioMap: {},
          address: constants.address,
          action: {},
          scenarios: [],
          currentScenario: null,
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
    this.handleScenarioChange = this.handleScenarioChange.bind(this);
    this.updateScenarioList = this.updateScenarioList.bind(this);
    this.displayRoutes = this.displayRoutes.bind(this);
    this.deleteCar = this.deleteCar.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleProfileSave = this.handleProfileSave.bind(this);
    this.fetchCars = this.fetchCars.bind(this);
  }

  loadCars(){
    let self = this;
    const localData=localStorage.getItem("loginData");
    const password=localStorage.getItem("pwd");
    console.log("localData---->", localData);
    const header = JSON.parse(localData);
    let apiBaseUrl = apiUrl + 'scenario/getAllScenarios/';
    let params = { page: 0, size: 10};
    let auth = { username: header.uuid, password: password  }
     axios.get(apiBaseUrl, {params: params, auth: auth}).then(function (response) {
         console.log("Get Scenarios Hit", response);
         if(response.status === 200){
            if(response.data.length > 0){
              let s = self.formScenarioArray(response.data);
              let sMap = self.formScenarioMap(response.data);
              let cars = self.formCarArray(response.data[0].cars);
              let selCar = cars.length > 0 ? cars[0] : {};
              let adr = response.data[0].userAddress || null;
              self.setState({cars: cars, count: cars.length,
                              selectedCar: selCar, scenarios: s, currentScenario: s[0], address: adr, scenarioMap: sMap });
            }else{
              self.setState({cars: [], count: 0, selectedCar: {}, scenarios: [], currentScenario: "", scenarioMap: {}  });
            }
         }
         else{
            console.log("Oops...! Get Scenarios failed with--------" + response.status);
            self.setState({cars: [], count: 0, selectedCar: {}, scenarios: [], currentScenario: "", scenarioMap: {}});
         }

      }).catch(function (error) {
          self.setState({cars: [], count: 0, selectedCar: {}, scenarios: [], currentScenario: "", scenarioMap: {} });
          console.log("The error is------------", error);
      });
  }

  formScenarioMap(scenarios){
    let scenarioMap = [];
    for(let i=0; i< scenarios.length; i++){
      if(scenarios[i].scenarioId)
        scenarioMap[scenarios[i].scenarioId] = scenarios[i].name;
      else
        scenarioMap[scenarios[i].id] = scenarios[i].name;
    }
    return scenarioMap;
  }

  //Called on scenario change 
  fetchCars(scenario, list, isClone){
    let self = this;
    const localData=localStorage.getItem("loginData");
    const password=localStorage.getItem("pwd");
    const header = JSON.parse(localData);
    let apiBaseUrl = apiUrl + 'scenario/getScenario/' + scenario.id;
    let auth = { username: header.uuid, password: password };
    axios.get(apiBaseUrl, {auth: auth}).then(function (response) {
     console.log("Get by ID", response);
     if(response.status === 200){
        if(response.data.length > 0){
          let cars = response.data[0].cars ? self.formCarArray(response.data[0].cars) : [];
          let selCar = cars.length > 0 ? cars[0] : {};
          if(isClone === 'isClone'){
            for(let i=0;i<cars.length; i++){
              cars[i]["carId"] = cars[i].carLabel;
              cars[i]["isSaved"] = false;
            }
          }
          let adr = response.data[0].userAddress || null;
          let currentScenario = isClone === 'isClone' ? "" : scenario ;
          let updateObj = list ? 
                            {cars: cars, count: cars.length, selectedCar: selCar, scenarios: list,
                                    currentScenario: currentScenario, address: adr, dialogVisible: false, scenarioMap: self.formScenarioMap(list)} :
                            {cars: cars, count: cars.length, selectedCar: selCar, 
                                    currentScenario: currentScenario, address: adr, dialogVisible: false};
          self.setState(updateObj);
        }else{
           let updateObj = list ? {cars: [], count: 0, selectedCar: {}, currentScenario: "", scenarios: list, dialogVisible: false, scenarioMap: self.formScenarioMap(list)} :
                              {cars: [], count: 0, selectedCar: {}, currentScenario: "", dialogVisible: false }
           self.setState(updateObj);
        }
     }
     else{
        console.log("Oops...! Get Scenario failed with--------" + response.status);
        self.setState({cars: [], count: 0, selectedCar: {}, scenarios: [], currentScenario: "", dialogVisible: false, scenarioMap: {}});
     }}).catch(function (error) {
        self.setState({cars: [], count: 0, selectedCar: {},  scenarios: [], currentScenario: "", dialogVisible: false, scenarioMap: {} });
        console.log("The error is------------", error);
    });
  }
  
  //Called as change handler on drop-down
  handleScenarioChange(newScenario){
    if((this.mapRef && this.mapRef.state.isDirty) || !newScenario){ //Show popup if there are edits / new scenario is to be created
      this.setState({dialogVisible: true, action: this.onConfirmSwitch.bind(this), message: newScenario, modalHeading: null });
    }else{ // Just switch to specified scenario
      this.fetchCars(newScenario);
    }
  }

  //OK is clicked in scenario-change modal
  onConfirmSwitch(scenarioDetails){
    let newScenario = scenarioDetails.scenario;
    let objToSave = {scenario: this.state.currentScenario, address: this.state.address};
    let payload = this.getPayload(objToSave);
    if(newScenario){ //Switch to an existing scenario 
        this.saveCurrent(payload, 'save_and_switch', newScenario);
    }else{ //Create New scenario
      if(scenarioDetails.cloneType === "start-new"){ 
        this.saveCurrent(payload, 'save_and_new');
      }
      else{
        if(this.state.currentScenario.id === scenarioDetails.cloneFrom.id)
          this.saveCurrent(payload, 'save_and_clone');
        else
          this.saveCurrent(payload, 'save_clone_other', scenarioDetails.cloneFrom);
      }
    } 
  }

  //Constructs payload for scenario PUT/ POST call
  getPayload(objToSave){
    let allCars = [].concat(this.state.cars); //Copy of cars state variable
    let cars = allCars.filter((car) => car.isDirty);
    for(let j=0; j< cars.length; j++){
      if(cars[j]["carId"] === cars[j]["carLabel"])
          delete(cars[j]["carId"]);
      delete(cars[j].markers);
      delete(cars[j].showMarker); 
      delete(cars[j].markerCount); 
      let poly = [];
      cars[j].poly.forEach(function(p) {
        let point = {lat: parseFloat(p.lat), lng:parseFloat(p.lng)}; //Keep only essential data in poly; Otherwise causes circular error
        if(p.speed)
            point.speed = p.speed;
        poly.push(point);
      });
      cars[j].poly =  poly;
    }
    let payload = {
      name: objToSave.scenario.name,
      cars: cars
    };
    if(objToSave.address.location.coordinates.length > 0)
      payload.userAddress = objToSave.address ;
    if(objToSave.scenario.id && objToSave.scenario.id.length > 0){ //Add Scenario ID if for a PUT call
      payload.scenarioId = objToSave.scenario.id ;
    }
    // console.log("Payload:  ", payload);
    return payload;
  }

  //To clone from a saved scenario without switching
  cloneScenario(response, scenarios){
    let self = this;
    if(response.data){
      let cars = response.data.cars ? self.formCarArray(response.data.cars) : [];
      let selCar = cars.length > 0 ? cars[0] : {};
      for(let i=0;i<cars.length; i++){
        cars[i]["carId"] = cars[i].carLabel;
        cars[i]["isDirty"] = true;
      } 
      let adr = response.data.userAddress || null;
      let updateObj = {cars: cars, count: cars.length, selectedCar: selCar, 
                          currentScenario: "", address: adr, dialogVisible: false};
      if(scenarios)
          updateObj.scenarios = scenarios;                    
      self.setState(updateObj);
    }else{
      let updateObj = {cars: [], count: 0, selectedCar: {}, currentScenario: "", dialogVisible: false };
      if(scenarios)
          updateObj.scenarios = scenarios;
      self.setState(updateObj);
    }
  }

  //Handles Scenario PUT/POST calls and sets state based on action
  saveCurrent(payload, action, changedScenario){
    let self = this;
    const localData=localStorage.getItem("loginData");
    const pwd=localStorage.getItem("pwd");
    const loginResp = JSON.parse(localData);
    const apiBaseUrl =  apiUrl + "scenario/";
    let method = payload.scenarioId ? 'PUT' : 'POST';
    let context = payload.scenarioId ? 'updateScenario' : 'createScenario ';
    axios({
          method: method,
          url: apiBaseUrl + context,
          data: payload,
          auth: {
            username: loginResp.uuid,
            password: pwd
          }
    }).then(function (response) {
          console.log("scenario create/update RESPONSE ->", response);
          if(response.status === 200){
            let s, scenarios;
             s = {id: response.data.scenarioId, name: response.data.name}; 
             scenarios = self.state.scenarios;
             let sMap = self.state.scenarioMap;
             if(method === 'POST'){
                scenarios.push(s);
                sMap[s.id] = s.name;
             }
             else{
                scenarios.forEach(function(scenario){
                    if(scenario.id === s.id){
                      scenario.name = s.name;
                      sMap[s.id] = s.name;
                    }
                });
            }
            if(self.mapRef.state.isDirty){
               self.mapRef.setState({isDirty: false});
            }
            if(action === 'save'){  //Update/ Save current scenario
                let cars = response.data.cars ? self.formCarArray(response.data.cars) : [];
                let selCar = self.state.selectedCar;
                if(selCar.carLabel){
                  selCar = cars.filter((car) => car.carLabel === selCar.carLabel)[0];
                  if(selCar)
                    selCar['isDirty'] = false;
                  else
                    console.log("Sel car is-------", selCar.carLabel);
                }
                //Check for old & new current scenarios
                self.setState({cars: cars, count: cars.length, currentScenario: s, selectedCar: selCar,
                                scenarios: scenarios, address: response.data.userAddress, scenarioMap: sMap});
            }else if(action === 'save_and_switch'){ //Switch to other scenario
                self.fetchCars(changedScenario, scenarios);
            }else if(action === 'save_and_new'){ //Switch to a new scenario w/o cloning
                self.setState({cars: [], count: 0, selectedCar: {}, currentScenario: "", scenarioMap: sMap, 
                                  scenarios: scenarios, dialogVisible: false });
            }else if(action === 'save_and_clone'){
               self.cloneScenario(response, scenarios);   
            }else if(action === 'save_clone_other'){
                self.fetchCars(changedScenario, scenarios, 'isClone');
            }
            
          }
        else{
          console.log("Oops...! Rest HIT failed with--------" + response.status);
        }
    }).catch(function (error) {
          console.log("The error is------------", error);
   });
  }

  //Discard Changes is clicked in the popup
  discardEdits(details){
    let newScenario = details.scenario;
    let s = this.state.currentScenario;
    s.name = this.state.scenarioMap[s.id] ? this.state.scenarioMap[s.id] : "";
    if(newScenario){ //Switch to other existing scenario
      this.fetchCars(newScenario);
    }else if(details.cloneType === 'start-new'){ //Create a new scenario from scratch
      this.setState({cars: [], count: 0, selectedCar: {}, currentScenario: "", dialogVisible: false });
    }else if(details.cloneType === 'clone-from' && details.cloneFrom){ //Clone from an old scenario
      this.fetchCars(details.cloneFrom, null, "isClone");
    }
  }

  updateRoute(objToSave, isRest) {
      let self = this;
      if(isRest){
        let payload = this.getPayload(objToSave);
        this.saveCurrent(payload, 'save');
         setTimeout(function(){
            self.setState({showHeader: false});
         }, 5000);
      }else{
          const cars = this.state.cars;
          for(let index=0; index<cars.length; index ++){
            if(cars[index].carLabel === objToSave.carLabel){
              cars[index] = objToSave;
              break;
            }
          }
          self.setState({
            cars: cars, showHeader: isRest
          });
      }
  }

  formScenarioArray(scenarios){
    let scenarioArray = [];
    for(let i=0; i< scenarios.length; i++){
      scenarioArray.push({
        id: scenarios[i].scenarioId, name: scenarios[i].name
      });
    }
    return scenarioArray;
  }

  formCarArray(cars){
      let carArray= [], ids = [], unwanted_keys=['id', 'fileWritten', 'createdAt', 'deleted', 'emailId', 'geoFileName', 'parentUserId', 'updatedAt', 'scenarioId', 'configFileName', 'granularPoints'];
      for(let i=0; i< cars.length; i++){
          let c=cars[i];
          if(ids.indexOf(c.carId) === -1){
            c.isSaved=true;
            let poly = [];
            if(c.poly && c.poly.length > 0){
              c.speed = c.poly[0].speed;
              c.poly.forEach(function(p, index) {
                let point = {lat: parseFloat(p.lat), lng: parseFloat(p.lng)}
                if(index !== c.poly.length - 1) {
                  point.speed = p.speed;
                }
                poly.push(point);
              });
              c.poly = poly;
              c.drawPolyline = true;
              c.markerCount = 2;
              c.showMarker = true;
            }
            c.color = c.color || constants.color_codes[i % 10];
            let last_index = poly.length -1;
            c.markers = [];
            if(poly.length > 0){
              c.markers.push({lat: poly[0].lat, lng: poly[0].lng});
              c.markers.push({lat: poly[last_index].lat, lng: poly[last_index].lng});
            }
            unwanted_keys.forEach(function(k){
              delete(c[k]);
            });
            carArray.push(c);
            ids.push(c.carId);
          }
      }
      return carArray;
    }

/*  componentWillReceiveProps(nextProps){
      if(nextProps.cars && nextProps.cars !== this.props.cars) {
        this.setState({cars: nextProps.cars, count: nextProps.count});
      }else{
        this.loadCars();
      }
  }
*/
  openModal() {
    this.setState({modalIsOpen: true, sourceCar: {}, isEditing: false});
  }

  closeModal() {
    this.setState({modalIsOpen: false, sourceCar: {}, isEditing: false});
  }

  createCar(carData){
    if(this.state.isEditing){
      console.log("Updating a car", carData);
      this.updateCarProps(carData);
    }else{
      console.log("Creating a car");
      this.closeModal();
      let oldCars = this.state.cars;
      let oldCount = this.state.count;
      let index = oldCount;
      carData.useAsEv = oldCount === 0 ? true : false;
      if(oldCount > 0){
        let oldColor = oldCars[oldCount -1].color;
        let oldIndex = constants.color_codes.indexOf(oldColor);
        if(oldIndex !== oldCount -1){
          index = oldIndex + 1;
        }
      }
      carData.carId = carData.carLabel;
      carData.isDirty = true;
      carData.color = constants.color_codes[index % 10];
      oldCars.push(carData);
      let newCount = oldCount + 1;
      this.setState({cars: oldCars, count: newCount, selectedCar: carData, mapOpen: true});
    }
    if(!this.mapRef.state.isDirty){
       this.mapRef.setState({isDirty: true});
    }
        
  }

  showMap(e) {
    let carId = typeof e.target.dataset.carid === 'undefined' ? e.target.parentElement.dataset.carid : e.target.dataset.carid;
    console.log("Display map for the selected car---------",  carId);
    if((typeof carId !== 'undefined' && carId != null) && this.state.selectedCar.carId !== carId){
      let cars = this.state.cars;
      let selectedCar = cars.filter(function(car) {
         return car.carId === carId;
       })[0];
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
     if(car.isSaved && self.state.currentScenario.id){
          let url = apiUrl + 'scenario/deleteCar/' + self.state.currentScenario.id + '?carId=' + carId;
          let auth = { username: header.uuid, password: password  };
          axios.delete(url, { auth: auth}).then(function (response) {
            console.log(response);
             if(response.status === 200){
                console.log("Delete Cars Hit successful");
                self.updateCarPanel(carId, self);
                self.forceUpdate();
            }
             else{
              console.log("Oops...! Delete Cars failed with--------" + response.status);
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
      let isEvCar = false;
      oldCars.forEach(function(car, index) {
          if(car.carId === carId && car.useAsEv)
            isEvCar = true;
          car.carId !== carId ? newCars.push(car) : carIndex = index ;
       });
      let oldCount = self.state.count;
      let newCount = oldCount- 1;
      if(newCount === 0){
        self.setState({cars: newCars, count: newCount, selectedCar: {}, mapOpen: false, dialogVisible: false});
      }else{
        if(isEvCar)
            newCars[0].useAsEv=true;
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
            let evDiv= car.useAsEv ? <div className="load_ev_icon" title="This is your EV">EV</div> :
                    <div className="load_ev_icon disable_ev" title="Mark as EV" onClick={(event) => this.markEV(car)}>RV</div>
            let btnHtml = <div key={'div_' + car.carId + i}  className={"car-btn "+ cloneIcon + colorClass + activeClass}>
                        <button key={'btn_' + car.carId + i} data-carid={car.carId}
                       className={"pull-left load_car " } onClick={this.showMap}
                       onDoubleClick={(event) => this.editCar(event, car)}>

                       <div className="fa fa-car "></div>
                       <div className="car_name_no">{this.state.cars[i].carLabel} </div></button>
                       <i key={'icon_' + car.carId} title="Copy" className='fa fa-copy new_car_copy ' onClick={() => this.cloneCar(car)}></i>
                       <i key={'icon_trash_' + car.carId} title="Delete" className={'fa fa-trash-o car_item_delete' + showDelete}
                        onClick={() => this.deleteCar(car)} ></i>
                        {evDiv}
                        </div>
            buttons.push(
               btnHtml
            );
     }
    return <div id="car-panel">{buttons}</div> || null;
  }

  markEV(car){
    let cars = this.state.cars;
    let selCar = this.state.selectedCar;
    for(let i=0;i<cars.length; i++){
      cars[i].useAsEv = cars[i].carId === car.carId;
      cars[i].isDirty = true;
    }
    selCar.useAsEv = selCar.carId === car.carId; 
    if(!this.mapRef.state.isDirty){
      this.mapRef.setState({isDirty: true});
    }        
    this.setState({cars: cars, selectedCar: selCar});
  }

  updateCarProps(car){
     let self = this;
     self.closeModal();
     let cars = self.state.cars;
     cars.forEach(function(c){
      if(c.carId === car.carId){
        c.carLabel = car.carLabel;
        c.speed = car.speed;
        c.isDirty = true;
      }
     });
     self.mapRef.setState({isDirty: true});
     self.setState({cars: cars, isEditing: false, mapOpen: true});
  }

  

  drawMap(){
  	let routes = [];
    let self = this;
		let cars = this.state.cars;
    let unSavedCars = cars.filter((car) => car.poly && car.carId !== self.state.selectedCar.carId)
    routes = this.getRoutes(unSavedCars);

    return <MapContainer car={this.state.selectedCar} updateCar={this.updateRoute}
            mapRef={this.handleMapRef.bind(this)}  deleteScenario={this.deleteScenario.bind(this)}
            routes={routes} userAddress={this.state.address} addCar={this.openModal} updateAddress={this.updateAddress.bind(this)}
            scenario={this.state.currentScenario} switchCar={this.switchCar.bind(this)}/>;
  }

  displayRoutes(){
    this.setState({mapOpen: false, selectedCar: {}});
  }


  deleteScenario(s){
     let self = this;
     const localData = localStorage.getItem("loginData");
     const password = localStorage.getItem("pwd");
     const header = JSON.parse(localData);
     let url = apiUrl + 'scenario/deleteScenario/' + s.id;
     let auth = { username: header.uuid, password: password  };
     axios.delete(url, { auth: auth}).then(function (response) {
        console.log(response);
        if(response.status === 200){
          console.log("Delete Scenario Hit successful");
          self.updateScenarioList(s.id);
        }
        else{
          console.log("Oops...! Delete Scenario failed with--------" + response.status);
        }
      }).catch(function (error) {
            console.log("The error is------------" , error);
      });
  }

  updateScenarioList(scenarioId){
    let self = this;
    let scenarios = this.state.scenarios;
    let otherScenarios = scenarios.filter((s) => s.id !== scenarioId);
    if(otherScenarios.length > 0){
      self.fetchCars(otherScenarios[0], otherScenarios);
    }else{
      self.setState({scenarios: otherScenarios, currentScenario: "", cars: [], count: 0, selectedCar: {}});
    }
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
        route[0].carId = car.carId;
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

  switchCar(carId){
    let cars = this.state.cars;
    let selectedCar = cars.filter((car) => car.carId === carId)[0];
    this.setState({mapOpen: true, selectedCar: selectedCar});
  }

  displayContent(){
    let content;
    let self = this;
    if(this.state.mapOpen){
      console.log("Displaying content for car-------");
      content = this.drawMap();
    }else{
      let cars = this.state.cars;
      let carsWithRoutes = cars.filter((car) => car.poly && car.carId !== self.state.selectedCar.carId)
      let routes = carsWithRoutes.length > 0 ? this.getRoutes(carsWithRoutes) : []; /* Whether to view routes or display disabled map*/
      content = <MapContainer car={this.state.selectedCar} updateCar={this.updateRoute}  mapRef={this.handleMapRef.bind(this)}
                  routes={routes} userAddress={this.state.address} addCar={this.openModal} updateAddress={this.updateAddress.bind(this)}
                  scenario={this.state.currentScenario} switchCar={this.switchCar.bind(this)} deleteScenario={this.deleteScenario.bind(this)}/>;
     }
      return content;
  }

  handleMapRef(mapComp){
    this.mapRef = mapComp;
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

  updateAddress(address){
    if(!this.mapRef.state.isDirty)
      this.mapRef.setState({isDirty: true});
    this.setState({address: address});
  }

 render() {

    console.info("Rendering HomePage--------------");
    return (
      <div className="App">
         <Header menuClickIns={this.menuClick} scenarios={this.state.scenarios}
                 currentScenario={this.state.currentScenario} 
                 scenarioChangeHandler={this.handleScenarioChange}/>
        {this.state.dialogVisible && (this.state.modalHeading ? 
          <MyModal title={this.state.modalHeading} modalIsOpen={this.state.dialogVisible} content={this.state.message}
          okAction={this.state.action} cancelAction={this.closeDialog} data={this.state.selectedCar}  /> :
          <NewScenario modalIsOpen={this.state.dialogVisible} scenarios={this.state.scenarios} 
              okAction={this.state.action} 
              cancelAction={this.discardEdits.bind(this)} data={this.state.currentScenario}
              message={this.state.message} isDirty={this.mapRef && this.mapRef.state.isDirty} /> )
        }
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
            <MenuItem primaryText="Edit" leftIcon={<Mapicon/>} onClick={this.showProfile.bind(this)}/>
            <MenuItem primaryText="Sign out" leftIcon={<Logouticon/>} onClick={this.signOutPopupClicked} />
          </Menu>
        </Popover>
        </MuiThemeProvider>
      {this.state.cars && this.displayContent()}
      </div>
    );
  }
}
