import React from "react";
import { SafeAreaView, StyleSheet, Image, Text, View } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import Logout from "./Logout";
import { getAuth } from "firebase/auth";
import theme from "../../theme";

const CustomSidebarMenu = (props) => {
  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <SafeAreaView style={[ styles.container ,{ flex: 1 }]}>
      {user.photoURL ? (
        <Image
          source={{ uri: user.photoURL }}
          style={{ width: 110, height: 110 }}
        />
      ) : (
        <Image
          source={require("../../assets/images/anon.png")}
          style={{ width: 110, height: 110 }}
        />
      )}
      <DrawerContentScrollView {...props}> 
        <View style={{ flex: 1}}>
          {props.state.routes.map((route, index) => (
            <DrawerItem
              key={index}
              labelStyle={{
                color: "#D6665C",
              }}
              label={route.name}
              onPress={() => {
                props.navigation.navigate(route.name);
              }}
            />
          ))}
        </View>
      </DrawerContentScrollView>
      <Logout />
      <Text
        style={{
          fontSize: 12,
          textAlign: "center",
          color: "grey",
        }}
      >
        Copyright 2023
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: "center",
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    alignSelf: "center",
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    height: "100%",
    backgroundColor: theme.colors.background,
  },
});

export default CustomSidebarMenu;
