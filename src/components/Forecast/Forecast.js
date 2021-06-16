import React, { useCallback, useContext, useEffect, useState } from "react";
import BarLoader from "react-spinners/BarLoader";
import { loadingStyle, override } from "../../consts/loading";
import AuthContext from "../../store/auth-context";
import DayForecast from "./DayForecast";

const Forecast = (props) => {
    const authContext = useContext(AuthContext);
    const location = localStorage.getItem("location");
    const [isLoading, setIsLoading] = useState(true);
    const [weather, setWeather] = useState(null);
    const [suggestions, setSuggestions] = useState(null);
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
    }, [authContext.token, location]);

    const fetchSuggestionsHandler = useCallback(async () => {
        try {
            let url =
                "https://activity-suggestion-app.herokuapp.com/suggestions?address=" +
                location;
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
            setSuggestions(fetchedSuggestions);
        } catch (error) {
            setError(error.message);
            alert(error);
        }
        setIsLoading(false);
    }, [authContext.token, location]);

    useEffect(() => {
        fetchWeatherHandler();
        fetchSuggestionsHandler();
    }, [fetchWeatherHandler, fetchSuggestionsHandler]);

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

    if (!isLoading && weather && suggestions) {
        content = <React.Fragment>
        <h2>{location}</h2>
        {weather.weekForecast.map((day, index) => {
            return (
                <DayForecast
                    key={day.id}
                    id={day.id}
                    morningAvg={day.morningAvgTemp}
                    afternoonAvg={day.afternoonAvgTemp}
                    eveningAvg={day.eveningAvgTemp}
                    date={day.date}
                    conditions={day.weatherConditions}
                    suggestions={suggestions[index]}
                />
            );
        })}
        </React.Fragment>
    }
    return content;
};

export default Forecast;
