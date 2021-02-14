/*
Component to display and interact with a specific post
 */
import React from "react";
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import AccountCircle from "@material-ui/core/SvgIcon/SvgIcon";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MessageIcon from '@material-ui/icons/Message';

const useStyles = makeStyles((theme) => ({

    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
        marginRight: 5
    },

}));

export default function Post(data) {
    const classes = useStyles();
    let postData =  data['data'];
    let pid = data['pid'];
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
                                <h1 style={{fontFamily: 'Newsreader, serif'}}>"{postData['caption']}"</h1>
                            </Grid>

                            <Grid item xs={3}>
                            </Grid>
                            <Grid item xs={3}>
                            </Grid>
                            <Grid item xs={3}>
                            </Grid>
                            <Grid item xs={3}>
                                <div style={{display:'flex', fontSize:'16px'}}
                                > <Avatar  className={classes.small} alt={postData['userName']} src={postData['userName']} />{postData['userName']}</div>

                            </Grid>


                    </Grid>
                        </div>
                    <li className="item">
                        {postData['thumbnail'] &&
                        <img className="thumbnail"
                             alt=""
                             src={postData['thumbnail']}
                        />
                        }
                        <h2 className="title">
                            <a href={postData.reference}>Article Title</a>
                        </h2>
                        <p className="description">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada nisl commodo est fermentum, eget laoreet nibh pretium. Nam nisi eros, varius eget imperdiet et, scelerisque vitae diam. Phasellus pulvinar hendrerit lorem, scelerisque eleifend nisl sodales tempus. Sed lorem nunc, bibendum a lacus ac, blandit aliquam ipsum.
                        </p>
                        <div className="meta">
                            <span>Date of publishing</span>
                            <span className="provider">

                                Source name
        </span>

                            <span>Source category</span>

                        </div>
                    </li>
                    <div className={'category-chips'}>
                    <Chip label={postData['category']} color={'primary'}/>
                    </div>

                    <IconButton
                        onClick={() => { alert('upvote, add code for this') }}
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <ArrowDropUpIcon />

                    </IconButton>
                    {postData['points']}
                    <IconButton
                        onClick={() => { alert('downvote, add code for this') }}
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <ArrowDropDownIcon />
                    </IconButton>

                    <IconButton
                        onClick={() => { alert('comments, add code for this') }}
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <MessageIcon />

                    </IconButton>
                    {postData['comments'].length}



                </Paper>

            </React.Fragment>
        </>

    );
}