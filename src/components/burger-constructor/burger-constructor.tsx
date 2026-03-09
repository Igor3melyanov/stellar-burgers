import { FC, useCallback, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearConstructor,
  clearOrderModal,
  placeOrder
} from '../../services/slices/constructorSlice';
import {
  selectConstructorItems,
  selectOrderModalData,
  selectOrderRequest,
  selectTotalPrice,
  selectUser
} from '../../services/selectors';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const user = useSelector(selectUser);
  const totalPrice = useSelector(selectTotalPrice);

  const onOrderClick = useCallback(() => {
    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id)
    ];
    dispatch(placeOrder(ingredientsIds));
  }, [constructorItems, user, orderRequest, dispatch, navigate]);

  const closeOrderModal = useCallback(() => {
    dispatch(clearOrderModal());
    dispatch(clearConstructor());
  }, [dispatch]);

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
