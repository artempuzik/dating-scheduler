import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Platform} from 'react-native';
import {useFocusEffect, useRouter} from 'expo-router';
import * as Linking from "expo-linking";
import {DatingItem} from '@/types/dating';
import {getDatingItems, saveDatingItems} from '@/utils/storage';
import {differenceInYears, parseISO} from 'date-fns';
import {getZodiacSign, zodiacSymbols} from '@/types/zodiac';
import {Ionicons} from "@expo/vector-icons";

export default function DatingListScreen() {
    const [datingItems, setDatingItems] = useState<DatingItem[]>([]);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            loadDatingItems();
        }, [])
    )

    const onCallMobilePhone = async (phoneNumber?: string) => {

        if(!phoneNumber) {
            return;
        }
        try {
            await Linking.openURL(`tel:${phoneNumber}`);
        } catch (error) {
            console.log(error);
        }
    }

    const onTypedEmail = async (email?: string) => {

        if(!email) {
            return;
        }
        try {
        await Linking.openURL(`mailto:${email}`)
        } catch (error) {
            console.log(error);
        }
    }

    const loadDatingItems = async () => {
        const items = await getDatingItems();
        setDatingItems(items);
    };

    const handleAddDating = () => {
        router.push('/dating-form');
    };

    const handleEditDating = (item: DatingItem) => {
        router.push({
            pathname: '/dating-form',
            params: {item: JSON.stringify(item)}
        });
    };

    const handleDeleteDating = async (id: string) => {
        const updatedItems = datingItems.filter(item => item.id !== id);
        await saveDatingItems(updatedItems);
        setDatingItems(updatedItems);
    };

    const calculateAge = (birthday: string) => {
        return differenceInYears(new Date(), parseISO(birthday));
    };

    const renderDatingItem = ({item}: { item: DatingItem }) => {
        const itemDateTime = new Date(`${item.date}T${item.time}`);
        const isPast = itemDateTime < new Date();
        const zodiacSign = item.zodiacSign || getZodiacSign(item.birthday);

        return (
            <View style={styles.itemContainer}>
                {item.photo ? (<Image source={{uri: item.photo}} style={styles.photo}/>) : (
                    <View style={styles.photo}><Ionicons name="person" size={50} color={'#e65d5d'}/></View>)}
                <View style={[styles.itemDetails, isPast && styles.pastItem]}>
                    <Text style={styles.partnerName}>{item.partnerName}</Text>
                    <Text>Dating Date: {item.date}</Text>
                    <Text>Dating Time: {item.time}</Text>
                    <Text>Birthday: {item.birthday}</Text>
                    <Text>Age: {calculateAge(item.birthday)} years</Text>
                    <View style={styles.zodiacContainer}>
                        <Text style={styles.zodiacSymbol}>{zodiacSymbols[zodiacSign]}</Text>
                        <Text style={styles.zodiacText}>{zodiacSign}</Text>
                    </View>
                    <View style={styles.zodiacContainer}>
                        {
                            item.email && (
                                <TouchableOpacity onPress={() => onTypedEmail(item.email)}>
                                    <Text style={styles.phoneNumber}>{item.email}</Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                    <View style={styles.zodiacContainer}>
                        {
                            item.phoneNumber && (
                                <TouchableOpacity onPress={() => onCallMobilePhone(item.phoneNumber)}>
                                    <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
                <View style={styles.actions}>
                    {!isPast && (
                        <TouchableOpacity
                            onPress={() => handleEditDating(item)}
                            disabled={isPast}
                        >
                            <Text style={styles.editButton}>Edit</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => handleDeleteDating(item.id)}>
                        <Text style={styles.deleteButton}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.addButton} onPress={handleAddDating}>
                    <Text style={styles.addButtonText}>Add New Date</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={datingItems}
                renderItem={renderDatingItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#f39b9b',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    list: {
        padding: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 10,
    },
    photo: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    itemDetails: {
        flex: 1,
    },
    partnerName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    actions: {
        justifyContent: 'center',
    },
    editButton: {
        color: '#007AFF',
        marginBottom: 10,
    },
    deleteButton: {
        color: '#FF3B30',
    },
    pastItem: {
        opacity: 0.5,
    },
    zodiacContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    zodiacSymbol: {
        fontSize: 20,
        marginRight: 5,
    },
    phoneNumber: {
        fontSize: 16,
        color: '#007AFF',
        textDecorationLine: 'underline',
    },
    zodiacText: {
        fontSize: 16,
        color: '#666',
    },
    compatibilityButton: {
        color: '#5856D6',
        marginBottom: 10,
    }
}); 