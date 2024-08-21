import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import FormField from '../../components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { signIn } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalContext'

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const submitForm = async () => {
    if (isSubmitting) return;
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields");
    }

    setIsSubmitting(true);
    try {
      const res = await signIn(form.email, form.password);

      if (!res) throw new Error('An error occurred');

      setUser(res);
      setIsLoggedIn(true);
      router.replace('/home');

      router.replace('/home');
    } catch (error) {
      Alert.alert("Error", String(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <GestureHandlerRootView>
        <ScrollView>
          <View style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", minHeight: "100%", paddingHorizontal: 10, marginVertical: 10 }}>
            <Image
              source={images.logo}
              resizeMode='contain'
              style={{ width: 130, height: 84 }}
            />
            <Text style={{ fontSize: 24, color: "white", fontWeight: "500", marginTop: 40 }} >
              Login to your account
            </Text>

            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              keyboardType="email-address" placeholder={undefined}            />
            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
              keyboardType="password" placeholder={undefined}            />

            <CustomButton title="Sign In" handlePress={submitForm} isLoading={isSubmitting} />

            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">Don't have an account?</Text>
              <Link href="/signup" className="text-lg text-secondary-200 font-psemibold">Sign Up</Link>
            </View>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </SafeAreaView>
  )
}

export default SignIn