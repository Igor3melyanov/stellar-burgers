import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { updateUser } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { selectUser } from '../../services/selectors';

export const Profile: FC = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const [initialValues, setInitialValues] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  const [formValue, setFormValue] = useState(initialValues);

  useEffect(() => {
    const newInitialValues = {
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    };
    setInitialValues(newInitialValues);
    setFormValue(newInitialValues);
  }, [user]);

  const isFormChanged =
    formValue.name !== initialValues.name ||
    formValue.email !== initialValues.email ||
    formValue.password !== '';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const updatedData: { name?: string; email?: string; password?: string } =
      {};
    if (formValue.name !== initialValues.name) {
      updatedData.name = formValue.name;
    }
    if (formValue.email !== initialValues.email) {
      updatedData.email = formValue.email;
    }
    if (formValue.password) {
      updatedData.password = formValue.password;
    }

    dispatch(updateUser(updatedData)).then(() => {
      setInitialValues({
        name: formValue.name,
        email: formValue.email,
        password: formValue.password
      });
    });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue(initialValues);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
