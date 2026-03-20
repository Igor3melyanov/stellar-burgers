import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

export const selectBun = (state: RootState) => state.constructor?.bun;
export const selectConstructorIngredients = (state: RootState) =>
  state.constructor?.ingredients;
export const selectOrderRequest = (state: RootState) =>
  state.constructor?.orderRequest ?? false;
export const selectOrderModalData = (state: RootState) =>
  state.constructor?.orderModalData;

export const selectConstructorItems = createSelector(
  [selectBun, selectConstructorIngredients],
  (bun, ingredients) => ({
    bun,
    ingredients: ingredients || []
  })
);

export const selectTotalPrice = createSelector(
  [selectBun, selectConstructorIngredients],
  (bun, ingredients) => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = (ingredients || []).reduce(
      (sum, item) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }
);

export const selectUser = (state: RootState) => state.user.user;

export const selectFeeds = (state: RootState) => state.feeds.orders;
export const selectFeedsLoading = (state: RootState) => state.feeds.loading;
export const selectTotal = (state: RootState) => state.feeds.total;
export const selectTotalToday = (state: RootState) => state.feeds.totalToday;

export const selectOrderByNumber = (state: RootState) => state.order.order;
export const selectOrderByNumberLoading = (state: RootState) =>
  state.order.loading;
