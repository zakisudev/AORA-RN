import { router, usePathname } from 'expo-router';
import { icons } from '../constants';
import { useState } from 'react';
import { View, TouchableOpacity, Image, Alert } from 'react-native';
import { TextInput, NativeViewGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';

type SearchInputProps = {
  initialQuery?: string;
};

const SearchInput:React.FC<SearchInputProps> = ({initialQuery}) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || '');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <GestureHandlerRootView>
      <NativeViewGestureHandler>
        <View
          style={{
            width: '100%',
            height: 56,
            paddingHorizontal: 15,
            backgroundColor: '#2c2b29',
            borderColor: isFocused ? '#c4aa16' : '#2c2b29',
            borderWidth: 1,
            borderRadius: 10,
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <TextInput
            style={{ flex: 1, color: 'white', fontSize: 16 }}
            value={query}
            onChangeText={(e) => setQuery(e)}
            placeholder='Search for videos'
            placeholderTextColor="#CDCDE0"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          <TouchableOpacity
            onPress={() => {
              if (!query) return Alert.alert('Please enter a search query');

              if (pathname.startsWith('/search')) {
                router.setParams({ query });
              } else {
                router.push(`/search/${query}`);
              }
            }}
          >
            <Image
              source={icons.search}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </NativeViewGestureHandler>
    </GestureHandlerRootView>
  );
};

export default SearchInput;
