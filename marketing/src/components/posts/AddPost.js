import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { create } from "../../datasource/api-posts";
import PostModel from "../../datasource/postModel";
import CATEGORIES from "../../datasource/categories";

const AddPost = () => {
    let navigate = useNavigate();
    let [post, setPost] = useState(new PostModel());
    let [images, setImages] = useState([]); // Array of { file, url } for newly selected images

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files).map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...newFiles]); // Accumulate across multiple selections
        event.target.value = ""; // allow re-selecting the same file(s) again
    };

    const handleRemoveImage = (index) => {
        setImages((prev) => {
            const target = prev[index];
            if (target) URL.revokeObjectURL(target.url);
            return prev.filter((_, i) => i !== index);
        });
    };

    useEffect(() => {
        // Revoke any remaining preview URLs when the form unmounts
        return () => {
            images.forEach((img) => URL.revokeObjectURL(img.url));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        // Use FormData to send data and the files
        const formData = new FormData();
        formData.append("id", post.id);
        formData.append("name", post.name);
        formData.append("price", post.price);
        formData.append("description", post.description);
        formData.append("category", post.category || "");
        formData.append("status", post.status || "enabled");
        formData.append("expire", post.expire);
        images.forEach(({ file }) => {
            formData.append("images", file); // Append each file
        });

        create(formData)
            .then((response) => {
                if (response && response.success) {
                    alert("Post added successfully");
                    navigate("/profile");
                } else {
                    alert(response.message);
                }
            })
            .catch((err) => {
                alert(err.message);
                console.log(err);
            });
    };

    return (
        <div className="containerSe" style={{ paddingTop: 96 }}>
            <div className="row">
                <div className="offset-md-3 col-md-6">
                    <h1>Add a New Post</h1>
                    <p className="page-subtitle">List an item for sale in a few quick steps.</p>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <input type="hidden" name="id" value={post.id || ''}></input>
                            <label htmlFor="productTextField">Product Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="productTextField"
                                placeholder="Enter the Product Name"
                                name="name"
                                value={post.name || ''}
                                onChange={handleChange}
                                required
                            ></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="priceTextField">Price</label>
                            <input
                                type="number"
                                className="form-control"
                                id="priceTextField"
                                placeholder="00"
                                name="price"
                                value={post.price || 0}
                                onChange={handleChange}
                                required
                            ></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="descTextField">Description</label>
                            <input
                                type="text"
                                className="form-control"
                                id="descTextField"
                                placeholder="Enter Product Description"
                                name="description"
                                value={post.description || ''}
                                onChange={handleChange}
                                required
                            ></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="categoryField">Category</label>
                            <select
                                className="form-select"
                                id="categoryField"
                                name="category"
                                value={post.category || ''}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select a category</option>
                                {CATEGORIES.map((category) => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="expireTextField">Expire Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="expireTextField"
                                placeholder="YYYY/MM/DD"
                                name="expire"
                                value={post.expire || ''}
                                onChange={handleChange}
                            ></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="imageField">Upload Images</label>
                            <input
                                type="file"
                                className="form-control"
                                id="imageField"
                                onChange={handleFileChange}
                                multiple // Allows multiple files to be selected
                                accept="image/*" // Restrict to image files only
                            />
                            {images.length > 0 && (
                                <div className="image-grid">
                                    {images.map((image, index) => (
                                        <div className="image-item" key={image.url}>
                                            <img
                                                src={image.url}
                                                alt={`Selected ${index}`}
                                                className="image-thumbnail"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="remove-button"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="d-flex" style={{ gap: 10 }}>
                            <button className="btn btn-primary" type="submit">
                                <i className="fas fa-edit"></i> Submit
                            </button>
                            <Link href="#" to="/profile" className="btn btn-warning">
                                <i className="fas fa-undo"></i> Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPost;
