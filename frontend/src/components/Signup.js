
function Signup() {

  // component return function
  return (
    <div>
      <div>
        Create an Account
      </div>

      {/* Username Input */}
      <div>
        <div>Username</div>
        <input type='text' placeholder='Username'></input>
      </div>

      {/* Email Input */}
      <div>
        <div>Email</div>
        <input type='email' placeholder='Email'></input>
      </div>

      {/* Password Input */}
      <div>
        <div>Password</div>
        <input type='password' placeholder='Password'></input>
      </div>

      {/* Confirm Password Input */}
      <div>
        <div>Confirm Password</div>
        <input type='password' placeholder='Password'></input>
      </div>

      {/* Account Signup Button */}
      <button>Create an Account</button>
    </div>
  );
}

export default Signup;
