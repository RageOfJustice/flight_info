import ActionTypes from "../constants/ActionTypes";


export function filterByCountry(countries) {
	return {
		type: ActionTypes.FILTER.BY_COUNTRY,
		filter: countries
	};
}

export function filterBySpi(spi) {
	return {
		type: ActionTypes.FILTER.BY_SPI,
		filter: spi
	};
}

export function reFilter() {
	return {
		type: ActionTypes.FILTER.RE_FILTER,
	};
}