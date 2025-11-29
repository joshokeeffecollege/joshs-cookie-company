import {useEffect, useState} from "react";
import axios from "axios";

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/reviews")
            .then(res => {
                setReviews(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post("http://localhost:5000/api/reviews", {
            author,
            content,
        });
        window.location.reload();
    };

    return (
        <div className="py-5">
            <div className="container-fluid px-5">
                <h1 className={"h3 mb-3"}>Customer Reviews</h1>
                {/* Review form*/}
                <div className="card mb-4">
                    <div className="card-body">
                        <h2 className={"h5 mb-3"}>
                            Leave a review
                        </h2>
                        <form onSubmit={handleSubmit} noValidate>
                            <div className={"mb-3"}>
                                <label htmlFor="author" className={"form-label"}>Name (optional)</label>
                                <input
                                    id="author"
                                    className={"form-control"}
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    placeholder={"Your name"}/>
                            </div>

                            <div className={"mb-3"}>
                                <label htmlFor="content" className={"form-label"}>
                                    Review
                                </label>
                                <textarea
                                    id="content"
                                    className={"form-control"}
                                    rows="4"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder={"Your review"}
                                />
                            </div>

                            <button type={"submit"} className={"btn btn-warning"}>
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>

                {/* Reviews */}
                <div className={"list-group"}>
                    {reviews.map(review => (
                        <div key={review.id} className="list-group-item">
                            <div className="d-flex justify-content-between mb-1">
                                <strong>{review.author || "Anonymous"}</strong>
                                <span className={"text-muted small"}>
                                    {new Date(review.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className={"text-muted"} dangerouslySetInnerHTML={{__html: review.content}}/>
                        </div>
                    ))}

                    {reviews.length === 0 && (
                        <p className={"text-muted"}>
                            No reviews yet. Be the first to leave us a review.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}