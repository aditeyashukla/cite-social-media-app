/*
Component to create a new post
 */
import React, { useContext } from "react";

import { UserContext } from "../providers/UserProvider";

export default function NewPost() {
    const user = useContext(UserContext);

    return (
            <>
                Make New Post page
            </>

    );
}