import { icons } from '@/constants'
import { useState } from 'react'
import { FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native'
import * as Animatable from 'react-native-animatable';
import {
  Video,
  ResizeMode,
  AVPlaybackStatus,
  AVPlaybackStatusError,
  AVPlaybackStatusSuccess,
} from 'expo-av';

type TrendingProps = {
  posts: any[]
}
type TrendingItemProps = {
  item: any,
  activeItem: any
}


const zoomIn = {
  0: {
    opacity: 0.8,
    scale: 0.9,
  },
  1: {
    opacity: 1,
    scale: 1,
  },
};

const zoomOut = {
  0: {
    opacity: 1,
    scale: 1,
  },
  1: {
    opacity: 0.8,
    scale: 0.9,
  },
};

const isPlaybackStatusError = (
  status: AVPlaybackStatus
): status is AVPlaybackStatusError => {
  return 'error' in status;
};

const TrendingItem:React.FC<TrendingItemProps> = ({activeItem, item})=> {
  const [play, setPlay] = useState(false);

  return (
    <Animatable.View
      style={{ marginRight: 20 }}
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item.video }}
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
            width: 200,
            height: 300,
            borderRadius: 10,
            overflow: 'hidden',
            backgroundColor: 'black',
            marginTop: 10,
          }}
        />
      ) : (
        <TouchableOpacity
          style={{
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            style={{
              width: 200,
              height: 300,
              borderRadius: 10,
              overflow: 'hidden',
              shadowColor: 'black',
              shadowOpacity: 0.5,
              shadowRadius: 10,
            }}
            imageStyle={{ borderRadius: 10 }}
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            style={{ width: 50, height: 50, position: 'absolute' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
}

const Trending:React.FC<TrendingProps> = ({posts}) => {
  const [activeItem, setActiveItem] = useState(posts[1]);

  const viewableItemChanged = (viewableItems: any) => {
    if (viewableItems.viewableItems.length > 0) {
      setActiveItem(viewableItems.viewableItems[0].key);
    }
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item: any) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item}/>
      )}
      onViewableItemsChanged={viewableItemChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
      horizontal
    />
  );
}

export default Trending