import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from '@/constants'
import { GestureHandlerRootView, NativeViewGestureHandler, TouchableOpacity } from 'react-native-gesture-handler'
import { AVPlaybackStatus, AVPlaybackStatusError, ResizeMode, Video } from 'expo-av'

type VideoCardProps = {
  video: any
}

const isPlaybackStatusError = (
  status: AVPlaybackStatus
): status is AVPlaybackStatusError => {
  return 'error' in status;
};

const VideoCard:React.FC<VideoCardProps> = ({video}) => {
  const [play, setPlay] = useState(false)
  return (
    <GestureHandlerRootView>
      <NativeViewGestureHandler>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingHorizontal: 4,
            marginBottom: 50,
            width: '100%',
            flex: 1,
            gap: 5,
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 3,
              alignItems: 'flex-start',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 5,
                  borderStyle: 'solid',
                  borderColor: '#ff8e01',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  padding: 2,
                }}
              >
                <Image
                  source={{ uri: video.creater?.avatar }}
                  style={{ width: "90%", height: "90%", borderRadius: 2 }}
                  resizeMode="cover"
                />
              </View>
              <View
                style={{ justifyContent: 'center', marginLeft: 10, flex: 1 }}
              >
                <Text
                  style={{ color: 'white', fontWeight: '500', fontSize: 18 }}
                  numberOfLines={1}
                >
                  {video.title}
                </Text>
                <Text
                  style={{ fontSize: 12, color: '#94918c', fontWeight: '300' }}
                >
                  {video.creater.username}
                </Text>
              </View>
            </View>

            <View style={{ paddingTop: 8 }}>
              <Image
                source={icons.menu}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
            </View>
          </View>

          {play ? (
            <View style={{flex:1, width:'100%', height: 260, marginTop:10}}>
              <Video
                source={{ uri: video }}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                useNativeControls
                onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
                  if (status.isLoaded && isPlaybackStatusError(status)) {
                    setPlay(false);
                  }
                  if (status.isLoaded && status.didJustFinish) {
                    setPlay(false);
                  }
                }}
                style={{
                  height: 260,
                  borderRadius: 10,
                  overflow: 'hidden',
                  backgroundColor: 'black',
                  marginTop: 10,
                }}
              />
            </View>
          ) : (
            <View style={{ flex: 1, width: '100%' }}>
              <TouchableOpacity
                onPress={() => setPlay(true)}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  height: 240,
                  borderRadius: 10,
                  overflow: 'hidden',
                  marginTop: 10,
                }}
              >
                <Image
                  source={{ uri: video.thumbnail }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                <Image
                  source={icons.play}
                  style={{
                    position: 'absolute',
                    width: '50%',
                    height: '50%',
                    top: '25%',
                    left: '25%',
                    margin: 'auto',
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </NativeViewGestureHandler>
    </GestureHandlerRootView>
  );
}

export default VideoCard