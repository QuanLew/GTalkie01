import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { getAuth } from 'firebase/auth';

const getUID = () => {
    const auth = getAuth()
    const user = auth.currentUser
    const uid = user.uid 

    return uid
}

export default getUID