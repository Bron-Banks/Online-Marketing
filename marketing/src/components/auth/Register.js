import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../datasource/api-users"; 
import UserModel from "../../datasource/userModel"; 

const RegisterUser = () => {
    let navigate = useNavigate();
    let [user, setUser] = useState(new UserModel()); 

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value })); 
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Assuming register function expects a UserModel object
        register(user)
            .then((response) => {
                if (response && response.message === "User created successfully."){
                    alert("User created successfully!")
                    navigate("/users/signin");
                } else {
                    alert(response.message || "Registration failed");
                }
            })
            .catch((err) => {
                alert("Registration failed: " + err.message);
                console.log(err);
            });
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card" style={{ maxWidth: 480 }}>
                    <h1>Create Your Account</h1>
                    <p className="auth-subtitle">Join Online Marketing to buy and sell with ease.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="firstNameTextField">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="firstNameTextField"
                                placeholder="Enter your first name"
                                name="firstName"
                                value={user.firstName || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastNameTextField">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="lastNameTextField"
                                placeholder="Enter your last name"
                                name="lastName"
                                value={user.lastName || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="emailTextField">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="emailTextField"
                                placeholder="Enter your email"
                                name="email"
                                value={user.email || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="usernameTextField">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="usernameTextField"
                                placeholder="Enter your username"
                                name="username"
                                value={user.username || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="passwordTextField">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="passwordTextField"
                                placeholder="Enter your password"
                                name="password"
                                value={user.password || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button className="btn btn-primary mt-2" type="submit">
                            <i className="fas fa-user-plus me-1"></i>
                            Register
                        </button>

                        <p className="auth-footer">
                            Already have an account?{" "}
                            <Link to="/users/signin">
                                Log in <i className="fas fa-sign-in-alt"></i>
                            </Link>
                        </p>
                    </form>
            </div>
        </div>
    );
};

export default RegisterUser;
