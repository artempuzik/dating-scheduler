import React, {useCallback, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {DatingItem, UserData} from '@/types/dating';
import {getZodiacSign, zodiacSymbols, compatibilityDescriptions, ZodiacSign} from '@/types/zodiac';
import {getUserData} from '@/utils/storage';
import {useFocusEffect, useRouter} from "expo-router";

export default function CompatibilityScreen() {
    const [userData, setUserData] = React.useState<UserData | null>(null);
    const loadData = async () => {
        const user = await getUserData();
        setUserData(user);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    )

    React.useEffect(() => {

    }, []);
    const userSign = useMemo(() => getZodiacSign(userData?.birthday ?? ''), [userData]);

    const compatibilityArray = useMemo(() => Object.entries(compatibilityDescriptions[userSign as ZodiacSign]), [userSign]);

    if (!userData) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.signSymbol}>{zodiacSymbols[userSign as ZodiacSign]}</Text>
                <Text style={[styles.title, {marginHorizontal: 5},]}>{userSign}</Text>
                <Text style={styles.title}>Compatibility</Text>
            </View>
            {
                compatibilityArray.map((item, index) => (
                    <View style={styles.signBox} key={index}>
                        <Text style={styles.signSymbol}>{zodiacSymbols[item[0] as ZodiacSign]}</Text>
                        <Text style={styles.signName}>{item[0]}</Text>
                        <Text style={styles.label}>{item[1]}</Text>
                    </View>
                ))
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    signBox: {
        alignItems: 'center',
        padding: 15,
        width: '100%',
        borderRadius: 10,
    },
    signSymbol: {
        fontSize: 40,
        marginBottom: 10,
    },
    signName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    label: {
        fontSize: 14,
        color: '#666',
    },
    compatibilityContainer: {
        padding: 20,
        backgroundColor: '#f8f8f8',
        margin: 20,
        borderRadius: 10,
    },
    compatibilityTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    compatibilityText: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
    },
}); 