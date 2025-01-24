import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useMutation } from '@apollo/client';
import {Form} from 'react-bootstrap';
import { ADD_USER } from '../../graphql/mutations';
import AuthService from '../../utils/auth';
import type { User } from '../../models/User';
import '/src/assets/styles/signupForm.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function SignupForm (): JSX.Element {
    const [ signupFormData, setSignupFormData ] = useState<User>({
        username: '',
        password: '',
        watchlist: [],
        reviews: [],
    });
    
    // set state for form validation
     const [validated] = useState(false);


    const [ addUser ] = useMutation(ADD_USER);

    //handle input change
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSignupFormData({ ...signupFormData, [name]: value});
    };
    // handle form submission
    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        try {
            const { data } = await addUser ({
               variables: {
                username: signupFormData.username,
                password: signupFormData.password
               },
            });
            console.log("Data variables:", data);
            AuthService.login(data.addUser.token)
        } catch (err) {
            console.error('Problem adding User', err);
            // setShowAlert(true);
        }

    };
    return (
        <>
        <div className="signup-parent custom-padding-top">
            <div>
            <img src="/harry-potter.png"></img>
            </div>
                 
              <Form className="signup-child" noValidate validated={validated} onSubmit={handleFormSubmit}>
              <div><h1>Sign Up</h1></div>
                <label htmlFor="username">Create username:</label>
                <input 
                    className="form-control"
                    type="text" 
                    id="username"
                    name="username"
                    value={signupFormData.username || ''}
                    onChange={handleInputChange}
                    required
                />
                <label htmlFor="password">Create password:</label>
                <input 
                    className="form-control"
                    type="password" 
                    id="password"
                    name="password"
                    value={signupFormData.password || ''}
                    onChange={handleInputChange}
                    required
                    />
                <button 
                onClick={() => window.location.href = '/home'}
                type="submit" 
                className="center-button-text"
                >Submit</button>
                
                <div>
                    <h4>Already signed up...?</h4>
                    <button 
                    className="center-button-text"
                    onClick={() => window.location.href = '/login'}
                    >Login here
                    </button>
                </div>
                </Form>
                
            </div>
      
        </>
    )

}
export default SignupForm;