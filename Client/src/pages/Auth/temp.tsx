import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';

import { ADD_USER } from '../../graphql/mutations';
import AuthService from '../../utils/auth';
import type { User } from '../../models/User';



function SignUpForm (): JSX.Element {
    const [ signupFormData, setSignupFormData ] = useState<User>({
        username: '',
        password: '',
    });
    
    // set state for form validation
    const [validated, setValidated] = useState(false);
    //set state for alert
    const [showAlert, setShowAlert] = useState(false);

    const [ addUser ] = useMutation(ADD_USER);

    //handle input change
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSignupFormData({ ...signupFormData, [name]: value});
    };
    // handle form submission
    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);
        try {
            const { data } = await addUser ({
               variables: { ...signupFormData},
            });
            AuthService.login(data.addUser.token)
        } catch (err) {
            console.error('Problem adding User', err);
            setShowAlert(true);
        }
        setSignupFormData({
            username: '',
            password: '',
        });

    };
    return (
        <>
        <div className="signup-parent">
            <div>
            <img src="/harry-potter.png"></img>
            </div>
            <div className="signup-child">
                <div><h1>Sign In</h1></div>
                {showAlert && (
                    <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                        Invalid input. Please check your username and password.
                    </Alert>
                )}
              <form noValidate onSubmit={handleFormSubmit}>
                <label htmlFor="username">Enter username:</label>
                <input 
                    type="text" 
                    id="username"
                    name="username"
                    value={signupFormData.username}
                    onChange={handleInputChange}
                    required
                />
                <label htmlFor="password">Enter password:</label>
                <input 
                    type="text" 
                    id="password"
                    name="password"
                    value={signupFormData.password}
                    onChange={handleInputChange}
                    required
                    />
                <button type="submit">Submit</button>
                </form>
            </div>
        </div>
        </>
    )

}
export default SignUpForm;