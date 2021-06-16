import React, { useCallback, useContext, useEffect, useState } from "react";
import BarLoader from "react-spinners/BarLoader";
import { loadingStyle, override } from "../../consts/loading";
import AuthContext from "../../store/auth-context";
import { TimeOfDay } from "../../utils/date";
import DayTab from "./DayTab";
import classes from "./WeekNavigation.module.css";

const WeekNavigation = (props) => {
    const authContext = useContext(AuthContext);
    const location = localStorage.getItem("location");
    const [isLoading, setIsLoading] = useState(true);
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);

    const fetchWeatherHandler = useCallback(async () => {
        try {
            const url =
                "https://activity-suggestion-app.herokuapp.com/weather?address=" +
                location;
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
    }, [authContext.token, location]);

    useEffect(() => {
        fetchWeatherHandler();
    }, [fetchWeatherHandler]);

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

    if (!isLoading && weather) {
        content = <div className={TimeOfDay() !== "Evening"
        ? classes.navigation_day
        : classes.navigation_night}>
        {weather.weekForecast.map((day, index) => {
            return (
                <DayTab
                    today={weather.weekForecast[0].dayOfWeek}
                    key={day.id}
                    id={day.id}
                    dayOfWeek={day.dayOfWeek}
                    morningAvg={day.morningAvgTemp}
                    afternoonAvg={day.afternoonAvgTemp}
                    eveningAvg={day.eveningAvgTemp}
                    date={day.date}
                    conditions={day.weatherConditions}
                    location={props.location}
                />
            );
        })}
        </div>
    }
    return content;
};

export default WeekNavigation;
