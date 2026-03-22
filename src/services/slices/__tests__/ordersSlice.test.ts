import ordersReducer, { fetchUserOrders } from '../ordersSlice';
import { TOrder } from '@utils-types';

describe('ordersSlice', () => {
  const initialState = {
    orders: [],
    loading: false,
    error: null
  };

  const mockOrders: TOrder[] = [
    {
      _id: '1',
      number: 12345,
      status: 'done',
      name: 'Order 1',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      ingredients: ['1', '2']
    }
  ];

  describe('асинхронный экшен fetchUserOrders', () => {
    it('должен устанавливать loading: true при pending', () => {
      const action = { type: fetchUserOrders.pending.type };
      const state = ordersReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен записывать данные заказов и сбрасывать loading при fulfilled', () => {
      const action = { type: fetchUserOrders.fulfilled.type, payload: mockOrders };
      const state = ordersReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
    });

    it('должен записывать ошибку и сбрасывать loading при rejected', () => {
      const errorMessage = 'Ошибка загрузки заказов';
      const action = { type: fetchUserOrders.rejected.type, error: { message: errorMessage } };
      const state = ordersReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});