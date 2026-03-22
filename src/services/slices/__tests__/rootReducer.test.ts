import { rootReducer } from '../../store';
import constructorReducer, { initialState as constructorInitialState } from '../constructorSlice';
import { initialState as ingredientsInitialState } from '../ingredientsSlice';
import { initialState as userInitialState } from '../userSlice';
import { initialState as feedsInitialState } from '../feedsSlice';
import { initialState as ordersInitialState } from '../ordersSlice';
import { initialState as orderInitialState } from '../orderSlice';

describe('rootReducer', () => {
  it('должен корректно инициализировать состояние', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    
    expect(state.ingredients).toEqual(ingredientsInitialState);
    expect(state.user).toEqual(userInitialState);
    expect(state.feeds).toEqual(feedsInitialState);
    expect(state.orders).toEqual(ordersInitialState);
    expect(state.order).toEqual(orderInitialState);
    
    // Проверяем, что редьюсер constructor работает правильно (обход конфликта имен)
    const constructorState = constructorReducer(undefined, { type: '@@INIT' });
    expect(constructorState).toEqual(constructorInitialState);
  });
});