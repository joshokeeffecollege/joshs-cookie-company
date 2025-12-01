import {useEffect, useState} from "react";
import axiosClient from "../api/axiosClient.js";

export default function Reviews() {
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // fetch current user for auth and reviews
    useEffect(() => {
        let isMounted = true;

        async function loadInitialData() {
            try {
                // check if user is logged in
                try {
                    const loggedIn = await axiosClient.get("/me");
                    if (isMounted) {
                        setUser(loggedIn.data.user);
                    }
                } catch (error) {
                    if (!isMounted) return;
                    if (error.response?.status === 401) {
                        // not logged in
                        setUser(null);
                    } else {
                        console.error(error);
                        setError("Could not load user");
                    }
                }

                // fetch reviews
                try {
                    const res = await axiosClient.get("/reviews");
                    if (isMounted) {
                        setReviews(Array.isArray(res.data) ? res.data : []);
                    }
                } catch (error) {
                    if (!isMounted) return;
                    console.error(error);
                    setError("Could not load reviews");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadInitialData();

        return () => {
            isMounted = false;
        };
    }, []); // IMPORTANT: only run on mount

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (!content.trim()) {
            setError("Review cannot be empty");
            return;
        }

        setSubmitting(true);

        try {
            // SECURE: use POST, not GET, to create a new review
            // We only send the review content – the backend should derive
            // the author from the authenticated user, not trust the client.
            const res = await axiosClient.post("/reviews", {
                content: content.trim(),
            });

            const createdReview = res.data?.review ?? res.data;

            // add review without reloading page (if backend returns it)
            if (createdReview) {
                setReviews((prev) => [createdReview, ...prev]);
            } else {
                // fallback – re-fetch list if shape is different
                const refreshed = await axiosClient.get("/reviews");
                setReviews(Array.isArray(refreshed.data) ? refreshed.data : []);
            }

            setContent("");
            setMessage("Thank you for your review!");
        } catch (error) {
            console.error("Error submitting review:", error);

            if (error.response?.status === 401) {
                setError("You must be logged in to leave a review.");
                setUser(null);
            } else {
                setError("There was a problem submitting your review. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="py-5">
                <div className="container-fluid px-5">
                    <h1 className="h3 mb-3">Customer Reviews</h1>
                    <p>Loading reviews...</p>
                </div>
            </div>
        );
    }

    const safeReviews = Array.isArray(reviews) ? reviews : [];

    return (
        <div className="py-5">
            <div className="container-fluid px-5">
                <h1 className="h3 mb-3">Customer Reviews</h1>

                {/* only logged in users can leave reviews */}
                {user && (
                    <div className="card mb-4">
                        <div className="card-body">
                            <h2 className="h5 mb-3">Leave a review</h2>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            {message && (
                                <div className="alert alert-info" role="alert">
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <textarea
                                        id="content"
                                        className="form-control"
                                        rows="4"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Your review"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-warning"
                                    disabled={submitting}
                                >
                                    {submitting ? "Submitting..." : "Submit Review"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {!user && (
                    <p className="text-muted">
                        You must be logged in to leave a review. You can still read what others
                        have said below.
                    </p>
                )}

                {/* reviews */}
                {safeReviews
                    .filter((r) => r && (r.author || r.content))
                    .map((review) => (
                        <div
                            key={review.id || `${review.author ?? "anon"}-${review.content}`}
                            className="card mb-3"
                        >
                            <div className="card-body">
                                <h5 className="card-title">{review.author || "Anonymous"}</h5>
                                <p className="card-text">{review.content}</p>
                            </div>
                        </div>
                    ))}

                {safeReviews.length === 0 && (
                    <p className="text-muted">
                        No reviews yet. Be the first to leave us a review.
                    </p>
                )}
            </div>
        </div>
    );
}
