import React, { useState } from "react";

const PreferenceContext = React.createContext({
    preferrences: [],
    updatePreferences: (preferrences) => {}
});

export const PreferenceContextProvider = (props) => {
    const preferenceData = localStorage.getItem("preference");
    let initialPreference;
    if (preferenceData) {
        initialPreference = preferenceData.preference;
    }
    const [preference, setPreference] = useState(initialPreference);

    const updatePreferenceHandler = (preference) => {
        setPreference(preference);
        localStorage.setItem("preference", preference);
    };

    const contextValue = {
        preference: preference,
        updatePreference: updatePreferenceHandler
    };

    return (
        <PreferenceContext.Provider value={contextValue}>
            {props.children}
        </PreferenceContext.Provider>
    );
};

export default PreferenceContext;
