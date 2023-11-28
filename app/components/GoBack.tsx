import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function GoBack () {
    const navigation = useNavigation()

    return (
        <View>
            <TouchableOpacity  onPress={() => navigation.goBack() }>
                <Text>Back</Text>
            </TouchableOpacity>
        </View>
    )
}