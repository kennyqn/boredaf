import { Link } from "react-router-dom";
import classes from "./ActivitySuggestion.module.css";

const ActivitySuggestion = (props) => {
    return (
        <div className={classes.suggestion}>
                <p>{props.title}</p>
                <Link
                    to={{
                        pathname: "/suggestions",
                        search: `?activity=${props.id}&location=${props.location}&radius=48280.3`,
                        state: {
                            id: props.id,
                            activity: props.title,
                            address: props.location,
                        },
                    }}
                >            <div
                style={{
                    backgroundImage: `url("https://activity-suggestion-app.herokuapp.com/${props.backgroundImagePath}")`,
                }}
            /></Link>

        </div>
    );
};

export default ActivitySuggestion;
