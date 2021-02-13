/*
Component to display and interact with a specific post
 */
import React, { useContext } from "react";
import { UserContext } from "../providers/UserProvider";

export default function NewPost() {
    const user = useContext(UserContext);
    const postID = this.props.match.params.PID;

    return (
        <>
            Make Post page
        </>

    );
}