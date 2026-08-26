import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { read, update } from "../../datasource/api-users";
import UserModel from "../../datasource/userModel";
let apiURL = process.env.REACT_APP_APIURL;

const EditProfile = () => {
  const { id } = useParams(); // Extract the user ID from the URL
  console.log("Extracted userID:", id);
  
  const navigate = useNavigate(); // Navigation hook to redirect
  const [user, setUser] = useState(new UserModel("", "", "", "", "", "")); // Initialize user state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching from API URL:", apiURL + `/users/get/${id}`);
        const userData = await read(id);
        console.log("Response from read():", userData);
        setUser(
          new UserModel(
            userData._id,
            userData.firstName,
            userData.lastName,
            userData.email,
            userData.username,
          )
        );
      } catch (err) {
        setError("Failed to load user data.");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, [id]);  

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await update(id, user);
      alert("Profile updated successfully!");
      navigate(`/profile`); // Redirect to the profile page
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error(err);
    }
  };

  if (loading) return <div className="loading-state" style={{ paddingTop: 96 }}>Loading...</div>;
  if (error) return <div className="empty-state" style={{ marginTop: 96 }}>Error: {error}</div>;

  return (
    <div className="auth-wrapper">
            <div className="auth-card">
                <h1>Edit Profile</h1>
                <p className="auth-subtitle">Update your account details.</p>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        value={user.firstName}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        required
                        />
                    </div >
                    <div className="d-flex" style={{ gap: 10 }}>
                        <button className="btn btn-primary" style={{ flex: 1 }} type="submit">
                            <i className="fas fa-edit"></i>
                            Submit
                        </button>
                        <Link href="#" to="/profile" className="btn btn-warning" style={{ flex: 1 }}>
                            <i className="fas fa-undo"></i>
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
    </div>
);
};

export default EditProfile;
