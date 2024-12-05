
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import Loader from '../components/Loader';
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const EditProfileScreen = ({ route, navigation }) => {
    const { userDetails } = route.params;
    const [displayName, setDisplayName] = useState(userDetails?.displayName || userDetails?.fullName || userDetails?.FullName);
    const [email, setEmail] = useState(userDetails?.email || userDetails?.UserEmail);
    const [contact, setContact] = useState(userDetails?.UserContact);


 const logout = async () => {
        try {
            await AsyncStorage.removeItem('UserLoggedInData');

            const isGoogleSignedIn = await GoogleSignin.isSignedIn();
            if (isGoogleSignedIn) {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
            }

            if (auth().currentUser) {
                await auth().signOut();
            }

            navigation.navigate("LoginScreen");
        } catch (error) {
            console.error("Something went wrong:", error);
        }
    };
    const handleSave = () => {
        const updatedDetails = {
            UserId: userDetails.UserId,
            FullName: displayName,
            UserEmail: email,
            UserContact: contact,
        };

        fetch('http://10.0.2.2:80/api/user_update.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedDetails),
        })
        .then(response => response.json())
        .then(data => {
            Alert.alert(data[0].Message);
            if (data[0].Message === "User Successfully Updated") {
                navigation.navigate('UserProfile', { userDetails: updatedDetails });
                alert("LOGIN AGAIN TO APPLY CHANGES");
                logout();
            }
            
            
        })
        .catch(error => {
            console.error('Error:', error);
            Alert.alert('Something went wrong. Please try again.');
        });
        
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={displayName} onChangeText={setDisplayName} />
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
            <Text style={styles.label}>Contact</Text>
            <TextInput style={styles.input} value={contact} onChangeText={setContact} keyboardType="phone-pad" />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    label: {
        fontSize: 16,
        color: 'darkblue',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: 'darkblue',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default EditProfileScreen;
