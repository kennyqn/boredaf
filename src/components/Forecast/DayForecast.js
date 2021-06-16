import { Link } from "react-router-dom";
import classes from "./DayForecast.module.css";
import Card from "../UI/Card/Card";
import React from "react";

const DayForecast = (props) => {
    let location = localStorage.getItem("location");
    let morningSuggestionsContent = "No Suggested Activities";
    if (props.suggestions && props.suggestions.morningSuggestions.length > 0) {
        morningSuggestionsContent = `Suggestions: ${props.suggestions.morningSuggestions.map(suggestion => suggestion.title).join(",")}`
    }
    let afternoonSuggestionsContent = "No Suggested Activities";
    if (props.suggestions && props.suggestions.afternoonSuggestions.length > 0) {
        afternoonSuggestionsContent = `Suggestions: ${props.suggestions.afternoonSuggestions.map(suggestion => suggestion.title).join(",")}`
    }
    let eveningSuggestionsContent = "No Suggested Activities";
    if (props.suggestions && props.suggestions.eveningSuggestions.length > 0) {
        eveningSuggestionsContent = `Suggestions: ${props.suggestions.eveningSuggestions.map(suggestion => suggestion.title).join(",")}`
    }
    return (
        <React.Fragment>
                    <Link to={{ 
                pathname: "/summary",
                search: `?day=${props.id}&location=${location}`,
                state: {
                    id: props.id,
                    day: props.id,
                    address: props.location,
                }
               }}>
            <div className={classes.day}>
                <Card>
                    <h3>{props.date}</h3>
                    <p>{props.conditions.map(condition => condition.main).join(",")}</p>
                    <section>________</section>

                    <section>Morning ~{props.morningAvg}°F<p>{morningSuggestionsContent}</p></section>
                    <section>________</section>
                    <section>Afternoon ~{props.afternoonAvg}°F<p>{afternoonSuggestionsContent}</p></section>
                    <section>________</section>
                    <section>Evening ~{props.eveningAvg}°F<p>{eveningSuggestionsContent}</p></section>
                </Card>
            </div>
            </Link>
        </React.Fragment>
    );
};

export default DayForecast;
