import { useEffect, useMemo, useState } from "react";
import { disable, userList } from "../datasource/api-posts";
import { Link } from "react-router-dom";
import { isAuthenticated, getUsername, getToken } from "./auth/auth-helper";
import CATEGORIES from "../datasource/categories";

const CATEGORY_LABELS = CATEGORIES.reduce((map, category) => {
  map[category.value] = category.label;
  return map;
}, {});
const CATEGORY_ICONS = CATEGORIES.reduce((map, category) => {
  map[category.value] = category.icon;
  return map;
}, {});

const FILTERS = [
  { key: "all", label: "All" },
  { key: "enabled", label: "Active" },
  { key: "disabled", label: "Disabled" },
];

const getExpiryInfo = (expire) => {
  if (!expire) return null;
  const expiryDate = new Date(expire);
  if (Number.isNaN(expiryDate.getTime())) return null;
  const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return { label: "Expired", tone: "expired" };
  if (daysLeft <= 3) return { label: `${daysLeft}d left`, tone: "soon" };
  return { label: expiryDate.toLocaleDateString(), tone: "normal" };
};

const hasImage = (image) => (Array.isArray(image) ? image.length > 0 : Boolean(image));

const ProfilePosts = () => {
  const [postList, setPostList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [brokenImageIds, setBrokenImageIds] = useState(() => new Set());

  const refreshList = () => {
    setIsLoading(true);
    const token = getToken();

    userList(token)
      .then((data) => {
        console.log("Backend Response Data:", data);
        if (Array.isArray(data)) {
          const username = getUsername();
          const filteredPosts = data.filter(
            (post) => post.owner && post.owner.username === username
          );

          if (filteredPosts.length > 0 && filteredPosts[0].owner) {
            console.log("User ID:", filteredPosts[0].owner._id); // Log user ID here
          }

          console.log("Filtered Posts:", filteredPosts);
          setPostList(filteredPosts);
        } else {
          alert("Failed to load posts: " + (data.message || "Unknown error"));
        }
        setIsLoading(false);
      })
      .catch((err) => {
        alert(err.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      alert("You are not authenticated. Please sign in first.");
      return;
    }
    refreshList();
  }, []);

  const handleDisable = (id) => {
    if (!isAuthenticated()) {
      window.alert("You are not authenticated. Please, proceed with sign-in first.");
    } else {
      if (window.confirm("Are you sure you want to disable this item?")) {
        disable(id)
          .then((data) => {
            if (data && data.success) {
              setPostList((prev) => prev.filter((post) => post.id !== id));
              refreshList();
            } else {
              alert(data.message);
            }
          })
          .catch((err) => {
            alert(err.message);
          });
      }
    }
  };

  const owner = postList.length > 0 ? postList[0].owner : null;
  const initials = owner
    ? `${(owner.firstName || "?")[0]}${(owner.lastName || "")[0] || ""}`.toUpperCase()
    : "?";

  const stats = useMemo(() => {
    const total = postList.length;
    const active = postList.filter((p) => p.status !== "disabled").length;
    const disabledCount = total - active;
    const questions = postList.reduce((sum, p) => sum + (p.questionsCount || 0), 0);
    return { total, active, disabledCount, questions };
  }, [postList]);

  const visiblePosts = useMemo(() => {
    if (filter === "all") return postList;
    return postList.filter((post) =>
      filter === "disabled" ? post.status === "disabled" : post.status !== "disabled"
    );
  }, [postList, filter]);

  const filterIndex = FILTERS.findIndex((f) => f.key === filter);

  return (
    <main className="container" style={{ paddingTop: 96, paddingBottom: 40 }}>
      <div className="profile-header">
        <div className="d-flex align-items-center" style={{ gap: 20 }}>
          <div className="profile-avatar">{initials}</div>
          <div>
            <h2 className="profile-name">
              {owner ? `${owner.firstName} ${owner.lastName}` : "My Profile"}
            </h2>
            <p className="profile-meta">
              {owner ? `@${owner.username} · ${owner.email}` : "Loading your details…"}
            </p>
            <div className="profile-stats">
              <div className="profile-stat">
                <strong>{stats.total}</strong> Listings
              </div>
              <div className="profile-stat">
                <strong>{stats.active}</strong> Active
              </div>
              <div className="profile-stat">
                <strong>{stats.questions}</strong> Questions
              </div>
            </div>
          </div>
        </div>
        {owner && owner._id ? (
          <Link to={`/users/edit/${owner._id}`} className="btn btn-primary" role="button">
            <i className="fas fa-pencil-alt"></i> Edit Profile
          </Link>
        ) : (
          <span className="btn btn-secondary disabled">Loading...</span>
        )}
      </div>

      <div className="page-heading">
        <h3 className="section-title" style={{ marginBottom: 0, display: "inline-block" }}>My Advertisements</h3>
        <Link to="/posts/add" className="btn btn-primary" role="button">
          <i className="fas fa-plus-circle"></i> Add a New Post
        </Link>
      </div>

      <div className="profile-tabs">
        <span
          className="profile-tabs__indicator"
          style={{
            width: `calc((100% - 8px) / ${FILTERS.length})`,
            transform: `translateX(${filterIndex * 100}%)`,
          }}
        ></span>
        {FILTERS.map((f) => {
          const count =
            f.key === "all" ? stats.total : f.key === "enabled" ? stats.active : stats.disabledCount;
          return (
            <button
              key={f.key}
              type="button"
              className={`profile-tabs__btn${filter === f.key ? " active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label} <span className="profile-tabs__count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="row">
        {isLoading && <div className="loading-state">Loading your posts&hellip;</div>}
        {!isLoading && visiblePosts.length === 0 && postList.length === 0 && (
          <div className="empty-state">
            No posts available yet.
            <div className="mt-3">
              <Link to="/posts/add" className="btn btn-primary">
                <i className="fas fa-plus-circle me-1"></i> Create your first listing
              </Link>
            </div>
          </div>
        )}
        {!isLoading && visiblePosts.length === 0 && postList.length > 0 && (
          <div className="empty-state">No {filter} listings to show.</div>
        )}
        {!isLoading &&
          visiblePosts.map((post, i) => {
            const expiryInfo = getExpiryInfo(post.expire);
            const showImage = hasImage(post.image) && !brokenImageIds.has(post.id);
            return (
              <div key={i} className="col-sm-6 col-md-4 mb-4">
                <div className="card listing-card h-100">
                  <div className="listing-card__media">
                    {showImage ? (
                      <img
                        src={post.image}
                        alt={post.name}
                        onError={() =>
                          setBrokenImageIds((prev) => new Set(prev).add(post.id))
                        }
                      />
                    ) : (
                      <div className="listing-card__media-fallback">
                        <i className={`fas ${CATEGORY_ICONS[post.category] || "fa-image"}`}></i>
                      </div>
                    )}
                    <span className={`status-badge listing-card__status ${post.status === 'disabled' ? 'disabled' : 'enabled'}`}>
                      {post.status || 'Unknown'}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start" style={{ gap: 8 }}>
                      <div>
                        {post.category && (
                          <span className="category-chip">{CATEGORY_LABELS[post.category] || post.category}</span>
                        )}
                        <h5 className="card-title mb-0">{post.name || 'Unnamed Post'}</h5>
                      </div>
                      <div className="price-tag" style={{ margin: 0, whiteSpace: "nowrap" }}>${post.price || '0'}</div>
                    </div>
                    <p className="card-text description mt-2">{post.description || 'No Description'}</p>

                    <div className="listing-card__meta">
                      <span>
                        <i className="fa-regular fa-comment-dots me-1"></i>
                        {post.questionsCount >= 1 ? `${post.questionsCount} question${post.questionsCount > 1 ? 's' : ''}` : 'No questions'}
                      </span>
                      {expiryInfo && (
                        <span className={`listing-card__expiry listing-card__expiry--${expiryInfo.tone}`}>
                          <i className="fa-regular fa-clock me-1"></i>
                          {expiryInfo.label}
                        </span>
                      )}
                    </div>

                    <div className="listing-card__actions">
                      <Link
                        className="btn btn-primary btn-sm"
                        to={'/posts/edit/' + post.id}>
                        <i className="fas fa-pencil-alt"></i> Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDisable(post.id)}>
                        <i className="fa-regular fa-eye-slash"></i> Disable
                      </button>
                      <Link
                        className="btn btn-success btn-sm"
                        to={`/questions/answer/${post.id}`}>
                        <i className="fas fa-reply"></i> Answer
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
};

export default ProfilePosts;
