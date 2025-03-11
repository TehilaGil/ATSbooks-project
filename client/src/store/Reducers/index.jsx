import { combineReducers } from "redux";
import MoneReducer from './MoneReducer'


const reducers=combineReducers({
mone:MoneReducer
})

export default reducers