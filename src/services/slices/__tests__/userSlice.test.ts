import userReducer, {
  login,
  register,
  logout,
  updateUser,
  checkUserAuth
} from '../userSlice';
import { TUser } from '@utils-types';

describe('userSlice', () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    loading: false,
    error: null
  };

  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  describe('асинхронный экшен login', () => {
    it('должен устанавливать loading: true при pending', () => {
      const action = { type: login.pending.type };
      const state = userReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен записывать данные пользователя и сбрасывать loading при fulfilled', () => {
      const action = { type: login.fulfilled.type, payload: mockUser };
      const state = userReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
    });

    it('должен записывать ошибку и сбрасывать loading при rejected', () => {
      const errorMessage = 'Ошибка входа';
      const action = { type: login.rejected.type, error: { message: errorMessage } };
      const state = userReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('асинхронный экшен register', () => {
    it('должен устанавливать loading: true при pending', () => {
      const action = { type: register.pending.type };
      const state = userReducer(initialState, action);
      
      expect(state.loading).toBe(true);
    });

    it('должен записывать данные пользователя при fulfilled', () => {
      const action = { type: register.fulfilled.type, payload: mockUser };
      const state = userReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
    });
  });

  describe('асинхронный экшен logout', () => {
    it('должен очищать данные пользователя при fulfilled', () => {
      const loggedInState = {
        ...initialState,
        user: mockUser,
        isAuthChecked: true
      };
      
      const action = { type: logout.fulfilled.type };
      const state = userReducer(loggedInState, action);
      
      expect(state.user).toBeNull();
    });
  });

  describe('асинхронный экшен checkUserAuth', () => {
    it('должен устанавливать loading: true при pending', () => {
      const action = { type: checkUserAuth.pending.type };
      const state = userReducer(initialState, action);
      
      expect(state.loading).toBe(true);
    });

    it('должен записывать данные пользователя и устанавливать isAuthChecked: true при fulfilled', () => {
      const action = { type: checkUserAuth.fulfilled.type, payload: mockUser };
      const state = userReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен устанавливать isAuthChecked: true и user: null при rejected', () => {
      const action = { type: checkUserAuth.rejected.type };
      const state = userReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });
  });
});