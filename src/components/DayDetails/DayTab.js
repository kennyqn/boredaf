import { Link, useLocation } from "react-router-dom";
import { DaysOfWeek_SHORT } from "../../consts/date";
import { TimeOfDay } from "../../utils/date";
import classes from "./DayTab.module.css";

const DayTab = (props) => {
    const location = useLocation();
    const opacity = 1 - Math.abs(props.today - props.id) * 0.1;
    const selectedDay = location.state ? location.state.day : 0;
    let style = {
        opacity: selectedDay === props.id ? 1 : opacity,
    };

    const getImageSource = (conditions) => {
        if (conditions[0].main === "Clouds") {
            return "/conditions/cloudy.png"
        } else if (conditions[0].main === "Rain") {
            return "/conditions/rainy.png"
        } else if (conditions[0].main === "Snow") {
            return "/conditions/snowy.png"
        } else {
            return "/conditions/clear.png"
        }
    }

    return (
        <Link
            to={{
                pathname: "/summary",
                search: `?day=${props.id}`,
                state: {
                    id: props.id,
                    day: props.id,
                    address: props.location,
                },
            }}
        >
            <div className={selectedDay === props.id ? classes.day_selected : classes.day} style={style}>
                <div>
                    <img src={getImageSource(props.conditions)} />
                    <p style={{color: TimeOfDay() !== "Evening" ? "white" : "black"}}>{props.today === props.dayOfWeek ? "Today" : DaysOfWeek_SHORT[props.dayOfWeek]}</p>
                </div>
            </div>
        </Link>
    );
};

export default DayTab;
