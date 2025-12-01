// src/pages/Users.jsx (SECURE VERSION)
import {useEffect, useState} from 'react';
import axiosClient from '../api/axiosClient.js';

function Users() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        axiosClient
            .get('/users')
            .then((res) => {
                if (!isMounted) return;
                setUsers(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
                if (!isMounted) return;
                console.error(err);
                const status = err.response?.status;

                if (status === 401) {
                    setError('You must be logged in as an admin to view this page.');
                } else if (status === 403) {
                    setError('You are not authorized to view this page.');
                } else {
                    setError('Could not load users.');
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <section className="py-5">
                <div className="container-fluid px-5">
                    <h1 className="h3 mb-3">Admin – Users</h1>
                    <p>Loading users...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-5">
                <div className="container-fluid px-5">
                    <h1 className="h3 mb-3">Admin – Users</h1>
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                </div>
            </section>
        );
    }

    if (users.length === 0) {
        return (
            <section className="py-5">
                <div className="container-fluid px-5">
                    <h1 className="h3 mb-3">Admin – Users</h1>
                    <p className="text-muted">No users found.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-5">
            <div className="container-fluid px-5">
                <h1 className="h3 mb-3">Admin – Users</h1>
                <p className="text-muted">
                    This page is only available to admins. Sensitive fields such as password hashes are never shown.
                </p>

                <div className="table-responsive">
                    <table className="table table-striped table-bordered align-middle">
                        <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Role</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.role}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default Users;
