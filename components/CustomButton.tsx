import { View, Text } from 'react-native'
import React from 'react'
import { GestureHandlerRootView, NativeViewGestureHandler, TouchableOpacity } from 'react-native-gesture-handler'

type CustomButtonProps = {
  title: string,
  handlePress: () => void,
  isLoading: boolean
}

const CustomButton:React.FC<CustomButtonProps> = ({ title, handlePress, isLoading }) => {
  return (
    <GestureHandlerRootView>
      <NativeViewGestureHandler>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.7}
          style={{
            backgroundColor: '#ffaa33',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: isLoading ? 0.5 : 1,
            minHeight: 62,
            minWidth: '90%',
            marginTop: 20,
            ...(isLoading ? { opacity: 0.5 } : {}),
          }}
          disabled={isLoading}
        >
          <View>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: 18,
              }}
            >
              {isLoading ? "Please wait" : title}
            </Text>
          </View>
        </TouchableOpacity>
      </NativeViewGestureHandler>
    </GestureHandlerRootView>
  );
}

export default CustomButton;