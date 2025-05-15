import { NavLink } from "react-router-dom";

const Footer = ({ title }: { title: string }) => {
  return (
    <>
      <div className="mb-5 pt-5"></div>

      <footer>
        <nav className="navbar fixed-bottom navbar-expand-lg bg-warning bg-gradient shadow-sm">
          <div className="container">
            <NavLink to="/" className="navbar-brand d-flex align-items-center">
              <img src="/images/logo.png" alt="Logo" width="45" height="45" />
              <span className="ms-2">{title}</span>
            </NavLink>
            <span className="text-body-secondary ms-auto">
              © 2025 Company, Inc
            </span>
          </div>
        </nav>
      </footer>
    </>
  );
};

export default Footer;
