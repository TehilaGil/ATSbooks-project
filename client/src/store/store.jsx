import { createStore } from "redux";
import reducers from "./Reducers/index";

export const store = createStore(
    reducers,
    {}
)