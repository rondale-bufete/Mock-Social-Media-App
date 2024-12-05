import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

import gIcon from './Imgs/google.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from './Input';
import AppLogo from './Imgs/facephone.png';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { ALERT_TYPE, AlertNotificationRoot, Dialog } from 'react-native-alert-notification';

import 'expo-dev-client';
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';



const LoginScreen = ({ navigation }) => {

  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const [inputs, setInputs] = React.useState({
    email: "",
    password: "",
  });

  const handleError = (text, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: text }));
  };
  const handleOnChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const validate = () => {
    let isValid = true;

    if (!inputs.email) {
      handleError("Invalid Input", "email");
      isValid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError("Please Enter a Valid Email Address", "email");
      isValid = false;
    }
    if (!inputs.password) {
      handleError("Invalid Input", "password");
      isValid = false;
    } else if (inputs.password.length < 8) {
      handleError("Passwords must be 8 characters or more...", "password");
      isValid = false;
    }
    
    if (isValid) login();
  };


// --------------------------------------------------------------------------
  const userLog = () => {
  const { email, password } = inputs;

  if (email.length === 0 || password.length === 0) {
    handleError("Invalid Input", email.length === 0 ? "email" : "password");
    return;
  }

  const API_URL = "http://10.0.2.2:80/api/search.php";

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  const data = {
    email,
    password,

  };

  setLoading(true);

  fetch(API_URL, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      setLoading(false);
      if (response.error) {
        showErrorDialog(response.error);
      } else {
        AsyncStorage.setItem("UserLoggedInData", JSON.stringify({ user: response, loggedIn: true }));
        console.log(inputs);
        navigation.navigate("HomeScreen");
      }
    })
    .catch((error) => {
      setLoading(false);
      showErrorDialog("ERROR LOGGING IN!");
      console.error(error);
    });
};


// --------------------------------------------------------------------------

  const login = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          if (inputs.email === parsedUserData.email && inputs.password === parsedUserData.password) {
            await AsyncStorage.setItem("UserLoggedInData", JSON.stringify({ user: parsedUserData, loggedIn: true }));
            navigation.navigate("HomeScreen");
            
          } else {
            showErrorDialog("INVALID ACCOUNT CREDENTIALS!");
          }
        } else {
          showErrorDialog("INVALID ACCOUNT CREDENTIALS!");
        }
      } catch (error) {
        showErrorDialog("ERROR REGISTERING THE ACCOUNT!");
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

// -------------------- GOOGLE LOGIN SECTION ----------------------------

  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId: "211933158062-idn5382g8i0ta8mgq6pnc7h1aufma237.apps.googleusercontent.com",
    });
  }, []);

  const onGoogleButtonPress = async () => {
    
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      setUser(userCredential.user);
      SocialLoginSuccess(userCredential.user);
      console.log(userCredential.user);
      setLoading(false);
    } catch (error) {
      showErrorDialog();
      setLoading(false);
    }
  };

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  React.useEffect(() => {
    if (user) {
      SocialLoginSuccess();
    }
  }, [user]);

  const SocialLoginSuccess = () => {
    AsyncStorage.setItem("UserLoggedInData", JSON.stringify({ user, loggedIn: true }));
    navigation.navigate("HomeScreen");
  }

  const showErrorDialog = (message) => {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: 'Error',
      textBody: message,
      button: 'close',
    });
  };
// -------------------- ----------------------------- ----------------------------
  return (
    <AlertNotificationRoot style={styles.container}>
      <SafeAreaView>
        <Loader visible={loading} />
        <ScrollView style={styles.svContainer}>
          <View style={styles.imgContain}><Image style={styles.image} source={AppLogo}></Image></View>
          <Text style={styles.textTitle}>LOGIN</Text>
          <View style={styles.viewContainer}>
            <Input
              label='Email'
              iconName='envelope'
              placeholder="Enter your Email"
              onChangeText={(text) => handleOnChange(text, "email")}
              onFocus={() => handleError(null, "email")}
              error={errors.email}
            />
            <Input
              label='Password'
              iconName='lock'
              password={true}
              placeholder="Enter Password"
              onChangeText={(text) => handleOnChange(text, "password")}
              onFocus={() => handleError(null, "password")}
              error={errors.password}
            />
            <View style={styles.btnContain}>
                <TouchableOpacity onPress={userLog} style={styles.btn} activeOpacity={0.7}>
                    <Text style={styles.btnText}>LOGIN</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.btnDiv}>
              <Text style={styles.divTxt}>----- or -----</Text>
            </View>
            <View style={styles.btnContain}>
                <TouchableOpacity onPress={onGoogleButtonPress} style={styles.Gbtn} activeOpacity={0.7}>
                    <Image style={styles.btnIcon} source={gIcon}></Image><Text style={styles.GbtnText}>Continue with Google</Text>
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={() => navigation.navigate("RegistrationScreen")} activeOpacity={0.7}>
                <Text style={styles.registerTxt}>Don't have an account? <Text style={styles.textLink}> REGISTER HERE</Text></Text>
              </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: 'lightcyan',
  },
  svContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: '10%',
  },
  imgContain: {
    width: '100%',
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
    borderRadius: 5,
  },
  image: {
    width: 250,
    height: 250,
    alignSelf: 'center',
  },
  textTitle: {
    fontSize: 30,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  viewContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  registerTxt: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 20,
  },
  btnContain: {
    width: '100%',
    alignItems: 'center',
    height: 'auto',
  },
  btn: {
    backgroundColor: 'darkblue',
    paddingVertical: 15,
    paddingHorizontal: 65,
    borderRadius: 15,
  },
  btnText: {
    color: '#fff',
    alignItems: 'center'
  },
   Gbtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
  },
  GbtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  btnIcon: {
    width: 20,
    height: 20,
    paddingHorizontal: 5,
  },
  btnDiv: {
    width: '100%',
    marginVertical: 5,
  },
  divTxt: {
    textAlign: 'center'
  },
  
  textLink: {
    color: 'darkblue',
  }
});

export default LoginScreen;