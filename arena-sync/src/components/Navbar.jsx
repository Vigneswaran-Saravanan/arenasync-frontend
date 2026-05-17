import { Link } from "react-router-dom";

function Navbar(){
    return (
     <nav className="navbar navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">
        ArenaSync
      </Link>

      <div>
        <Link className="btn btn-outline-light me-2" to="/login">
          Login
        </Link>

        <Link className="btn btn-success me-2" to="/register">
          Register
        </Link>

        <Link className="btn btn-primary" to="/matches">
          Matches
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;