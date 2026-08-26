import { useEffect, useMemo, useState } from "react";
import { list } from "../datasource/api-posts";
//import { Link } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { Carousel } from "react-bootstrap"; // Import Carousel from react-bootstrap
import CATEGORIES from "../datasource/categories";
import { useCart } from "../context/CartContext";

// Import images from the assets folder
import electronicsImage from "../assets/electronics.jpg";
import furnitureImage from "../assets/furniture.jpg";
import fashionImage from "../assets/fashion.jpg";
import sportsImage from "../assets/sports.jpg";
import toysImage from "../assets/toys.jpg";

const CATEGORY_IMAGES = {
  electronics: electronicsImage,
  furniture: furnitureImage,
  fashion: fashionImage,
  sports: sportsImage,
  toys: toysImage,
};

const CATEGORY_LABELS = CATEGORIES.reduce((map, category) => {
  map[category.value] = category.label;
  return map;
}, {});

const AllPosts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]); // List of posts
  const [selectedCategory, setSelectedCategory] = useState(null); // null = All
  const [addedIds, setAddedIds] = useState(() => new Set());
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const refreshList = async () => {
    setIsLoading(true);
    try {
      const data = await list();
      console.log("Response:", data);
      if (data) {
        const filteredPosts = data.filter(post => post.status === "enabled");
        setPosts(filteredPosts);
      }
    } catch (err) {
      alert(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestions = (id) => {
    console.log(`Navigating to questions for post ID: ${id}`);
    navigate(`/posts/get/${id}`); // Navigate to the post details page
  };

  useEffect(() => {
    refreshList();
  }, []);

  const visiblePosts = useMemo(
    () =>
      selectedCategory
        ? posts.filter((post) => post.category === selectedCategory)
        : posts,
    [posts, selectedCategory]
  );

  const handleCategoryClick = (value) => {
    setSelectedCategory((prev) => (prev === value ? null : value));
  };

  const handleAddToCart = (post) => {
    const image =
      post.images && post.images.length > 0 ? post.images[0] : post.image || "";
    addToCart({ id: post.id, name: post.name, price: Number(post.price) || 0, image });
    setAddedIds((prev) => new Set(prev).add(post.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(post.id);
        return next;
      });
    }, 2000);
  };

  return (
    <main className="container" style={{ paddingTop: 96, paddingBottom: 40 }}>
      <section className="hero">
        <h1>Find great deals from sellers near you</h1>
        <p>
          Browse thousands of listings across electronics, furniture, fashion and more &mdash;
          or list your own item in minutes.
        </p>
        <Link to="/posts/add" className="btn btn-lg btn-gradient-accent">
          <i className="fas fa-plus-circle me-2"></i>Sell an Item
        </Link>
      </section>

      <section className="category-section mb-5">
        <h2 className="section-title" style={{ display: "inline-block" }}>Shop by Category</h2>
        <div className="category-grid">
          <div
            className={`category-card${selectedCategory === null ? " active" : ""}`}
            onClick={() => setSelectedCategory(null)}
          >
            <div className="category-card__circle category-card__circle--all">
              <i className="fas fa-border-all"></i>
            </div>
            <div className="category-card__label">All</div>
          </div>
          {CATEGORIES.map((category) => (
            <div
              key={category.value}
              className={`category-card${selectedCategory === category.value ? " active" : ""}`}
              onClick={() => handleCategoryClick(category.value)}
            >
              <div
                className="category-card__circle"
                style={{ backgroundImage: `url(${CATEGORY_IMAGES[category.value]})` }}
              ></div>
              <div className="category-card__label">{category.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="page-heading">
          <h2 className="section-title" style={{ marginBottom: 0, display: "inline-block" }}>
            {selectedCategory ? `${CATEGORY_LABELS[selectedCategory]} Listings` : "Latest Listings"}
          </h2>
          {selectedCategory && (
            <button
              type="button"
              className="btn btn-warning btn-sm"
              onClick={() => setSelectedCategory(null)}
            >
              <i className="fas fa-xmark me-1"></i> Clear filter
            </button>
          )}
        </div>
        <div className="product-grid">
          {isLoading && <div className="loading-state">Loading listings&hellip;</div>}
          {!isLoading && visiblePosts.length === 0 && (
            <div className="empty-state">
              {selectedCategory
                ? `No listings in ${CATEGORY_LABELS[selectedCategory]} yet. Check back soon!`
                : "No listings available right now. Check back soon!"}
            </div>
          )}
          {!isLoading &&
            visiblePosts.map((post, i) => (
              <div className="custom-col mb-4" key={i}>
                <div className="card product-card h-100">
                  {/* Check if images are available for a carousel */}
                  {post.images && post.images.length > 0 ? (
                    <Carousel>
                      {post.images.map((image, idx) => (
                        <Carousel.Item key={idx}>
                          <img
                            src={image}
                            className="d-block w-100"
                            alt={`Slide ${idx + 1}`}
                            style={{
                              height: "200px",
                              objectFit: "contain",
                              backgroundColor: "var(--color-bg)",
                            }}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : post.image ? (
                    // If no multiple images are available but a single image exists
                    <img
                      src={post.image}
                      className="card-img-top"
                      alt={post.name}
                      style={{
                        height: "200px",
                        objectFit: "contain",
                        backgroundColor: "var(--color-bg)",
                      }}
                    />
                  ) : (
                    // Fallback placeholder when no images are available
                    <div
                      className="card-img-top"
                      style={{
                        height: "200px",
                        backgroundColor: "var(--color-bg)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--color-muted)",
                      }}
                    >
                      No Image
                    </div>
                  )}

                  <div className="card-body">
                    {post.category && (
                      <span className="category-chip">{CATEGORY_LABELS[post.category] || post.category}</span>
                    )}
                    <h5 className="card-title">{post.name}</h5>
                    <div className="price-tag">${post.price}</div>
                    <p className="card-text description">{post.description}</p>
                    <div className="d-flex mt-auto" style={{ gap: 8 }}>
                      <Link to={`/posts/get/${post.id}`} className="btn btn-primary" style={{ flex: 1 }}>
                        View Details
                      </Link>
                      <button
                        type="button"
                        className={`btn btn-dark icon-btn${addedIds.has(post.id) ? " icon-btn--success" : ""}`}
                        title="Add to Cart"
                        aria-label="Add to Cart"
                        onClick={() => handleAddToCart(post)}
                      >
                        <i className={`fas ${addedIds.has(post.id) ? "fa-check" : "fa-cart-plus"}`}></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
};

export default AllPosts;
