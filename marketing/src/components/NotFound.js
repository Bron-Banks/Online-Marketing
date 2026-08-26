import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="not-found">
            <div className="not-found-code">404</div>
            <h1>Page not found</h1>
            <p>The page you're looking for doesn't exist or may have been moved.</p>
            <Link to="/" className="btn btn-primary">
                <i className="fas fa-home me-1"></i> Back to Home
            </Link>
        </div>
    );
};

export default NotFound;
