import React, {useState, useEffect} from 'react';
import {View, TextInput, StyleSheet, Text, TouchableOpacity, Platform, Image} from 'react-native';
import {useRouter} from 'expo-router';
import {saveUserData, getUserData} from '@/utils/storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NameScreen() {
    const [name, setName] = useState('');
    const [birthday, setBirthday] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const router = useRouter();

    useEffect(() => {
        checkExistingUser();
    }, []);

    const checkExistingUser = async () => {
        const userData = await getUserData();
        if (userData?.name) {
            router.replace('/dating-list');
        }
    };

    const handleSubmit = async () => {
        if (name.trim() && birthday) {
            await saveUserData({
                name: name.trim(),
                birthday: birthday.toISOString().split('T')[0],
            });
            router.replace('/dating-list');
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setBirthday(selectedDate);
        }
    };

    return (
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/images/dating-icon.png')} width={100} height={100} style={styles.logo}/>
          </View>
            <Text style={styles.title}>Welcome to Dating Scheduler</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
            />
            <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={styles.dateButtonText}>
                    {birthday ? birthday.toLocaleDateString() : 'Select your birthday'}
                </Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={birthday || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    textColor="#000"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                />
            )}

            <TouchableOpacity
                style={[styles.button, (!name.trim() || !birthday) && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={!name.trim() || !birthday}
            >
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    dateButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    dateButtonText: {
        fontSize: 16,
        color: '#333',
    },
    zodiacContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    zodiacSymbol: {
        fontSize: 30,
        marginRight: 10,
    },
    zodiacText: {
        fontSize: 18,
        color: '#666',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginVertical: 50,
    },
}); 