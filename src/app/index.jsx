import React from "react";
import ReactDOM from "react-dom";
import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import rootReducer from "./reducers";
import App from "./containers/AppContainer";

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
/*store.subscribe(() => {
	console.log(store.getState().toJS());
})*/
ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<App/>
		</BrowserRouter>
	</Provider>,
	document.getElementById("app")
);


