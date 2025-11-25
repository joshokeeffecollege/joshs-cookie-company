function Register() {
    return (
        <section>
            <h2>Register</h2>
            <form>
                <div>
                    <label>
                        Email
                        <input type="email" name="email"/>
                    </label>
                </div>
                <div>
                    <label>
                        Password
                        <input type="password" name="password"/>
                    </label>
                </div>
                <button type="submit">Log in</button>
            </form>
        </section>
    );
}

export default Register;
