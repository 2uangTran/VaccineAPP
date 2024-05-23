import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Button, Text, TextInput, HelperText, Checkbox, IconButton } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useMyContextController, register } from "../../src/context";
import COLORS from "../../constants";
import { format } from "date-fns";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [controller, dispatch] = useMyContextController();

  const hasErrorPassword = () => password.length < 6;
  const hasErrorFullname = () => fullName.length < 1;
  const hasErrorPasswordConfirm = () => confirmPassword !== password;
  const hasErrorEmail = () => !email.includes("@");
  const hasErrorPhone = () => phone.length < 1;
  const hasErrorDateOfBirth = () => dateOfBirth.length < 1;
  const hasErrorGender = () => gender.length < 1;

  const onSubmit = async () => {
    try {
      await register(fullName, email, password, phone, dateOfBirth, gender);

      navigation.navigate('Login');

      Alert.alert('Success', 'Registration successful');
    } catch (error) {
      console.error("Error registering:", error.message);
      setError(error.message);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDateOfBirth(format(date, 'dd/MM/yyyy'));
    hideDatePicker();
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{ marginVertical: 10, width: 390 }}
          mode="outlined"
        />
        <HelperText type='error' visible={hasErrorEmail()}>Please enter a valid email.</HelperText>
        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          style={{ marginVertical: 10, width: 390 }}
          mode="outlined"
        />
        <HelperText type='error' visible={hasErrorFullname()}>Please enter your full name.</HelperText>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={{ marginVertical: 10, width: 390 }}
          mode="outlined"
        />
        <HelperText type='error' visible={hasErrorPassword()}>Please enter a password with at least 6 characters.</HelperText>
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          style={{ marginVertical: 10, width: 390 }}
          mode="outlined"
        />
        <HelperText type='error' visible={hasErrorPasswordConfirm()}>Passwords do not match.</HelperText>
        <TextInput
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          style={{ marginVertical: 10, width: 390 }}
          mode="outlined"
        />
        <HelperText type='error' visible={hasErrorPhone()}>Please enter your phone number.</HelperText>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, width: 390 }}>
          <TextInput
            placeholder="Date of Birth"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            style={{ flex: 1 }}
            mode="outlined"
            editable={false}  // Make it readonly
          />
          <IconButton
            icon="calendar"
            size={30}
            onPress={showDatePicker}
          />
        </View>
        <HelperText type='error' visible={hasErrorDateOfBirth()}>Please enter your date of birth.</HelperText>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Checkbox.Android
            status={gender === 'male' ? 'checked' : 'unchecked'}
            onPress={() => setGender('male')}
          />
          <Text>Male</Text>
          <Checkbox.Android
            status={gender === 'female' ? 'checked' : 'unchecked'}
            onPress={() => setGender('female')}
          />
          <Text>Female</Text>
        </View>
        <HelperText type='error' visible={hasErrorGender()}>Please select your gender.</HelperText>
        <Button
          mode="contained"
          onPress={onSubmit}
          disabled={hasErrorEmail() || hasErrorPassword() || hasErrorPasswordConfirm() || hasErrorFullname() || hasErrorPhone() || hasErrorDateOfBirth() || hasErrorGender()}
          style={{ marginVertical: 10, padding: 5 }}
          labelStyle={{ fontSize: 20 }}
        >
          Register
        </Button>

        {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
      </View>
    </ScrollView>
  );
};

export default Register;
