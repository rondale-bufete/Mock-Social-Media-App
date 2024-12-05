import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SearchResult = ({ route }) => {
    const { user } = route.params;

    return (
        <View style={styles.container}>
            {user ? (
                <View style={styles.searched}>
                    <Text>Search result:</Text>
                    <View style={styles.containSearch}>
                        <Image source={{ uri: user.avatar }} style={styles.avatar} />
                        <View style={styles.textContainer}>
                            <Text style={styles.searchedResult}>{`${user.first_name} ${user.last_name}`}</Text>
                            <Text style={styles.email}>{user.email}</Text>
                        </View>
                    </View>
                </View>
            ) : (
                <Text>No results found</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searched: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: '90%',
        borderRadius: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'darkblue',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        backgroundColor: 'lightcyan',
    },
    containSearch: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    textContainer: {
        flexDirection: 'column',
        marginLeft: 35,
    },
    searchedResult: {
        fontSize: 16,
        color: '#333',
    },
    email: {
        fontSize: 14,
        color: '#555',
    },
});

export default SearchResult;
