// import { createStore } from "redux";
// import reducers from "./Reducers/index";

// export const store = createStore(
//     reducers,
//     {}
// )

import { configureStore } from '@reduxjs/toolkit';
import { myApi } from './api/api'; // ניצור את הקובץ הזה עוד רגע

export const store = configureStore({
  reducer: {
    [myApi.reducerPath]: myApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(myApi.middleware),
});


