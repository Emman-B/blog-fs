
function Login() {

  // component return function
  return (
    <div>
      <div>
        Login
      </div>

      {/* Username Input */}
      <div>
        <div>Username</div>
        <input type='text' placeholder='Username'></input>
      </div>

      {/* Password Input */}
      <div>
        <div>Password</div>
        <input type='password' placeholder='Password'></input>
      </div>

      {/* Login Button */}
      <button>Log in</button>
    </div>
  );
}

export default Login;
