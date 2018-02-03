import React from "react";
import PropTypes from "prop-types";
import "./style";
import AjaxLoading from "../AjaxLoading";
import planeOptions from "../../constants/planeOptions";
import {Link} from "react-router-dom";
import InputMask from "react-input-mask";


class Plane extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			search: ""
		};
		this.__getPlaneData = this.__getPlaneData.bind(this);
	}

	__getPlaneData() {
		if (!this.props.plane.getIn(["info", "states"]))
			return [];
		const states = this.props.plane.getIn(["info", "states", 0]).valueSeq();
		return states.map((val, key) => {
			let newVal;
			switch (key) {
				case 3:
				case 4:
					const unix = new Date(val * 1000);
					const minutes = "0" + unix.getMinutes();
					const seconds = "0" + unix.getSeconds();
					newVal = unix.getHours() + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
					break;
				case 5:
				case 6:
					newVal = <Link title="На карте" to={`/map/${states.get(0)}`}>{val}</Link>;
					break;
				case 9:
				case 11:
					newVal = `${val} м/с`;
					break;
				case 12:
					newVal = val? val.join(): val;
					break;
				case 7: case 13:
					newVal = `${val} м`;
					break;
				case 16:
					switch (val){
						case 0: newVal = "ADS-B"; break;
						case 1: newVal = "ASTERIX"; break;
						case 2: newVal = "MLAT"; break;
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
		});
	}

	render() {
		const id = this.props.match.params.id;

		if (this.props.plane.get("isFetching")) {
			return (<section className="Plane"><AjaxLoading/></section>);
		}
		const data = this.__getPlaneData();
		const table = data.length || data.size ? <div>
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
						{data}</tbody>
					</table>
				</div>
			</div> : null;
		return (
			<section className="Plane">
				<form onSubmit={event => {
					event.preventDefault();
                    this.props.getPlaneInfo(this.state.search);
                }} className="Plane__search">
					<InputMask className="Plane__input" onInput={event => this.setState({search: event.target.value})} maskChar="" defaultValue={id} mask="******" formatChars={{ "9": "[0-9]", "a": "[a-z]", "*": "[a-z0-9]"}} placeholder="ICAO24" type="text"/>
					<button type="submit" className="Plane__submit"><i className="fa fa-search"></i></button>
				</form>
				{table}
			</section>
		);

	}

	componentWillMount(){
        const id = this.props.match.params.id;

        if (id) {
            this.props.getPlaneInfo(this.props.match.params.id);
        }
	}


}

Plane.propTypes = {
	getPlaneInfo: PropTypes.func.isRequired,
	plane: PropTypes.object.isRequired
};

export default Plane;