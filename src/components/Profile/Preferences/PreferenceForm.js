import { useContext, useRef, useState } from "react";
import BarLoader from "react-spinners/BarLoader";
import { loadingStyle, override } from "../../../consts/loading";
import AuthContext from "../../../store/auth-context";
import classes from "./PreferenceForm.module.css";

const PreferenceForm = (props) => {
    const authContext = useContext(AuthContext);
    const minTempInputRef = useRef();
    const maxTempInputRef = useRef();
    const [conditionPreferences, setConditionPreferences] = useState(
        props.conditions
    );
    const [timePreferences, setTimePreferences] = useState(props.time);
    const [isLoading, setIsLoading] = useState(false);

    const submitHandler = (event) => {
        event.preventDefault();

        const enteredMinTemp = minTempInputRef.current.value;
        const enteredMaxTemp = maxTempInputRef.current.value;

        setIsLoading(true);
        let errorMessage = "Unable to save preferences.";
        const url =
            "https://activity-suggestion-app.herokuapp.com/preferences/" +
            props.id;
        fetch(url, {
            method: "PATCH",
            body: JSON.stringify({
                minTemp: enteredMinTemp,
                maxTemp: enteredMaxTemp,
                time: timePreferences,
                conditions: conditionPreferences,
            }),
            headers: {
                Authorization: authContext.token,
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
            .catch((err) => {
                alert(errorMessage);
            });
        props.onClose();
    };

    const deleteActivityHandler = () => {
        setIsLoading(true);
        let errorMessage = "Unable to save preferences.";
        const url =
            "https://activity-suggestion-app.herokuapp.com/preferences/" +
            props.id;
        fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: authContext.token,
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
            .catch((err) => {
                alert(errorMessage);
            });
        props.onClose();
        window.location.reload();
    }

    const toggleMorning = () => {
        setTimePreferences({
            ...timePreferences,
            morning: !timePreferences.morning,
        });
    };

    const toggleAfternoon = () => {
        setTimePreferences({
            ...timePreferences,
            afternoon: !timePreferences.afternoon,
        });
    };

    const toggleEvening = () => {
        setTimePreferences({
            ...timePreferences,
            evening: !timePreferences.evening,
        });
    };

    const toggleClear = () => {
        setConditionPreferences({
            ...conditionPreferences,
            clear: !conditionPreferences.clear,
        });
    };

    const toggleCloudy = () => {
        setConditionPreferences({
            ...conditionPreferences,
            cloudy: !conditionPreferences.cloudy,
        });
    };

    const toggleRainy = () => {
        setConditionPreferences({
            ...conditionPreferences,
            rainy: !conditionPreferences.rainy,
        });
    };

    const toggleSnowy = () => {
        setConditionPreferences({
            ...conditionPreferences,
            snowing: !conditionPreferences.snowing,
        });
    };

    let content = (
        <div style={loadingStyle}>
            <BarLoader
                color="rgb(175,171,171)"
                loading={isLoading}
                css={override}
                height={10}
                width={300}
            />
        </div>
    );

    if (!isLoading) {
        content = (
            <section>
                <div>
                    <h1>{props.activity} Preferences</h1>
                    <h3>Temperature</h3>
                    <div className={classes.child}>
                        <img
                            className={classes.temp}
                            src="/temperature/snowflake.png"
                        ></img>
                        <span className={classes.caption}>Min </span>
                        <input
                            className={classes.temp}
                            type="number"
                            id="minTemp"
                            required
                            defaultValue={props.minTemp}
                            ref={minTempInputRef}
                        />
                    </div>
                    <div className={classes.child}>
                        <img
                            className={classes.temp}
                            src="/temperature/fire.png"
                        ></img>
                        <span className={classes.caption}>Max </span>
                        <input
                            className={classes.temp}
                            type="number"
                            id="maxTemp"
                            required
                            defaultValue={props.maxTemp}
                            ref={maxTempInputRef}
                        />
                    </div>

                    <div>
                        <h3>Time</h3>
                        <div className={classes.child}>
                            <img
                                onClick={toggleMorning}
                                className={
                                    timePreferences.morning
                                        ? classes.selectedImg
                                        : classes.notSelectedImg
                                }
                                src="/time/morning.png"
                            />
                            <span className={classes.caption}>Morning</span>
                        </div>

                        <div className={classes.child}>
                            <img
                                onClick={toggleAfternoon}
                                className={
                                    timePreferences.afternoon
                                        ? classes.selectedImg
                                        : classes.notSelectedImg
                                }
                                src="/time/afternoon.png"
                            />
                            <span className={classes.caption}>Afternoon</span>
                        </div>

                        <div className={classes.child}>
                            <img
                                onClick={toggleEvening}
                                className={
                                    timePreferences.evening
                                        ? classes.selectedImg
                                        : classes.notSelectedImg
                                }
                                src="/time/evening.png"
                            />
                            <span className={classes.caption}>Evening</span>
                        </div>
                    </div>

                    <div>
                        <h3>Weather Conditions</h3>

                        <div className={classes.child}>
                            <img
                                onClick={toggleClear}
                                className={
                                    conditionPreferences.clear
                                        ? classes.selectedImg
                                        : classes.notSelectedImg
                                }
                                src="/conditions/clear.png"
                            />
                            <span className={classes.caption}>Clear</span>
                        </div>

                        <div className={classes.child}>
                            <img
                                onClick={toggleCloudy}
                                className={
                                    conditionPreferences.cloudy
                                        ? classes.selectedImg
                                        : classes.notSelectedImg
                                }
                                src="/conditions/cloudy.png"
                            />
                            <span className={classes.caption}>Cloudy</span>
                        </div>

                        <div className={classes.child}>
                            <img
                                onClick={toggleRainy}
                                className={
                                    conditionPreferences.rainy
                                        ? classes.selectedImg
                                        : classes.notSelectedImg
                                }
                                src="/conditions/rainy.png"
                            />
                            <span className={classes.caption}>Rainy</span>
                        </div>

                        <div className={classes.child}>
                            <img
                                onClick={toggleSnowy}
                                className={
                                    conditionPreferences.snowing
                                        ? classes.selectedImg
                                        : classes.notSelectedImg
                                }
                                src="/conditions/snowy.png"
                            />
                            <span className={classes.caption}>Snowy</span>
                        </div>
                    </div>

                    <button className={classes.control} onClick={submitHandler}>
                        Save
                    </button>
                    <button className={classes.control} onClick={props.onClose}>
                        Close
                    </button>
                    <button className={classes.control} onClick={deleteActivityHandler}>
                    Delete Activity
                </button>
                </div>
                <div className={classes.attribute}>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
            </section>
        );
    }
    return content;
};

export default PreferenceForm;
