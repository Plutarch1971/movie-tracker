function SignUp () {
    return (
        <>
        <div className="signup-parent">
            <div>
            <img src="/harry-potter.png"></img>
            </div>
            <div className="signup-child">
                <div><h1>Sign In</h1></div>
                <label htmlFor="username">Enter username:</label>
                <input type="text" id="username"></input>
                <label htmlFor="password">Enter password:</label>
                <input type="text" id="password"></input>
                <button>Submit</button>

            </div>
        </div>
        </>
    )

}
export default SignUp;