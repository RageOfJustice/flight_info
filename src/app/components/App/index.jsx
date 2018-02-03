import React from "react";
import {Route, Redirect, Switch} from "react-router-dom";
import "./style";
import Menu from "../Menu";
import Map from "../../containers/MapContainer";
import Plane from "../../containers/PlaneContainer";
import Filter from "../../containers/FilterContainer";
import PropTypes from "prop-types";


class App extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			showProgress: false
		};
	}

	render(){
		return (
			<div className="App">
				<Menu/>
				<div className="App__content">
					<Route exact path="/" render={() => <Redirect to="/map" />} />
					<Switch>
						<Route exact path="/map" component={Map} />
						<Route path="/map/:id" component={Map} />
					</Switch>
					<Route path="/map" component={Filter} />
					<Switch>
						<Route exact path="/plane" component={Plane} />
						<Route path="/plane/:id" component={Plane} />
					</Switch>
					<Route path="/filter" component={Filter}/>
				</div>
				<ProgressIndicator show={this.state.showProgress} />
			</div>
		);
	}

	componentWillMount(){
		this.props.getVector();
	}

	componentDidMount(){
		this.getVectorInterval = setInterval(this.props.getVector, 10 * 1000);
		this.setState({
			showProgress: true
		});
	}


	componentWillUnmount(){
		clearInterval(this.getVectorInterval);
		this.setState({
			showProgress: false
		});
	}

}

class ProgressIndicator extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return (this.props.show ? <div className="ProgressIndicator"></div> : null);
	}
}

ProgressIndicator.propTypes = {
	show: PropTypes.bool.isRequired
};


export default App;