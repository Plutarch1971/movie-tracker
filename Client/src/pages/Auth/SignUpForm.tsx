import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useMutation } from '@apollo/client';
import { Form, Alert } from 'react-bootstrap';
import { ADD_USER } from '../../graphql/mutations';
import AuthService from '../../utils/auth';
import type { User } from '../../models/User';
import '/src/assets/styles/signupForm.css';

function SignupForm(): JSX.Element {
    const [signupFormData, setSignupFormData] = useState<User>({
        username: '',
        password: '',
        watchlist: [],
        reviews: [],
    });
    
    // Add error state
    const [errorMessage, setErrorMessage] = useState('');
    const [validated] = useState(false);
    const [addUser] = useMutation(ADD_USER);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSignupFormData({ ...signupFormData, [name]: value });
        // Clear error when user starts typing
        if (errorMessage) setErrorMessage('');
    };

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        try {
            const { data } = await addUser({
                variables: {
                    username: signupFormData.username,
                    password: signupFormData.password
                },
            });
            
            console.log("Data variables:", data);
            
            if (data.addUser.token) {
                AuthService.login(data.addUser.token);
                // Redirect to home page after successful signup
                window.location.href = '/';
            }
        } catch (err) {
            const error = err as Error;
            if (error.message.includes('duplicate key error')) {
                setErrorMessage('This username is already taken. Please choose a different one.');
            } else {
                setErrorMessage('Something went wrong during signup. Please try again.');
            }
            console.error('Problem adding User', err);
        }
    };

    return (
        <>
            <div className="signup-parent">
                <div>
                    <img src="/harry-potter.png" alt="Harry Potter" />
                </div>
                
                {errorMessage && (
                    <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
                        {errorMessage}
                    </Alert>
                )}

                <Form className="signup-child" noValidate validated={validated} onSubmit={handleFormSubmit}>
                    <div><h1>Sign Up</h1></div>
                    
                    <label htmlFor="username">Create username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={signupFormData.username || ''}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="password">Create password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={signupFormData.password || ''}
                        onChange={handleInputChange}
                        required
                    />

                    <button type="submit">Submit</button>
                    
                    <div className="redirection-login">
                        <h2>Already signed up...?</h2>
                        <button
                            type="button"
                            onClick={() => window.location.href = '/login'}
                        >
                            Login here
                        </button>
                    </div>
                </Form>
            </div>
        </>
    );
}

export default SignupForm;