import { connect } from "react-redux";
import Filter from "../components/Filter";
import { withRouter} from "react-router";
import { filterByCountry, filterBySpi } from "../actions";


const mapStateToProps = state => ({
	filter: state.getIn(["map", "filter"])
});
const mapDispatchToProps = dispatch => ({
	filterByCountry: (countries, variantType) => {
		dispatch(filterByCountry(countries, variantType));
	},
	filterBySpi: (spi, variantType) => {
		dispatch(filterBySpi(spi, variantType));
	}
});

const FilterContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Filter));

export default FilterContainer;