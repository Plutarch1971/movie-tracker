import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';

import { LOGIN_USER } from '../utils/mutations';
import AuthService from '../utils/auth';
import type { User } from '../models/User';

const LoginForm = ({ handleModalClose} : { handleModalClose: () => void }) => {
  const [userFormData, setUserFormData] = useState<User>({ 
    username: '', 
    email: '', 
    password: '', 
  });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [ login, { error }] = useMutation(LOGIN_USER);
    

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

      try {
        const { data } = await login({
          variables: { email: userFormData.email, password: userFormData.password},
      });
      
      //gilocalStorage.setItem('id_token', data.login.token);
      AuthService.login(data.login.token);
      handleModalClose();
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }
    
  };
  
  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials! 
        </Alert>
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
