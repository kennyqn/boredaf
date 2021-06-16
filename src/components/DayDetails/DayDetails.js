import React, { useCallback, useContext, useEffect, useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { useLocation } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import { loadingStyle, override } from "../../consts/loading";
import AuthContext from "../../store/auth-context";
import { ActivityCompare } from "../../utils/activity"
import { TimeOfDay } from "../../utils/date";
import ActivitySuggestion from "../ActivitySuggestion/ActivitySuggestion";
import Card from "../UI/Card/Card";
import classes from "./DayDetails.module.css";
import WeekNavigation from "./WeekNavigation";

let options = ["Morning", "Afternoon", "Evening"];

const DayDetails = () => {
    const authContext = useContext(AuthContext);
    const [location, setLocation] = useState({
        label: localStorage.getItem("location"),
    });
    let id,
        address,
        day = 0;
    const locationState = useLocation();
    if (locationState.state) {
        id = locationState.state.id;
        day = locationState.state.day;
        address = locationState.state.address;
    }
    localStorage.setItem("location", location.label);
    const [isLoading, setIsLoading] = useState(true);
    const [weather, setWeather] = useState(null);
    const [suggestions, setSuggestions] = useState(null);
    const [recommendationTime, setRecommendationTime] = useState({
        value: TimeOfDay(),
        label: TimeOfDay(),
    });
    const [error, setError] = useState(null);

    const fetchWeatherHandler = useCallback(async () => {
        setIsLoading(true);
        try {
            let url =
                `https://activity-suggestion-app.herokuapp.com/weather/${day}?address=` +
                location.label;
            setError(null);
            const response = await fetch(url, {
                headers: {
                    Authorization: authContext.token,
                },
            });
            if (!response.ok) {
                throw new Error("Unable to retrieve weather");
            }

            const fetchedWeather = await response.json();
            setWeather(fetchedWeather);
        } catch (error) {
            setError(error.message);
        }
        setIsLoading(false);
    }, [authContext.token, day, location.label]);

    const fetchSuggestionsHandler = useCallback(async () => {
        setIsLoading(true);
        let url;
        try {
            if (!day) {
                url =
                    `https://activity-suggestion-app.herokuapp.com/suggestions/0?address=` +
                    location.label;
            } else {
                url =
                    `https://activity-suggestion-app.herokuapp.com/suggestions/${day}?address=` +
                    location.label;
            }
            setError(null);
            const response = await fetch(url, {
                headers: {
                    Authorization: authContext.token,
                },
            });
            if (!response.ok) {
                throw new Error("Unable to retrieve suggestions");
            }

            const fetchedSuggestions = await response.json();
            setSuggestions({
                ...fetchedSuggestions,
                morningSuggestions: fetchedSuggestions.morningSuggestions.sort(ActivityCompare),
                afternoonSuggestions: fetchedSuggestions.afternoonSuggestions.sort(ActivityCompare),
                eveningSuggestions: fetchedSuggestions.eveningSuggestions.sort(ActivityCompare)
            });
        } catch (error) {
            setError(error.message);
        }
        setIsLoading(false);
    }, [authContext.token, location.label]);

    useEffect(() => {
        fetchWeatherHandler();
        fetchSuggestionsHandler();
    }, [
        fetchWeatherHandler,
        fetchSuggestionsHandler,
    ]);

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
            <React.Fragment>
                <div
                    className={
                        TimeOfDay() !== "Evening"
                            ? classes.background_day
                            : classes.background_night
                    }
                ></div>
                <div className={classes.location}>
                    <p>Location:</p>
                    <GooglePlacesAutocomplete
                        apiKey={process.env.REACT_APP_GOOGLE_PLACES_API_KEY}
                        selectProps={{
                            location,
                            onChange: setLocation,
                        }}
                    />
                </div>

                <div className={classes.week}>
                    <WeekNavigation location={location.label} />
                </div>
                <div className={classes.parent}>
                    <div
                        className={
                            TimeOfDay() !== "Evening"
                                ? classes.detail_day
                                : classes.detail_night
                        }
                    >
                        {weather && (
                            <React.Fragment>
                                <p> {location.label} </p>
                                {(day === 0) && weather && (
                                    <p style={{ fontSize: "55px" }}>
                                        {weather.currentTemp}° F
                                    </p>
                                )}
                                {weather.weatherConditions.map((condition) => {
                                    return (
                                        <p key={condition.main}>
                                            {condition.description[0].toUpperCase() +
                                                condition.description.slice(1)}
                                        </p>
                                    );
                                })}
                                <p>
                                    H: {weather.maxTemp}° L: {weather.minTemp}°
                                </p>
                                <p style={{ fontSize: "15px" }}>Morning: {weather.morningAvgTemp}° Afternoon: {weather.afternoonAvgTemp}° Evening: {weather.eveningAvgTemp}°</p>

                            </React.Fragment>
                        )}
                    </div>
                    <hr
                        style={{
                            width: "30%",
                            backgroundColor: `${
                                TimeOfDay() !== "Evening" ? "black" : "white"
                            }`,
                        }}
                    ></hr>
                    <p
                        style={{
                            fontSize: "40px",
                            font: "HelveticaNeue-Light"
                        }}
                        className={
                            TimeOfDay() !== "Evening"
                                ? classes.label_day
                                : classes.label_night
                        }
                    >
                        Suggestions
                    </p>
                    <div className={classes.dropdown}>
                        <Dropdown
                            onChange={setRecommendationTime}
                            options={options}
                            value={recommendationTime}
                            placeholder="Select an option"
                        />
                    </div>
                    {recommendationTime.value === "Morning" && (
                        <Card>
                            <div className={classes.suggestions}>
                                {suggestions &&
                                    suggestions.morningSuggestions.map(
                                        (suggestedActivity) => {
                                            return (
                                                <ActivitySuggestion
                                                    key={suggestedActivity.key}
                                                    id={suggestedActivity.key}
                                                    title={
                                                        suggestedActivity.title
                                                    }
                                                    location={location.label}
                                                    backgroundImagePath={
                                                        suggestedActivity.backgroundImagePath
                                                    }
                                                >
                                                    {suggestedActivity.title}
                                                </ActivitySuggestion>
                                            );
                                        }
                                    )}
                                {suggestions &&
                                    suggestions.morningSuggestions.length ===
                                        0 && <p> No suggested activites </p>}
                            </div>
                        </Card>
                    )}

                    {recommendationTime.value === "Afternoon" && (
                        <Card>
                            <div className={classes.suggestions}>
                                {suggestions &&
                                    suggestions.afternoonSuggestions.map(
                                        (suggestedActivity) => {
                                            return (
                                                <ActivitySuggestion
                                                    key={suggestedActivity.key}
                                                    id={suggestedActivity.key}
                                                    title={
                                                        suggestedActivity.title
                                                    }
                                                    location={location.label}
                                                    backgroundImagePath={
                                                        suggestedActivity.backgroundImagePath
                                                    }
                                                >
                                                    {suggestedActivity.title}
                                                </ActivitySuggestion>
                                            );
                                        }
                                    )}
                                {suggestions &&
                                    suggestions.afternoonSuggestions.length ===
                                        0 && <p> No suggested activites </p>}
                            </div>
                        </Card>
                    )}
                    {recommendationTime.value === "Evening" && (
                        <Card>
                            <div className={classes.suggestions}>
                                {suggestions &&
                                    suggestions.eveningSuggestions.map(
                                        (suggestedActivity) => {
                                            return (
                                                <ActivitySuggestion
                                                    key={suggestedActivity.key}
                                                    id={suggestedActivity.key}
                                                    title={
                                                        suggestedActivity.title
                                                    }
                                                    location={location.label}
                                                    backgroundImagePath={
                                                        suggestedActivity.backgroundImagePath
                                                    }
                                                >
                                                    {suggestedActivity.title}
                                                </ActivitySuggestion>
                                            );
                                        }
                                    )}
                                {suggestions &&
                                    suggestions.eveningSuggestions.length ===
                                        0 && <p> No suggested activites </p>}
                            </div>
                        </Card>
                    )}
                </div>
                <br />
            </React.Fragment>
        );
    }
    return content;
};

export default DayDetails;
