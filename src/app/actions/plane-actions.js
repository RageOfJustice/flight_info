import fetch from "isomorphic-fetch";
import ActionTypes from "../constants/ActionTypes";


function requestPlaneInfo() {
    return {
        type: ActionTypes.REQUEST_PLANE_INFO,
    };
}


function receivePlaneInfo(json) {
    return {
        type: ActionTypes.RECEIVE_PLANE_INFO,
        info: json,
    };
}


export function fetchPlaneInfo(id) {
    return dispatch => {
        dispatch(requestPlaneInfo());
        return fetch(`https://opensky-network.org/api/states/all?icao24=${id}`)
            .then(response => response.json())
            .then(json => dispatch(receivePlaneInfo(json)));
    };
}
