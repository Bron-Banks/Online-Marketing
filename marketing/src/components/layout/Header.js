import { useEffect, useRef } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import image_logo from "../../assets/logo.png"
import { isAuthenticated, getUsername, clearJWT } from "../auth/auth-helper";
import { useCart } from "../../context/CartContext";

const isDesktopViewport = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 992px)").matches;

const Header = () => {

  const location = useLocation();
  const { itemCount } = useCart();
  const navListRef = useRef(null);
  const indicatorRef = useRef(null);

  const moveIndicatorTo = (el) => {
    if (!el || !navListRef.current || !indicatorRef.current || !isDesktopViewport()) return;
    const containerRect = navListRef.current.getBoundingClientRect();
    const itemRect = el.getBoundingClientRect();
    indicatorRef.current.style.width = `${itemRect.width}px`;
    indicatorRef.current.style.left = `${itemRect.left - containerRect.left}px`;
    indicatorRef.current.style.opacity = "1";
  };

  const resetIndicatorToActive = () => {
    if (!navListRef.current || !indicatorRef.current) return;
    if (!isDesktopViewport()) {
      indicatorRef.current.style.opacity = "0";
      return;
    }
    const activeEl = navListRef.current.querySelector(".nav-link.active");
    if (activeEl) {
      moveIndicatorTo(activeEl);
    } else {
      indicatorRef.current.style.opacity = "0";
    }
  };

  useEffect(() => {
    // Route just changed, or viewport was resized: snap the pill back to the active tab
    resetIndicatorToActive();
    window.addEventListener("resize", resetIndicatorToActive);
    return () => window.removeEventListener("resize", resetIndicatorToActive);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const signoutClick = () => {
    clearJWT();
  }
  return (
    <>
      <header className="site-header">
        <nav className="navbar navbar-expand-lg navbar-dark">
          <div className="container-fluid">
            <NavLink className="navbar-brand" to="/">
              <img src={image_logo} alt="logo" style={{ width: 34, height: 34, objectFit: "cover" }} />
              Online Marketing
            </NavLink>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="collapsibleNavbar">
              <ul className="navbar-nav ms-auto nav-flair" ref={navListRef} onMouseLeave={resetIndicatorToActive}>
                <li className="nav-indicator" ref={indicatorRef} aria-hidden="true"></li>
                <li className="nav-item" onMouseEnter={(e) => moveIndicatorTo(e.currentTarget)}>
                  <NavLink className="nav-link" to="/" end>
                    <span className="nav-link__icon"><i className="fas fa-home"></i></span>
                    <span className="nav-link__label">Posts</span>
                  </NavLink>
                </li>
                <li className="nav-item" onMouseEnter={(e) => moveIndicatorTo(e.currentTarget)}>
                  <NavLink className="nav-link" to="/profile">
                    <span className="nav-link__icon"><i className="fa-regular fa-user"></i></span>
                    <span className="nav-link__label">Profile</span>
                  </NavLink>
                </li>
                <li className="nav-item" onMouseEnter={(e) => moveIndicatorTo(e.currentTarget)}>
                  <NavLink className="nav-link cart-link" to="/cart">
                    <span className="nav-link__icon">
                      <i className="fas fa-shopping-cart"></i>
                      {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                    </span>
                    <span className="nav-link__label">Cart</span>
                  </NavLink>
                </li>
              </ul>

              <div className="nav-divider"></div>

              <div className="nav-account">
                {!isAuthenticated() &&
                  <NavLink className="btn-signin" to="/users/signin">
                    <i className="fa-solid fa-right-to-bracket"></i> Sign in
                  </NavLink>}
                {isAuthenticated() &&
                  <Link className="user-chip" to="/" onClick={signoutClick} title="Sign out">
                    <span className="user-chip__avatar">{(getUsername() || "?")[0].toUpperCase()}</span>
                    <span className="user-chip__name">{getUsername()}</span>
                    <i className="fa-solid fa-right-from-bracket user-chip__icon"></i>
                  </Link>}
              </div>
            </div>
          </div>
        </nav>
      </header>

      <Outlet />
    </>
  )
};

export default Header;
