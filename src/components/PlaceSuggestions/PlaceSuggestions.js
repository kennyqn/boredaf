import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import { loadingStyle, override } from "../../consts/loading";
import AuthContext from "../../store/auth-context";
import { TimeOfDay } from "../../utils/date";
import Place from "../PlaceSuggestions/Place";
import classes from "./PlaceSuggestions.module.css";

const PlaceSuggestions = () => {
    const authContext = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [places, setPlaces] = useState(null);
    const [error, setError] = useState(null);
    const location = useLocation();
    const { id, activity, address } = location.state;
    const history = useHistory();

    // TODO: Fetch different pages of results

    useEffect(() => {
        const fetchPlacesHandler = async () => {
            try {
                const url =
                    "https://activity-suggestion-app.herokuapp.com/places?" +
                    "activity=" +
                    id +
                    "&address=" +
                    address;
                setError(null);
                const response = await fetch(url, {
                    headers: {
                        Authorization: authContext.token,
                    },
                });
                if (!response.ok) {
                    throw new Error("Unable to retrieve places");
                }

                const fetchedData = await response.json();
                setPlaces(fetchedData.places);
            } catch (error) {
                setError(error.message);
            }
            setIsLoading(false);
        };
        fetchPlacesHandler();
    }, [address, authContext.token, id]);

    const backButtonHandler = () => {
        history.goBack();
    };

    const color = (TimeOfDay() !== "Evening") ? "black" : "white"

    return (
        <section className={classes.results}>
        <div
        className={
            TimeOfDay() !== "Evening"
                ? classes.background_day
                : classes.background_night
        }
        ></div>
            {isLoading && (
                <div style={loadingStyle}>
                    <BarLoader
                        color="rgb(175,171,171)"
                        loading={isLoading}
                        css={override}
                        height={10}
                        width={300}
                    />
                </div>
            )}
            {!isLoading && <button onClick={backButtonHandler}>Back</button>}
            <h1 style={{color}}>
                Results for '{activity}' in '{address}'
            </h1>
            {
                (places && places.results &&
                    places.results.length <= 0 && !isLoading) && (
                <h1>
                    No results found. Please try increasing the search radius.
                </h1>
            )}
            {places &&
                places.results &&
                places.results.length > 0 &&
                places.results.map((place, index) => {
                    let photoRef = "no_photos"
                    if (place.photos && place.photos.length > 0) {
                        photoRef = place.photos[0].photo_reference
                    }
                    return (
                        <Place
                            numReviews={place.user_ratings_total}
                            rating={place.rating}
                            placeId={place.place_id}
                            lat={place.geometry.location.lat}
                            long={place.geometry.location.lng}
                            key={place.place_id}
                            photoReference={photoRef}
                            id={index + 1}
                            name={place.name}
                        />
                    );
                })}
        </section>
    );
};

export default PlaceSuggestions;
