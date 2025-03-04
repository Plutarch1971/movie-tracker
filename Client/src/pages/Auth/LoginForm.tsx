import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { LOGIN_USER } from '../../graphql/mutations';
import AuthService from '../../utils/auth';
import { User } from '../../models/User';
import '/src/assets/styles/loginForm.css';


function LoginForm () : JSX.Element {
    const navigate = useNavigate();
    const [ userFormData , setUserFormData ] = useState<User>({
        username: '',
        password: '',
        watchlist: [],
        reviews: [],
    });
    // set state for form validation
    // const [validated] = useState(false);
    //set state for alert
    const [showAlert, setShowAlert] = useState(false);

    const [ login, { error } ] = useMutation(LOGIN_USER);
    console.log("Error:", error);

    // Check if user is already logged In
    // useEffect(() => {
    //     if (AuthService.loggedIn()) {
    //         navigate('/profile');
    //     }
    // }, [navigate]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value});
    };

    //handle form submission
    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
       
        try {
            const { data } = await login ({
                variables: { 
                    username: userFormData.username, 
                    password:userFormData.password
                },
            });
            if (data.login.token) {
                AuthService.login(data.login.token);
                // Clear form data
                setUserFormData({
                    username: '',
                    password: '',
                    watchlist: [],
                    reviews: [],
                });
            }
           
            // Navigate to home page
            navigate('/home', { replace: true});
        
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
            type="password" 
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
    )
}
export default LoginForm;