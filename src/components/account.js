/*
Component for account settings
 */
import React, { useContext, useState, useEffect } from "react";
import {
  Avatar,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import StarIcon from "@material-ui/icons/Star";

import { UserContext } from "../providers/UserProvider";
import { makePremiumUser } from "../firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100%",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  text: {
    padding: theme.spacing(2, 2, 0),
  },
  paper: {
    paddingBottom: 50,
    marginLeft: 50,
    marginRight: 50,
    marginTop: 100,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  list: {
    marginBottom: theme.spacing(2),
  },
  subheader: {
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    top: "auto",
    bottom: 0,
  },
  grow: {
    flexGrow: 1,
  },
  fabButton: {
    position: "absolute",
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: "0 auto",
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  avatarSize: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  break: {
    flexBasis: "100%",
    height: "0",
  },
  modal: {
    textAlign: "center",
  },
}));

export default function NewPost() {
  const user = useContext(UserContext);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [buyPremiumModalOpen, setBuyPremiumModalOpen] = useState(false);
  const [paymentName, setPaymentName] = useState("");
  const [paymentEmail, setPaymentEmail] = useState("");
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");

  useEffect(() => {
    console.log(invoiceId);
    if (invoiceId) {
      const interval = setInterval(async () => {
        const response = await fetch(
          `http://localhost:5000/invoice?id=${invoiceId}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              Authorization: process.env.CHECKBOOK_AUTH,
              "Content-Type": "application/json",
            },
          }
        );
        const responseJson = await response.json();
        if (responseJson.status === "IN_PROCESS") {
          clearInterval(interval);
          setInvoiceId("");
          setPaymentInProgress(false);
          setPremiumModalOpen(false);
          setBuyPremiumModalOpen(false);
          makePremiumUser(user);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [invoiceId, user]);

  const classes = useStyles();

  const handleCloseBuyPremiumModal = () => {
    setBuyPremiumModalOpen(false);
  };

  const handleBuyPremiumClick = () => {
    setBuyPremiumModalOpen(true);
    makePremiumUser(user);
  };

  const handleClosePremiumModal = () => {
    setPremiumModalOpen(false);
  };

  const handlePremiumClick = () => {
    setPremiumModalOpen(true);
  };

  const handleBuyClick = async () => {
    setPaymentInProgress(true);
    const response = await fetch(
      `http://localhost:5000/checkbook-invoice?name=${paymentName}&recipient=${paymentEmail}&description=Premium_account_payment&amount=10`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: process.env.CHECKBOOK_AUTH,
          "Content-Type": "application/json",
        },
      }
    );
    const responseJson = await response.json();
    setInvoiceId(responseJson.id);
  };

  if (user)
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <Avatar
              alt="Remy Sharp"
              src={user.profilePicture}
              className={classes.avatarSize}
            />
            <div className={classes.break}></div>
            <Typography variant="h3">{user.displayName}</Typography>
            <div className={classes.break}></div>
            <Typography variant="subtitle1">
              {" "}
              Account Type: {` ${user.membership}`}
            </Typography>
            <div className={classes.break}></div>
            {user.membership === "BASIC" && (
              <Button color="primary" onClick={handlePremiumClick}>
                Go Premium
              </Button>
            )}
          </Paper>
        </div>
        <Dialog
          onClose={handleClosePremiumModal}
          aria-labelledby="customized-dialog-title"
          open={premiumModalOpen}
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={handleClosePremiumModal}
          >
            Go Premium!
          </DialogTitle>
          <DialogContent dividers>
            <div classes={classes.modal}>
              <Typography id="simple-modal-description" variant="subtitle1">
                With a premium account, you can do much more!
              </Typography>
              <List aria-label="contacts">
                <ListItem>
                  <ListItemIcon>
                    <StarIcon />
                  </ListItemIcon>
                  <ListItemText inset primary="Post Satire Pieces" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <StarIcon />
                  </ListItemIcon>
                  <ListItemText inset primary="Post Non Cited Opinions" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <StarIcon />
                  </ListItemIcon>
                  <ListItemText
                    inset
                    primary="Gain access to research papers"
                  />
                </ListItem>
              </List>
            </div>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleBuyPremiumClick} color="primary">
              Buy for $10/month
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          onClose={handleCloseBuyPremiumModal}
          aria-labelledby="customized-dialog-title"
          open={buyPremiumModalOpen}
        >
          {!paymentInProgress && (
            <>
              <DialogTitle
                id="customized-dialog-title"
                onClose={handleCloseBuyPremiumModal}
              >
                Buy Premium for $10!
              </DialogTitle>

              <DialogContent dividers>
                <div classes={classes.modal}>
                  <Typography id="simple-modal-description" variant="subtitle1">
                    Billing Details:
                  </Typography>
                  <div>
                    <TextField
                      required
                      id="standard-required"
                      label="Name"
                      placeholder="Your Name"
                      onChange={(e) => {
                        setPaymentName(e.target.value);
                      }}
                    />
                    <TextField
                      required
                      id="standard-required"
                      label="E-mail Address"
                      defaultValue={user.email}
                      onChange={(e) => {
                        setPaymentEmail(e.target.value);
                      }}
                    />
                    <TextField
                      disabled
                      variant="filled"
                      id="standard-required"
                      label="Amount"
                      defaultValue="$10"
                      size="medium"
                    />
                  </div>
                </div>
              </DialogContent>

              <DialogActions>
                <Button autoFocus onClick={handleBuyClick} color="primary">
                  Buy for $10/month
                </Button>
              </DialogActions>
            </>
          )}
          {paymentInProgress && (
            <DialogContent dividers>
              <div classes={classes.modal}>
                <Typography id="simple-modal-description" variant="subtitle1">
                  Please check your email to pay for the order. Once the payment
                  is done, the page will automatically update.
                </Typography>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </React.Fragment>
    );
  return null;
}
