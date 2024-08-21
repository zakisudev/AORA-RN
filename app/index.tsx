import { Image, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, NativeViewGestureHandler, ScrollView } from 'react-native-gesture-handler'
import { images } from '../constants'
import { Redirect, router } from 'expo-router';
import CustomButton from '../components/CustomButton'
import { StatusBar } from 'expo-status-bar'
import { useGlobalContext } from '../context/GlobalContext'
import Spinner from '@/components/Spinner'

const RootLayout = () => {
  const {isLoading, isLoggedIn, user} = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/home" />

  if (isLoading) return <Spinner />

  return (
    <SafeAreaView className="bg-primary h-full">
      <GestureHandlerRootView>
          <ScrollView contentContainerStyle={{ height: "100%" }}>
            <View className="w-full justify-center items-center min-h-[85vh] px-4">
              <Image
                source={images.logo}
                className="w-[130px] h-[84px]"
                resizeMode='contain'
              />

              <Image
                source={images.cards}
                className="max-w-[380px] w-full h-[300px]"
                resizeMode='contain'
              />

              <View className="relative mt-5">
                <Text className="text-4xl text-white font-bold text-center">
                  Discover endless possibilities with {' '}
                  <Text className="text-secondary-200">Aora</Text>
                </Text>

                <Image
                  source={images.path}
                  className="w-[130px] h-[15px] absolute -bottom-2 -right-8"
                  resizeMode='contain'
                />
              </View>

              <Text className="font-pregular text-gray-200 text-sm text-center mt-7 px-3">
                Where creativity meets innovation: embark on a journey of limitless exploration with {' '}
                <Text className="text-secondary-200">Aora!</Text>
              </Text>

              <CustomButton
                title="Continue with Email"
                handlePress={() => router.push('/signin')}
                containerStyle="w-full mt-7"
                textStyle=""
                isLoading={false}
              />
            </View>

          </ScrollView>
        <StatusBar backgroundColor='#161622' style='light' />
      </GestureHandlerRootView>
    </SafeAreaView>
  )
}

export default RootLayout
