/*
Component to display and interact with a specific post
 */
import React, { useContext, useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import AccountCircle from "@material-ui/core/SvgIcon/SvgIcon";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import MessageIcon from "@material-ui/icons/Message";
import TextField from "@material-ui/core/TextField";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import SendIcon from '@material-ui/icons/Send';
import {
  FirebaseDatabaseProvider,
  FirebaseDatabaseNode,
  FirebaseDatabaseTransaction,
} from "@react-firebase/database";
import firebase from "firebase/app";
import { Typography } from "@material-ui/core";
import {UserContext} from "../providers/UserProvider";

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: 5,
  },
}));

function unix_to_date(unix_timestamp) {
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  let date = new Date(unix_timestamp * 1000);
  // Hours part from the timestamp
  let hours = date.getHours();
  // Minutes part from the timestamp
  let minutes = "0" + date.getMinutes();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  return (
    hours + ":" + minutes.substr(-2) + " " + day + "/" + month + "/" + year
  );
}

export default function Post(data) {
    const classes = useStyles();
    let postData =  data['data'];
    let pid = data['id'];
    let pointPath = `${pid}/points`;

    return (
        <>
            <React.Fragment key={pid}>

                <Paper elevation={3}  style={{
                    width: '95%',
                    padding: '3%',
                    border: 'solid #c9d8c9',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}>
                    <div className={'user-post'}>
                        <Grid container spacing={3} style={{marginBottom: '2%'}}>
                            <Grid item xs={12} style={{paddingBottom: 0}}>
                                <h1 style={{fontFamily: 'Noto Serif, serif'}}>"{postData['caption']}"</h1>
                            </Grid>

                            <Grid item xs={6}>
                            </Grid>


                            <Grid item xs={6}>
                                <div style={{display:'flex', fontSize:'16px', float:'right'}}
                                >
                                    {/*<Avatar  className={classes.small} alt={postData['userName']} src={postData['userName']} />*/}
                                    {postData['userName']} @ {unix_to_date(postData['created'])}</div>

                            </Grid>


                    </Grid>
                        </div>

                    {postData['reference'] &&



                    <li className="item">
                        {postData.reference.thumbnail &&
                        <img className="thumbnail"
                             alt=""
                             src={postData.reference.thumbnail}
                        />
                        }
                        <h2 className="title">
                            <a href={postData.reference.link}>{postData.reference.title}</a>
                        </h2>
                        <p className="description">
                            {postData.reference.description}
                        </p>
                        <div className="meta">
                            <span>{postData.reference.date}</span>
                            <span className="provider">

                                {postData.reference.name}
        </span>

                            <span>Source category</span>

                        </div>
                    </li>
                    }
                    <div className={'category-chips'}>
                    <Chip label={postData['category']} color={'primary'}/>
                    </div>

                    <FirebaseDatabaseTransaction path={pointPath}>
                        {({ runTransaction }) => {
                            return (
                                <IconButton
                                    onClick={() => {
                                        runTransaction({
                                            reducer: val => {
                                                if (val === null) {
                                                    return 0;
                                                } else {
                                                    return val + 1;
                                                }
                                            }
                                        }).then(() => {

                                        });
                                    }}
                                    aria-label="account of current user"
                                    aria-controls="primary-search-account-menu"
                                    aria-haspopup="true"
                                    color="inherit"
                                >
                                    <ArrowDropUpIcon />

                                </IconButton>

                            );
                        }}

                    </FirebaseDatabaseTransaction>
                    {postData['points']}
                    <FirebaseDatabaseTransaction path={pointPath}>
                        {({ runTransaction }) => {
                            return (
                                <IconButton
                                    onClick={() => {
                                        runTransaction({
                                            reducer: val => {
                                                if (val === null || val === 0) {
                                                    return 0;
                                                } else {
                                                    return val - 1;
                                                }
                                            }
                                        }).then(() => {

                                        });
                                    }}
                                    aria-label="account of current user"
                                    aria-controls="primary-search-account-menu"
                                    aria-haspopup="true"
                                    color="inherit"
                                >
                                    <ArrowDropDownIcon />

                                </IconButton>

                            );
                        }}

                    </FirebaseDatabaseTransaction>

                    <IconButton
                        onClick={() => { alert('comments, add code for this') }}
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <MessageIcon />

                    </IconButton>
                    {postData['comments'] &&
                        <>{postData['comments'].length}</>
                    }




                </Paper>

            </React.Fragment>
        </>

    );
}