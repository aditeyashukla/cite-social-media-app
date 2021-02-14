/*
Component for account settings
 */
import React, { useContext } from "react";

import { UserContext } from "../providers/UserProvider";

export default function NewPost() {
    const user = useContext(UserContext);
    console.log("USER",user);
    return (
        <>
            Make Account page
        </>

    );
}