import { Text, Pressable, StyleSheet } from 'react-native'

const Button = ({ text, onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    marginTop: 'auto',
    backgroundColor: '#DF7E7E',
    borderRadius: 8,
    padding: 20,
    width: '90%'
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold'
  }
})

export default Button