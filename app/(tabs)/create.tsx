import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, NativeViewGestureHandler, ScrollView } from 'react-native-gesture-handler'
import FormField from '@/components/FormField'
import { ResizeMode, Video } from 'expo-av'
import { icons } from '@/constants'
import CustomButton from '@/components/CustomButton';
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { uploadVideo } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalContext'

type ImagePickerAsset = {
  uri: string;
  width: number;
  height: number;
  type: string;
  fileName?: string;
};

type FormState = {
  title: string;
  video: ImagePickerAsset | null;
  thumbnail: ImagePickerAsset | null;
  prompt: string;
};

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: '',
    video: null,
    thumbnail: null,
    prompt: '',
  });

  const openPicker = async (selectType: string) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      if (selectType === 'image') {
        setForm({ ...form, thumbnail: result.assets[0] });
      }
    } else {
      setForm({ ...form, video: result.assets[0] });
    }
  };

  const submitVideo = async () => {
    if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
      Alert.alert('All fields are required');
      return;
    }

    setUploading(true);

    try {
      await uploadVideo({ ...form, userId: user.$id });

      Alert.alert('Success', 'Post uploaded successfully');
      router.push('/home');
    } catch (error: any) {
      console.log(error);
      Alert.alert('Failed to upload video', error?.message);
      return;
    } finally {
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: '',
      });
      setUploading(false);
    }
  };

  return (
    <GestureHandlerRootView>
      <NativeViewGestureHandler>
        <SafeAreaView className="bg-primary h-full">
          <ScrollView style={{ marginVertical: 24, paddingHorizontal: 16 }}>
            <Text style={{ fontSize: 24, color: 'white', fontWeight: '500' }}>
              Upload a video
            </Text>
            <FormField
              title="Video Title"
              value={form.title}
              placeholder={'Enter video title'}
              handleChangeText={(title: any) => setForm({ ...form, title })}
            />

            <View style={{ marginTop: 20 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: 'lightgray',
                  fontWeight: '500',
                  marginBottom: 4,
                }}
              >
                Choose Video
              </Text>
              <TouchableOpacity
                onPress={() => openPicker('video')}
                style={{
                  width: '100%',
                  height: 200,
                  paddingHorizontal: 15,
                  justifyContent: 'center',
                  backgroundColor: '#2c2b29',
                  borderRadius: 10,
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 5,
                }}
              >
                {form.video ? (
                  <Video
                    source={{ uri: form.video.uri }}
                    style={{ width: '100%', height: '100%', borderRadius: 10 }}
                    resizeMode={ResizeMode.COVER}
                  />
                ) : (
                  <View
                    style={{
                      width: '90%',
                      height: 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        width: 100,
                        height: 100,
                        backgroundColor: '#2c2b29',
                        borderRadius: 10,
                        borderColor: '#7b7b8b',
                        borderStyle: 'dashed',
                        borderWidth: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Image
                        source={icons.upload}
                        style={{ width: 30, height: 30 }}
                      />
                    </View>
                    <Text style={{ color: '#7b7b8b', fontSize: 16 }}>
                      No file chosen
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 20 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: 'lightgray',
                  fontWeight: '500',
                  marginBottom: 4,
                }}
              >
                Choose Thumbnail
              </Text>
              <TouchableOpacity
                onPress={() => openPicker('image')}
                style={{
                  width: '100%',
                  height: 100,
                  paddingHorizontal: 15,
                  justifyContent: 'center',
                  backgroundColor: '#2c2b29',
                  borderRadius: 10,
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 5,
                }}
              >
                {form.thumbnail ? (
                  <Image
                    source={{ uri: form.thumbnail.uri }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{
                      width: '90%',
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        width: 100,
                        height: 50,
                        backgroundColor: '#2c2b29',
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Image
                        source={icons.upload}
                        style={{ width: 30, height: 30 }}
                        resizeMode="cover"
                      />
                    </View>
                    <Text style={{ color: '#7b7b8b', fontSize: 16 }}>
                      No file chosen
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <FormField
              title="AI prompt"
              value={form.prompt}
              placeholder={'AI prompt used to create this video'}
              handleChangeText={(prompt: any) => setForm({ ...form, prompt })}
            />

            <CustomButton
              title="Upload & Publish"
              handlePress={submitVideo}
              isLoading={uploading}
            />
          </ScrollView>
        </SafeAreaView>
      </NativeViewGestureHandler>
    </GestureHandlerRootView>
  );
};

export default Create