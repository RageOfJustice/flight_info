import React from "react";
import "./style";
import PropTypes from "prop-types";
import classnames from "classnames";
import ReactTooltip from "react-tooltip";
import {NavLink} from "react-router-dom";

class Menu extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			opened: false
		};
		this.__toggleMenu = this.__toggleMenu.bind(this);
	}

	__toggleMenu(){
		this.setState(oldState => ({opened: !oldState.opened}));
	}

	render(){
	    return (
	        <div className={classnames("Menu", {"_opened": this.state.opened })}>
				<div className="menu-link__wrapper">
					<a href="javascript:void(0)" className={classnames("menu-link", {"_rotated": this.state.opened})} onClick={this.__toggleMenu}><i className="fa fa-2x fa-arrow-right"></i></a>
				</div>
				<div className="Menu__separator"></div>
				<MenuList opened={this.state.opened}/>
			</div>
		);
	}
}

class MenuList extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
	    const tooltipOpts = {disable: this.props.opened, effect: "solid", place: "right"};
		return (
			<nav className="MenuList">
				<NavLink activeClassName="_active" to="/map" data-tip="" data-for="map-tooltip" className={classnames("MenuList__link", {"_expanded": this.props.opened})}>
					<span className="MenuList__icon"><i className="fa fa-2x fa-globe"></i></span>
					<strong className="MenuList__link-text">
                        Карта
					</strong>
					<ReactTooltip {...tooltipOpts} id="map-tooltip">Карта</ReactTooltip>
				</NavLink>
				<NavLink activeClassName="_active" to="/filter" data-tip="" data-for="list-tooltip" className={classnames("MenuList__link", {"_expanded": this.props.opened})}>
					<span className="MenuList__icon"><i className="fa fa-2x fa-th-list"></i></span>
					<strong className="MenuList__link-text">
                        Список самолётов
					</strong>
					<ReactTooltip {...tooltipOpts} id="list-tooltip">Список самолётов</ReactTooltip>
				</NavLink>
				<NavLink activeClassName="_active" to="/plane" data-tip="" data-for="plane-tooltip" className={classnames("MenuList__link", {"_expanded": this.props.opened})}>
					<span className="MenuList__icon"><i className="fa fa-2x fa-plane"></i></span>
					<strong className="MenuList__link-text">
                        Инфо о самолёте
					</strong>
					<ReactTooltip {...tooltipOpts} id="plane-tooltip">Инфо о самолёте</ReactTooltip>
				</NavLink>
				<div className="Menu__separator"></div>
				<NavLink activeClassName="_active" to="/info" data-tip="" data-for="info-tooltip" className={classnames("MenuList__link", {"_expanded": this.props.opened})}>
					<span className="MenuList__icon"><i className="fa fa-2x fa-info"></i></span>
					<strong className="MenuList__link-text">
                        О программе
					</strong>
					<ReactTooltip {...tooltipOpts} id="info-tooltip">О программе</ReactTooltip>
				</NavLink>
			</nav>
		);
	}

}

MenuList.propTypes = {
	opened: PropTypes.bool.isRequired
};


export default Menu;