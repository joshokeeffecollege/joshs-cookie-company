import {useEffect, useState} from "react";
import axiosClient from "../api/axiosClient.js";

export default function Admin() {
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadAdminData() {
            try {
                const [usersRes, logsRes] = await Promise.all([
                    axiosClient.get("/admin/users"),
                    axiosClient.get("/admin/logs"),
                ]);

                if (!isMounted) return;

                setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
                setLogs(Array.isArray(logsRes.data) ? logsRes.data : []);
            } catch (err) {
                if (!isMounted) return;
                console.error("Error loading admin data:", err);

                const status = err.response?.status;
                if (status === 401) {
                    setError("You must be logged in as an admin to view the admin dashboard.");
                } else if (status === 403) {
                    setError("You are not authorized to view the admin dashboard.");
                } else {
                    setError("There was a problem loading admin data.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadAdminData();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <section className="py-5">
                <div className="container-fluid px-5">
                    <h1 className="h3 mb-3">Admin Dashboard</h1>
                    <p>Loading admin data...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-5">
                <div className="container-fluid px-5">
                    <h1 className="h3 mb-3">Admin Dashboard</h1>
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-5">
            <div className="container-fluid px-5">
                <h1 className="h3 mb-4">Admin Dashboard</h1>

                {/* Users panel */}
                <div className="card mb-4">
                    <div className="card-header">
                        <h2 className="h5 mb-0">Users</h2>
                    </div>
                    <div className="card-body">
                        {users.length === 0 ? (
                            <p className="text-muted mb-0">No users found.</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered align-middle">
                                    <thead className="table-light">
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
                        )}
                    </div>
                </div>

                {/* Security logs panel */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="h5 mb-0">Security Logs</h2>
                    </div>
                    <div className="card-body">
                        {logs.length === 0 ? (
                            <p className="text-muted mb-0">No security events logged yet.</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered align-middle table-sm">
                                    <thead className="table-light">
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Time</th>
                                        <th scope="col">Event</th>
                                        <th scope="col">User</th>
                                        <th scope="col">IP</th>
                                        <th scope="col">User Agent</th>
                                        <th scope="col">Details</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {logs.map((log) => (
                                        <tr key={log.id}>
                                            <td>{log.id}</td>
                                            <td>
                                                {log.created_at
                                                    ? new Date(log.created_at).toLocaleString()
                                                    : "-"}
                                            </td>
                                            <td>{log.event_type}</td>
                                            <td>
                                                {log.user_email
                                                    ? `${log.user_name || ""} (${log.user_email})`
                                                    : "Unknown / N/A"}
                                            </td>
                                            <td>{log.ip_address || "-"}</td>
                                            <td style={{maxWidth: "220px"}}>
                                                <small className="text-muted text-wrap d-inline-block">
                                                    {log.user_agent || "-"}
                                                </small>
                                            </td>
                                            <td style={{maxWidth: "240px"}}>
                                                <small className="text-muted text-wrap d-inline-block">
                                                    {log.details || "-"}
                                                </small>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
