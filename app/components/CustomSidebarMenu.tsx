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
    <SafeAreaView style={[ styles.container
  ]}>
    <View style={{ alignItems:"center", padding: 40,borderBottomWidth: 0.5,
    borderBottomColor: "black",}}>
      {user.photoURL ? (
        <Image
          source={{ uri: user.photoURL }}
          style={{ width: 110, height: 110 , borderRadius: 100,}}
        />
      ) : (
        <Image
          source={require("../../assets/images/anon.png")}
          style={{ width: 110, height: 110 }}
        />
      )}
      </View>
      <DrawerContentScrollView {...props}> 
      <View style={{marginTop: -20}}>
  {props.state.routes.map((route, index) => (
    route.name !== "Welcome" && (
      <DrawerItem
        key={index}
        labelStyle={{
          color: "#D6665C",
          textAlign: "center",
          fontSize: 16,
          fontWeight: "bold",
          left: 10
        }}
        label={route.name}
        onPress={() => {
          props.navigation.navigate(route.name);
        }}
      />
    )
  ))}
</View>
      </DrawerContentScrollView>
      <View style={{ alignItems:"center"}}>
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
      </View>
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
