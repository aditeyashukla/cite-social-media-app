/*
Component for News feed
 */
import React, { useContext } from "react";

import { UserContext } from "../providers/UserProvider";

export default function NewPost() {
    const user = useContext(UserContext);

    return (
        <>
            Make Newsfeed
        </>

    );
}