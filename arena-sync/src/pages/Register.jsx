function Register() {
  return (
    <div className="container mt-5">
      <h2>Register</h2>

      <input className="form-control mb-2" placeholder="Name" />
      <input className="form-control mb-2" placeholder="Email" />
      <input className="form-control mb-2" placeholder="Password" />

      <button className="btn btn-success w-100">
        Create Account
      </button>
    </div>
  );
}

export default Register;