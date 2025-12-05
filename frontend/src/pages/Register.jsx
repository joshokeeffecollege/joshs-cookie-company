import {useState} from "react";
import axiosClient from "../api/axiosClient.js";
import {useNavigate} from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (password.length < 10) {
            setError("Password must be at least 10 characters long.");
            return;
        }

        setLoading(true);

        try {
            await axiosClient.post("/register", {
                name,
                email,
                password,
            });

            setMessage("Registration successful. You can now log in.");
            navigate("/login");
        } catch (err) {
            console.error("Register error:", err);
            const apiMessage = err.response?.data?.message;
            setError(apiMessage || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-5">
            <div className="container-fluid px-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-3">
                        <h1 className="h3 mb-3 text-center">Create an account</h1>
                        <p className="text-muted text-center mb-4">
                            Save your details and make ordering cookies even easier.
                        </p>

                        {error && (
                            <div className={"alert alert-danger text-center"}>
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="alert alert-info text-center" role="alert">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    Full name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div className="form-text">
                                    Must be at least 10 characters.
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-outline-warning w100 mt-3"
                                disabled={loading}
                            >
                                {loading ? "Creating account..." : "Register"}
                            </button>
                        </form>

                        <p className="text-center text-muted mt-3 mb-0">
                            Already have an account? <a href="/login">Login here</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
