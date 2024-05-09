import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useChat } from "../provider/ChatProvider";
import { useAuth } from "../provider/AuthProvider";

const GroupInfoScreen = () => {
  const { selectedRoom } = useChat();
  const [groupName, setGroupName] = useState(selectedRoom.name);
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const { userVerified } = useAuth();
  // const isAdmin = selectedRoom.admin._id === userVerified._id;
  const isAdmin = true;
  console.log(isAdmin, userVerified);

  const changeGroupName = () => {
    // Logic to change group name
    // For example, you can make an API call here
    console.log("Changing group name to:", groupName);
    // Update UI or show success message
    Alert.alert("Group Name Changed", `Group name changed to ${groupName}`);
  };

  const addMember = () => {
    // Logic to add a member
    // For example, you can make an API call here
    console.log("Adding new member:", newMemberUsername);
    // Update UI or show success message
    Alert.alert("Member Added", `Added ${newMemberUsername} to the group`);
    // Clear input field
    setNewMemberUsername("");
  };

  const deleteMember = (memberId) => {
    // Logic to delete a member
    // For example, you can make an API call here
    console.log("Deleting member:", memberId);
    // Update UI or show success message
    Alert.alert("Member Deleted", `Deleted member with ID: ${memberId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Group Info</Text>

      <Text style={styles.subtitle}>Group Name:</Text>
      {isAdmin ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Enter new group name"
          />
          <TouchableOpacity style={styles.button} onPress={changeGroupName}>
            <Text style={styles.buttonText}>Change</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.infoText}>{selectedRoom.name}</Text>
      )}

      <Text style={styles.subtitle}>Admin:</Text>
      <Text style={styles.infoText}>{selectedRoom.admin.username}</Text>

      <Text style={styles.subtitle}>Members:</Text>
      {selectedRoom.members.map((member) => (
        <View style={styles.memberContainer} key={member._id}>
          <Image
            source={{
              uri: member.profilePic || "https://via.placeholder.com/150",
            }}
            style={styles.profilePic}
          />
          <Text style={styles.memberName}>{member.username}</Text>
          {isAdmin && member._id !== selectedRoom.admin._id && (
            <TouchableOpacity onPress={() => deleteMember(member._id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      {isAdmin && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMemberUsername}
            onChangeText={setNewMemberUsername}
            placeholder="Enter username to add member"
          />
          <TouchableOpacity style={styles.button} onPress={addMember}>
            <Text style={styles.buttonText}>Add Member</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  memberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  memberName: {
    fontSize: 16,
    marginRight: 10,
  },
  deleteButton: {
    color: "red",
    marginLeft: "auto",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default GroupInfoScreen;
