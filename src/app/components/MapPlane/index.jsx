import React from "react";
import PropTypes from "prop-types";
import "./style";
import {Link} from "react-router-dom";

class MapPlane extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if(this.props.nolink){
			return (
				<span className="MapPlane">
					<i className="fa fa-plane fa-2x"></i>
				</span>
			);
		}
		return (
			<Link to={`/plane/${this.props.id}`} className="MapPlane">
				<i className="fa fa-plane fa-2x"></i>
			</Link>
		);
	}
}

MapPlane.propTypes = {
	lat: PropTypes.number.isRequired,
	lng: PropTypes.number.isRequired,
	id: PropTypes.string.isRequired,
	nolink: PropTypes.bool,
	country: PropTypes.string,
};

export default MapPlane;