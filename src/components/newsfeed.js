import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import CreateIcon from '@material-ui/icons/Create';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FilterListIcon from '@material-ui/icons/FilterList';
import Menu from '@material-ui/core/Menu';
import Chip from '@material-ui/core/Chip';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Post from './post'
import Divider from '@material-ui/core/Divider';
import {UserContext} from "../providers/UserProvider";

import firebase from "firebase/app";
import "firebase/database";
import {
    FirebaseDatabaseProvider,
    FirebaseDatabaseNode
} from "@react-firebase/database";
import { firebaseConfig } from "../firebase";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    text: {
        padding: theme.spacing(2, 2, 0),
    },
    paper: {
        paddingBottom: 50,
    },
    list: {
        marginBottom: theme.spacing(2),
    },
    subheader: {
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        top: 'auto',
        bottom: 0,
    },
    grow: {
        flexGrow: 1,
    },
    fabButton: {
        position: 'absolute',
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: '0 auto',
    },
    chip: {
        margin: theme.spacing(0.5),
    },
}));

export default function BottomAppBar() {
    const classes = useStyles();
    const user = useContext(UserContext);
    console.log("URSER",user)
    const [chipData, setChipData] = React.useState([
        { key: 0, label: 'Breaking' },
        { key: 1, label: 'Opinion' },

    ]);

    const [chipDataOffline, setChipDataOffline] = React.useState([
        { key: 2, label: 'Unvetted Opinion' },
        { key: 3, label: 'Discussion' },
        { key: 4, label: 'Joke' },
    ]);
    const [activeCategories, setActiveCatergories] = React.useState(['Opinions']);
    const [disabledCategories, setDisabledCatergories] = React.useState(['Jokes', 'Uncited Opinions']);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const [state, setState] = React.useState({
        bottom: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const handleChipDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
        setChipDataOffline((chips) => chips.concat(chipToDelete));

    };

    const handleChipAdd  = (chipToDelete) => () => {
        setChipDataOffline((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
        setChipData((chips) => chips.concat(chipToDelete));
    };


    const list = (anchor) => (
        <div

            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
            style={{backgroundColor:'#84a29e'}}
        >

            <Paper component="ul" className={classes.root} style={{backgroundColor:'#84a29e'}}>


                {chipData.map((data) => {
                    let icon;

                    return (
                        <li key={data.key}>
                            <Chip
                                icon={icon}
                                color="primary"
                                label={data.label}
                                onDelete={handleChipDelete(data)}
                                className={classes.chip}
                            />
                        </li>
                    );
                })}
            </Paper>

            <Paper component="ul" className={classes.root} style={{backgroundColor:'#84a29e'}}>

                {chipDataOffline.map((data) => {
                    let icon;

                    return (
                        <li key={data.key}>
                            <Chip
                                icon={icon}

                                label={data.label}
                                onDelete={handleChipAdd(data)}
                                className={classes.chip}
                            />
                        </li>
                    );
                })}
            </Paper>
        </div>
    );


    const menuId = 'primary-search-account-menu';

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Log Out</MenuItem>
        </Menu>
    );


    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="md">
                <Paper square className={classes.paper}>
                    {/*<h1>Welcome, {user['displayName']}</h1>*/}
                    <FirebaseDatabaseProvider firebase={firebase} {...firebaseConfig}>
                        <FirebaseDatabaseNode
                            path="/"
                            //orderByChild={""}
                            //limitToFirst={this.state.limit}
                            // orderByKey
                            orderByValue={"created"}
                        >
                            {d => {
                                let a = (d.value);

                                return (
                                    <>
                                        {d.value !== null &&
                                        <>
                                            {Object.keys(a).map((each) => {
                                                return (
                                                    <Post data={a[each]} id={each} user={user}/>
                                                )}
                                            )}
                                        </>

                                        }
                                    </>

                                );
                            }}
                        </FirebaseDatabaseNode>

                    </FirebaseDatabaseProvider>
                    {/*</List>*/}
                </Paper>
            </Container>
            <AppBar position="fixed" style={{backgroundColor:'#84a29e'}} className={classes.appBar}>
                <Toolbar>
                    <React.Fragment key={'bottom'}>

                        <IconButton onClick={toggleDrawer('bottom', true)} edge="start" color="inherit" aria-label="open drawer">
                            <FilterListIcon />
                            <p style={{
                                fontSize:'1vw'
                            }}
                            >Filter Categories</p>
                        </IconButton>

                        <SwipeableDrawer
                            anchor={'bottom'}
                            open={state['bottom']}
                            onClose={toggleDrawer('bottom', false)}
                            onOpen={toggleDrawer('bottom', true)}
                        >
                            {list('bottom')}
                        </SwipeableDrawer>
                    </React.Fragment>

                    <Fab color="secondary" aria-label="add" className={classes.fabButton} style={{backgroundColor:'#a5a09b'}}>
                        <CreateIcon />
                    </Fab>
                    <div className={classes.grow} />


                    <IconButton
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <AccountCircle />

                    </IconButton>


                </Toolbar>
            </AppBar>
            {renderMenu}
        </React.Fragment>
    );
}
