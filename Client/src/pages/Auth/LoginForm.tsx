import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';

import { LOGIN_USER } from '../../graphql/mutations';
import AuthService from '../../utils/auth';
import '/src/assets/styles/loginForm.css';

// Define a specific type for the form data
interface LoginFormData {
    username: string;
    password: string;
}

function LoginForm () : JSX.Element {
    const [ userFormData , setUserFormData ] = useState<User>({
        username: '',
        password: ''
    });

    const [showAlert, setShowAlert] = useState(false);

    const [ login, { error } ] = useMutation(LOGIN_USER);
    console.log("Error:", error);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value });
        if (showAlert) setShowAlert(false);
    };

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const { data } = await login ({
                variables: { username: userFormData.username, password:userFormData.password},
            });
            AuthService.login(data.login.token);
        } catch (err) {
            console.error('Problem logging User', err);
            setShowAlert(true);
        }
    };

    return (
        <>
        <form noValidate onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials! 
        </Alert>
        <div className="login-container">
      
        <div className="signup-child">
        <h1>Login</h1>
            <label htmlFor="username">Username:</label>
            <input 
            type="text" 
            id="username"
            name="username"
            onChange={handleInputChange}
            value={userFormData.username || ''}
            required
            />
            <label htmlFor="password">Password:</label>
            <input 
            type="text" 
            id="password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password || ''}
            required
            />
            <button
            disabled={!(userFormData.username && userFormData.password)}
            type='submit'
            >
            Submit
            </button>
        </div>
        </div>
        </form>
        </>
    );
}

export default LoginForm;