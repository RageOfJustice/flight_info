import fetch from "isomorphic-fetch";
import ActionTypes from "../constants/ActionTypes";


function requestMapVector() {
    return {
        type: ActionTypes.REQUEST_MAP_VECTOR,
    };
}


function receiveMapVector(json) {
    return {
        type: ActionTypes.RECEIVE_MAP_VECTOR,
        vector: json,
    };
}


function fetchMapVector() {
	return dispatch => {
		dispatch(requestMapVector());
		return fetch("https://opensky-network.org/api/states/all")
			.then(response => response.json())
			.then(json => dispatch(receiveMapVector(json)));
	};
}

function shouldFetchMapVector(state) {
	const map = state.get("map");
	if (!map) {
		return true;
	} else{
		return !map.get("isFetching");
	}
}

export function fetchMapVectorIfNeeded() {
	return (dispatch, getState) => {
		if (shouldFetchMapVector(getState())) {
			return dispatch(fetchMapVector());
		} else {
			return Promise.resolve();
		}
	};
}