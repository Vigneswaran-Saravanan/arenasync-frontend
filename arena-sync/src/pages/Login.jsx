function Login() {
  return (
    <div className="container mt-5">
      <h2>Login</h2>

      <input className="form-control mb-2" placeholder="Email" />
      <input className="form-control mb-2" placeholder="Password" />

      <button className="btn btn-primary w-100">
        Login
      </button>
    </div>
  );
}

export default Login;