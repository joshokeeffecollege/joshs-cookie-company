import {useEffect, useState} from 'react';
import axiosClient from '../api/axiosClient.js'

function Users() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axiosClient
            .get('http://localhost:5000/api/users')
            .then((res) => setUsers(res.data))
            .catch((err) => {
                console.error(err);
                setError('Failed to load users');
            });
    }, []);

    if (users.length === 0) {
        return (
            <section>
                <h2>Insecure User List (Debug)</h2>
                <p style={{ color: 'red' }}>
                    No user data to be found here.
                </p>
            </section>
        );
    }

    return (
        <section>
            <h2>Insecure User List (Debug)</h2>
            <p style={{color: 'red'}}>
                Oopsie! All user data exposed!!!.
            </p>

            {error && <p>{error}</p>}

            <pre style={{background: '#f7f7f7', padding: '1rem', overflowX: 'auto'}}>
        {
            JSON.stringify(users, null, 2)
        }
      </pre>
        </section>
    );
}

export default Users;
