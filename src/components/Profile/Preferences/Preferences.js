import React from "react"
import Preference from "./Preference";

const Preferences = (props) => {
    return (
        <React.Fragment>
        {props.preferences &&
            props.preferences.length > 0 &&
            props.preferences.map((preference) => {
                return (
                    <Preference
                        key={preference._id}
                        title={preference.title}
                        activity={preference.key}
                        backgroundImagePath={preference.backgroundImagePath}
                        minTemp={preference.minTemp}
                        maxTemp={preference.maxTemp}
                        conditions={preference.conditions}
                        time={preference.time}
                    />
                );
            })}
        </React.Fragment>
    );
};

export default Preferences;
