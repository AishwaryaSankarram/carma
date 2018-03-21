import React, {Component} from 'react';
export class Header extends Component {
  constructor(props){
    super(props);
    this.menuClick = this.menuClick.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.openRoutes = this.openRoutes.bind(this);

  }

  handleBtnClick() {
    this.props.onBtnClick(true);
  }

  menuClick(){
    this.props.menuClickIns();
  }

  openRoutes(){
    this.props.viewRoutes();
  }

  render(){
    var loginData=JSON.parse(localStorage.getItem("loginData"));
    let userName=loginData ? loginData.name : "";
    console.log("username: ", loginData);
    return <div className="header_part">
        <div className="page_logo">
          <figure className="logo">
            <img src="http://carmanetworks.com/img/assets/Carma%20Network.png" alt="Carma Networks" title="Carma Networks" />
          </figure>
        </div> 
        <div className="header_title">Carma Route Planner</div>
        <div className="add_car">
          <button className="logout_icon new_car" title={"Logged in as "+userName} onClick={this.menuClick}>
            <i className="fa fa-user-circle">  {userName}</i>
          </button>
        </div>
        <div className="add_car hide">
          <button className="logout_icon new_car" title="Start Simulation">
            <i className="fa fa-play"> </i>
          </button>
        </div>
        <div className="add_car">
          <button className="logout_icon new_car" title="View Routes" onClick={this.openRoutes}>
            <i className="fa fa-eye"> </i>
          </button>
        </div>
        <div className="add_car">
          <button onClick={this.handleBtnClick} className="new_car" title="Add Car">
            <i className="fa fa-plus"> Add Car</i>
          </button>
        </div>
      </div>;
  }
}

