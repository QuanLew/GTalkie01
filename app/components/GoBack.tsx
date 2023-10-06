import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const GoBack = ({ navigation }: any) => {
    navigation = useNavigation()

    return (
        <View>
            <TouchableOpacity  onPress={() => navigation.goBack() }>
                <Text>Back</Text>
            </TouchableOpacity>
        </View>
    )
}

export default GoBack;