import {applyMiddleware, createStore} from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from "../reducers";
import thunkMiddleware from 'redux-thunk';


export default function configureStore(preloadedState={}) {
    return createStore(
        rootReducer, preloadedState,composeWithDevTools(applyMiddleware(thunkMiddleware)),
    )

}