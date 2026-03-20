import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsReducer from './slices/ingredientsSlice';
import userReducer from './slices/userSlice';
import feedsReducer from './slices/feedsSlice';
import ordersReducer from './slices/ordersSlice';
import constructorReducer from './slices/constructorSlice';
import orderReducer from './slices/orderSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  feeds: feedsReducer,
  orders: ordersReducer,
  constructor: constructorReducer,
  order: orderReducer
}); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    })
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
