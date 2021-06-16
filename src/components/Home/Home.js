import React, { useState, useEffect, useContext, useCallback } from "react";

import ActivitySelection from "../ActivitySelection/ActivitySelection";
import DayDetails from "../DayDetails/DayDetails";
import AuthContext from "../../store/auth-context";
import classes from "./Home.module.css";

const Home = () => {
    const [
        initialActivitySelectionIsShown,
        setinitialActivitySelectionIsShown,
    ] = useState(true);

    const hideActivitySelection = () => {
        setinitialActivitySelectionIsShown(false);
    };

    const authContext = useContext(AuthContext);

    const fetchPreferences = useCallback(() => {
        setinitialActivitySelectionIsShown(false);
        let url;
        let errorMessage = "Failed to retrieve user preferences";

        url = "https://activity-suggestion-app.herokuapp.com/preferences";
        fetch(url, {
            method: "GET",
            headers: {
                Authorization: authContext.token,
            },
        })
            .then((res) => {
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
                if (data.length === 0) {
                    setinitialActivitySelectionIsShown(true);
                }
            })
            .catch((err) => {
                // alert(err);
            });
    }, [authContext.token]);
    useEffect(() => {
        fetchPreferences();
    }, [fetchPreferences]);

    return (
        <div>
            
            
            <DayDetails />
            {initialActivitySelectionIsShown && (
                <ActivitySelection selectedActivities={[]} formTitle="Let's get started by choosing some activities!" onClose={hideActivitySelection} />
            )}
        </div>
    );
};

export default Home;
