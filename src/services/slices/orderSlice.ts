import { getOrderByNumberApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface IOrderState {
  order: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: IOrderState = {
  order: null,
  loading: false,
  error: null
};

export const getOrderByNumber = createAsyncThunk(
  'order/getByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.order = action.payload;
        state.loading = true;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error getting orger';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
