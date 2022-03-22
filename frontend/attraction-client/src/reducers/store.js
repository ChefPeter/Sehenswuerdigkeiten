import { createStore } from "redux";
import rootReducer from "./rootReducer";

let initState = {theme: "light", language: "de"}

const store = createStore(rootReducer, initState);

export default store;