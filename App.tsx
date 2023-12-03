import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Main from "./app/screens/Main";
import Signup from "./app/screens/Signup";
import Login from "./app/screens/Login";
import { auth } from './firebaseConfig'
import { useEffect, useState } from "react";
import { Provider } from 'react-redux';
import { store } from "./redux/store";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from "react-native";
import ForgotPassword from "./app/screens/ForgotPassword";
import Profile from "./app/screens/Profile";
import * as SplashScreen from 'expo-splash-screen';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomSidebarMenu from "./app/components/CustomSidebarMenu";
import Logout from './app/components/Logout';
import SendEmail from './app/screens/SendEmail';
import Draft from './app/screens/Draft';
import DisplayDraft from './app/screens/DisplayDraft';
import { useFonts } from "expo-font";
import Trash from './app/screens/Trash';
import ContactList from './app/screens/ContactList';
import theme from './theme';
import DisplayOneTrash from './app/screens/DisplayOneTrash';
import History from './app/screens/History';

const Stack = createNativeStackNavigator();
SplashScreen.preventAutoHideAsync();
const Drawer = createDrawerNavigator();

// allowance
function AfterLogin() {
    const [fontsLoaded, error] = useFonts({
        "Fredoka": require("./assets/fonts/Fredoka.ttf"),
    });
    if (!fontsLoaded && !error) {
        return null;
    }
    return (
        <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{headerShown: false}}>
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="ContactList" component={ContactList} />
            <Stack.Screen name="SendEmail" component={SendEmail} />
            <Stack.Screen name="Logout" component={Logout} />
            <Stack.Screen name="Drafts" component={Draft} />
            <Stack.Screen name="DisplayDraft" component={DisplayDraft} />
            <Stack.Screen name="Trash" component={Trash} />
            <Stack.Screen name="DisplayOneTrash" component={DisplayOneTrash} />
            <Stack.Screen name="History" component={History} />
        </Stack.Navigator>
    );
}

export default function App() {
    
    // keep SplashScreen stay for 2.5s
    useEffect(() => {
        setTimeout(async () => {
            await SplashScreen.hideAsync();
        }, 2500);
        }, [])
        
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }
    
    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);
    const [fontsLoaded, error] = useFonts({
        "Fredoka": require("./assets/fonts/Fredoka.ttf"),
    });
    if (!fontsLoaded && !error) {
        return null;
    }
    // handle routing
    if (!user) {
    return (
        <GestureHandlerRootView style={styles.root}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen options={{headerShown: false}} name="Login" component={Login} />
                    <Stack.Screen options={{headerShown: false}} name='Signup' component={Signup} />
                    <Stack.Screen options={{headerShown: false}} name='ForgotPassword' component={ForgotPassword} />
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    )}
    return (
        <GestureHandlerRootView style={styles.root}>
        <Provider store={store}>
            <NavigationContainer>
                <Drawer.Navigator drawerContent={props => <CustomSidebarMenu {...props} />}>
                    {/* hide this */}
                    <Drawer.Screen
                        name="Welcome"
                        component={AfterLogin}
                        options={{
                            drawerItemStyle: { height: 0 },
                            headerTitle: "Home",
                            headerStyle: styles.customHeaderStyle,
                            headerTitleStyle: styles.title
                        }}
                        />
                    <Drawer.Screen
                        name="Home"
                        component={Main}
                        options={{
                            headerStyle: styles.customHeaderStyle,
                            headerTitleStyle: styles.title
                        }}
                        />
                    <Drawer.Screen
                        name="Profile"
                        component={Profile}
                        options={{
                            headerTitle: "Profile",
                            headerStyle: styles.customHeaderStyle,
                            headerTitleStyle: styles.title
                        }}
                        />
                    <Drawer.Screen
                        name="History"
                        component={History}
                        options={{
                            headerTitle: "History",
                            headerStyle: styles.customHeaderStyle,
                            headerTitleStyle: styles.title
                        }}
                        />
                    <Drawer.Screen
                        name="Drafts"
                        component={Draft}
                        options={{
                            headerTitle: "Drafts",
                            headerStyle: styles.customHeaderStyle,
                            headerTitleStyle: styles.title
                        }}
                        />
                    <Drawer.Screen
                        name="Trash"
                        component={Trash}
                        options={{
                            headerTitle: "Trash",
                            headerStyle: styles.customHeaderStyle,
                            headerTitleStyle: styles.title
                        }}
                        />
                </Drawer.Navigator>
            </NavigationContainer>
        </Provider>
        </GestureHandlerRootView>
    )
  }

  const styles = StyleSheet.create({
    root: {
      flex: 1,
      height: "100%",
    },
    title: {
      fontSize: 20,
      color: theme.colors.textPrimary,
      textAlign: "center",
      fontWeight: "bold",
    },
    headerTitleContainer: {
      color: theme.colors.textPrimary,
    },
    customHeaderStyle: {
        backgroundColor: theme.colors.background,
  }});
