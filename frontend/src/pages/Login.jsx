import {useState} from "react";
import axios from "../api/axiosClient.js";
import {useNavigate} from "react-router-dom";
import axiosClient from "../api/axiosClient.js";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            await axiosClient.post(
                "/login",
                {
                    email,
                    password,
                }
            );
            navigate("/account");
        } catch (error) {
            console.log("Login error: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-5">
            <div className="container-fluid px-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-3">
                        <h1 className="h3 mb-3 text-center">Login</h1>
                        <p className="text-muted text-center mb-4">
                            Sign in to manage your orders and account.
                        </p>

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    Email address
                                </label>
                                <input type="email" id="email" className="form-control" value={email}
                                       placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} required/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <input type="password" id="password" className="form-control" value={password}
                                       onChange={(e) => setPassword(e.target.value)} required/>
                            </div>

                            <button type="submit" className="btn btn-outline-warning w100 mt-3 mx-auto">
                                Login
                            </button>
                        </form>

                        <p className="text-center text-muted mt-3 mb-0">
                            Don't have an account?{" "}
                            <a href="/register">Register here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}