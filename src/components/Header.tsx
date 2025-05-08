import { NavLink } from "react-router-dom";

const Header = ({ title }: { title: string }) => {
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
                <li className="nav-item me-4">
                  <NavLink
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                    to="/invoices"
                  >
                    Invoices
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                    to="/search"
                  >
                    Search
                  </NavLink>
                </li>
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
