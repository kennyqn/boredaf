import { useEffect, useContext, useState } from "react";
import ActivitySelection from "../ActivitySelection/ActivitySelection";
import AuthContext from "../../store/auth-context"
import { useHistory } from "react-router-dom";

const ActivitySelectionForm = (props) => {

    return (
        <section>
            <ActivitySelection onClose={props.hideActivitySelection}/>;
        </section>
    );
};

export default ActivitySelectionForm;
