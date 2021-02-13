/*
Component to sign in
If user logged in then displays newsfeed, otherwise user has to sign in
 */

import React, {useState} from "react";
import { auth } from "../firebase";
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1)
        },
    },
}));

const SignIn = () => {
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const signInWithEmailAndPasswordHandler = (event, email, password) => {
        event.preventDefault();
        auth.signInWithEmailAndPassword(email, password).catch(error => {
            setError("Error signing in with password and email!");
            console.error("Error signing in with password and email", error);
        });
    };

    const onChangeHandler = (event) => {
        const {name, value} = event.currentTarget;

        if(name === 'userEmail') {
            setEmail(value);
        }
        else if(name === 'userPassword'){
            setPassword(value);
        }
    };

    return (
        <Container >
            <Card elevation={3} style={{
                height: '100vh',
                backgroundColor: '#EDF5E1',
                padding: '15px',
                maxWidth: '98%'
            }}>
                <img alt={'logo placeholder'} src={"https://www.goomlandscapes.co.nz/wp-content/uploads/2018/08/logo-placeholder.png"}/>
                <div style={{
                    display:'flex',
                    flex: '1',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '100vh'
                }}>

                    <form className={classes.root} noValidate autoComplete="off">
                        {error !== null && <div className = "">{error}</div>}

                        <div className={"textInForm"}>
                            <TextField
                                id="standard-basic"
                                type="email"
                                label="Email"
                                name="userEmail"
                                value = {email}
                                onChange = {(event) => onChangeHandler(event)}/>
                        </div>

                        <div className={"textInForm"}>
                            <TextField
                                id="standard-password-input"
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                name="userPassword"
                                value = {password}
                                onChange = {(event) => onChangeHandler(event)}
                            />
                        </div>

                        <Button variant="contained"  onClick = {(event) => {signInWithEmailAndPasswordHandler(event, email, password)}}>
                            Sign In
                        </Button>
                    </form>
                </div>
            </Card>
        </Container>
    );
};
export default SignIn;