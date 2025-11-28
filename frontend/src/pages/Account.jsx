function Account() {

    // read from local storage
    const storedUser = localStorage.getItem("currentUser");
    const user = storedUser ? JSON.parse(storedUser) : null;

    // if a user is not logged in
    if (!user) {
        return (
            <div className="py-5">
                <div className="container-fluid px-5">
                    <h1 className={"h3 mb-3"}>My account</h1>
                    <p>You are not logged in.</p>
                    <a href="/login" className={"btn btn-outline-warning m-1"}>Login</a>
                    <a href="/register" className={"btn btn-outline-primary m-1"}>Create an account</a>
                </div>
            </div>
        );

        // logged in user page
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
                            <p><strong>Password:</strong> {user.password}</p>

                            {/* log out button */}
                            <button className={"btn btn-outline-warning mt-4"} onClick={() => {
                                localStorage.removeItem("currentUser");
                                window.location.reload();
                            }}>
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
