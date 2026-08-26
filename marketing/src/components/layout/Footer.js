const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-grid">
                <div>
                    <div className="brand-line">
                        <i className="fas fa-store"></i> Online Marketing
                    </div>
                    <p>
                        A simple, secure marketplace to buy and sell items online &mdash;
                        find great deals from sellers near you.
                    </p>
                    <div className="footer-social">
                        <a href="/" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                        <a href="/" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                        <a href="/" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                    </div>
                </div>

                <div>
                    <h5>Shop</h5>
                    <ul>
                        <li><a href="/">All Posts</a></li>
                        <li><a href="/cart">Cart</a></li>
                        <li><a href="/profile">My Profile</a></li>
                    </ul>
                </div>

                <div>
                    <h5>Account</h5>
                    <ul>
                        <li><a href="/users/signin">Sign In</a></li>
                        <li><a href="/users/register">Register</a></li>
                        <li><a href="/posts/add">Sell an Item</a></li>
                    </ul>
                </div>

                <div>
                    <h5>Contact</h5>
                    <ul>
                        <li><i className="fas fa-envelope me-2"></i>support@onlinemarketing.com</li>
                        <li><i className="fas fa-phone me-2"></i>+1 (555) 010-0198</li>
                        <li><i className="fas fa-location-dot me-2"></i>Toronto, Canada</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} Online Marketing. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
