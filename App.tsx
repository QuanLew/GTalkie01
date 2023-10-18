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
import SendEmail from "./app/screens/SendEmail";
import Profile from "./app/screens/Profile";

const Stack = createNativeStackNavigator();

export default function app() {
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
      
    return (
        <GestureHandlerRootView style={styles.root}>
            <NavigationContainer>
                <Provider store={store}>
                    { user ?
                        <Stack.Navigator>
                            <Stack.Screen options={{headerShown: false}} name="Main" component={Main} />
                            <Stack.Screen options={{headerShown: false}} name='SendEmail' component={SendEmail} />
                            <Stack.Screen options={{headerShown: false}} name='Profile' component={Profile} />

                        </Stack.Navigator>
                    : ( 
                        <Stack.Navigator>
                            <Stack.Screen options={{headerShown: false}} name="Login" component={Login} />
                            <Stack.Screen options={{headerShown: false}} name='Signup' component={Signup} />
                            <Stack.Screen options={{headerShown: false}} name='ForgotPassword' component={ForgotPassword} />
                        </Stack.Navigator> 
                        )
                    }
                </Provider>
            </NavigationContainer>

        </GestureHandlerRootView>
    );
  }

  const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingTop: 100,
        paddingBottom: 5,
        paddingLeft: 10,
    },
})