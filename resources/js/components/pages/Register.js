import { Link } from "react-router-dom";

const Register = () => {
    return (
        <form method="post" action="/register">
            <div>
                <div className="loginview" id="loginview">
                    <table cellSpacing={0}>
                        <thead>
                            <tr>
                                <th colSpan={2}>Register</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="lc">Full Name</td>
                                <td>
                                    <input
                                        className="form-input"
                                        type="text"
                                        name="name"
                                        id="name"
                                        required=""
                                    />
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td className="lc">Username / Email</td>
                                <td>
                                    <input
                                        className="form-input"
                                        type="text"
                                        name="email"
                                        id="email"
                                        required=""
                                    />
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td className="lc">Password</td>
                                <td>
                                    <input
                                        className="form-input"
                                        type="password"
                                        name="password"
                                        id="password"
                                        required=""
                                    />
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td className="lc">Confirm Password</td>
                                <td>
                                    <input
                                        className="form-input"
                                        type="password"
                                        name="password_confirmation"
                                        id="password_confirmation"
                                        required=""
                                    />
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td className="lc">
                                    <input type="checkbox" id="checkSave" />
                                </td>
                                <td>
                                    <label htmlFor="checkSave">
                                        Do you agree save this password on this
                                        PC?
                                    </label>
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colSpan={2} align="center">
                                    <Link
                                        to="/login"
                                        className="btn btn-secondary"
                                    >
                                        Exit
                                    </Link>
                                    &nbsp;
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Register
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colSpan={2} align="right">
                                    <a href="#">Vietnamese</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </form>
    );
};
export default Register;
