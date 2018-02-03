import ActionTypes from "../constants/ActionTypes";
import {Record, List} from "immutable";

const Plane = Record({
	isFetching: false,
	info: new List()
});

function plane(state = new Plane(), action){
	switch (action.type){
		case ActionTypes.REQUEST_PLANE_INFO:
			return state.set("isFetching", true);
		case ActionTypes.RECEIVE_PLANE_INFO:
			return state.merge({
				isFetching: false,
				info: action.info
			});
		default:
			return state;
	}
}

export default plane;