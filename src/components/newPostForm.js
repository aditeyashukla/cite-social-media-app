/*
Component to display and interact with a specific post
 */
import React, { useContext } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import firebase from "firebase/app";
import { UserContext } from "../providers/UserProvider";
import Iframe from "react-iframe";

const request = require("request");

const base64Credentials = Buffer.from(
  "localhost:3000:dBB4b3hqYdqcrduUF9X9"
).toString("base64");

class NewPost extends React.Component {
  //const classes = useStyles();
  constructor(props) {
    super(props);
    this.state = {
      stage: 1,
      //category ->> 0: none, 1: opinion (cite), 2: non opinion (no citation)
      category: 0,
      topic: "",
      reference: {
        title: "",
        link: "",
        thumbnail: "",
        description: "",
        category: "",
        date: "",
        name: "",
      },
      reference_markup: [],
      caption: "",
      modalOpen: false,
      articleContent: ''
    };
    this.categorySetOp = this.categorySetOp.bind(this);
    this.categorySetDisc = this.categorySetDisc.bind(this);
    this.stage2 = this.stage2.bind(this);
    this.changeToStage3 = this.changeToStage3.bind(this);
    this.changeToStage4 = this.changeToStage4.bind(this);
  }

  static contextType = UserContext;

  categorySetOp = (event) => {
    this.setState({
      category: 1,
      stage: 2,
    });
  };

  categorySetDisc = (event) => {
    this.setState({
      category: 2,
      stage: 2,
    });
  };

  changeToStage3 = (event) => {
    this.setState({
      stage: 3,
    });
  };

  changeToStage4 = (event) => {
    this.setState({
      stage: 4,
    });
  };

  changeReferenceLink = (event) => {
    const target = event.target;
    const val = target.value;
    this.setState({
      reference: {
        ...this.state.reference,
        link: val,
      },
    });
  };

  changeCaption = (event) => {
    const target = event.target;
    const val = target.value;
    this.setState({
      caption: val,
    });
  };

  callback(error, response, body) {
    if (!error && response.statusCode === 200) {
      let data = JSON.parse(body);

      if (data.result.status == "OK") {
        console.log(data.meta);
      } else {
        console.log(data.result.reason);
      }
    } else {
      console.log(error, body);
    }
  }

  checkRef = async (event) => {
    const response = await fetch(
      `http://localhost:5000/fact-check?newsURL=${this.state.reference.link}`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseJson = await response.json();
    const meta = responseJson.meta;

    if (
      (responseJson.claims &&
        !responseJson.claims.claimReview.textualRating.contains("False")) ||
      (responseJson.articleCategory &&
        responseJson.articleCategory !== "unsure")
    ) {

      this.setState({
        reference: {
          ...this.state.reference,
          title: responseJson.articleTitle,
          thumbnail: meta.image,
          description: meta.description,
          category: "",
          date: "",
          name: "",
        },
        articleContent: responseJson.articleContent
      });

      this.changeToStage3();
    } else {
      alert(
        "Sorry - your source isn't verified by our metrics. Please try another source."
      );
    }
  };

  postDisc = (event) => {
    //post disc to realtime fbdb
    //move to stage 4
    let fbref = firebase.database().ref("/");
    let data = {
      caption: this.state.caption,
      category: "Discussion",
      comments: {},
      points: 0,
      userID: this.context.uid,
      userName: this.context.displayName,
      created: firebase.database.ServerValue.TIMESTAMP,
    };
    fbref.push(data);
    this.changeToStage4();
  };

  postOpinion = (event) => {
    //post disc to realtime fbdb
    //move to stage 4
    let fbref = firebase.database().ref("/");
    let data = {
      caption: this.state.caption,
      category: "Opinion",
      comments: {},
      points: 0,
      userID: this.context.uid,
      userName: this.context.displayName,
      reference: this.state.reference,
      created: firebase.database.ServerValue.TIMESTAMP,
    };
    fbref.push(data);
    this.changeToStage4();
  };

  stage1() {
    return (
      <>
        <h2>What type of post would you like to make today?</h2>
        <Button
          variant="contained"
          color="primary"
          id={"opinion_button"}
          name={"opinion"}
          onClick={this.categorySetOp}
        >
          Opinion
        </Button>
        <br />
        or
        <br />
        <Button
          variant="contained"
          onClick={this.categorySetDisc}
          name={"disc"}
          id={"discussion_button"}
        >
          Discussion
        </Button>
      </>
    );
  }

  stage2() {
    //if opinion, then show text field for reference
    //if disc, then show field for caption, with POST button
    let stage2;
    if (this.state.category === 1) {
      stage2 = (
        <>
          <h1>What source would you like to use as a reference?</h1>
          <TextField
            autoFocus
            margin="dense"
            id="reference"
            label="Reference"
            type="text"
            onChange={this.changeReferenceLink}
            value={this.state.reference.link}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={this.checkRef}
            id={"discussion_button"}
          >
            Next
          </Button>
        </>
      );
    } else {
      let that = this;
      stage2 = (
        <>
          <h1>What is on your mind?</h1>
          <TextField
            autoFocus
            margin="dense"
            id="caption"
            label="I'm thinking about..."
            type="text"
            onChange={this.changeCaption}
            value={this.state.caption}
            fullWidth
          />

          <Button
            variant="contained"
            onClick={this.postDisc}
            id={"discussion_button"}
          >
            Post
          </Button>
        </>
      );
    }
    return stage2;
  }
  //     document.addEventListener('mousemove', (e) => {
  //     this.setState({left: e.pageX, top: e.pageY});
  // });
  componentDidMount() {
    document.addEventListener("click", (e) => {
      const selection = window.getSelection();
      console.log("Got selection", selection.toString());
      this.setState({
        caption: selection,
      });
    });
  }

  getSelectionHandler = (e) => {
    const selection = window.getSelection();
    console.log("Got selection", selection.toString());
    this.setState({
      caption: selection,
    });
  };

  stage3() {
    //if opinion, select text from reference and add opinions
    // if disc, moved to stage 4
    let stage3;
    if (this.state.category === 1) {
      stage3 = (
        <>
          <h1>Highlight the part of the article you want to quote!</h1>
          {/*<Iframe url={this.state.reference.link}*/}
          {/*        width="450px"*/}
          {/*        height="450px"*/}
          {/*        id="myId"*/}
          {/*        className="myClassname"*/}
          {/*        display="initial"*/}
          {/*        position="relative"/>*/}
          <p>
            {/*TODO ADD REAL CONTENT*/}
            {this.state.articleContent}
          </p>
          <TextField
            autoFocus
            margin="dense"
            id="reference"
            type="text"
            onChange={this.changeCaption}
            value={this.state.caption}
            fullWidth
          />

          <Button variant="contained" onClick={this.postOpinion}>
            Post
          </Button>
        </>
      );
    }
    return stage3;
  }

  stage4() {
    //Posting stage
    //if opinion, send POST req with fact checker
    // if disc, send POST request
    //Add to realtime db if everything passes checks, otherwise show error in modal
    return <h1>Your post is now live!</h1>;
  }

  render() {
    return (
      <>
        {this.state.stage === 1 && this.stage1()}
        {this.state.stage === 2 && this.stage2()}
        {this.state.stage === 3 && this.stage3()}
        {this.state.stage === 4 && this.stage4()}
      </>
    );
  }
}

export default NewPost;
