import React, { useEffect, useState } from "react";
import { FlatList, View, Text, Button, Alert } from "react-native";
import * as ExpoContacts from 'expo-contacts';

const ContactList = ({ navigation, route }) => {
  const [contactList, setContactList] = useState([]);

  // on Mount we should ask for permissions
  useEffect(() => {
    (async () => {
      const permissions = await ExpoContacts.requestPermissionsAsync();
      
      if (permissions.status === 'granted') {
        const { data } = await ExpoContacts.getContactsAsync();
        setContactList(data);
      }
    })();
  }, []);

  const callback = route.params?.callback

  const getEmail = (contact) => {
    let email = ""
    try {
      email = contact.emails[0].email;
      callback && callback(email)
      navigation.goBack()
    }
    catch (e) {
      Alert.alert('Oops', 'This person doesn\'t have an email', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    }
    //console.log(email)
    return email
  }

  return (
    <View>
      <FlatList
        data={contactList}
        renderItem={({ item }) => <Button
          title={item.name}
          onPress={() => getEmail(item)}
        />}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default ContactList;