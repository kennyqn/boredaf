import { useContext } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
    const authContext = useContext(AuthContext);
    const history = useHistory();
    const isLoggedIn = authContext.isLoggedIn;

    const logoutHandler = () => {
        authContext.logout();
        history.push("/auth");
    };

    const location = localStorage.getItem("location");

    return (
        <header className={classes.header} style={{backgroundColor: "rgba(0, 0, 0, 0.3)"}}>
            <Link to={isLoggedIn ? "/summary" : "/auth"}>
                <div className={classes.logo}>BOREDAF</div>
            </Link>
 

            <nav>
                <ul>
                    {isLoggedIn && (
                        <li>
                            <Link to="/profile">Profile</Link>
                        </li>
                    )}
                    {isLoggedIn && (
                        <li>
                            <button className={classes.logout} onClick={logoutHandler}>Logout</button>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default MainNavigation;
