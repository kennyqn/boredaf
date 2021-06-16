import { useCallback, useContext, useEffect, useState } from 'react';
import BarLoader from "react-spinners/BarLoader";
import { loadingStyle, override } from "../../consts/loading";
import AuthContext from '../../store/auth-context';
import { ActivityCompare } from '../../utils/activity';
import Modal from "../UI/Modal/Modal";
import ActivityItem from "./ActivityItem";
import classes from "./ActivitySelection.module.css";

const ActivitySelection = (props) => {
    const authContext = useContext(AuthContext)
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    const [error, setError] = useState(null);
    const fetchActivitiesHandler = useCallback(async () => {
        try {
            setError(null);
            const response = await fetch(
                "https://activity-suggestion-app.herokuapp.com/activities",
                {
                    headers: {
                        "Authorization": authContext.token,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Unable to retrieve activities");
            }

            const loadedActivities = await response.json();
            setActivities(loadedActivities.sort(ActivityCompare).filter(activity => !props.selectedActivities.includes(activity.key)));
        } catch (error) {
            setError(error.message);
        }
        setIsLoading(false);
    }, [authContext.token]);

    const submitPreferences = async () => {
        try {
            setError(null);
            setIsLoading(true)
            const response = await fetch(
                "https://activity-suggestion-app.herokuapp.com/preferences?activities=" + selectedActivities.join(','),
                {
                    method: "POST",
                    headers: {
                        "Authorization": authContext.token,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Unable to set preferred activities");
            }
            
        } catch (error) {
            setError(error.message);
        }
        setSubmitted(true);
        setIsLoading(false);
    }

    useEffect(() => {
        if (!submitted) {
            fetchActivitiesHandler();   
        }
    }, [fetchActivitiesHandler, submitted]);

    let content = <p>Found no activities</p>;


    const onCloseHandler = () => {
        props.onClose();
        window.location.reload();
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        await submitPreferences();
    }
    if (activities.length > 0) {
        content = (
            <form onSubmit={submitHandler}>
                <h1>{props.formTitle}</h1>
                <ul>
                    {activities.map((activity) => {
                        return (
                            <ActivityItem
                                key={activity.key}
                                selectedActivities={selectedActivities}
                                onSelect={setSelectedActivities}
                                title={activity.title}
                                id={activity.key}
                                relatedActivities={activity.relatedActivities}
                            ></ActivityItem>
                        );
                    })}
                </ul>
                <button type="submit">Submit</button>
            </form>
        );
    }

    if (error) {
        content = <p>{error}</p>;
    }

    if (isLoading) {
        content = <div style={loadingStyle}>
        <BarLoader
            color="rgb(175,171,171)"
            loading={isLoading}
            css={override}
            height={10}
            width={300}
        />
    </div>;
    }

    if (submitted) {
        content = <div><h1>Preferred activities have been set! Please head to your profile to customize your preferences.</h1><button onClick={onCloseHandler}>Close</button></div>;
    }
    return <Modal onClose={props.onClose}><div className={classes.selection}>{content}</div></Modal>;
};

export default ActivitySelection;
