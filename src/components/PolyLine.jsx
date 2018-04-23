import React from 'react';
import { Polyline } from "react-google-maps";
import {SpeedModal} from "../popup/SpeedModal.jsx";
import {Icon} from "./icon.jsx";
let isDragging = false;
export class PolyLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lineOptions: {
                strokeColor: this.props.color,
                strokeOpacity: 1.0,
                strokeWeight: 2,
            },
            modalIsVisible: false,
            currentSpeed: "",
            vertex: null
        }
        this.method = this.method.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.setSpeed = this.setSpeed.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.polyLineEle = this.polyLineEle.bind(this);
        this.updatePolyLine = this.updatePolyLine.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleIconDrag = this.handleIconDrag.bind(this);
    }

    componentDidMount() {
        this.props.onRef(this);
        var path = this.refs.gPolyLine.getPath();
        let google = window.google;
        let self = this;
        google.maps.event.addListener(path, 'insert_at', function(e){
            // console.error("componentDidMount path insert_at event ", e);
            //Here we need to push the speeds to the next vertices
            self.updatePolyLine(e, "insert_at");
        });
        google.maps.event.addListener(path, 'remove_at', function(e){
            // console.error("componentDidMount  path remove_at event", e);
            //Here we need to push the speeds to the previous vertices
            self.updatePolyLine(e, 'remove_at');
        });
        google.maps.event.addListener(path, 'set_at', function(e){
            // console.log("isDragging----------" + isDragging);
            if(!isDragging) {
                // console.error("componentDidMount path set_at event==============>", e);
                //Set the old speed at the new point
                self.updatePolyLine(e, 'set_at');

            }
        });
    }

    updatePolyLine(v, event_name){
        let self = this;
        let p = self.refs.gPolyLine;
        let path = p.getPath();
        let pathProps = this.props.pathCoordinates;
        if(event_name === 'set_at'){
            // console.log("updatePolyLine-------------", self.createPoly(path.getArray()), pathProps, event_name);
            let oldPt = path.getAt(v);
            if(oldPt.speed === pathProps[v].speed){
                let poly = path.getArray();
                let pathData = self.createPoly(poly);
                isDragging = false;
                self.props.dragHandler(pathData);
                // return false;
            }else{
                isDragging= true;
                oldPt.speed = pathProps[v].speed;
                path.setAt(v, oldPt); //This will trigger a set_at event; So let's stop that
                let poly = path.getArray();
                let pathData = self.createPoly(poly);
                isDragging = false;
                self.props.dragHandler(pathData);
            }
            // console.log("updatePolyLine After-------------", pathData, pathProps);
        }else if(event_name === 'insert_at'){
            // console.log("updatePolyLine-------------", self.createPoly(path.getArray()), pathProps, event_name, v);
            isDragging = true;
            pathProps.forEach(function(p, index){
                if(index > v){
                    let oldPt = path.getAt(index);
                    oldPt.speed = pathProps[index-1].speed;
                    path.setAt(index,oldPt);
                }
                if(index === v){
                   let oldPt = path.getAt(index);
                    oldPt.speed = null;
                    path.setAt(index,oldPt);
                }
            });
            let poly = path.getArray();
            let pathData = self.createPoly(poly);
            isDragging=false;
            self.props.saveHandler(pathData);
            // console.log("updatePolyLine After-------------", self.createPoly(path.getArray()), pathProps);
        }else if(event_name === 'drag'){
            // console.log("updatePolyLine-------------", self.createPoly(path.getArray()), pathProps, event_name);
            pathProps.forEach(function(p, index){
                let oldPt = path.getAt(index);
                oldPt.speed = p.speed;
                path.setAt(index,oldPt);
            });
            let poly = path.getArray();
            let pathData = self.createPoly(poly);
            isDragging = false;
            self.props.dragHandler(pathData);
            // console.log("updatePolyLine After-------------", pathData, pathProps);
        }else if(event_name === 'remove_at'){
            // console.log("updatePolyLine-------------", self.createPoly(path.getArray()), pathProps, event_name, v);
            let poly;
            if(path.getArray().length === pathProps.length){ //Somehow remove_at doesn't work; So manually remove the point
                poly = path.getArray();
                poly.splice(v, 1);
            }else{
                pathProps.forEach(function(p, index){
                if(index > v){
                    let oldPt = path.getAt(index);
                    oldPt.speed = pathProps[index+1].speed;
                    path.setAt(index,oldPt);
                }
                if(index === v){
                   let oldPt = path.getAt(index);
                    oldPt.speed = null;
                    path.setAt(index,oldPt);
                }
            });
                poly = path.getArray();
            }
            let pathData = self.createPoly(poly);
            isDragging=false;
            self.props.saveHandler(pathData);
            // console.log("updatePolyLine After-------------", self.createPoly(path.getArray()), pathProps);
        }else{
            console.log('moving_pt'); //No handle required as set_at will take care of moved marker

        }

    }

    componentDidUpdate() {
        var path = this.refs.gPolyLine.getPath();
        let google = window.google;
        let self = this;
        google.maps.event.addListener(path, 'insert_at', function(e){
            // console.error("componentDidUpdate path insert_at event ", e);
            //Here we need to push the speeds to the next vertices
            self.updatePolyLine(e, "insert_at");
        });
        google.maps.event.addListener(path, 'remove_at', function(e){
            // console.error("componentDidUpdate path remove_at event", e);
            //Here we need to push the speeds to the previous vertices
            self.updatePolyLine(e, 'remove_at');
        });
        google.maps.event.addListener(path, 'set_at', function(e){
            // console.log("isDragging----------" + isDragging);
            if(!isDragging) {
                // console.error("componentDidUpdate  path set_at event==============>", e);
                //Set the old speed at the new point
                self.updatePolyLine(e, 'set_at');
            }
        });
    }

    componentWillUnmount() {
        isDragging=false;
        let google = window.google;
        var path = this.refs.gPolyLine.getPath();
        google.maps.event.clearListeners(path, 'insert_at');
        google.maps.event.clearListeners(path, 'remove_at');
        google.maps.event.clearListeners(path, 'set_at');
        this.props.onRef(undefined);
    }

    handleClick(e, v){
        let vertex = typeof(v) === 'undefined' ?  e.vertex : v;
        console.log("click on polyline vertex----------->", e, vertex, v);
        if(vertex > -1  && this.props.pathCoordinates.length !== vertex + 1){
        let latLng = e.latLng || e;
        let google = window.google;
        let map = this.props.mapObj;
        console.log("Map Props------", map, latLng);    
        if(map && map.getProjection()){
            let coordinates = map.getProjection().fromLatLngToPoint(latLng);
            let pt =  new google.maps.Point(coordinates.x, coordinates.y);    
            console.log("Map ready now------------", pt, coordinates);
        }else{ 
            console.log("Map not at--------", new Date());
        }
        
            console.log(this.props.pathCoordinates[vertex]);
            let speed = this.props.pathCoordinates[vertex].speed ;
            this.setState({vertex: vertex, modalIsVisible: true, currentSpeed: speed});
        }
    }

    closeDialog(){
        this.setState({modalIsVisible: false});
    }

    setSpeed(speed, vertex){
         console.log("Comes to setSpeed ---------->" , speed, vertex);
         if(speed > 0){
           let existingLine =  this.refs.gPolyLine;
           let point = existingLine.getPath().getAt(vertex);
           point.speed = speed;
           this.setState({modalIsVisible: false});
           isDragging= true; //Set so that set_at is not triggered
           existingLine.getPath().setAt(vertex, point);
           let pathArray = existingLine.getPath().getArray();
           let pathData = this.createPoly(pathArray);
           // console.log("Setting Path as-----", pathData);
           isDragging = false;
           this.props.saveHandler(pathData);
          }
    }

    createPoly(poly){
        let p = [];
        for(let i=0; i< poly.length; i++) {
            let obj = {lat: poly[i].lat(), lng: poly[i].lng()};
            if(typeof(poly[i].speed) !== 'undefined')
                obj.speed = poly[i].speed;
            else
                obj.speed = typeof(this.props.pathCoordinates[i]) === 'undefined' ? "" : this.props.pathCoordinates[i].speed;
            p.push(obj);
        }
        return p;
    }

    method = (event) => {
        console.log("Child method   " , this.refs.gPolyLine);
        let poly = this.refs.gPolyLine.getPath().getArray();
        let gPolyLine = this.createPoly(poly);
        return gPolyLine;
    }

    handleDrag() {
        console.log("Handling drag event on the polyline--------");
        this.updatePolyLine(null, 'drag'); //Copy speeds at the new points
        isDragging = false;
    }

    handleDragStart(){
        isDragging = true;
    }

    handleIconDrag(pos, vertex){
        console.log("Polyline Icon is dragged---------", pos, vertex);
        let existingLine =  this.refs.gPolyLine;
        let newPoint = pos;
        // newPoint.speed = this.props.pathCoordinates[vertex].speed;
        existingLine.getPath().setAt(vertex, newPoint); //This will trigger a set at event and the rest follows
    }

    polyLineEle() {
        let lineOptions = {
            strokeColor: this.props.color,
            strokeOpacity: 1.0,
            strokeWeight: 4,
            zIndex: 150
        };
        console.log("Rendering red polyline----------" , lineOptions , this.props);
        return (
            <div>
                <Polyline ref="gPolyLine"
                path={ this.props.pathCoordinates }
                options={lineOptions}
                onClick={this.handleClick}
                onDragEnd={this.handleDrag}
                editable={this.props.allowEdit}
                draggable={this.props.allowEdit}
                onDragStart={this.handleDragStart}
                />
                <Icon markerPos={this.props.pathCoordinates}  clickHandler={this.handleClick}
                dragHandler={this.handleIconDrag} allowEdit={true} color={this.props.color}/>
                {this.state.modalIsVisible &&
                      <SpeedModal title="Enter Speed" modalIsOpen={this.state.modalIsVisible}
                      okAction={this.setSpeed} cancelAction={this.closeDialog} vertex={this.state.vertex} speed={this.state.currentSpeed} /> }
            </div>
        );
    }
    render() {
        return this.polyLineEle();
    }
}
