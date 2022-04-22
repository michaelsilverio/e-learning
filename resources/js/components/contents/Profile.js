import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withCookies } from "react-cookie";

import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Settings } from "@mui/icons-material";

import { fetchSingleUser } from "../../actions/user";
import { fetchAllAnswers } from "../../actions/lesson";
import {
  fetchFollowData,
  followUser,
  setFollower,
  setFollowing,
  unfollowUser,
  setToUnfollow,
  freshFollow,
} from "../../actions/follow";
import Activity from "./Activity";
import EditProfile from "./EditProfile";
import Word from "./Word";

const Profile = (props) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [tabValue, setTabValue] = useState("1");
  // Get profile data from cookie
  const profileData = () => {
    return props.cookies.get("profileData") !== undefined
      ? props.cookies.get("profileData")
      : null;
  };
  // Run on first load
  useEffect(() => {
    // Initialize the state on first load
    props.freshFollow();
    // Get the user profile data
    props.fetchSingleUser(props.token, profileData().userId);
    // Get the currently signed in user follows data
    props.fetchFollowData(props.token, props.userAuth.id);
    // Get all lesson answers based on user id
    props.fetchAllAnswers(props.token, profileData().userId);
  }, []);

  useEffect(() => {
    // If greater than 0
    if (props.singleUserData.length !== 0) {
      // Run function assign data to followers and followings
      followersFollowing();
    }
  }, [props.singleUserData]);

  useEffect(() => {
    if (props.allAnswers.length !== 0) {
      var count = 0;
      Object.entries(props.allAnswers).map(([key, answer]) => {
        count += answer.answer_users.length;
      });
      // Set state with word count
      setWordCount(count);
    }
  }, [props.allAnswers]);

  useEffect(() => {
    return props.followData.length !== 0
      ? // Get the follows data and assign to variables
        Object.entries(props.followData).map(([key2, data]) => {
          /**
           * Check if already followed, if already followed then update
           * follow button to unfollow.
           */
          if (data.followed_id === profileData().userId) {
            // Set follow to unfollow butotn
            props.setToUnfollow();
          }
        })
      : null;
  }, [props.followData]);

  const userData = () => {
    return props.singleUserData.length !== 0
      ? // This gets the data of the first id of the array of object
        props.singleUserData[Object.keys(props.singleUserData)[0]]
      : [];
  };

  const followersFollowing = () => {
    // Set data to followers
    props.setFollower(userData().followers.length);
    // Set data to followings
    props.setFollowing(userData().followings.length);
  };

  // Set the button to unfollow
  const handleFollow = (data) => {
    // Store data to follows table
    props.followUser(props.token, {
      user_id: data.userId,
      followed_id: data.followedId,
    });
  };
  // Set the button to unfollow
  const handleUnfollow = (data) => {
    // Destroy data in the follows table
    props.unfollowUser(props.token, {
      user_id: data.userId,
      followed_id: data.followedId,
    });
  };
  // Close edit profile then open activity list
  const handleViewActivity = () => {
    setOpenEdit(false);
  };

  const handleEditProfile = (data) => {
    setOpenEdit(true);
  };

  const handleChange = (e, value) => {
    setTabValue(value);
  };

  return (
    <React.Fragment>
      <Container>
        <Grid container>
          <Grid item lg={4} md={4} sm={4} xs={12}>
            <Typography component="h5" variant="h5" sx={{ mb: 5 }}>
              Profile
            </Typography>
          </Grid>
          <Grid item lg={8} md={8} sm={8} xs={12}></Grid>
        </Grid>
      </Container>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Box sx={{ pt: 5, pr: 10, pb: 5 }}>
          <Grid container>
            <Grid item lg={4} md={4} sm={4} xs={12}>
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mb: 2 }}>
                  <Typography>
                    {userData().fname + " " + userData().lname}
                  </Typography>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Avatar
                    alt="img"
                    variant="square"
                    src={
                      userData().avatar === null
                        ? "images/avatars/profile.png"
                        : userData().avatar
                    }
                    sx={{ width: "200px", height: "200px" }}
                    style={{
                      borderRadius: "100%",
                      boxShadow: "inset 0 0 0px 11px #1976D266",
                      backgroundColor: "transparent",
                    }}
                  />
                </Grid>

                <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 1 }}>
                  <Grid
                    container
                    spacing={5}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid item>
                      <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justifyContent="centerF"
                      >
                        <Grid item>
                          <Typography sx={{ color: "#000000B2" }}>
                            {props.followers}
                          </Typography>
                        </Grid>
                        <Grid>
                          <Typography
                            sx={{ fontSize: "14px", color: "#000000B2" }}
                          >
                            Followers
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justifyContent="centerF"
                      >
                        <Grid item>
                          <Typography sx={{ color: "#000000B2" }}>
                            {props.following}
                          </Typography>
                        </Grid>
                        <Grid>
                          <Typography
                            sx={{ fontSize: "14px", color: "#000000B2" }}
                          >
                            Following
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} sx={{ mt: "-25px" }}>
                      <Divider />
                    </Grid>
                  </Grid>
                </Grid>
                {
                  // We can follow and unfollow others but not it's own
                  profileData().userId !== props.userAuth.id ? (
                    <React.Fragment>
                      <Grid item>
                        <Typography
                          style={{
                            fontSize: "15px",
                            color: "#777777",
                            marginTop: "15px",
                          }}
                        >
                          Learned {wordCount} words
                        </Typography>
                      </Grid>
                      <Grid item sx={{ mt: 2 }}>
                        {props.isFollowButton ? (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              handleFollow({
                                userId: props.userAuth.id,
                                followedId: profileData().userId,
                              });
                            }}
                          >
                            Follow
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              handleUnfollow({
                                userId: props.userAuth.id,
                                followedId: profileData().userId,
                              });
                            }}
                          >
                            Unfollow
                          </Button>
                        )}
                      </Grid>
                    </React.Fragment>
                  ) : (
                    <Grid item sx={{ mt: 4 }}>
                      <Button
                        variant={openEdit ? "outlined" : "contained"}
                        size="small"
                        onClick={() => {
                          !openEdit
                            ? handleEditProfile({
                                userId: props.userAuth.id,
                              })
                            : handleViewActivity();
                        }}
                      >
                        {!openEdit ? (
                          <React.Fragment>
                            <Settings sx={{ pr: 1 }} />
                            Edit Profile
                          </React.Fragment>
                        ) : (
                          "View Activity"
                        )}
                      </Button>
                    </Grid>
                  )
                }
              </Grid>
            </Grid>
            <Grid item lg={8} md={8} sm={8} xs={12}>
              <Paper>
                <Box sx={{ p: 2 }}>
                  {!openEdit ? (
                    <React.Fragment>
                      <Box sx={{ p: 5 }}>
                        <TabContext value={tabValue}>
                          <Box>
                            <TabList onChange={handleChange}>
                              <Tab label="User Activities" value="1" />
                              <Tab label="Words Learned" value="2" />
                            </TabList>
                          </Box>
                          <TabPanel value="1">
                            <Activity
                              userId={profileData().userId}
                              type="profile"
                            />
                          </TabPanel>
                          <TabPanel value="2">
                            <Word
                              userId={profileData().userId}
                              type="profile"
                            />
                          </TabPanel>
                        </TabContext>
                      </Box>
                    </React.Fragment>
                  ) : (
                    <EditProfile
                      userData={userData()}
                      setOpenEdit={setOpenEdit}
                    />
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </React.Fragment>
  );
};

const mapToStateProps = (state, ownProps) => {
  return {
    token: state.auth.userAuth.token,
    userAuth: state.auth.userAuth,
    singleUserData: state.user.singleUserData,
    allAnswers: state.lesson.allAnswers,
    followData: state.follow.followData,
    followers: state.follow.followers,
    following: state.follow.following,
    isFollowButton: state.follow.isFollowButton,
    cookies: ownProps.cookies,
  };
};

export default withCookies(
  connect(mapToStateProps, {
    fetchSingleUser,
    fetchAllAnswers,
    fetchFollowData,
    followUser,
    setFollower,
    setFollowing,
    unfollowUser,
    setToUnfollow,
    freshFollow,
  })(Profile)
);
