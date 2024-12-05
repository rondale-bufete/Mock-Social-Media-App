import { Text, View, StyleSheet, useWindowDimensions } from "react-native";
import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
} from "react-native-indicators"
const Loader = ({ visible = false }) => {
    const { width, height } = useWindowDimensions();
    return (
        visible && (
            <View style={[styles.container, { width, height }] }>
                <View style={styles.loader}>
                    <DotIndicator color="white" count={5} size={9}/>
                    <Text style={styles.loadingTxt}>Loading...</Text>
                </View>
            </View>
            
            
        )
    );
};
const styles = StyleSheet.create({
    container: {
        position: "absolute",
        zIndex: 10,
        backgroundColor: "rgba(0, 0, 0, .6)",
        justifyContent: 'center',
    },
    loader: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingTxt: {
        color: 'white',
        marginTop: 10,
    }
}) 

export default Loader;