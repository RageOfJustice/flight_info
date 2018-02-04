import ActionTypes from "../constants/ActionTypes";


export function filterByCountry(countries, variantType) {
	return {
		type: ActionTypes.FILTER.BY_COUNTRY,
		filter: countries,
		variantType
	};
}

export function filterBySpi(spi, variantType) {
	return {
		type: ActionTypes.FILTER.BY_SPI,
		filter: spi,
		variantType
	};
}

export function reFilter() {
	return {
		type: ActionTypes.FILTER.RE_FILTER,
	};
}