import React from 'react';
import { View, Text, TextInput, StyleSheet, } from 'react-native';
import  Icon  from 'react-native-vector-icons/FontAwesome5';

const Input = ({label, iconName, error, password, onFocus = () => {}, ...props}) => {
    const [hidePassword, setHidePassword] = React.useState(password);
    const [isFocused, setIsFocused] = React.useState(false);
    return (
        <View style={styles.container}>
            <Text>{label}</Text>

            <View style={[styles.input, 
            {borderColor: isFocused ? "darkblue" : "powderblue"}
            ]}>
                <Icon name={iconName} style={styles.icon}></Icon>

                <TextInput 
                    onFocus={() => { 
                        onFocus(); 
                        setIsFocused(true);
                    }} 
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={hidePassword} 
                    style={styles.textInput}
                    {...props} 
                    
                />
                
                
                {password && 
                <Icon onPress={() => setHidePassword(!hidePassword)} 
                    name={hidePassword ? "eye" : "eye-slash"} 
                    style={styles.eyeIcon}>
                </Icon>}
                
            </View>
            {error && 
            <Text style={styles.textError}>{error}</Text>
            }
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },

    input: {
        backgroundColor: 'lightcyan',
        height: 55,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderWidth: 0.75,
        borderRadius: 20,
        borderColor: 'darkblue',
    },

    icon: {
        fontSize: 17,
        color: 'darkblue',
    },

    eyeIcon: {
        fontSize: 15,
        color: 'darkblue',
    },

    textInput: {
        color: 'darkblue',
        flex: 1,
        margin: 10,
    },
    textError: {
        marginTop: 7,
        color: 'red',
        fontSize: 12,
    }
})

export default Input;