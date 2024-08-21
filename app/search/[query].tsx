import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList, GestureHandlerRootView, NativeViewGestureHandler } from 'react-native-gesture-handler'
import { useLocalSearchParams } from 'expo-router'
import useAppwrite from '@/lib/useAppwrite'
import { searchPosts } from '@/lib/appwrite'
import Spinner from '@/components/Spinner'
import VideoCard from '@/components/VideoCard'
import EmptyState from '@/components/EmptyState'
import SearchInput from '@/components/SearchInput'

const Search = () => {
  const {query}= useLocalSearchParams();
  const {
    data: posts,
    refetch,
    isLoading: postsLoading,
  } = useAppwrite({ fn: searchPosts }, String(query));

  useEffect(() => {
    refetch();
  }, [query]);

  if (postsLoading) return <Spinner />;

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
                <View className="my-6 px-4">
                  <Text className="font-pmedium text-sm text-gray-100">
                    Search results,
                  </Text>
                  <Text className="font-semibold text-2xl text-white">
                    {query}
                  </Text>
                  <View className="mt-6 mb-8">
                    <SearchInput initialQuery={String(query)} />
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
}

export default Search