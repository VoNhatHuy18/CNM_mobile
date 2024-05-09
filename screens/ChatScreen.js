import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import EmojiSelector from "react-native-emoji-selector";
import { useChat } from "../provider/ChatProvider";
import chatService from "../services/chatService";
import { useAuth } from "../provider/AuthProvider";
import socket from "../config/socket";

const ChatScreen = ({ route, navigation }) => {
  const { selectedRoom, fetchUpdatedRooms } = useChat();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [replyingMessage, setReplyingMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { userVerified } = useAuth();

  // fetch messages when selected room changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedRoom) {
        const response = await chatService.getAllMessagesInRoom(
          selectedRoom._id
        );
        setMessages(response);
      }
    };
    fetchMessages();
  }, [selectedRoom]);

  // listen for new messages
  useEffect(() => {
    socket.on("receive-message", (data) => {
      console.log("Received message:", data);
      setMessages((prevMessages) => [...prevMessages, data.savedMessage]);
    });

    return () => {
      socket.off("receive-message");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendMessage = async () => {
    setLoading(true);
    try {
      if (newMessage.trim() === "") {
        return;
      }

      if (selectedRoom.type === "1v1") {
        const receiverId = selectedRoom.members.find(
          (member) => member._id !== userVerified._id
        );

        const response = await chatService.sendMessage({
          senderId: userVerified._id,
          receiverId: receiverId,
          content: newMessage,
          images: [],
          roomId: selectedRoom._id,
          replyMessageId: replyingMessage || null,
        });

        setMessages([...messages, response]);
        setNewMessage("");

        socket.emit("send-message", {
          savedMessage: response,
        });
      } else if (selectedRoom.type === "group") {
        const response = await chatService.sendMessage({
          senderId: userVerified._id,
          content: newMessage,
          images: [],
          roomId: selectedRoom._id,
          replyMessageId: replyingMessage || null,
        });

        setMessages([...messages, response]);
        setNewMessage("");

        socket.emit("send-message", {
          savedMessage: response,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
      fetchUpdatedRooms();
      setReplyingMessage(null);
      setIsReplying(false);
      socket.emit("sort-room", {
        userId: userVerified._id,
      });
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage(newMessage + emoji);
    setShowEmojiPicker(false);
  };

  const scrollViewRef = useRef();

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  };

  // const handleInfoPress = () => {
  //   navigation.navigate("MemberInfo", { member: selectedRoom });
  // };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Image
            source={require("../assets/favicon.png")}
            style={styles.avatar}
          />
          <Text style={styles.headerText}></Text>
        </View>
        <View style={styles.info}>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="call" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="videocam" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => {
              navigation.navigate("GroupInfo");
            }}
          >
            <Ionicons name="information-circle" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.chatContainer}
      >
        {/* Example messages */}
        {messages.map((message, index) => {
          const isSentMessage = message.sender._id === userVerified._id;
          console.log(message);
          return (
            <View
              key={index}
              style={[
                styles.messageContainer,
                isSentMessage
                  ? styles.messageContainerRight
                  : styles.messageContainerLeft,
              ]}
            >
              {!isSentMessage && (
                <Image
                  source={require("../assets/icon.png")}
                  style={styles.avatarSmallleft}
                />
              )}
              <View
                style={[
                  styles.messageBubble,
                  isSentMessage
                    ? styles.receivedMessage
                    : styles.receivedMessage,
                ]}
              >
                <Text style={styles.messageText}>{message.content}</Text>
                <Text style={styles.messageTime}>
                  {formatMessageTime(message.timestamp)}
                </Text>
              </View>
              {isSentMessage && (
                <Image
                  source={require("../assets/favicon.png")}
                  style={styles.avatarSmallright}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="camera" size={24} color="#333333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="image" size={24} color="#333333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="mic" size={24} color="#333333" />
        </TouchableOpacity>
        <View style={styles.input}>
          <TextInput
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={(text) => setNewMessage(text)}
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowEmojiPicker(true)}
          >
            {showEmojiPicker && (
              <EmojiSelector onEmojiSelected={handleEmojiSelect} />
            )}
            <Ionicons name="happy" size={24} color="#333333" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#4267B2",
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 5,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    right: 50,
  },
  headerText: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "bold",
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoButton: {
    padding: 10,
  },
  chatContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 10,
  },
  messageContainerRight: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  messageContainerLeft: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 20,
    padding: 15,
    paddingVertical: 10,
  },
  sentMessage: {
    backgroundColor: "#4267B2",
    alignSelf: "flex-end", // Đảm bảo tin nhắn gửi nằm ở bên phải
  },
  receivedMessage: {
    backgroundColor: "#ECEFF1",
    borderWidth: 1,
    borderColor: "#ccc",
    alignSelf: "flex-start", // Đảm bảo tin nhắn nhận nằm ở bên trái
  },
  messageText: {
    fontSize: 16,
    color: "black",
  },
  messageTime: {
    fontSize: 12,
    color: "#333333",
    marginTop: 5,
    textAlign: "left",
  },
  avatarSmallleft: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  avatarSmallright: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  iconButton: {
    padding: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    marginRight: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sendButton: {
    backgroundColor: "#4267B2",
    borderRadius: 30,
    padding: 10,
  },
});

export default ChatScreen;
