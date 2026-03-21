import feedsReducer, { fetchFeeds } from '../feedsSlice';
import { TOrder } from '@utils-types';

describe('feedsSlice', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
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

  const mockFeedsResponse = {
    orders: mockOrders,
    total: 100,
    totalToday: 5
  };

  describe('асинхронный экшен fetchFeeds', () => {
    it('должен устанавливать loading: true при pending', () => {
      const action = { type: fetchFeeds.pending.type };
      const state = feedsReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен записывать данные и сбрасывать loading при fulfilled', () => {
      const action = { type: fetchFeeds.fulfilled.type, payload: mockFeedsResponse };
      const state = feedsReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(5);
    });

    it('должен записывать ошибку и сбрасывать loading при rejected', () => {
      const errorMessage = 'Ошибка загрузки ленты';
      const action = { type: fetchFeeds.rejected.type, error: { message: errorMessage } };
      const state = feedsReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});