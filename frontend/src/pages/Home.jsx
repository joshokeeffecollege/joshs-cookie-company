import {useEffect, useState} from "react";
import {useCart} from "../components/context/CartContext.jsx";
import axios from "../api/axiosClient.js";

export default function Home() {
    const [cookies, setCookies] = useState([]);
    const {addToCart} = useCart();

    // Fetch cookies from your Express backend
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

    // Show only 3 featured cookies
    const featuredCookies = cookies.slice(0, 3);

    return (
        <div>

            {/* HERO SECTION */}
            <section className="py-5 px-0 bg-light border-bottom">
                <div className="container-fluid px-5">
                    <div className="row align-items-center">
                        {/* Text */}
                        <div className="col-md-7">
                            <h1 className="display-4 fw-bold mb-3">
                                Fresh cookies. <span className="orange">Delivered daily.</span>
                            </h1>
                            <p className="lead text-muted mb-4">
                                Crispy edges, chewy centres, baked to order. Josh&apos;s Cookie Company
                                brings bakery-quality cookies straight to your door.
                            </p>
                            <a href="/cookies" className="btn btn-outline-warning btn-md me-3">
                                Shop cookies
                            </a>
                        </div>

                        {/* Hero visual */}
                        <div className="col-md-5 text-center mt-4 mt-md-0">
                            <div
                                className="rounded-circle bg-warning bg-opacity-25 d-inline-flex justify-content-center align-items-center"
                                style={{width: "220px", height: "220px"}}
                            >
                                <span style={{fontSize: "5rem"}} role="img" aria-label="cookie">
                                    🍪
                                </span>
                            </div>
                            <p className="text-muted mt-3 mb-0">
                                Baked locally. Packed securely. Delivered fast.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* FEATURED COOKIES */}
            <section className="py-5">
                <div className="container-fluid px-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="h3 mb-0">Featured cookies</h2>
                        <a href="/cookies" className="text-decoration-none">
                            View all cookies →
                        </a>
                    </div>

                    <div className="row g-4">
                        {featuredCookies.map((cookie) => (
                            <div key={cookie.id} className="col-12 col-sm-6 col-md-4">
                                <div className="card h-100 shadow-sm">

                                    {/* Cookie Image */}
                                    {cookie.image_url && (
                                        <img
                                            src={cookie.image_url}
                                            className="card-img-top"
                                            alt={cookie.name}
                                            style={{height: "200px", objectFit: "cover"}}
                                        />
                                    )}

                                    <div className="card-body d-flex flex-column">
                                        {cookie.tag && (
                                            <span className="badge bg-warning text-dark mb-2 align-self-start">
                                                {cookie.tag}
                                            </span>
                                        )}
                                        <h3 className="h5 card-title">{cookie.name}</h3>
                                        <p className="card-text text-muted mb-3">
                                            {cookie.description}
                                        </p>
                                        <div className="mt-auto d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">€{cookie.price}</span>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-warning"
                                                onClick={() => addToCart(cookie)}
                                            >
                                                Add to cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-5 border-top border-bottom bg-white">
                <div className="container-fluid px-5">
                    <h2 className="h2 mb-0 text-center py-3">How it Works</h2>
                    <div className="row text-center g-3">
                        <div className="col-md-4">
                            <h3 className="h6 fw-semibold">1. Choose your cookies</h3>
                            <p className="text-muted mb-0">Pick boxes or single cookies.</p>
                        </div>
                        <div className="col-md-4">
                            <h3 className="h6 fw-semibold">2. We bake to order</h3>
                            <p className="text-muted mb-0">Fresh, daily, never pre-packed.</p>
                        </div>
                        <div className="col-md-4">
                            <h3 className="h6 fw-semibold">3. Same-day delivery</h3>
                            <p className="text-muted mb-0">Local delivery available.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* REASONS SECTION */}
            <section className="py-5 bg-light">
                <div className="container-fluid px-5">
                    <h2 className="h3 text-center mb-4">Why Josh&apos;s Cookies?</h2>
                    <div className="row g-4">
                        <div className="col-md-4 text-center">
                            <h3 className="h5">Baked to order</h3>
                            <p className="text-muted mb-0">
                                Always fresh. Never pre-packaged.
                            </p>
                        </div>
                        <div className="col-md-4 text-center">
                            <h3 className="h5">Local ingredients</h3>
                            <p className="text-muted mb-0">
                                Irish butter, free-range eggs, fair-trade chocolate.
                            </p>
                        </div>
                        <div className="col-md-4 text-center">
                            <h3 className="h5">Student-friendly</h3>
                            <p className="text-muted mb-0">
                                Perfect for study sessions and late-night debugging.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            {/*<section className="py-5 bg-white">*/}
            {/*    <div className="container-fluid px-5">*/}
            {/*        <div className="row justify-content-center">*/}
            {/*            <div className="col-md-8 text-center">*/}
            {/*                <h2 className="h4 mb-3">What people are saying</h2>*/}
            {/*                <p className="fst-italic text-muted mb-1">*/}
            {/*                    “Best cookies I’ve ever had. This Josh lad is a genius.”*/}
            {/*                </p>*/}
            {/*                <p className="fw-semibold mb-0">— Some guy</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}


        </div>
    );
}
