import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
import { updateHcpProfile } from "../src/api/engagementsApi";

export default function UpdateProfileScreen() {

    const [loading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState(null);
    const [userId, setUserId] = useState(null);
    const router = useRouter();

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/dashboard");
        }
    };

    // Load user + cached profile
    const loadProfile = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem("userId");
            setUserId(storedUserId);

            const cached = await AsyncStorage.getItem("cachedProfile");

            if (cached) {
                setInitialData(JSON.parse(cached));  // FIXED
            }
        } catch (err) {
            Alert.alert("Error", "Unable to load profile");
        }

        setLoading(false);
    };

    useEffect(() => {
        loadProfile();
    }, []);

    if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

    if (!initialData) return <Text>No profile data found</Text>;

    const validationSchema = Yup.object({
        hcpFirstName: Yup.string().required("Required"),
        hcpLastName: Yup.string().required("Required"),
        hcpEmail: Yup.string().email("Invalid email").required("Required")
    });

    const onSubmit = async (values) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await updateHcpProfile(token, userId, values);
            if (Platform.OS === "web") {
                alert(response.data.message)
                router.replace("/profile");
            }
            Alert.alert("Success", "Profile updated!", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Failed to update profile");
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{ padding: 16 }}>

                <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>


                <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
                    Edit Profile
                </Text>

                <Formik
                    initialValues={initialData}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                    enableReinitialize={true}
                >
                    {({ values, handleChange, handleSubmit, errors }) => (
                        <View style={styles.formContainer}>
                            <Text>First Name</Text>
                            <TextInput
                                value={values.hcpFirstName}
                                onChangeText={handleChange("hcpFirstName")}
                                style={styles.input}
                            />
                            {errors.hcpFirstName && <Text style={styles.error}>{errors.hcpFirstName}</Text>}

                            <Text>Last Name</Text>
                            <TextInput
                                value={values.hcpLastName}
                                onChangeText={handleChange("hcpLastName")}
                                style={styles.input}
                            />

                            <Text>Email</Text>
                            <TextInput
                                value={values.hcpEmail}
                                onChangeText={handleChange("hcpEmail")}
                                style={styles.input}
                                keyboardType="email-address"
                            />

                            <Text>Phone Number</Text>
                            <TextInput
                                value={String(values.hcpPhone || "")}
                                onChangeText={handleChange("hcpPhone")}
                                keyboardType="numeric"
                                style={styles.input}
                            />

                            <Button title="Save Changes" onPress={handleSubmit} />
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </View>
    );
}

const styles = {
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    formContainer: {
        padding: 10, margin: 10, borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
    },
    backBtn: { marginBottom: 10 },
    backText: { fontSize: 18, color: "#2d6cdf" },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
    },
    error: {
        color: "red",
        marginBottom: 8,
    },
};
