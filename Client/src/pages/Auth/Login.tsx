function Login () {
    return (
        <>
        <div className="login-container">
      
        <div className="signup-child">
        <h1>Login</h1>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username"></input>
            <label htmlFor="password">Password:</label>
            <input type="text" id="password"></input>
            <button>Submit</button>
        </div>
        </div>
        </>
    )
}
export default Login;