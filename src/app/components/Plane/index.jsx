import React from "react";
import PropTypes from "prop-types";
import "./style";
import AjaxLoading from "../AjaxLoading";
import planeOptions from "../../constants/planeOptions";
import InputMask from "react-input-mask";
import ReactTooltip from "react-tooltip";
import GoogleMapReact from "google-map-react";
import MapPlane from "../MapPlane";


class Plane extends React.Component {
	constructor(props) {
		super(props);
		let id;
		if(this.props.match.params.id ){
			id = this.props.match.params.id;
		} else {
			id = this.props.plane.getIn(["info", "states"]) ? this.props.plane.getIn(["info", "states", 0, 0]): "";
		}
		this.state = {
			search: id,
			failValidate: false
		};
		this.__getPlaneData = this.__getPlaneData.bind(this);
		this.__handleSubmit = this.__handleSubmit.bind(this);
	}

	__getPlaneData() {
		if (!this.props.plane.getIn(["info", "states"]))
			return false;
		const states = this.props.plane.getIn(["info", "states", 0]).valueSeq();
		return {
			marker: states.get(6) !== null ? [states.get(0), states.get(2), states.get(6), states.get(5)] : false,
			table: states.map((val, key) => {
				let newVal;
				switch (key) {
					case 3:
					case 4:
						const unix = new Date(val * 1000);
						const minutes = "0" + unix.getMinutes();
						const seconds = "0" + unix.getSeconds();
						newVal = unix.getHours() + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
						break;
					case 9:
					case 11:
						newVal = `${val} м/с`;
						break;
					case 12:
						newVal = val ? val.join() : val;
						break;
					case 7:
					case 13:
						newVal = `${val} м`;
						break;
					case 16:
						switch (val) {
							case 0:
								newVal = "ADS-B";
								break;
							case 1:
								newVal = "ASTERIX";
								break;
							case 2:
								newVal = "MLAT";
								break;
						}
						break;
					default:
						if (typeof val === "boolean") {
							newVal = val ? "Да" : "Нет";
						} else {
							newVal = val;
						}
				}
				return (
					<tr key={key}>
						<td>{planeOptions[key]}</td>
						<td>{newVal ? newVal : "Не определено"}</td>
					</tr>);
			})
		};
	}

	__handleSubmit(event) {
		event.preventDefault();
		if (this.__validateInput()) {
			this.props.getPlaneInfo(this.input.value);
		}
	}

	__validateInput() {
		const search = this.input.value;
		if (search.length != 6) {
			this.setState({
				failValidate: true
			});
			return false;
		}
		this.setState({
			search
		});
		return true;
	}

	render() {
		const id = this.state.search;

		if (this.props.plane.get("isFetching")) {
			return (<section className="Plane"><AjaxLoading/></section>);
		}
		const data = this.__getPlaneData();
		let table = null;
		if (data) {
			table = <div>
				<h3 className="Plane__header">{`Самолёт ICAO24 - ${this.props.plane.getIn(["info", "states", 0, 0])}`}</h3>
				<div className="Plane__body">
					<table className="Plane__table">
						<thead>
							<tr>
								<th>Свойство</th>
								<th>Значение</th>
							</tr>
						</thead>
						<tbody>
							{data.table}
						</tbody>
					</table>
					{ data.marker ?
						<div className="Plane__map">

							<GoogleMapReact bootstrapURLKeys={{
								key: "AIzaSyDkg9gT-qTmUxOUUoTzri1iGA5cQ_ouZAg"
							}}
							center={{lat: data.marker[2], lng: data.marker[3]}}
							zoom={4}
							>
								<MapPlane nolink={true} id={data.marker[0]} country={data.marker[1]}
										  lat={data.marker[2]}
										  lng={data.marker[3]}/>
							</GoogleMapReact>

						</div>
						: null
					}
				</div>
			</div>;
		} else if (id) {
			table = <div style={{textAlign: "center"}}><b>{`Нет данных по самолёту с ICAO24 ${id}`}</b></div>;
		}
		return (
			<section className="Plane">
				<form onSubmit={this.__handleSubmit} className="Plane__search" noValidate="noValidate">
					<InputMask data-tip="" data-for="validate"
							   className="Plane__input"
							   ref={input => this.input = input}
							   maskChar="" defaultValue={id} mask="******"
							   formatChars={{"9": "[0-9]", "a": "[a-z]", "*": "[a-z0-9]"}} placeholder="ICAO24"
							   type="text"/>
					<button type="submit" className="Plane__submit"><i className="fa fa-search"></i></button>
					<ReactTooltip effect="solid" event="click" globalEventOff="click" eventOff="mouseover"
								  id="validate">
						Введите ICAO24 код (6-значный)
					</ReactTooltip>

				</form>
				{table}
			</section>
		);

	}

	componentWillMount() {
		const id = this.state.search;
		if (id) {
			this.props.getPlaneInfo(id);
		}
	}


}

Plane.propTypes = {
	getPlaneInfo: PropTypes.func.isRequired,
	plane: PropTypes.object.isRequired
};

export default Plane;