import { TextInput, View, StyleSheet } from "react-native";

import theme from "../../theme";

const textInput = ({ value, onChange, placeholder, before, secureTextEntry }) => {
  return (
    <View style={styles.container}>
      {before}
      <TextInput
        autoCapitalize="none"
        clearTextOnFocus
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textPrimary}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 20,
    borderRadius: theme.borders.input,
    backgroundColor: theme.colors.input,
  },
  input: {
    width: "80%",
    textAlign: "center",
    marginLeft: 10,
  },
});

export default textInput;
