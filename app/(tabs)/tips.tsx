import React, {useCallback, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {UserData} from '@/types/dating';
import {getZodiacSign, zodiacSymbols, compatibilityDescriptions, ZodiacSign} from '@/types/zodiac';
import {getUserData} from '@/utils/storage';
import {useFocusEffect, useRouter} from "expo-router";

    const relationship_tips = [
    {
        "title": "Communicate Openly and Honestly",
        "description": "Share your thoughts and feelings honestly, and listen actively. Good communication builds trust and understanding."
    },
    {
        "title": "Spend Quality Time Together",
        "description": "Be present and engage meaningfully. Quality time strengthens emotional bonds and creates lasting memories."
    },
    {
        "title": "Practice Empathy",
        "description": "Try to understand the other person's feelings and perspective. Empathy deepens emotional connection."
    },
    {
        "title": "Show Respect",
        "description": "Respect each other’s opinions, boundaries, and space. It maintains harmony and dignity in the relationship."
    },
    {
        "title": "Offer Support and Encouragement",
        "description": "Be there in good times and bad. Your support shows you care and are committed to the relationship."
    },
    {
        "title": "Learn to Compromise",
        "description": "Work together to find middle ground. Compromise shows maturity and willingness to prioritize the relationship."
    },
    {
        "title": "Forgive and Let Go of Grudges",
        "description": "Don’t let past mistakes ruin the present. Forgiveness helps the relationship heal and grow."
    },
    {
        "title": "Celebrate Together",
        "description": "Mark achievements and joyful moments. Shared celebrations build positivity and connection."
    },
    {
        "title": "Find and Nurture Shared Interests",
        "description": "Engage in hobbies or activities you both enjoy. It brings joy and strengthens your bond."
    },
    {
        "title": "Be Consistent and Reliable",
        "description": "Follow through on promises and be dependable. Consistency builds trust and emotional security."
    }
]


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
                <Text style={[styles.title, {marginHorizontal: 5},]}>{userData.name}, Do you want to make your relationship with your partner stronger? Then follow these tips:</Text>
            </View>
            {
                relationship_tips.map((item, index) => (
                    <View style={styles.signBox} key={index}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.label}>{item.description}</Text>
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