import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { Platform } from "react-native";
import ImagePicker from "react-native-image-picker";
import { useChat } from "../provider/ChatProvider";
import { useAuth } from "../provider/AuthProvider";
import chatService from "../services/chatService";
import userService from "../services/userService";

const GroupInfoScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { selectedRoom, setSelectedRoom, setRoomList } = useChat();
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState(selectedRoom.name);
  const [members, setMembers] = useState(selectedRoom.members);
  const [newAdmin, setNewAdmin] = useState("");
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const { userVerified } = useAuth();
  // const isAdmin = selectedRoom.admin._id === userVerified._id;
  const isAdmin = userVerified._id === selectedRoom.admin._id;
  console.log(isAdmin, userVerified, selectedRoom);

  const [groupImage, setGroupImage] = useState(
    selectedRoom.image || "https://via.placeholder.com/150"
  );

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchText.trim() !== "") {
        try {
          const result = userVerified.friends.filter((friend) =>
            friend.username.includes(searchText.trim())
          );
          const filteredList = result.filter(
            (user) =>
              !selectedRoom.members.some((member) => member._id === user._id)
          );
          setFilteredUsers(filteredList);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      } else {
        setFilteredUsers([]);
      }
    };

    fetchUsers();
  }, [searchText, userVerified._id]);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleUserSelect = async (user) => {
    try {
      // Tạo một phòng trò chuyện mới hoặc tham gia phòng trò chuyện nhóm
    } catch (error) {
      console.error("Error selecting user:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedRoom = await chatService.updateChatGroup({
        chatroomId: selectedRoom._id,
        members,
        name: groupName,
        image: selectedRoom.image || "",
        adminId: selectedRoom.admin._id,
        newAdminId: newAdmin || selectedRoom.admin._id, // Assuming admin remains the same
      });
      setSelectedRoom(updatedRoom); // Assuming response contains updated room data
      setRoomList((prevRooms) =>
        prevRooms.map((room) =>
          room._id === updatedRoom._id ? updatedRoom : room
        )
      );
      // Emit event to update group details in other clients
      // socket.emit("update-group", updatedRoom);
    } catch (error) {
      console.error("Error updating group:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (memberId) => {
    setLoading(true);
    const updatedMembers = members.filter((member) => member._id !== memberId);
    try {
      const updatedRoom = await chatService.updateChatGroup({
        chatroomId: selectedRoom._id,
        members: updatedMembers,
        name: groupName,
        image: selectedRoom.image || "",
        adminId: selectedRoom.admin._id,
        newAdminId: newAdmin || selectedRoom.admin._id, // Assuming admin remains the same
      });
      setSelectedRoom(updatedRoom); // Assuming response contains updated room data
      setRoomList((prevRooms) =>
        prevRooms.map((room) =>
          room._id === updatedRoom._id ? updatedRoom : room
        )
      );
      // Emit event to update group details in other clients
      // socket.emit("update-group", updatedRoom);
    } catch (error) {
      console.error("Error updating group:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = () => {
    const options = {
      title: "Select Group Avatar",
      mediaType: "photo",
      maxWidth: 200,
      maxHeight: 200,
      quality: 0.8,
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        // Here, you can update the groupImage state with the selected image
        const source =
          Platform.OS === "android"
            ? response.uri
            : response.uri.replace("file://", "");
        setGroupImage(source);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Group Info</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={groupImage}
          onChangeText={setGroupImage}
          placeholder="Enter new group image URL"
        />
        <TouchableOpacity style={styles.button} onPress={handleSelectImage}>
          <Text style={styles.buttonText}>Change Image</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Group Name:</Text>
      {isAdmin ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={groupName}
            onChangeText={(text) => setGroupName(text)}
            placeholder="Enter new group name"
          />
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Change</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.infoText}>{selectedRoom.name}</Text>
      )}

      <View style={styles.search}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={searchText}
            onChangeText={handleSearch}
            placeholder="Enter username to add member"
            editable={isAdmin}
            selectTextOnFocus={isAdmin}
          />
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Add Member</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredUsers}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleUserSelect(item)}>
              <View style={styles.item}>
                <Image
                  source={{ uri: item.profilePic }}
                  style={styles.avatar}
                />
                <Text style={styles.username}>{item.username}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id.toString()}
        />
      </View>
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
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  search: {
    flexDirection: "column",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});

export default GroupInfoScreen;
