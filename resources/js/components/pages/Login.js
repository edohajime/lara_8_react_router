import "../../../css/login.css";
import { Link } from "react-router-dom";
const Login = () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    return (
        <form method="post" action="/login">
            <div>
                <input type="hidden" name="_token" value={csrfToken} />
                
                <div className="loginview" id="loginview">
                    <table cellSpacing={0}>
                        <thead>
                            <tr>
                                <th colSpan={2}>Login</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="lc">Username / Email</td>
                                <td>
                                    <input
                                        className="form-input"
                                        type="text"
                                        name="email"
                                        id="email"
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
                                    <a href="#">Forget password?</a>
                                    &nbsp;&nbsp;|&nbsp;&nbsp;
                                    <a href="#">Help!</a>
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colSpan={2} align="center">
                                    <Link
                                        to="/register"
                                        className="btn btn-secondary"
                                    >
                                        Register
                                    </Link>
                                    &nbsp;
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Login
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

export default Login;
