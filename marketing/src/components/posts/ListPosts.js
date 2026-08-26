
import { useEffect, useState } from "react";
import { disable, list } from "../../datasource/api-posts";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/auth-helper";
import CATEGORIES from "../../datasource/categories";

const CATEGORY_LABELS = CATEGORIES.reduce((map, category) => {
    map[category.value] = category.label;
    return map;
}, {});

const ListPosts = () => {
    let [postList, setPostList] = useState([]);
    let [isLoading, setIsLoading] = useState(true);

    const refreshList = async () => {
        setIsLoading(true);
        try {
            const data = await list(); // Fetch the list of posts
            console.log("Response: ", data);
            if (data) {
                setPostList(data); // Update state with the fetched posts
            }
        } catch (err) {
            alert(err.message);
            console.error(err);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        refreshList(); // Call refreshList to fetch data when the component mounts
    }, []);

    const handleDisable = (id) => {
        if (!isAuthenticated()) {
            window.alert("You are not authenticated. Please, proceed with sign-in first.");
        } else {
            if (window.confirm("Are you sure you want to disable this item?")) {
                disable(id)
                    .then((data) => {
                        if (data && data.success) {
                            const newList = postList.filter((post) => post.id !== id); // Filter out the disabled post
                            setPostList(newList);
                            refreshList(); // Refresh the list after disabling
                        } else {
                            alert(data.message);
                        }
                    })
                    .catch((err) => {
                        alert(err.message);
                        console.error(err);
                    });
            }
        }
    };

    return (
        <main className="container" style={{ paddingTop: 96, paddingBottom: 40 }}>
            <div className="page-heading">
                <h1 style={{ marginBottom: 0 }}>Posts List</h1>
                <Link to="/posts/add" className="btn btn-primary" role="button">
                    <i className="fas fa-plus-circle"></i>
                    Add a New Post
                </Link>
            </div>
            <div className="table-card">
                <div className="table-responsive">
                    {isLoading && <div className="loading-state">Loading...</div>}
                    {!isLoading && (
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th className="text-center">Name</th>
                                    <th className="text-center">Price</th>
                                    <th className="text-center">Description</th>
                                    <th className="text-center">Category</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center">Expire Date</th>
                                    <th className="text-center">Questions</th>
                                    <th className="text-center" colSpan="2">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {postList.map((post, i) => (
                                    <tr key={i}>
                                        <td className="text-center">{post.name || ""}</td>
                                        <td className="text-center">{`$${post.price || 0}`}</td>
                                        <td className="text-center">{post.description || ""}</td>
                                        <td className="text-center">
                                            {post.category
                                                ? <span className="category-chip">{CATEGORY_LABELS[post.category] || post.category}</span>
                                                : "—"}
                                        </td>
                                        <td className="text-center">
                                            <span className={`status-badge ${post.status === 'disabled' ? 'disabled' : 'enabled'}`}>
                                                {post.status || "unknown"}
                                            </span>
                                        </td>
                                        <td className="text-center">{post.expire || ""}</td>
                                        <td className="text-center">
                                            {post.questionsCount > 0
                                                ? `${post.questionsCount} question(s)`
                                                : "0"}
                                        </td>
                                        <td className="text-center">
                                            <Link className="btn bg-primary btn-primary btn-sm" to={`/posts/edit/${post.id}`}>
                                                <i className="fas fa-pencil-alt"></i>
                                            </Link>
                                        </td>
                                        <td className="text-center">
                                            <button
                                                className="btn bg-danger btn-danger btn-sm"
                                                onClick={() => handleDisable(post.id)}
                                            >
                                                <i className="fa-regular fa-eye-slash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ListPosts;
