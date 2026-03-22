import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  clearOrderModal,
  placeOrder
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: '1',
  name: 'Краторная булка',
  type: 'bun',
  price: 100,
  proteins: 10,
  fat: 5,
  carbohydrates: 50,
  calories: 300,
  image: 'image.jpg',
  image_mobile: 'image-mobile.jpg',
  image_large: 'image-large.jpg',
};

const mockMainIngredient: TIngredient = {
  _id: '2',
  name: 'Филе',
  type: 'main',
  price: 150,
  proteins: 20,
  fat: 10,
  carbohydrates: 30,
  calories: 200,
  image: 'image.jpg',
  image_mobile: 'image-mobile.jpg',
  image_large: 'image-large.jpg',
};

const mockSauce: TIngredient = {
  _id: '3',
  name: 'Соус',
  type: 'sauce',
  price: 50,
  proteins: 1,
  fat: 2,
  carbohydrates: 5,
  calories: 30,
  image: 'image.jpg',
  image_mobile: 'image-mobile.jpg',
  image_large: 'image-large.jpg',
};

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null,
    orderError: null
  };

  describe('редьюсеры синхронных экшенов', () => {
    it('должен правильно добавлять булку', () => {
      const action = addIngredient(mockBun);
      const newState = constructorReducer(initialState, action);
      
      expect(newState.bun).toEqual({
        ...mockBun,
        id: expect.any(String)
      });
      expect(newState.ingredients).toHaveLength(0);
    });

    it('должен правильно добавлять начинку', () => {
      const action = addIngredient(mockMainIngredient);
      const newState = constructorReducer(initialState, action);
      
      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual({
        ...mockMainIngredient,
        id: expect.any(String)
      });
    });

    it('должен заменять булку при повторном добавлении', () => {
      const anotherBun = { ...mockBun, _id: '4', name: 'Другая булка' };
      
      let state = constructorReducer(initialState, addIngredient(mockBun));
      state = constructorReducer(state, addIngredient(anotherBun));
      
      expect(state.bun?.name).toBe('Другая булка');
    });

    it('должен правильно удалять ингредиент по id', () => {
      let state = constructorReducer(initialState, addIngredient(mockMainIngredient));
      const ingredientId = state.ingredients[0].id;
      
      state = constructorReducer(state, removeIngredient(ingredientId));
      
      expect(state.ingredients).toHaveLength(0);
    });

    it('должен перемещать ингредиент вверх/вниз', () => {
      let state = constructorReducer(initialState, addIngredient(mockMainIngredient));
      state = constructorReducer(state, addIngredient(mockSauce));
      
      const originalFirstId = state.ingredients[0].id;
      const originalSecondId = state.ingredients[1].id;
      
      state = constructorReducer(state, moveIngredient({ fromIndex: 1, toIndex: 0 }));
      
      expect(state.ingredients[0].id).toBe(originalSecondId);
      expect(state.ingredients[1].id).toBe(originalFirstId);
    });

    it('должен очищать конструктор', () => {
      let state = constructorReducer(initialState, addIngredient(mockBun));
      state = constructorReducer(state, addIngredient(mockMainIngredient));
      
      state = constructorReducer(state, clearConstructor());
      
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });

    it('должен очищать модальное окно заказа', () => {
      let state = constructorReducer(
        initialState, 
        { type: placeOrder.fulfilled.type, payload: { _id: '1', number: 12345 } as any }
      );
      
      expect(state.orderModalData).toBeDefined();
      
      state = constructorReducer(state, clearOrderModal());
      
      expect(state.orderModalData).toBeNull();
    });
  });

  describe('асинхронный экшен placeOrder', () => {
    const mockOrder = {
      _id: 'order1',
      number: 12345,
      status: 'done',
      name: 'Test order',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      ingredients: ['1', '2']
    };

    it('должен устанавливать orderRequest: true при pending', () => {
      const action = { type: placeOrder.pending.type };
      const state = constructorReducer(initialState, action);
      
      expect(state.orderRequest).toBe(true);
      expect(state.orderError).toBeNull();
    });

    it('должен записывать данные заказа и сбрасывать orderRequest при fulfilled', () => {
      const action = { type: placeOrder.fulfilled.type, payload: mockOrder };
      const state = constructorReducer(initialState, action);
      
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
    });

    it('должен записывать ошибку и сбрасывать orderRequest при rejected', () => {
      const errorMessage = 'Ошибка создания заказа';
      const action = { type: placeOrder.rejected.type, error: { message: errorMessage } };
      const state = constructorReducer(initialState, action);
      
      expect(state.orderRequest).toBe(false);
      expect(state.orderError).toBe(errorMessage);
    });
  });
});