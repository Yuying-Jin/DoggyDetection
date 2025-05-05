import React, {useState, useRef, useContext, useEffect} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ImageBackground,
    Image,
    Dimensions,
    Animated,
    Easing,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {Button, Icon, PaperProvider, Text, useTheme} from "react-native-paper";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import {AuthContext} from "../context/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAtom} from "jotai";
import {isDarkModeAtom} from "../store";
import {darkTheme, lightTheme} from "../theme";
import {getImageUrlByBreed} from "./ImageMap";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const CameraScreen = () => {
    const navigation = useNavigation();
    const { colors, dark } = useTheme();
    const theme = useTheme()
    const [isDark] = useAtom(isDarkModeAtom);

    const [auth, setAuth] = useContext(AuthContext);
    const authenticated = auth && auth?.token !== "" && auth?.user !== null;

    // camera and photo
    const [status, requestPermission] = Camera.useCameraPermissions();
    const [cameraType, setCameraType] = React.useState(CameraType.back);
    const [lastPhotoURI, setLastPhotoURI] = useState(null);
    const [lastPhotoFilename, setLastPhotoFilename] = useState(null);
    const [lastPhotoBase64, setLastPhotoBase64] = useState(null);
    const cameraRef = useRef(null);

    // detection and result
    const [detectionResult, setDetectionResult] = useState({breed: null, image: null, sample: null, desc: null});
    const [loading, setLoading] = useState(false);
    // animation
    const [isFlip, setIsFlip] = useState(false);
    const flipAnim = useRef(new Animated.Value(0)).current;
    const shrinkAnim =  useRef(new Animated.Value(0)).current

    // camera
    const __startCamera = async () => {
        const {status} = await Camera.requestCameraPermissionsAsync();
        if (status === 'granted') {
            await requestPermission(true);
        } else {
            return (
                <View style={styles.container}>
                    <Text style={styles.permissionText}>We need access to your camera</Text>
                    <Button onPress={requestPermission} title="Grant permission"/>
                </View>
            );
        }
    }

    // pick image
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            maxWidth: 400,
            maxHeight: 400,
            includeBase64: true,
        });
        if (!result.canceled) {
            setLastPhotoURI(result.assets[0].uri);
            setLastPhotoFilename(result.assets[0].fileName)
            // let fsRead = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            //     encoding: FileSystem.EncodingType.Base64,
            // });
            // let base64Img = "data:image/jpeg;base64,"+ fsRead;
            //
            // const  missing_padding = base64Img.length % 4
            // if (missing_padding) {
            //     base64Img += '='.repeat(4 - missing_padding);
            // }
            // setLastPhotoBase64(base64Img)
        } else {
            console.log("User canceled image picker")
            handleResultClose()
        }
    };

    useEffect(() => {
        if (lastPhotoURI && lastPhotoFilename) {
            handleConfirm();
        }
    }, [lastPhotoURI, lastPhotoFilename]);


    // save result
    const saveResultToStorage = async (isConfirmed) => {
        try {
            const result = {
                image: detectionResult.image,
                breed: detectionResult.breed,
                desc: detectionResult.desc,
                isConfirmed: isConfirmed,
            };
            console.log("save result: ", result)
            const existingResults = await AsyncStorage.getItem('detectionResult');
            let results = [];
            if (existingResults) {
                results = JSON.parse(existingResults);
            }
            results.push(result);
            await AsyncStorage.setItem('detectionResult', JSON.stringify(results));
        } catch (error) {
            console.error('Error saving detection result to storage:', error);
        }
    };

    const handleTryAgain = async () => {
        try {
            await saveResultToStorage(false);
        } catch (error) {
            console.error('Error saving detection result:', error);
        }
        handleResultClose()
    }

    const handleGood = async () => {
        try {
            await saveResultToStorage(true)
        } catch (error) {
            console.error('Error saving detection result:', error);
        }
        handleResultClose()
    }

    // close result
    const handleResultClose = () => {
        // set states
        setLoading(false)
        setLastPhotoURI(null)
        setLastPhotoFilename(null)
        setLastPhotoBase64(null)
        setDetectionResult(null)

        flipAnim.setValue(0);
        shrinkAnim.setValue(0);
    }

    // detection animation
    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });

    const frontAnimatedStyle = {
        transform: [{ rotateY: frontInterpolate }],
        backfaceVisibility: "hidden",
    };

    const backAnimatedStyle = {
        transform: [{ rotateY: backInterpolate }],
        position: "absolute",
        backfaceVisibility: "hidden",
        width: screenWidth,
    };

    const shrinkInterpolate = shrinkAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.5],
    });

    const shrinkAnimatedStyle = {
        transform: [{ scale: shrinkInterpolate }],
    };

    const handleConfirm = async () => {
        setLoading(true);

        Animated.timing(shrinkAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start(async () => {
            console.log('Shrink animation completed');

            await doggyDetect();

            // Trigger the flip animation
            flipAnim.setValue(0);
            setIsFlip(true)
            Animated.timing(flipAnim, {
                toValue: 1,
                friction: 5,
                tension: 10,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start(() => {
                console.log('Flip animation completed');
                setLoading(false);
            });
        });
    };

    const doggyDetect = async () => {
        try {
            console.log("detect");
            console.log("lastPhotoURI", lastPhotoURI)
            console.log("lastPhotoFilename", lastPhotoFilename)

            const dog = getImageUrlByBreed(lastPhotoFilename);
            console.log("result:", dog)

            if (lastPhotoFilename && lastPhotoURI) {
                // console.log("lastPhotoBase64", lastPhotoBase64.substring(0,30), "...", lastPhotoBase64.substring(lastPhotoBase64.length - 30))
                const response = await axios.post(
                    `https://detect.roboflow.com/stanford-dogs-0pff9/3?api_key=SXCNAvtS8ufRKXLiP6hI&confidence=40&overlap=30&format=json&image=${dog?.imageUrl}`

                    // `https://detect.roboflow.com/stanford-dogs-0pff9/3?api_key=SXCNAvtS8ufRKXLiP6hI&format=json`,
                    // {
                    //     image: lastPhotoBase64
                    // },
                    // {
                    //     params: {
                    //         confidence: 40,
                    //         overlap: 30,
                    //     },
                    //     headers: {
                    //         "Content-Type": "application/x-www-form-urlencoded"
                    //     }
                    // }
                );
                const breed = response.data;
                console.log('Dog breed detected:', breed);
                setDetectionResult({
                    breed: breed.predictions[0].class.replaceAll('_', ' ').replaceAll(/\b\w/g, match => match.toUpperCase()),
                    image: dog.imageUrl,
                    sample: dog.sampleUrl,
                    desc: dog.description
                });
            }
        } catch (error) {
            throw error.data;
        }
    }

    // detection screen
    if (lastPhotoURI !== null) {
        return (
            <View style={{height: screenHeight, backgroundColor: theme.colors.background}}>
                <Animated.View style={{...styles.card, ...frontAnimatedStyle, backgroundColor: theme.colors.background}}>
                   <Animated.View style={{...shrinkAnimatedStyle}}>
                        <ImageBackground source={{ uri: lastPhotoURI }} style={{...styles.imageBackground,... styles.shadow}}>
                        {!loading && lastPhotoURI && (
                            <>
                                <TouchableOpacity style={styles.imageButton} onPress={() => setLastPhotoURI(null)}>
                                    <Text style={styles.imageButtonText}>Retake</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.imageButton} onPress={handleConfirm}>
                                    <Text style={styles.imageButtonText}>Confirm</Text>
                                </TouchableOpacity>
                            </>
                        )}
                        </ImageBackground>
                   </Animated.View>
                </Animated.View>

                <Animated.View style={{...backAnimatedStyle, backgroundColor: theme.colors.background}}>
                    <View style={styles.resultContainer}>
                        <TouchableOpacity style={styles.resultCloseButton} onPress={handleTryAgain}>
                            <Icon size={40} source="close" color={colors.primary} style={styles.exitButton} />
                        </TouchableOpacity>
                        <Text style={styles.resultTitle}>Detection Result</Text>
                        <Image source={{ uri: detectionResult?.sample }} style={styles.resultImage} />
                        <Text style={styles.breedText}>{detectionResult?.breed}</Text>
                        <Text style={styles.descText}>{detectionResult?.desc}</Text>

                        <Text style={{...styles.confirmText, color: theme.colors.primary}}>The result looks good?</Text>
                        <View style={{ flexDirection: 'row'}}>
                            <TouchableOpacity style={styles.confirmButton} onPress={handleTryAgain}>
                                <Text style={styles.resultConfirmButtonText}>Try Again</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={handleGood}>
                                <Text style={styles.resultConfirmButtonText}>Good</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Image source={require('../assets/dog_prints.png')} style={{ width: screenWidth, height: 150, position:'absolute', bottom: -20, zIndex:-1, opacity: 0.8}} />
                </Animated.View>
            </View>
        );
    }

    return (
        <PaperProvider theme={isDark ? darkTheme : lightTheme}>
        <View style={{...styles.container, backgroundColor: theme.colors.background}}>
            <TouchableOpacity
                style={styles.exitButton}
                onPress={() => {
                    authenticated ? navigation.navigate("FieldGuide") : navigation.navigate("Settings")
                }}>
                <Icon size={40} source='close' color={"white"} />
            </TouchableOpacity>
            <Camera style={styles.camera}
                    ref={cameraRef}
                    type={cameraType}/>
            <View style={{...styles.bottomBar, backgroundColor: theme.colors.background}}>
                {/* Upload image */}
                <TouchableOpacity
                    style={{...styles.button,  backgroundColor: theme.colors.background}}
                    onPress={pickImage}>
                    <Icon size={40} source='image-outline' color={colors.primary}/>
                </TouchableOpacity>
                {/* Capture Button */}
                <TouchableOpacity
                    style={{...styles.captureButton_outer}}>
                    <TouchableOpacity
                        style={{...styles.captureButton_inner}}
                        onPress={async () => {
                            if (cameraRef.current) {
                                let photo = await cameraRef.current.takePictureAsync();
                                setLastPhotoURI(photo.uri);
                            }
                        }}
                    >
                    </TouchableOpacity>
                </TouchableOpacity>
                {/* Switch Camera Type */}
                <TouchableOpacity
                    style={{...styles.button, backgroundColor: theme.colors.background}}
                    onPress={() => {
                        setCameraType(
                            cameraType === CameraType.back? CameraType.front : CameraType.back
                        );
                    }
                }>
                    <Icon size={40} source='camera-flip-outline' color={colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
        </PaperProvider>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center"
    },
    permissionText: {
        textAlign: "center"
    },
    imageBackground: {
        height: "100%",
        flexDirection: "row",
        justifyContent: "center"
    },
    imageButton: {
        alignSelf: "flex-end",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 40,
        marginLeft: 20,
        backgroundColor: "#6750A4",
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginRight: 10,
        borderRadius: 10,
    },
    imageButtonText: {
        fontSize: 20,
        padding: 10,
        color: "white"
    },
    camera: {
        flex: 1
    },
    bottomBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        paddingBottom: 30,
        flex: 0.2
    },
    captureButton_outer: {
        alignSelf: "flex-end",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        width: 70,
        height: 70,
        bottom: 0,
        borderRadius: 50,
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#6750A4',
    },
    captureButton_inner: {
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        height: 60,
        borderRadius: 50,
        borderWidth: 3,
        backgroundColor: '#fff',
        borderColor: '#6750A4',
    },
    button: {
        flex: 0.18,
        alignSelf: "flex-end",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: 'white',
        width: 70,
        height: 70,
        bottom: 0,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20
    },
    exitButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        zIndex: 1,
        borderColor: "white",
        borderStyle: "solid",
        borderRadius: 20,
    },
    resultContainer: {
        paddingTop: 60,
        paddingLeft: 30,
        paddingRight: 30,
    },
    resultCloseButton: {
        position: 'absolute',
        top: 50,
        right: 15,
    },
    resultTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    resultImage: {
        width: 330,
        height: 300,
        borderRadius: 10,
        resizeMode: 'cover',
        marginTop: 30,
        borderColor:'#6750A4',
        borderWidth: 3,
        alignSelf: 'center',
    },
    breedText: {
        marginTop: 30,
        fontSize: 20,
        fontWeight: 'bold',
    },
    descText: {
        fontSize: 18,
        paddingTop: 10,
        height: 180
    },
    confirmText: {
        marginTop: 30,
        marginBottom: 20,
        fontSize: 20,
        textAlign: 'center',

    },
    confirmButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(103,80,164,0.8)",
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginRight: 10,
        borderRadius: 10,
    },
    resultConfirmButtonText: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white'
    },
    card: {
        borderRadius: 30,
        overflow: 'hidden',
    },
    shadow: {
        shadowColor: '#6750A4',
        backgroundColor: "transparent",
        shadowOpacity: 1,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 0 },
    },
});
