import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { read, update } from "../../datasource/api-posts";
import PostModel from "../../datasource/postModel";
import CATEGORIES from "../../datasource/categories";

const EditPost = () => {
    let navigate = useNavigate();
    let { id } = useParams();
    let [post, setPost] = useState(new PostModel());
    let [newImages, setNewImages] = useState([]); // Array of { file, url } for newly selected images
    let [selectedImagesToRemove, setSelectedImagesToRemove] = useState([]); // Filenames of existing images queued for removal

    useEffect(() => {
        read(id).then((response) => {
            if (response) {
                setPost(new PostModel(
                    response.id,
                    response.name,
                    response.price,
                    response.description,
                    response.category,
                    response.status,
                    response.expire,
                    response.image // Make sure to include the existing images
                ));
            }
        }).catch(err => {
            alert(err.message);
            console.log(err);
        });
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files).map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setNewImages((prev) => [...prev, ...newFiles]); // Accumulate across multiple selections
        event.target.value = ""; // allow re-selecting the same file(s) again
    };

    const handleRemoveNewImage = (index) => {
        setNewImages((prev) => {
            const target = prev[index];
            if (target) URL.revokeObjectURL(target.url);
            return prev.filter((_, i) => i !== index);
        });
    };

    useEffect(() => {
        // Revoke any remaining preview URLs when the form unmounts
        return () => {
            newImages.forEach((img) => URL.revokeObjectURL(img.url));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleImageRemove = (image) => {
        setSelectedImagesToRemove(prev => [...prev, image]); // Queue for removal on submit
        setPost((prev) => ({ ...prev, image: prev.image.filter((img) => img !== image) })); // Reflect removal immediately
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        let newPost = new FormData();
        newPost.append('id', post.id);
        newPost.append('name', post.name);
        newPost.append('price', post.price);
        newPost.append('description', post.description);
        newPost.append('category', post.category || '');
        newPost.append('status', post.status);
        newPost.append('expire', post.expire);

        // Append newly selected files, if any
        newImages.forEach(({ file }) => {
            newPost.append('images', file);
        });

        // Append images to be removed (repeated field, parsed as an array by the backend)
        selectedImagesToRemove.forEach((image) => {
            newPost.append('removeImages', image);
        });

        update(id, newPost).then(response => {
            if (response && response.success) {
                alert(response.message);
                navigate("/profile");
            } else {
                alert(response.message);
            }
        }).catch(err => {
            alert(err.message);
            console.log(err);
        });
    };

    return (
        <div className="containerSe" style={{ paddingTop: 96 }}>
            <div className="row">
                <div className="offset-md-3 col-md-6">
                    <h1>Edit Post</h1>
                    <p className="page-subtitle">Update your listing details below.</p>
                    <form onSubmit={handleSubmit} className="form" encType="multipart/form-data">
                        <div className="form-group">
                            <input type="hidden" name="id" value={post.id || ''} />
                            <label htmlFor="itemTextField">Product Name</label>
                            <input type="text" className="form-control"
                                id="itemTextField"
                                placeholder="Enter the Product Name"
                                name="name"
                                value={post.name || ''}
                                onChange={handleChange}
                                required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="priceTextField">Price</label>
                            <input type="number" className="form-control"
                                id="priceTextField"
                                placeholder="00"
                                name="price"
                                value={post.price || 0}
                                onChange={handleChange}
                                required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="descTextField">Description</label>
                            <input type="text" className="form-control"
                                id="descTextField"
                                placeholder="Enter Product Description"
                                name="description"
                                value={post.description || ''}
                                onChange={handleChange}
                                required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="categoryField">Category</label>
                            <select
                                className="form-select"
                                id="categoryField"
                                name="category"
                                value={post.category || ''}
                                onChange={handleChange}
                            >
                                <option value="">Select a category</option>
                                {CATEGORIES.map((category) => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="statusTextField">Status</label>
                            <div className="d-flex" style={{ gap: 20 }}>
                                <label style={{ fontWeight: 400 }}>
                                    <input type="radio"
                                        id="statusEnable"
                                        name="status"
                                        value="enabled"
                                        checked={post.status === 'enabled'}
                                        onChange={handleChange} /> Enable
                                </label>
                                <label style={{ fontWeight: 400 }}>
                                    <input type="radio"
                                        id="statusDisable"
                                        name="status"
                                        value="disabled"
                                        checked={post.status === 'disabled'}
                                        onChange={handleChange} /> Disable
                                </label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="expireTextField">Expire Date</label>
                            <input type="date" className="form-control"
                                id="expireTextField"
                                placeholder="YYYY/MM/DD"
                                name="expire"
                                value={post.expire || ''}
                                onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="images">Add New Images</label>
                            <input type="file" className="form-control"
                                id="images"
                                name="images"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange} />
                            {newImages.length > 0 && (
                                <div className="image-grid">
                                    {newImages.map((image, index) => (
                                        <div className="image-item" key={image.url}>
                                            <img
                                                src={image.url}
                                                alt={`New upload ${index}`}
                                                className="image-thumbnail"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveNewImage(index)}
                                                className="remove-button"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <h5>Existing Images:</h5>
                            {post.image && post.image.length > 0 ? (
                                <div className="image-grid">
                                    {post.image.map((image, index) => (
                                        <div className="image-item" key={image}>
                                            {/* Display the image */}
                                            <img
                                                src={`${process.env.REACT_APP_APIURL}/uploads/images/${image}`}
                                                alt={`Post Image ${index}`}
                                                className="image-thumbnail"
                                            />
                                            <button type="button" onClick={() => handleImageRemove(image)} className="remove-button">&times;</button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="page-subtitle" style={{ marginBottom: 0 }}>
                                    No existing images. Add some above.
                                </p>
                            )}
                        </div>
                        <div className="d-flex" style={{ gap: 10 }}>
                            <button className="btn btn-primary" type="submit">
                                <i className="fas fa-edit"></i>
                                Submit
                            </button>
                            <Link href="#" to="/profile" className="btn btn-warning">
                                <i className="fas fa-undo"></i>
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPost;
