import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { read } from "../datasource/api-posts";
import { Carousel } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import CATEGORIES from "../datasource/categories";

const CATEGORY_LABELS = CATEGORIES.reduce((map, category) => {
  map[category.value] = category.label;
  return map;
}, {});

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [post, setPost] = useState({
    name: "",
    description: "",
    price: 0,
    status: "",
    expire: "",
    image: "",
    images: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_APIURL}/questions/post/${id}`);
      if (!response.ok) throw new Error("Failed to fetch questions");

      const data = await response.json();
      setQuestions(data);
      setQuestionsCount(data.length);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) {
      alert("Please enter a question before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_APIURL}/questions/post/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newQuestion }),
      });
      if (!response.ok) throw new Error("Failed to add question");

      const data = await response.json();
      setQuestions((prevQuestions) => [...prevQuestions, data.question]);
      setQuestionsCount((prevCount) => prevCount + 1);
      setNewQuestion("");
      await fetchQuestions();
    } catch (error) {
      console.error(error.message);
      alert("Failed to add the question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const data = await read(id);
        console.log("Fetched Post Data:", data);

        if (data) {
          setPost({
            ...data,
            images: Array.isArray(data.image) ? data.image : [data.image].filter(Boolean),
          });
        }
        fetchQuestions();
        setIsLoading(false);
      } catch (error) {
        console.error(error.message);
        setIsLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  const handleAddToCart = () => {
    const primaryImage =
      post.images && post.images.length > 0
        ? `${process.env.REACT_APP_APIURL}/uploads/images/${post.images[0]}`
        : "";

    addToCart(
      {
        id: post.id,
        name: post.name,
        price: Number(post.price) || 0,
        image: primaryImage,
      },
      quantity
    );

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  if (isLoading) {
    return <div className="loading-state" style={{ paddingTop: 96 }}>Loading listing&hellip;</div>;
  }

  if (!post) {
    return <div className="empty-state" style={{ marginTop: 96 }}>No post found!</div>;
  }

  return (
    <main className="container" style={{ paddingTop: 96, paddingBottom: 40 }}>
      <div className="content-wrapper">
        {/* Left Side: Details and Image Card */}
        <div className="details-card">
          {/* Image Carousel Section */}
          <div style={{ height: "300px", overflow: "hidden" }}>
            {post.images && post.images.length > 0 ? (
              <Carousel>
                {post.images.map((image, idx) => (
                  <Carousel.Item key={idx}>
                    <img
                      src={`${process.env.REACT_APP_APIURL}/uploads/images/${image}`}
                      className="d-block w-100"
                      alt={`Slide ${idx + 1}`}

                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <div
                style={{
                  backgroundColor: "var(--color-bg)",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-muted)",
                }}
              >
                No Image Available
              </div>
            )}
          </div>

          {/* Post Details */}
          <div style={{ flexGrow: "1" }}>
            {post.category && (
              <span className="category-chip">{CATEGORY_LABELS[post.category] || post.category}</span>
            )}
            <h3 style={{ marginBottom: 4 }}>{post.name}</h3>
            <div className="price-tag" style={{ fontSize: "1.4rem" }}>${post.price.toFixed(2)}</div>
            <div className="detail-row">
              <div className="detail-label">Description</div>
              <p style={{ margin: 0 }}>{post.description}</p>
            </div>

            <div className="detail-row">
              <div className="detail-label">Quantity</div>
              <div className="qty-selector">
                <div className="qty-stepper">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                <span className="page-subtitle" style={{ marginBottom: 0 }}>
                  Total: <strong style={{ color: "var(--color-text)" }}>${(post.price * quantity).toFixed(2)}</strong>
                </span>
              </div>
            </div>

            <div className="d-flex flex-wrap" style={{ gap: 10, marginTop: 16 }}>
              <button type="button" className="btn btn-primary" onClick={handleAddToCart}>
                <i className="fas fa-cart-plus me-2"></i>
                {addedToCart ? "Added!" : "Add to Cart"}
              </button>
              <button
                type="button"
                className="btn btn-gradient-accent"
                onClick={() => {
                  handleAddToCart();
                  navigate("/cart");
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Questions Card */}
        <div className="questions-card">
          <div className="overflow-auto" style={{ flexGrow: "1", maxHeight: "400px" }}>
            <h5>Questions</h5>
            {questions.length > 0 ? (
              <ul>
                {questions.map((question, index) => (
                  <li key={index}>
                    <p style={{ margin: 0 }}>
                      <strong>{question.askedBy}</strong>: {question.question}
                    </p>
                    {question.answer && (
                      <p style={{ margin: "6px 0 0" }}>
                        <em>Answer:</em> {question.answer}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="page-subtitle" style={{ marginBottom: 0 }}>No questions yet. Be the first to ask!</p>
            )}
          </div>
          <div style={{ padding: "24px", borderTop: "1px solid var(--color-border)" }}>
            <textarea
              className="form-control"
              rows="3"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Type your question here and your email, our Customer Service will reach out to you shortly ..."
            ></textarea>
            <button
              id="addQuestion"
              className="btn btn-dark mt-2"
              onClick={handleAddQuestion}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting…" : "Add Question"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PostDetails;