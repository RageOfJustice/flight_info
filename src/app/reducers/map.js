import ActionTypes from "../constants/ActionTypes";
import Indexes from "../constants/filterMapToIndex";

import {Record, Map, Set, List} from "immutable";

const TypesEnum = {
	BOOLEAN: "BOOLEAN",
	RANGE: "RANGE",
	STRING: "STRING"
};

const VariantType = Record({
	values: null,
	type: ""
});

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

function subFilter(states, action, variantType) {
	if (states.size) {
		const values = variantType.get("values");
		if(values.size){
			switch (variantType.get("type")){
				case TypesEnum.RANGE:
					return states.filter(state => state.get(Indexes[action]) >= values.get(0) && state.get(Indexes[action]) <= values.get(1));
				case TypesEnum.BOOLEAN:
					// noinspection EqualityComparisonWithCoercionJS
					return states.filter(state => state.get(Indexes[action]) === ("true" ==values.get(0)));
				case TypesEnum.STRING:
					return states.filter(state => values.includes(state.get(Indexes[action])));
			}
		}
	}
	return states;
}

function reFilter(state, action) {
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
		let keys = filter.get("filterKeys");
		if(action){
			keys = keys.delete(action.type);
		}
		if (keys.size) {
			keys.forEach((variantType, key) => {
				states = subFilter(states, key, variantType);
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
	const filter = reFilter(state, action).get("filter").asMutable();
	const list = new VariantType({
		values: new List(action.filter),
		type: action.variantType
	});
	if (!action.filter.length) {
		filter.deleteIn(["filterKeys", action.type]);
	} else {
		filter.setIn(["filterKeys", action.type], list);
	}
	filter.set("states", subFilter(filter.get("states", new List()), action.type, list));
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