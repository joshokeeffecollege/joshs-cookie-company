import {useEffect, useState} from "react";
import axios from "axios";

export default function Cookies() {
    const [cookies, setCookies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/cookies")
            .then((res) => {
                setCookies(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching cookies", err);
                setError("Unable to load cookies.");
                setLoading(false);
            });
    }, []);

    const filteredCookies = cookies.filter((cookie) => {
        const term = search.toLowerCase();
        return (
            cookie.name.toLowerCase().includes(term) ||
            (cookie.description && cookie.description.toLowerCase().includes(term)) ||
            (cookie.tag && cookie.tag.toLowerCase().includes(term))
        );
    });

    return (
        <div className="py-5">
            <div className="container-fluid px-5">

                {/* Header + search */}
                <div
                    className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                    <div>
                        <h1 className="h2 mb-1">Our cookies</h1>
                        <p className="text-muted mb-0">
                            Freshly baked, carefully packed, and dangerously moreish.
                        </p>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search cookies..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{minWidth: "240px"}}
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="row g-4">
                    {filteredCookies.map((cookie) => (
                        <div key={cookie.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className="card h-100 shadow-sm">

                                {/* Image */}
                                {cookie.image_url && (
                                    <img
                                        src={cookie.image_url}
                                        className="card-img-top"
                                        alt={cookie.name}
                                        style={{height: "220px", objectFit: "cover"}}
                                    />
                                )}

                                <div className="card-body d-flex flex-column">
                                    {cookie.tag && (
                                        <span className="badge bg-warning text-dark mb-2 align-self-start">
                                            {cookie.tag}
                                        </span>
                                    )}

                                    <h2 className="h5 card-title mb-1">{cookie.name}</h2>

                                    {cookie.description && (
                                        <p className="card-text text-muted small mb-3">
                                            {cookie.description}
                                        </p>
                                    )}

                                    <div className="mt-auto d-flex justify-content-between align-items-center">
                                        <span className="fw-bold">
                                            €{Number(cookie.price).toFixed(2)}
                                        </span>
                                        <a href="" className="btn btn-sm btn-outline-warning">
                                            Add to cart
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
