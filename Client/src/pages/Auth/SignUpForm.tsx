import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useMutation } from '@apollo/client';
import {Form} from 'react-bootstrap';
import { ADD_USER } from '../../graphql/mutations';
import AuthService from '../../utils/auth';
import type { User } from '../../models/User';
import '/src/assets/styles/signupForm.css';

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
        <div className="signup-parent">
            <div>
            <img src="/harry-potter.png"></img>
            </div>
         
               
                {/* {showAlert && (
                    <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                        Invalid input. Please check your username and password.
                    </Alert>
                )} */}
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