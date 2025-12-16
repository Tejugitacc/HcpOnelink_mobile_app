import DateTimePicker from "@react-native-community/datetimepicker";
import * as Crypto from "expo-crypto";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Signature from "react-native-signature-canvas";

export default function Utilities() {
  const [photo, setPhoto] = useState(null);
  const [file, setFile] = useState(null);
  const [signature, setSignature] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [bankNumber, setBankNumber] = useState("");
  const [encrypted, setEncrypted] = useState("");
  const [signName, setSignName] = useState("");


  const [fontsLoaded] = useFonts({
    SignatureFont: require("../../assets/fonts//Pacifico-Regular.ttf")
  });

  if (!fontsLoaded) return null;

  // 📸 1. Capture Image using Camera
  const openCamera = async () => {
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!res.canceled) setPhoto(res.assets[0].uri);
  };

  // 📁 2. Upload File
  const pickFile = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
    });

    if (!res.canceled) setFile(res.assets[0]);
  };

  // ✍ 3. Signature Capture
  const handleSignature = (sig) => setSignature(sig);

  // 📅 4. Date Picker
  const onChangeDate = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  // 🔐 5. Encrypt Banking Details
  const encryptBank = async () => {
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      bankNumber
    );
    setEncrypted(hash);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Utilities</Text>

      {/* CAMERA */}
      <TouchableOpacity style={styles.btn} onPress={openCamera}>
        <Text style={styles.btnText}>📸 Capture Image</Text>
      </TouchableOpacity>
      {photo && <Image source={{ uri: photo }} style={styles.preview} />}

      {/* FILE PICKER */}
      <TouchableOpacity style={styles.btn} onPress={pickFile}>
        <Text style={styles.btnText}>📁 Upload File</Text>
      </TouchableOpacity>
      {file && <Text style={styles.fileText}>Selected: {file.fileName || "File"}</Text>}

      {/* SIGNATURE CANVAS*/}
      <Text style={styles.section}>Signature</Text>
      <Signature
        onOK={handleSignature}
        descriptionText="Sign above"
        backgroundColor="#f8f8f8"
      />
      {signature && <Text style={styles.success}>✔ Signature captured</Text>}


      {/* SIGNATURE BY NAME */}
      <Text style={styles.section}>Signature</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter full name"
        value={signName}
        onChangeText={setSignName}
      />

      {signName ? (
        <View style={styles.signatureBox}>
          <Text style={styles.signatureText}>{signName}</Text>
        </View>
      ) : null}

      {/* DATE PICKER */}
      <TouchableOpacity style={styles.btn} onPress={() => setShowPicker(true)}>
        <Text style={styles.btnText}>📅 Select Date</Text>
      </TouchableOpacity>
      <Text style={styles.dateText}>{date.toDateString()}</Text>
      {showPicker && (
        <DateTimePicker value={date} mode="date" onChange={onChangeDate} />
      )}

      {/* ENCRYPT DATA */}
      <TextInput
        style={styles.input}
        placeholder="Enter Bank Number"
        value={bankNumber}
        onChangeText={setBankNumber}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.btn} onPress={encryptBank}>
        <Text style={styles.btnText}>🔐 Encrypt Bank Details</Text>
      </TouchableOpacity>
      {encrypted ? <Text style={styles.hash}>{encrypted}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, backgroundColor: "#fff", paddingTop: 50 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  btn: {
    backgroundColor: "#1d6dce",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  btnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  preview: { width: 120, height: 120, marginTop: 10, borderRadius: 10 },
  section: { fontSize: 18, fontWeight: "600", marginVertical: 10 },
  fileText: { fontSize: 14, color: "#444" },
  success: { color: "green", marginTop: 5 },
  dateText: { marginTop: 5, fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  hash: { fontSize: 12, color: "#333", marginTop: 5 },
  signatureBox: {
    marginTop: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fafafa",
  },

  signatureText: {
    fontFamily: "SignatureFont",
    fontSize: 36,
    color: "#000",
  },

});
