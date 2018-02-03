import { connect } from "react-redux";
import Filter from "../components/Filter";
import { withRouter} from "react-router";
import { filterByCountry, filterBySpi } from "../actions";


const mapStateToProps = state => ({
	filter: state.getIn(["map", "filter"])
});
const mapDispatchToProps = dispatch => ({
	filterByCountry: countries => {
		dispatch(filterByCountry(countries));
	},
	filterBySpi: spi => {
		dispatch(filterBySpi(spi));
	}
});

const FilterContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Filter));

export default FilterContainer;