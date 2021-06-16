import classes from "./Place.module.css";
import React from "react";

const Place = (props) => {
    let backgroundImageSource = `https://maps.googleapis.com/maps/api/place/photo?maxheight=200&photoreference=${props.photoReference}&key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY}`;
    const onClickHandler = () => {
        window.open(
            `https://www.google.com/maps/search/?api=1&query=${props.lat},${props.long}&query_place_id=${props.placeId}`,
            "_blank"
        );
    };
    if (props.photoReference === "no_photos") {
        backgroundImageSource = "/no_photos.png"
    }
    return (
        <section className={classes.place} onClick={onClickHandler}>
            <div>
                <img src={backgroundImageSource} />
                <h1>
                    {props.name}
                </h1>
                <p>Rating: {props.rating}/5 | {props.numReviews} Reviews</p>
            </div>
        </section>
    );
};

export default Place;
