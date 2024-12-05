import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from './Input';
import AppLogo from './Imgs/facephone.png';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { ALERT_TYPE, AlertNotificationRoot, Dialog } from 'react-native-alert-notification';

const  RegistrationScreen = ({ navigation }) => {

    const [inputs, setInputs] = React.useState({
        fullName: "",
        contactNum: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = React.useState({});
    const [loading,setLoading] = React.useState(false);

    const validate = () => {
        let isValid = true;

        if(!inputs.fullName) {
            handleError("Invalid Input", "fullName");
            isValid = false;
        }
        if(!inputs.contactNum) {
            handleError("Invalid Input", "contactNum");
            isValid = false;
        }
        if(!inputs.email) {
            handleError("Invalid Input", "email");
            isValid = false;
        }else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
            handleError("Please Enter a Valid Email Address", "email");
            isValid = false;
        }   
        if(!inputs.password) {
            handleError("Invalid Input", "password");
            isValid = false;
        } else if (inputs.password.length < 8) {
            handleError("Passwords must be 8 characters or more...", "password");
            isValid = false;
        }
        if(!inputs.confirmPassword) {
            handleError("Invalid Input", "confirmPassword");
            isValid = false;
        }else if (inputs.confirmPassword != inputs.password) {
            handleError("Passwords Doesn't Match", "confirmPassword");
            isValid = false;
        }

        if(isValid) register();
    };

    const register = () => {
        console.log("Validate!");
        console.log(inputs);
        
        var FullName = inputs.fullName;
        var UserEmail = inputs.email;
        var UserContact = inputs.contactNum;
        var UserPassword = inputs.password;
        
        var API_URL = "http://10.0.2.2:80/api/insert.php";
        
        var headers = {
            'Accept':'application/json',
            'Content':'application/json'
        };
        var Data = {
            FullName:FullName,
            UserEmail:UserEmail,
            UserContact:UserContact,
            UserPassword:UserPassword,
        };
        fetch(API_URL, {
            method:'POST',
            headers:headers,
            body: JSON.stringify(Data),
        })
        .then((response)=>response.json())
        .then((response)=>{
            console.log("USER REGISTERED");
        })
        .catch((error)=>{
            alert("Error"+error);
        })

        setLoading(true);
        setTimeout(() => {
            try {
                setLoading(false);
                AsyncStorage.setItem('userData', JSON.stringify(inputs));
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "SUCCESS",
                    textBody: "YOU NOW HAVE REGISTERED AN ACCOUNT!",
                    button: "Close",
                    onHide: () => {
                        navigation.navigate("LoginScreen");
                    }
                });
            } catch (error) {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: "ERROR",
                    textBody: "ERROR REGISTERING THE ACCOUNT!",
                    button: "Close",
                 });
            }
        }, 3000)
    };

    const handleOnChange = (text, input) => {
        setInputs((prevState) => ({ ...prevState, [input] : text}));
    };

    const handleError = (text, input) => {
        setErrors((prevState) => ({ ...prevState, [input] : text}));
    };

  return (
    <SafeAreaView style={styles.container}>
        <AlertNotificationRoot>
        <Loader visible={loading} />
        <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.imgContain}>
            <Image style={styles.image} source={AppLogo}></Image>
        </View>
        

        <View style={styles.formContain}>
        <Text style={styles.textTitle}>Registration Form</Text>
        {/* <Text style={styles.textSubTitle}>Enter your Details to Register</Text> */}
            <Input label='Full Name' 
                iconName='user'
                placeholder="Enter your Full Name"
                onChangeText = {(text) => handleOnChange(text, "fullName")}
                onFocus={() => handleError(null, "fullName")}
                error={errors.fullName}
            />

            <Input label='Phone Number' 
                iconName='phone-alt' 
                keyboardType="numeric"
                placeholder="Enter your Phone Number"
                onChangeText = {(text) => handleOnChange(text, "contactNum")}
                onFocus={() => handleError(null, "contactNum")}
                error={errors.contactNum}
            />

            <Input label='Email' 
                iconName='envelope'
                placeholder="Enter your Email"
                onChangeText = {(text) => handleOnChange(text, "email")}
                onFocus={() => handleError(null, "email")}
                error={errors.email}
            />

            <Input label='Password' 
                iconName='lock' 
                password={true}
                placeholder="Create Password"
                onChangeText = {(text) => handleOnChange(text, "password")}
                onFocus={() => handleError(null, "password")}
                error={errors.password}
             />

            <Input label='Confirm Password' 
                iconName='check-square' 
                password={true} 
                placeholder="Confirm Password"
                onChangeText = {(text) => handleOnChange(text, "confirmPassword")}
                onFocus={() => handleError(null, "confirmPassword")}
                error={errors.confirmPassword}
            />
            <View style={styles.btnContain}>
                <TouchableOpacity onPress={validate} style={styles.btn} activeOpacity={0.7}>
                    <Text style={styles.btnText}>REGISTER</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")} activeOpacity={0.7}>
                <Text style={styles.registerTxt}>Already have an account? <Text style={styles.textLink}> LOGIN HERE</Text></Text>
              </TouchableOpacity>
            </View>
            </View>
            {/* <Button title="Register" /> */}
        </ScrollView>
        </AlertNotificationRoot>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
   container: {
        // backgroundColor: 'lightcyan',
        flex: 1,
    },

    scrollContainer: {
        paddingTop: 20,
        paddingHorizontal: 20,
        alignItems: 'center'
    },
    formContain: {
        width: '90%',
        alignItems: "center",
    },
    textTitle: {
        fontSize: 30,
        marginBottom: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    textSubTitle: {
        fontSize: 18,
        marginVertical: 5,
    },
    imgContain: {
        width: '100%',
        borderTopWidth: 0.3,
        borderBottomWidth: 0.3,
        borderRadius: 5,
    },
    image: {
        width: 250,
        height: 230,
        alignSelf: 'center',
    },
    btnContain: {
        width: '100%',
        alignItems: 'center',
        height: 'auto',
        marginBottom: 45,
    },
    btn: {
        backgroundColor: 'darkblue',
        paddingVertical: 15,
        paddingHorizontal: 45,
        borderRadius: 15,
        marginBottom: 15,
    },
    btnText: {
        color: '#fff',

    },
    textLink: {
      color: 'darkblue',
    }
})

export default RegistrationScreen;