import { NavLink, useNavigate } from "react-router-dom"; // Import useNavigate
import { signOut } from "firebase/auth"; // Import Firebase signOut
import { auth } from "../firebase/firebase"; // Import Firebase auth instance
import { useAuth } from "../contexts/authContext"; // Assuming you have useAuth hook for authentication
import { Button } from "react-bootstrap"; // Import Bootstrap components

const Header = ({ title }: { title: string }) => {
  const navigate = useNavigate(); // Get the navigate function from React Router
  const { userLoggedIn } = useAuth(); // Get login status from context

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Log the user out from Firebase
      navigate("/login"); // Redirect to login page after logging out
    } catch (error) {
      console.error("Logout error:", error); // Handle logout error if any
    }
  };

  return (
    <>
      <header>
        <nav className="navbar fixed-top navbar-expand-lg bg-warning bg-gradient shadow-sm">
          <div className="container">
            <NavLink className="navbar-brand d-flex align-items-center" to="/">
              <img src="/images/logo.png" alt="Logo" width="60" height="60" />
              <span className="ms-2">{title}</span>
            </NavLink>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                {userLoggedIn ? (
                  <>
                    {/* If logged in, show these options */}
                    <li className="nav-item me-4">
                      <NavLink
                        className={({ isActive }) =>
                          "nav-link" + (isActive ? " active" : "")
                        }
                        to="/search"
                      >
                        Search
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <Button
                        variant="primary"
                        type="button"
                        className="w-100"
                        onClick={handleLogout} // Handle logout when clicked
                      >
                        Log out
                      </Button>
                    </li>
                  </>
                ) : (
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                      to="/login"
                    >
                      <Button variant="primary" type="button" className="w-100">
                        Log in
                      </Button>
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <div className="mt-5 pt-5"></div>
    </>
  );
};

export default Header;
