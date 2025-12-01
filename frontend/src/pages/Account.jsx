import {useEffect, useState} from "react";
import axios from "../api/axiosClient.js";
import {useNavigate} from "react-router-dom";

function Account() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        axios
            .get("/me")
            .then(res => {
                setUser(res.data.user);
            })
            .catch(err => {
                if (!isMounted) return;
                if (err.response.status === 401) {
                    // if not logged in, show guest view
                    setUser(null);
                } else {
                    console.log("Error fetching /api/me" + err);
                    setError("Could not load account information")
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => isMounted = false;
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("/logout");
        } catch (error) {
            console.log("Logout error: " + error);
        } finally {
            setUser(null);
            navigate("/login");
        }
    };

    if (loading) {
        return (
            <div className={"py-5"}>
                <div className="container-fluid px-5">
                    <h1 className={"h3 mb-3"}>My account</h1>
                    <p>Loading your account...</p>
                </div>
            </div>
        )
    }

    // if a user is not logged in
    if (!user) {
        return (
            <div className="py-5">
                <div className="container-fluid px-5">
                    <h1 className={"h3 mb-3"}>My account</h1>

                    {
                        error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )
                    }

                    <p>You are not logged in.</p>
                    <a href="/login" className={"btn btn-outline-warning m-1"}>Login</a>
                    <a href="/register" className={"btn btn-outline-primary m-1"}>Create an account</a>
                </div>
            </div>
        );

        // logged-in user page
    } else {
        return (
            <div className="py-5">
                <div className="container-fluid px-5">
                    <h1 className={"h3 mb-3"}>My account</h1>
                    <div className="card">
                        <div className="card-body">
                            <h2 className={"h5 mb-3"}>Profile</h2>
                            <p><strong>Role:</strong> {user.role}</p>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>

                            {/* log out button */}
                            <button className={"btn btn-outline-warning mt-4"} onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Account;
