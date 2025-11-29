import {useEffect, useState} from "react";
import {useCart} from "../components/context/CartContext.jsx";
import axios from "axios";
import * as url from "node:url";

export default function Cookies() {
    const [cookies, setCookies] = useState([]);
    const [search, setSearch] = useState("");
    const {addToCart} = useCart();

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/cookies")
            .then((res) => {
                setCookies(res.data);
            })
            .catch((err) => {
                console.error("Error fetching cookies", err);
            });
    }, []);

    // Insecure - Use search queries from url (XSS susceptible)
    const [urlSearch] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get("q") || "";
    });

    // search by filtering cookies
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

                    {/* INSECURE - reflected XSS using ?q= url param */}
                    {urlSearch && (
                        <div className={"alert alert-info mb-4"}
                             dangerouslySetInnerHTML={{__html: `Showing results for: ${urlSearch}`}}>

                        </div>
                    )
                    }

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

                                    {/* Title */}
                                    <h2 className="h5 card-title mb-1">{cookie.name}</h2>

                                    {/* Description */}
                                    {cookie.description && (
                                        <p className="card-text text-muted small mb-3">
                                            {cookie.description}
                                        </p>
                                    )}

                                    <div className="mt-auto d-flex justify-content-between align-items-center">
                                        {/* Price */}
                                        <span className="fw-bold">
                                            €{Number(cookie.price).toFixed(2)}
                                        </span>

                                        {/* Add to cart button */}
                                        <button type="button" className={"btn btn-sm btn-outline-warning"}
                                                onClick={() => addToCart(cookie)}>
                                            Add to Cart
                                        </button>
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
