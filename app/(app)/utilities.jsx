import DateTimePicker from "@react-native-community/datetimepicker";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { decryptData, encryptData } from "../../src/helpers/encryptionUtils";

export default function Utilities() {
  const [photo, setPhoto] = useState(null);
  const [file, setFile] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [bankNumber, setBankNumber] = useState("");
  const [encrypted, setEncrypted] = useState("");
  const [decrypted, setDecrypted] = useState('');
  const [signName, setSignName] = useState("");
  const [capturedSignature, setCapturedSignature] = useState("");
  const [dateMode, setDateMode] = useState("single"); // "single" | "range"
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [activePicker, setActivePicker] = useState(null); // "single" | "from" | "to"



  const [fontsLoaded] = useFonts({
    SignatureFont: require("../../assets/fonts//Pacifico-Regular.ttf")
  });

  if (!fontsLoaded) return null;

  //  1. Capture Image using Camera
  const openCamera = async () => {
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!res.canceled) setPhoto(res.assets[0].uri);
  };

  //  2. Upload File
  const pickFile = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
    });

    if (!res.canceled) setFile(res.assets[0]);
  };


  //  4. Date Picker
  const onChangeDate = (event, selectedDate) => {
    setShowPicker(false);
    if (!selectedDate) return;

    if (activePicker === "single") setDate(selectedDate);
    if (activePicker === "from") setFromDate(selectedDate);
    if (activePicker === "to") setToDate(selectedDate);
  };


  //  5. Encrypt Banking Details
  const encryptBank = () => {
    if (!bankNumber) return;
    console.log("Bank number to encrypt:", bankNumber);
    const encryptedValue = encryptData(bankNumber);
    setEncrypted(encryptedValue);
  };

  const handleDecrypt = () => {
    const plain = decryptData(encrypted);
    setDecrypted(plain);
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


      {/* SIGNATURE BY NAME */}
      <Text style={styles.section}>Signature</Text>

      {!capturedSignature && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            value={signName}
            onChangeText={setSignName}
          />

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#2e7d32" }]}
            onPress={() => setCapturedSignature(signName)}
            disabled={!signName}
          >
            <Text style={styles.btnText}>✍ Capture Signature</Text>
          </TouchableOpacity>
        </>
      )}

      {capturedSignature && (
        <View style={styles.signatureBox}>
          <Text style={styles.signatureText}>{capturedSignature}</Text>

          <TouchableOpacity
            onPress={() => {
              setCapturedSignature("");
              setSignName("");
            }}
          >
            <Text style={styles.resetText}>Clear Signature</Text>
          </TouchableOpacity>
        </View>
      )}


      {/* DATE PICKER */}
      <Text style={styles.section}>Date Selection</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btnSmall, dateMode === "single" && styles.activeBtn]}
          onPress={() => setDateMode("single")}
        >
          <Text style={styles.btnText}>Single</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnSmall, dateMode === "range" && styles.activeBtn]}
          onPress={() => setDateMode("range")}
        >
          <Text style={styles.btnText}>Range</Text>
        </TouchableOpacity>
      </View>

      {/* SINGLE DATE */}
      {dateMode === "single" && (
        <>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setActivePicker("single");
              setShowPicker(true);
            }}
          >
            <Text style={styles.btnText}>📅 Select Date</Text>
          </TouchableOpacity>

          <Text style={styles.dateText}>{date.toDateString()}</Text>
        </>
      )}

      {/* RANGE DATE */}
      {dateMode === "range" && (
        <>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setActivePicker("from");
              setShowPicker(true);
            }}
          >
            <Text style={styles.btnText}>
              From: {fromDate ? fromDate.toDateString() : "Select"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setActivePicker("to");
              setShowPicker(true);
            }}
          >
            <Text style={styles.btnText}>
              To: {toDate ? toDate.toDateString() : "Select"}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {showPicker && (
        <DateTimePicker value={new Date()} mode="date" onChange={onChangeDate} />
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

      <TouchableOpacity style={styles.btn} onPress={handleDecrypt}>
        <Text style={styles.btnText}>Decrypt</Text>
      </TouchableOpacity>
      {decrypted ? <Text>Decrypted: {decrypted}</Text> : null}
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
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  btnSmall: {
    flex: 1,
    backgroundColor: "#bbb",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  activeBtn: {
    backgroundColor: "#1d6dce",
  },
  resetText: {
    color: "#d32f2f",
    marginTop: 10,
    textAlign: "center",
    fontWeight: "600",
  },


});