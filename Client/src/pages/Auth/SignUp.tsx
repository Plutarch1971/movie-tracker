function SignUp () {
    return (
        <>
        <div><h1>Sign Up Page</h1></div>
        <div className="login-signup">
            <label htmlFor="username">Enter username:</label>
            <input type="text" id="username"></input>
            <label htmlFor="password">Enter password:</label>
            <input type="text" id="password"></input>
            <button>Submit</button>

        </div>
        </>
    )

}
export default SignUp;