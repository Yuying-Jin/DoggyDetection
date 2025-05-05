import React, { useEffect, useState } from 'react';
import {View, Text, Image, FlatList, StyleSheet, ImageBackground, TouchableOpacity, Modal, Alert} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {darkTheme, lightTheme} from "../theme";
import {PaperProvider, useTheme} from "react-native-paper";
import {useAtom} from "jotai";
import {isDarkModeAtom} from "../store";

export const FieldGuideNotConformedScreen = () => {
    const [confirmResults, setConfirmResults] = useState([]);
    const [notConfirmResults, setNotConfirmResults] = useState([]);
    const [isDark] = useAtom(isDarkModeAtom);
    const theme = useTheme()

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDog, setSelectedDog] = useState(null);

    const openModal = (dog) => {
        setSelectedDog(dog);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        // loading detection result
        const fetchData = async () => {
            try {
                await loadResultsFromStorage();
            } catch (error) {
                console.error('Error loading results', error);
            }
        };
        fetchData();
    }, []);

    const loadResultsFromStorage = async () => {
        const jsonResults = await AsyncStorage.getItem('detectionResult');
        if (jsonResults) {
            const results = JSON.parse(jsonResults);
            const confirmedResults = results.filter(result => result.isConfirmed === true);
            setConfirmResults(confirmedResults);
            const notConfirmedResults = results.filter(result => result.isConfirmed === false);
            setNotConfirmResults(notConfirmedResults);
            console.log("not confirm screen: ", notConfirmResults)
        }
    };

    const handleLongPress = (dog) => {
        Alert.alert(
            'Delete Dog',
            `Are you sure you want to delete ${dog.breed}?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => deleteDog(dog),
                },
            ],
            { cancelable: false }
        );
    };

    const deleteDog = async (dog) => {
        const updatedNotConfirmResults = notConfirmResults.filter((d) => d !== dog);
        setNotConfirmResults(updatedNotConfirmResults);
        const updatedDogs = [...confirmResults, ...updatedNotConfirmResults];
        await updateLocalStorage(updatedDogs);
        console.log("update:", updatedDogs);
    };

    const updateLocalStorage = async (updatedDogs) => {
        try {
            await AsyncStorage.setItem('detectionResult', JSON.stringify(updatedDogs));
        } catch (error) {
            console.error('Error updating local storage', error);
        }
        console.log("update:", notConfirmResults)
    };

    return (
        <PaperProvider theme={isDark ? darkTheme : lightTheme}>
            <View style={{...styles.container, backgroundColor: theme.colors.background}}>
                {notConfirmResults[0] &&
                    <FlatList
                        data={notConfirmResults}
                        numColumns={2}
                        horizontal={false}
                        keyExtractor={(item, index) => index.toString()}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity key={index}
                                              onPress={() => openModal(item)}
                                              onLongPress={() => handleLongPress(item)}
                                              style={{...styles.listItem, backgroundColor: theme.colors.background, borderColor: theme.colors.primaryContainer}} >
                                <ImageBackground source={{ uri: item.image }} style={styles.image} >
                                    <Text style={styles.breedText}>{item.breed}</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        )}
                    />}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <Image source={{ uri: selectedDog?.image }} style={{...styles.modalImage, borderColor: theme.colors.primary}} />
                        <Text style={styles.modalBreedText}>{selectedDog?.breed}</Text>
                        <Text style={styles.descText}>{selectedDog?.desc}</Text>
                        <TouchableOpacity onPress={closeModal}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    listItem: {
        width: '49%',
        aspectRatio: 1,
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: "100%",
        aspectRatio: 1,
        marginBottom: 8,
    },
    breedText: {
        position: 'absolute',
        width: '100%',
        left: 0,
        bottom: 0,
        padding: 6,
        fontSize: 16,
        color: "white",
        backgroundColor: "rgba(102, 90, 111, 0.5)",
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalImage: {
        width: 200,
        height: 200,
        marginBottom: 10,

        borderWidth: 2,
        borderRadius: 8
    },
    modalBreedText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'white',
    },
    descText: {
        fontSize: 16,
        paddingHorizontal: 40,
        color: 'white',
    },
    closeButton: {
        marginTop: 20,
        fontSize: 18,
        color: 'white',
        borderWidth: 1,
        borderColor: 'white',
        padding: 10,
        borderRadius: 8,
    },
});