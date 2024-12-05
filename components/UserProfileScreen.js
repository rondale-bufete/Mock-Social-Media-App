import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const UserProfileScreen = ({ route, navigation }) => {
    const { userDetails } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.userProfile}>
                <View style={styles.profileHeader}>
                    {userDetails?.photoURL ? (
                        <Image style={styles.profileImage} source={{ uri: userDetails.photoURL }} />
                    ) : (
                        <View style={styles.profileImagePlaceholder}>
                            <Icon name="user" size={80} color="white" />
                        </View>
                    )}
                    <Text style={styles.profileName}>{userDetails?.displayName || userDetails?.fullName || userDetails?.FullName}</Text>
                    <Text style={styles.subDetails}>{userDetails?.email || userDetails?.UserEmail}</Text>
                    <Text style={styles.subDetails}>{userDetails?.UserContact}</Text>
                </View>
                <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile', { userDetails })}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 20,

    },
    userProfile: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        elevation: 3,
        backgroundColor: 'lightcyan',
        borderColor: 'darkblue',
        borderWidth: 1,
    },
    profileHeader: {
        alignItems: 'center',
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 150,
        marginRight: 20,
        borderWidth: 2,
        borderColor: 'darkblue'
    },
    profileImagePlaceholder: {
        width: 200,
        height: 200,
        borderRadius: 150,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    profileName: {
        fontSize: 24,
        color: 'darkblue',
        marginVertical: 10,
        fontWeight: 'bold',
    },
    subDetails: {
        fontSize: 18,
    }
    // Add styles for other user profile information
});
export default UserProfileScreen;
