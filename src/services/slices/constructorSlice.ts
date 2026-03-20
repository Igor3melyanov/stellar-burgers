import { orderBurgerApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

interface IConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
}

const initialState: IConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  orderError: null
};

export const placeOrder = createAsyncThunk(
  'constructor/placeOrder',
  async (ingredientIds: string[]) => {
    const data = await orderBurgerApi(ingredientIds);

    const order: TOrder = {
      _id: data.order._id,
      status: data.order.status,
      name: data.order.name,
      createdAt: data.order.createdAt,
      updatedAt: data.order.updatedAt,
      number: data.order.number,
      ingredients: ingredientIds
    };

    return order;
  }
);

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          return {
            ...state,
            bun: action.payload
          };
        } else {
          return {
            ...state,
            ingredients: [...(state.ingredients || []), action.payload]
          };
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: crypto.randomUUID() }
      })
    },

    removeIngredient: (state, action: PayloadAction<string>) => ({
      ...state,
      ingredients: (state.ingredients || []).filter(
        (item) => item.id !== action.payload
      )
    }),

    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      if (!state.ingredients || state.ingredients.length === 0) {
        return state;
      }

      const { fromIndex, toIndex } = action.payload;
      const newIngredients = [...state.ingredients];
      const [movedItem] = newIngredients.splice(fromIndex, 1);
      newIngredients.splice(toIndex, 0, movedItem);

      return {
        ...state,
        ingredients: newIngredients
      };
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },

    clearOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
        return state;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        return state;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error.message || 'Error create order';
        return state;
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  clearOrderModal
} = constructorSlice.actions;

export default constructorSlice.reducer;
