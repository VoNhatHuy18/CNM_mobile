import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth, useChat } from "../provider/AuthProvider";
import userService from "../services/userService";

const ChatGroup = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { userVerified } = useAuth();
  const { selectedRoom, setSelectedRoom, roomList, fetchUpdatedRooms } =
    useChat();

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchText.trim() !== "") {
        try {
          const result = await userService.getAllUsers();
          const filteredResult = result.filter(
            (user) => user._id !== userVerified._id
          );
          setFilteredUsers(filteredResult);
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

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchText}
          onChangeText={handleSearch}
        />
        <Ionicons name="search" size={24} color="black" />
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleUserSelect(item)}>
            <View style={styles.item}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <Text style={styles.username}>{item.username}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <FlatList
        data={roomList}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedRoom(item);
              navigation.navigate("ChatScreen");
            }}
          >
            <View style={styles.item}>
              <Ionicons name="chatbubbles" size={24} color="green" />
              <Text style={styles.roomName}>Room: {item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  roomName: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ChatGroup;
