import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import ChatList from "./screens/ChatList";
import ChatScreen from "./screens/ChatScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import SettingsScreen from "./screens/SettingScreen";
import RechangePasswordScreen from "./screens/RechangePasswordScreen";
import FriendListScreen from "./screens/FriendListScreen";
import OtpScreen from "./screens/OtpScreen";
import AddMembersScreen from "./screens/AddMembersScreen";
import InfoScreen from "./screens/InfoScreen";
// import ChatGroup from "./screens/ChatGroup";
// import MemberInfoScreen from "./screens/GroupInfoScreen";
import GroupInfoScreen from "./screens/GroupInfoScreen";

import { AuthProvider } from "./provider/AuthProvider";
import { ChatProvider } from "./provider/ChatProvider";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ChatList" component={ChatList} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="OtpScreen" component={OtpScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
            />
            <Stack.Screen
              name="RechangePassword"
              component={RechangePasswordScreen}
            />
            <Stack.Screen name="Setting" component={SettingsScreen} />
            <Stack.Screen name="FriendList" component={FriendListScreen} />
            <Stack.Screen name="AddMembers" component={AddMembersScreen} />
            <Stack.Screen name="GroupInfo" component={GroupInfoScreen} />
            <Stack.Screen name="Info" component={InfoScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ChatProvider>
    </AuthProvider>
  );
};

export default App;
