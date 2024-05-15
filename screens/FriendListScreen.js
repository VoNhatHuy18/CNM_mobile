import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

import { useAuth } from "../provider/AuthProvider";
import userService from "../services/userService";

const FriendRequestItem = ({ user, onAccept, onReject }) => {
  return (
    <View style={styles.container}>
      {/* <Image source={{ uri: user.profilePic }} style={styles.avatar} /> */}
      <View style={styles.userInfo}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.message}>sent you a friend request</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={onAccept} style={styles.acceptButton}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onReject} style={styles.rejectButton}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FriendListScreen = () => {
  const { userVerified, setUserVerified } = useAuth();
  const handleAcceptFriendRequest = async (requester) => {
    console.log("Accept friend request");
    try {
      const response = await userService.acceptFriendRequest({
        requesterId: requester._id,
        userId: userVerified._id,
      });

      const userUpdated = await userService.getUserById(userVerified._id);
      setUserVerified(userUpdated);

      // socket.emit('accept-friend-request', response);
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleReject = (userId) => {
    // Logic to reject friend request
  };

  return (
    <View style={styles.container}>
      {userVerified.friendRequestsReceived.map((request) => (
        <FriendRequestItem
          key={request._id}
          user={request}
          onAccept={() => handleAcceptFriendRequest(request)}
          onReject={() => handleReject(request)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  message: {
    color: "#666",
  },
  buttons: {
    flexDirection: "row",
  },
  acceptButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default FriendListScreen;
