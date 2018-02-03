import ActionTypes from "../constants/ActionTypes";
import Indexes from "../constants/filterMapToIndex";

import {Record, Map, Set, List} from "immutable";


const FilterVariants = Record({
	byCountry: new Set(),
	bySpi: new Set(),
	byGround: new Set(),
	bySource: new Set(),
	byVerticalRate: new Set(),
	byBaroAlt: new Set(),
	byVelocity: new Set(),
	byGeoAlt: new Set()
});

const Filter = Record({
	filterKeys: new Map(),
	filterVariants: new FilterVariants(),
	states: new List()
});

const MapVector = Record({
	isFetching: false,
	vector: [],
	filter: new Filter()
});

function reFilter(state) {
	const filter = state.get("filter").asMutable();
	const byCountry = new Set().asMutable(),
		bySpi = new Set().asMutable(),
		byGround = new Set().asMutable(),
		bySource = new Set().asMutable(),
		byVerticalRate = new Set().asMutable(),
		byBaroAlt = new Set().asMutable(),
		byVelocity = new Set().asMutable(),
		byGeoAlt = new Set().asMutable();
	let	states = state.getIn(["vector", "states"]).filter(state => state.get(6) && state.get(5));
	if (states.size) {
		states.forEach(val => {
			byCountry.add(val.get(2));
			bySpi.add(val.get(15));
			byGround.add(val.get(8));
			bySource.add(val.get(16));
			if (val.get(11) !== null) byVerticalRate.add(val.get(11));
			if (val.get(13) !== null) byBaroAlt.add(val.get(13));
			if (val.get(9) !== null) byVelocity.add(val.get(9));
			if (val.get(7) !== null) byGeoAlt.add(val.get(7));
		});
		const filterVariants = new FilterVariants({
			byCountry: byCountry.asImmutable(),
			bySpi: bySpi.asImmutable(),
			byGround: byGround.asImmutable(),
			bySource: bySource.asImmutable(),
			byVerticalRate: byVerticalRate.asImmutable(),
			byBaroAlt: byBaroAlt.asImmutable(),
			byVelocity: byVelocity.asImmutable(),
			byGeoAlt: byGeoAlt.asImmutable()
		});
		filter.set("filterVariants", filterVariants);
		const keys = filter.get("filterKeys");
		if (keys.size) {
			keys.forEach((list, key) => {
				states = states.filter(state => list.includes(state.get(Indexes[key])));
			});
		}


	}
	filter.set("states", states.sort((a, b) => {
		if (a.get(0) < b.get(0)) {
			return -1;
		}
		if (a.get(0) > b.get(0)) {
			return 1;
		}
		if (a.get(0) === b.get(0)) {
			return 0;
		}
	}));
	return state.set("filter", filter.asImmutable());
}

function handleFilter(state, action) {
	const filter = state.get("filter").asMutable();
	const list = new Set(action.filter);
	if (!action.filter.length) {
		filter.deleteIn(["filterKeys", action.type]);
	} else {
		filter.setIn(["filterKeys", action.type], list);
	}
	const states = state.getIn(["vector", "states"], []);
	if (!state.get("isFetching") && states.size) {
		list.size ?
			filter.set("states", states.filter(state => list.includes(state.get(Indexes[action.type])))) :
			filter.set("states", states);
	}

	return state.set("filter", filter.asImmutable());
}


function map(state = new MapVector(), action) {
	switch (action.type) {
		case ActionTypes.REQUEST_MAP_VECTOR:
			return state.set("isFetching", true);
		case ActionTypes.RECEIVE_MAP_VECTOR:
			return reFilter(state.merge({
				isFetching: false,
				vector: action.vector
			}));
		case ActionTypes.FILTER.BY_BARO_ALT:
		case ActionTypes.FILTER.BY_COUNTRY:
		case ActionTypes.FILTER.BY_GEO_ALT:
		case ActionTypes.FILTER.BY_GROUND:
		case ActionTypes.FILTER.BY_SOURCE:
		case ActionTypes.FILTER.BY_SPI:
		case ActionTypes.FILTER.BY_VERTICAL_RATE:
			return handleFilter(state, action);
		case ActionTypes.FILTER.RE_FILTER:
			return reFilter(state);
		default:
			return state;
	}
}


export default map;