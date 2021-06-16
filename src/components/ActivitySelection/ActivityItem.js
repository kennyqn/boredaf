import { useState } from "react";
import classes from "./ActivityItem.module.css";

const ActivityItem = (props) => {
    const [isSelected, setIsSelected] = useState(false);

    const onSelectHandler = () => {
        setIsSelected(!isSelected);
        let selectedActivities = props.selectedActivities;
        const selected = selectedActivities.indexOf(props.id);
        if (selected > -1) {
            const index = selectedActivities.indexOf(props.id);
            selectedActivities.splice(index, 1)
            props.onSelect(selectedActivities)
        } else {
            props.onSelect([...selectedActivities, props.id])
        }
    };
    return (
        <section className={isSelected ? classes.selectedActivity : classes.activity}>
            <div onClick={onSelectHandler}>
                <p>{props.title}</p>
            </div>
        </section>
    );
};

export default ActivityItem;
