/*
Component for home page
If user logged in then displays newsfeed, otherwise user has to sign in
 */

import React, { useContext } from "react";
import NewsFeed from "./newsfeed";
import SignIn from "./signin";
import { UserContext } from "../providers/UserProvider";

export default function Home() {
    const user = useContext(UserContext);

    return (
        user ?
            <NewsFeed/>
            :
            <SignIn/>

    );
}