import { useContext } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import SuggestionsPage from "./pages/SuggestionsPage";
import ForecastPage from "./pages/ForecastPage"
import AuthContext from "./store/auth-context";

function App() {
    const authContext = useContext(AuthContext);
    return (
        <Layout>
            <Switch>
                <Route path="/summary" exact>
                    <HomePage />
                </Route>
                {!authContext.isLoggedIn && (
                    <Route path="/auth">
                        <AuthPage />
                    </Route>
                )}
                {authContext.isLoggedIn && (
                    <Route path="/profile">
                        <ProfilePage />
                    </Route>
                )}
                <Route path="/suggestions" exact>
                    <SuggestionsPage />
                </Route>
                <Route path="/forecast" exact>
                    <ForecastPage />
                </Route>
                <Route path='*'>
                {!authContext.isLoggedIn && (
                    <Redirect to='/auth' />
                )}
                {authContext.isLoggedIn && (
                    <Redirect to='/summary' />
                )}
                </Route>
            </Switch>
        </Layout>
    );
}

export default App;
