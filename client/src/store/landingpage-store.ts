import { configureStore } from "@reduxjs/toolkit";
import landingPageReducer from "./landingpage-slice";

const store_landing_page = configureStore({
  reducer: {
    landingPage: landingPageReducer,
  },
});

// TypeScript types for the Redux state and dispatch
export type RootState = ReturnType<typeof store_landing_page.getState>;
export type AppDispatch = typeof store_landing_page.dispatch;

export default store_landing_page;
