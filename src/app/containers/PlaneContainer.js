import { connect } from "react-redux";
import Plane from "../components/Plane";
import { withRouter} from "react-router";
import { fetchPlaneInfo } from "../actions";


const mapStateToProps = state => ({
	plane: state.get("plane"),
});
const mapDispatchToProps = dispatch => ({
	getPlaneInfo: id => {
		dispatch(fetchPlaneInfo(id));
	}
});

const PlaneContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Plane));

export default PlaneContainer;