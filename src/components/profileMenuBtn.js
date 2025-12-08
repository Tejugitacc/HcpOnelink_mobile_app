import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from "../contexts/AuthContext";

export default function ProfileMenuButton() {
    const { logout } = useContext(AuthContext);

    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [userName, setUserName] = useState(null);

    const slideAnim = useRef(new Animated.Value(-150)).current;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: modalVisible ? 0 : -150,
            duration: modalVisible ? 220 : 180,
            useNativeDriver: true,
        }).start();
    }, [modalVisible]);

    const handleLogout = async () => {
        await logout();
        router.replace('/');
    };

    const handleModal = async () => {
        const uname = await AsyncStorage.getItem('username');
        setUserName(uname);
        setModalVisible(true)
    };

    return (
        <View style={{ position: 'absolute', top: 55, right: 20, zIndex: 999 }}>
            {/* Icon */}
            <TouchableOpacity onPress={handleModal}>
                <Ionicons name="person-circle-outline" size={38} color="#2d6cdf" />
            </TouchableOpacity>

            {/* Dropdown Modal */}
            <Modal visible={modalVisible} transparent animationType="none">
                <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
                    <Animated.View style={[styles.dropdown, { transform: [{ translateY: slideAnim }] }]}>
                        <Text style={styles.username}>{userName}</Text>

                        {/* Logout */}
                        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    dropdown: {
        position: 'absolute',
        top: 60,
        right: 20,
        width: width * 0.45,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8,
    },
    username: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    menuButton: {
        backgroundColor: '#2d6cdf',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    menuText: {
        color: '#fff',
        fontWeight: '700',
    },
    logoutBtn: {
        backgroundColor: '#d9534f',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontWeight: '700',
    },
});
