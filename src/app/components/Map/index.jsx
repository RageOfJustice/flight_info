import React from "react";
import PropTypes from "prop-types";
import "./style";
import GoogleMapReact from "google-map-react";
import MapPlane from "../MapPlane";
import {Range, List} from "immutable";

class Map extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			planes: new List(),
			dividedPlanes: new List(),
			currentIndex: 0
		};

		this.__getPlanesList = this.__getPlanesList.bind(this);
		this.__decreasePlanesList = this.__decreasePlanesList.bind(this);
		this.__increasePlanesList = this.__increasePlanesList.bind(this);
	}

	__decreasePlanesList(){
		if(this.state.currentIndex>0) {
			this.setState(oldState => ({
            	planes: oldState.dividedPlanes.get(oldState.currentIndex-1).valueSeq().map((state, index) =>
					<MapPlane key={index} id={state.get(0)} country={state.get(2)} lat={state.get(6)} lng={state.get(5)}/>
				),
				currentIndex: oldState.currentIndex-1
			}));
		}
	}
	__increasePlanesList(){
		if(this.state.currentIndex< this.state.dividedPlanes.size-1) {
			this.setState(oldState => ({
				planes: oldState.dividedPlanes.get(oldState.currentIndex+1).valueSeq().map((state, index) =>
					<MapPlane key={index} id={state.get(0)} country={state.get(2)} lat={state.get(6)} lng={state.get(5)}/>
				),
				currentIndex: oldState.currentIndex+1
			}));
		}
	}

	render() {
		const moreThen100 = this.state.dividedPlanes.size > 1;
		return (

			<section className="Map">
				<h3 className="Map__header">{`Количество самолетов на карте - ${this.state.planes.size}${moreThen100 ? " из " + this.props.filter.get("states").size : ""}`}
					{moreThen100 ?
						<span className="Map__toggles">
							<button onClick={this.__decreasePlanesList} className="Map__toggle"><i className="fa fa-arrow-circle-left"></i></button>
							<button onClick={this.__increasePlanesList} className="Map__toggle"><i className="fa fa-arrow-circle-right"></i></button>
						</span> : null}
				</h3>
				<div className="Map__body">
					<GoogleMapReact bootstrapURLKeys={{
						key: "AIzaSyDkg9gT-qTmUxOUUoTzri1iGA5cQ_ouZAg"
					}}
					defaultCenter={this.props.center}
					defaultZoom={this.props.zoom}
					>
						{this.state.planes}
					</GoogleMapReact>
				</div>
			</section>


		);
	}

	splitIntoChunks(list, chunkSize = 100) {
		return Range(0, list.count(), chunkSize)
			.map(chunkStart => list.slice(chunkStart, chunkStart + chunkSize));
	}

	__getPlanesList(filter) {
		const states = filter.get("states");
		if(states.size){
		    const chunks = this.splitIntoChunks(states);
		    this.setState(oldState => {
		    	const currentIndex = oldState.currentIndex < chunks.size ? oldState.currentIndex : 0;
				return ({
					dividedPlanes: chunks,
					planes: chunks.get(currentIndex).valueSeq().map((state, index) => (<MapPlane key={index} id={state.get(0)} country={state.get(2)} lat={state.get(6)} lng={state.get(5)}/>)),
					currentIndex
				});
			});
		} else {
			this.setState({
				planes: new List()
			});
		}
	}

	componentDidMount() {
		this.__getPlanesList(this.props.filter);
	}

	componentWillReceiveProps(nextProps) {
		this.__getPlanesList(nextProps.filter);
	}

}

Map.defaultProps = {
	center: {lat: 59.95, lng: 30.33},
	zoom: 4
};

Map.propTypes = {
	center: PropTypes.object,
	zoom: PropTypes.number,
	filter: PropTypes.object.isRequired,
};

export default Map;