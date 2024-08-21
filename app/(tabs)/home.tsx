import EmptyState from '@/components/EmptyState'
import SearchInput from '@/components/SearchInput'
import Spinner from '@/components/Spinner'
import Trending from '@/components/Trending'
import VideoCard from '@/components/VideoCard'
import { images } from '@/constants'
import { useGlobalContext } from '@/context/GlobalContext'
import { getAllPosts, getLatestPosts } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'
import { useState } from 'react'
import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
  const {user, setUser, setIsLoggedIn} = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const { data: posts, refetch, isLoading:postsLoading } = useAppwrite({fn: getAllPosts}, "" );
  const { data: latestPosts} = useAppwrite({ fn: getLatestPosts }, "");

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  if (postsLoading) return <Spinner />

  return (
    <SafeAreaView className="bg-primary h-full">
      <View>
        <FlatList
          data={posts}
          keyExtractor={(item:any) => item.$id}
          renderItem={({ item }) => (
            <VideoCard video={item}/>
          )}
          ListHeaderComponent={() => (
            <View className="my-6 px-4 space-y-6">
              <View className="justify-between items-start flex-row mb-6">
                <View>
                  <Text className="font-pmedium text-sm text-gray-100">Welcome back,</Text>
                  <Text className="font-semibold text-2xl text-white">{user?.username}</Text>
                </View>
                <View className="mt-1.5">
                  <Image
                    source={images.logoSmall}
                    className="w-9 h-10"
                    resizeMode='contain'
                  />
                </View>
              </View>

              <SearchInput
                title={undefined}
                value={undefined}
                placeholder="Search for a video"
                handleChangeText={undefined}
                otherStyles={undefined}
              />

              <View className="w-full flex-1 pt-5 pb-8">

                <Text className="text-gray-100 text-lg font-pregular mb-3">Latest Videos</Text>

                <Trending posts={latestPosts ?? []}/>

              </View>
            </View>
          )}
          ListEmptyComponent={()=> (
            <View>
              <EmptyState
                title="No videos found"
                subTitle="Be the first to upload a video"
              />
            </View>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>
    </SafeAreaView>
  )
}

export default Home