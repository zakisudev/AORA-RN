import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import FormField from '../../components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router';
import { createUser } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalContext'

const SignUp = () => {
  const {setUser, setIsLoggedIn} = useGlobalContext();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async () => {
    if (isSubmitting) return;
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields");
    }

    setIsSubmitting(true);
    try {
      const res = await createUser(form.email, form.password, form.username);

      if (!res) throw new Error('An error occurred');

      setUser(res);
      setIsLoggedIn(true);
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
              Sign up for an account
            </Text>

            <FormField
              title="Username"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              otherStyles="mt-7"
              keyboardType="username"
            />
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              keyboardType="email-address"
            />
            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
              keyboardType="password"
            />

            <CustomButton title="Sign Up" handlePress={submitForm} isLoading={isSubmitting} />

            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">Already have an account?</Text>
              <Link href="/signin" className="text-lg text-secondary-200 font-psemibold">Sign In</Link>
            </View>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </SafeAreaView>
  )
}

export default SignUp