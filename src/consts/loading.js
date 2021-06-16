import { css } from "@emotion/react";

const override = css`
    display: block;
    margin: 0 auto;
`;
const loadingStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
};

export {
    override,
    loadingStyle,
};
