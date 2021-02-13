/*
Component to sign in
If user logged in then displays newsfeed, otherwise user has to sign in
 */

import React from "react";
import { auth, createUserDocument, storage } from "../firebase";
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import firebase from "firebase/app";



class SignIn extends React.Component {
    //const classes = useStyles();
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: '',
            //If sign Up
            newUser: false,
            password_2: '',
            displayName: '',
            pfpLink: '',
            value:0,
            image: "",
            progress: 0,

        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.signInWithEmailAndPasswordHandler = this.signInWithEmailAndPasswordHandler.bind(this);
        this.createUserWithEmailAndPasswordHandler = this.createUserWithEmailAndPasswordHandler.bind(this);
        this.handleNewUserClick = this.handleNewUserClick.bind(this)
    }

    signInWithEmailAndPasswordHandler = (event, email, password) => {
        event.preventDefault();
        auth.signInWithEmailAndPassword(email, password).catch(error => {
            this.setState({
                error: `Error signing in with password and email!\n${error}`
            });
            console.error("Error signing in with password and email", error);
        });
    };

    async createUserWithEmailAndPasswordHandler(event) {
        event.preventDefault();
        if (this.state.password === this.state.password_2){


            try {
                const {user} = await auth.createUserWithEmailAndPassword(this.state.email, this.state.password);
                const userDB = {
                    'displayName': this.state.displayName,
                    'email': this.state.email,
                    'membership': "BASIC",
                    'pfpLink': this.state.pfpLink
                };
                createUserDocument(user,userDB);
            } catch (error) {
                this.setState({
                    error: `${error}`
                });
            }
        }else{
            this.setState({
                error:"Passwords don't match"
            })
        }

    }

    handleInputChange(event) {
        const target = event.target;
        const value =target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleImageUpload (e){
        e.preventDefault();
        const { image } = this.state;
        const uploadTask = firebase.storage().ref(`userProfileImages/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            snapshot => {
                // progress function ...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                this.setState({ progress });
            },
            error => {
                // Error function ...
                console.log(error);
            },
            () => {
                // complete function ...
                storage
                    .ref("eventsImages")
                    .child(image.name)
                    .getDownloadURL()
                    .then(imageURL => {
                        this.setState((prevState)=>{
                            return{
                                pfpLink: imageURL
                            }
                        });
                    });
            }
        );

    };

    handleImgChange = e => {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            this.setState(() => ({ image }));
        }
        this.handleImageUpload(e)
    };

    handleNewUserClick(){
        // Changing state
        this.setState({newUser: true})
    }

    render (){
        return (
            <Container fixed >
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

                    <form className={'root'} noValidate autoComplete="off">
                            {this.state.error !== null && <div className = "">{this.state.error}</div>}
                            {this.state.newUser ?
                                <>
                                    {/*{this.state.pfpLink && <img alt={'Event'} src={this.state.pfpLink} style={{width: '250px'}}/>}*/}
                                    {/*<div className="file-field input-field">*/}
                                    {/*    <div className="btn">*/}
                                    {/*                        <span>*/}
                                    {/*                            {!this.state.pfpLink &&*/}
                                    {/*                            <>Upload File</>*/}
                                    {/*                            }*/}
                                    {/*                            {this.state.pfpLink &&*/}
                                    {/*                            <>Replace File</>*/}
                                    {/*                            }*/}

                                    {/*                        </span>*/}
                                    {/*        <input type="file" accept="image/*" onChange={this.handleImgChange} />*/}
                                    {/*    </div>*/}

                                    {/*</div>*/}


                                    <div className={"textInForm"}>
                                        <TextField
                                            id="standard-basic"
                                            type="text"
                                            label="Display Name"
                                            name="displayName"
                                            required
                                            value = {this.state.displayName}
                                            onChange = {this.handleInputChange}/>
                                    </div>

                                    <div className={"textInForm"}>
                                        <TextField
                                            id="standard-basic"
                                            type="email"
                                            label="Email"
                                            required
                                            name="email"
                                            value = {this.state.email}
                                            onChange = {this.handleInputChange}/>
                                    </div>

                                    <div className={"textInForm"}>
                                        <TextField
                                            id="standard-password-input"
                                            label="Password"
                                            type="password"
                                            required
                                            autoComplete="current-password"
                                            name="password"
                                            value = {this.state.password}
                                            onChange = {this.handleInputChange}
                                        />
                                    </div>

                                    <div className={"textInForm"}>
                                        <TextField

                                            label="Enter Password Again"
                                            type="password"
                                            required
                                            autoComplete="current-password"
                                            name="password_2"
                                            value = {this.state.password_2}
                                            onChange = {this.handleInputChange}
                                        />
                                    </div>

                                    <Button variant="contained" id={"form-submit"}  onClick = {this.createUserWithEmailAndPasswordHandler}>
                                        Create Account
                                    </Button>
                                </>
                                :
                                <>
                                    <div className={"textInForm"}>
                                        <TextField
                                            id="standard-basic"
                                            type="email"
                                            label="Email"
                                            name="email"
                                            value = {this.state.email}
                                            onChange = {this.handleInputChange}/>
                                    </div>

                                    <div className={"textInForm"}>
                                        <TextField
                                            id="standard-password-input"
                                            label="Password"
                                            type="password"
                                            autoComplete="current-password"
                                            name="password"
                                            value = {this.state.password}
                                            onChange = {this.handleInputChange}
                                        />
                                    </div>

                                    <Button variant="contained"  onClick = {this.signInWithEmailAndPasswordHandler}>
                                        Sign In
                                    </Button>

                                    <Button variant="contained"  onClick = {this.handleNewUserClick}>
                                        Sign Up
                                    </Button>
                                </>
                            }
                        </form>
                    </div>
                </Card>
            </Container>
        );
    }

};
export default SignIn;