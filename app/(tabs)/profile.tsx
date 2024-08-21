import { View, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FlatList,
  GestureHandlerRootView,
  NativeViewGestureHandler,
} from 'react-native-gesture-handler';
import { router } from 'expo-router';
import useAppwrite from '@/lib/useAppwrite';
import { getUserPosts, logout } from '@/lib/appwrite';
import VideoCard from '@/components/VideoCard';
import EmptyState from '@/components/EmptyState';
import { useGlobalContext } from '@/context/GlobalContext';
import { icons } from '@/constants';
import InfoBox from '@/components/InfoBox';

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  if (!user) {
    router.replace('/signin');
  }

  const {
    data: posts,
  } = useAppwrite({ fn: getUserPosts }, user?.$id || '');

  const handleLogout = async () => {
    await logout();

    setIsLoggedIn(false);
    router.replace('/signin');
    setUser(null);
  }

  return (
    <GestureHandlerRootView>
      <NativeViewGestureHandler>
        <SafeAreaView className="bg-primary h-full">
          <View>
            <FlatList
              data={posts}
              keyExtractor={(item: any) => item.$id}
              renderItem={({ item }) => <VideoCard video={item} />}
              ListHeaderComponent={() => (
                <View className="w-full justify-center items-center mt-6 mb-12 px-4">
                  <TouchableOpacity
                    onPress={handleLogout}
                    className="w-full items-end mb-10"
                  >
                    <Image className="w-6 h-6" source={icons.logout} />
                  </TouchableOpacity>
                  <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                    <Image
                      source={{ uri: user?.avatar }}
                      className="w-[90%] h-[90%] rounded-lg"
                      resizeMode="cover"
                    />
                  </View>

                  <InfoBox title={user?.username} />

                  <View className="mt-5 flex-row">
                    <InfoBox
                      title={String(posts.length) || '0'}
                      subTitle="Posts"
                    />
                    <InfoBox
                      title="1.2k"
                      subTitle="Followers"
                    />
                  </View>
                </View>
              )}
              ListEmptyComponent={() => (
                <View>
                  <EmptyState
                    title="No videos found for the search query"
                    subTitle=""
                  />
                </View>
              )}
            />
          </View>
        </SafeAreaView>
      </NativeViewGestureHandler>
    </GestureHandlerRootView>
  );
};

export default Profile;
