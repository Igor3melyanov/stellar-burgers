import orderReducer, { getOrderByNumber, clearOrder } from '../orderSlice';
import { TOrder } from '@utils-types';

describe('orderSlice', () => {
  const initialState = {
    order: null,
    loading: false,
    error: null
  };

  const mockOrder: TOrder = {
    _id: '1',
    number: 12345,
    status: 'done',
    name: 'Test Order',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    ingredients: ['1', '2']
  };

  describe('синхронные экшены', () => {
    it('должен очищать заказ', () => {
      const stateWithOrder = {
        ...initialState,
        order: mockOrder
      };
      
      const action = clearOrder();
      const state = orderReducer(stateWithOrder, action);
      
      expect(state.order).toBeNull();
    });
  });

  describe('асинхронный экшен getOrderByNumber', () => {
    it('должен устанавливать loading: true при pending', () => {
      const action = { type: getOrderByNumber.pending.type };
      const state = orderReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен записывать данные заказа и сбрасывать loading при fulfilled', () => {
      const action = { type: getOrderByNumber.fulfilled.type, payload: mockOrder };
      const state = orderReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.order).toEqual(mockOrder);
    });

    it('должен записывать ошибку и сбрасывать loading при rejected', () => {
      const errorMessage = 'Ошибка получения заказа';
      const action = { type: getOrderByNumber.rejected.type, error: { message: errorMessage } };
      const state = orderReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});