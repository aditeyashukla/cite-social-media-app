/*
Component to display and interact with a specific post
 */
import React from "react";
import Paper from '@material-ui/core/Paper';

export default function Post(data) {
    let postData =  data['data'];
    let pid = data['pid'];
    return (
        <>
            <React.Fragment key={pid}>

                <Paper elevation={3}  >

                    <h1 style={{fontFamily: 'Newsreader, serif'}}>{postData['caption']}</h1>
                    <p> - {postData['userName']}</p>

                </Paper>

            </React.Fragment>
        </>

    );
}