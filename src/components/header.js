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
        <img style={{    width: '25%',
            marginLeft: '37%'}} src={"https://i.imgur.com/bTc1vPJ.png"}/>

    );
}