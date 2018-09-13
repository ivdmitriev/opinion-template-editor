import {combineReducers} from "redux";
import fields from "./fields";
import error_reducer from "./error";
import templates from "./templates";
import program_reducer from "./program";



const rootReducer = combineReducers(
    {
        program_reducer,
        fields,
        error_reducer,
        templates,

    }
);

export default rootReducer