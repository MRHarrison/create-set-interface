import { configureStore } from '@reduxjs/toolkit';
import launch from './launch/reducer';


const store = configureStore({
  reducer: {
    launch
  }
})

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
