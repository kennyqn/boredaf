import { useState } from "react";
import PreferenceForm from "./PreferenceForm";
import Modal from "../../UI/Modal/Modal";
import { TimeOfDay } from "../../../utils/date";
import classes from "./Preference.module.css";

const Preference = (props) => {
    const [showPreferenceForm, setShowPreferenceForm] = useState(false);

    const showPreferenceFormHandler = () => {
        setShowPreferenceForm(true);
    };

    const hidePreferenceFormHandler = () => {
        setShowPreferenceForm(false);
    };

    const color = (TimeOfDay() !== "Evening") ? "white" : "black"

    return (
        <div className={classes.preference}>
            <p style={{color}}>{props.title}</p>
            <div
                onClick={showPreferenceFormHandler}
                style={{
                    backgroundImage: `url("https://activity-suggestion-app.herokuapp.com/${props.backgroundImagePath}")`,
                }}
            >
            </div>

            {showPreferenceForm && (
                <Modal onClose={hidePreferenceFormHandler}>
                    <PreferenceForm
                        id={props.activity}
                        activity={props.title}
                        time={props.time}
                        conditions={props.conditions}
                        minTemp={props.minTemp}
                        maxTemp={props.maxTemp}
                        onClose={hidePreferenceFormHandler}
                        showForm={showPreferenceForm}
                    />
                </Modal>
            )}
        </div>
    );
};

export default Preference;
