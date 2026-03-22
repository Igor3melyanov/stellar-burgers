import ingredientsReducer, {
  fetchIngredients
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      price: 100,
      proteins: 10,
      fat: 5,
      carbohydrates: 50,
      calories: 300,
      image: 'image.jpg',
      image_mobile: 'image-mobile.jpg',
      image_large: 'image-large.jpg',
    },
    {
      _id: '2',
      name: 'Начинка',
      type: 'main',
      price: 150,
      proteins: 20,
      fat: 10,
      carbohydrates: 30,
      calories: 200,
      image: 'image.jpg',
      image_mobile: 'image-mobile.jpg',
      image_large: 'image-large.jpg',
    }
  ];

  describe('асинхронный экшен fetchIngredients', () => {
    it('должен устанавливать loading: true при pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен записывать данные и сбрасывать loading при fulfilled', () => {
      const action = { type: fetchIngredients.fulfilled.type, payload: mockIngredients };
      const state = ingredientsReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.items).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    it('должен записывать ошибку и сбрасывать loading при rejected', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = { type: fetchIngredients.rejected.type, error: { message: errorMessage } };
      const state = ingredientsReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.items).toEqual([]);
    });
  });
});