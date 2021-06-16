import { useState, useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";
import classes from "./AuthForm.module.css";
import { useHistory } from "react-router-dom";
import { TimeOfDay } from "../../utils/date";

const AuthForm = () => {
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const fullNameInputRef = useRef();
    const history = useHistory();

    const authContext = useContext(AuthContext);

    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    };

    const submitHandler = (event) => {
        event.preventDefault();

        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;
        const enteredFullName = fullNameInputRef.current
            ? fullNameInputRef.current.value
            : "";

        // optional: Add validation

        setIsLoading(true);
        let url;
        let errorMessage =
            "Authentication failed! Please check your login credentials.";
        if (isLogin) {
            url = "https://activity-suggestion-app.herokuapp.com/users/login";
        } else {
            url = "https://activity-suggestion-app.herokuapp.com/users";
        }
        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                name: enteredFullName,
                email: enteredEmail,
                password: enteredPassword,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                setIsLoading(false);
                if (res.ok) {
                    return res.json();
                } else {
                    return res.json().then((data) => {
                        if (data && data.error && data.error.message) {
                            errorMessage = data.error.message;
                            throw new Error(errorMessage);
                        }
                    });
                }
            })
            .then((data) => {
                const expirationTime = new Date(
                    new Date().getTime() + 365 * 86400000 // expiry time of jwt = 365d
                );
                authContext.login(data.token, expirationTime.toISOString());
                history.replace("/");
            })
            .catch((err) => {
                alert(errorMessage);
            });
    };

    return (
        <div>
            <div
                className={
                    TimeOfDay() !== "Evening"
                        ? classes.background_day
                        : classes.background_night
                }
            ></div>
            <section className={classes.auth}>
                <h1>{isLogin ? "Login" : "Sign Up"}</h1>
                <form onSubmit={submitHandler}>
                    {!isLogin && (
                        <div className={classes.control}>
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="name"
                                id="name"
                                required
                                ref={fullNameInputRef}
                            />
                        </div>
                    )}
                    <div className={classes.control}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            required
                            ref={emailInputRef}
                        />
                    </div>
                    <div className={classes.control}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            required
                            ref={passwordInputRef}
                            minLength="7"
                        />
                    </div>
                    <div className={classes.actions}>
                        {!isLoading && (
                            <button>
                                {isLogin ? "Login" : "Create Account"}
                            </button>
                        )}
                        {isLoading && (
                            <p className="auth">Loading Request...</p>
                        )}
                        <button
                            type="button"
                            className={classes.toggle}
                            onClick={switchAuthModeHandler}
                        >
                            {isLogin
                                ? "Create new account"
                                : "Login with existing account"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default AuthForm;
