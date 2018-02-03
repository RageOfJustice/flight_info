import { connect } from "react-redux";
import Map from "../components/Map";
import { withRouter} from "react-router";
import { fetchMapVectorIfNeeded } from "../actions";

const mapStateToProps = state => ({
	filter: state.getIn(["map", "filter"])
});
// const mapDispatchToProps = dispatch => ({
//
//     getVector: () => {
//     dispatch(fetchMapVectorIfNeeded());
// }
// });

const MapContainer = withRouter(connect(mapStateToProps/*, mapDispatchToProps*/)(Map));

export default MapContainer;