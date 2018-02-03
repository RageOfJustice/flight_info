import { connect } from "react-redux";
import App from "../components/App";
import { withRouter} from "react-router";
import { fetchMapVectorIfNeeded, filterByCountry } from "../actions";

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
	getVector: () => {
		dispatch(fetchMapVectorIfNeeded());
	},
    filterByCountry: countries => {
        dispatch(filterByCountry(countries));
    }
});

const AppContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export default AppContainer;