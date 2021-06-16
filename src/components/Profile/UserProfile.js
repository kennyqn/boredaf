import React, { useState, useCallback, useEffect, useContext } from "react";
import ActivitySelection from "../ActivitySelection/ActivitySelection";
import Preferences from "./Preferences/Preferences";
import AuthContext from "../../store/auth-context";
import { TimeOfDay } from "../../utils/date";
import classes from "./UserProfile.module.css";
import { ActivityCompare } from "../../utils/activity";

const UserProfile = () => {
    const authContext = useContext(AuthContext);
    const [preferences, setPreferences] = useState(null);
    const fetchPreferences = useCallback(() => {
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
                if (data.length > 0) {
                    setPreferences(data.sort(ActivityCompare));
                }
            })
            .catch((err) => {
                alert(err);
            });
    }, [authContext.token]);
    useEffect(() => {
        fetchPreferences();
    }, [fetchPreferences]);

    const [
        activitySelectionIsShown,
        setActivitySelectionIsShown,
    ] = useState(false);

    const hideActivitySelection = () => {
        setActivitySelectionIsShown(false);
    };

    const showActivitySelection = () => {
        setActivitySelectionIsShown(true);
    };

    const color = (TimeOfDay() !== "Evening") ? "black" : "white"
    const selectedActivities = preferences ? preferences.map((preference) => preference.key) : [];
    return (
        <div>
        <div className={TimeOfDay() !== "Evening"
        ? classes.background_day
        : classes.background_night}></div>
            <h1 style={{color}}>Profile</h1>
            <br />
            <h2 style={{color}}>Your Activities</h2>
            <div className={classes.preferences}>
                <Preferences preferences={preferences} />
            </div>
            <div className={classes.action}><button onClick={showActivitySelection}>Add Activities</button></div>
            

            <div className={classes.password}>
            </div>

            {activitySelectionIsShown && (
                <ActivitySelection formTitle="Add Activities" selectedActivities={selectedActivities} onClose={hideActivitySelection} />
            )}
        </div>
    );
};

export default UserProfile;
