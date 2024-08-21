import { icons } from '../constants'
import { useState } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';

type FormFieldProps = {
  title: string,
  value: string,
  placeholder: string,
  handleChangeText: (text: string) => void
}

const FormField:React.FC<FormFieldProps> = ({ title, value, placeholder, handleChangeText }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View style={{ marginTop: 30, marginBottom: 15 }}>
      <Text style={{ fontSize: 16, color: "lightgray", fontWeight: "500", marginBottom: 8 }}>{title}</Text>
      <View style={{ width: "100%", height: 56, paddingHorizontal: 15, backgroundColor: "#2c2b29", borderRadius: 10, alignItems: "center", flexDirection: "row", marginTop: 10 }}>
        <TextInput style={{ flex: 1, color: "white", fontSize: 16 }} value={value} onChangeText={handleChangeText} placeholder={placeholder} placeholderTextColor="#7b7b8b" secureTextEntry={title === "Password" && !showPassword} />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} >
            <Image source={!showPassword ? icons.eye : icons.eyeHide} resizeMode='contain' style={{ width: 25 }} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField