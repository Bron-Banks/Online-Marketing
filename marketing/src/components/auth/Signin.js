import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { signIn } from "../../datasource/api-users";
import { authenticate } from "./auth-helper";

const Signin = () => {

    const { state } = useLocation();
    const { from } = state || { from: { pathname: '/' } };

    const [errorMsg, setErrorMsg] = useState('')
    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    let navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        signIn(user).then((response) => {
            if (response && response.success) {
                authenticate(response.token, () => {
                    navigate(from, {replace: true});
                });
            }
            else {
                setErrorMsg(response.message);
            }
        }).catch(err => {
            setErrorMsg(err.message);
            console.log(err)
        });
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h1>Welcome Back</h1>
                <p className="auth-subtitle">Sign in to manage your listings and orders.</p>
                {errorMsg && <p className="flash"><span>{errorMsg}</span></p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="emailTextField">Email</label>
                        <input type="text" className="form-control"
                            id="emailTextField"
                            placeholder="Enter your email"
                            name="email"
                            value={user.email || ''}
                            onChange={handleChange}
                            required>
                        </input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="passowordTextField">Password</label>
                        <input type="password" className="form-control"
                            id="passowordTextField"
                            placeholder=""
                            name="password"
                            value={user.password || ''}
                            onChange={handleChange}
                            required>
                        </input>
                    </div>

                    <button className="btn btn-primary mt-2" type="submit">
                        <i className="fas fa-right-to-bracket me-1"></i>
                        Login
                    </button>

                    <p className="auth-footer">
                        Don&apos;t have an account?{" "}
                        <Link to="/users/register">
                            Sign up <i className="fas fa-user-plus"></i>
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signin;