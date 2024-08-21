import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '@/constants'
import CustomButton from './CustomButton'
import { router, usePathname } from 'expo-router'

type EmptyStateProps = {
  title: string,
  subTitle: string
}

const EmptyState:React.FC<EmptyStateProps> = ({title, subTitle}) => {
  const pathname = usePathname();

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={images.empty}
        style={{ width: 200, height: 200 }}
        resizeMode="contain"
      />
      <Text style={{ color: 'white', textAlign: 'center', fontSize: 24 }}>
        {title}
      </Text>
      <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
        {subTitle}
      </Text>

      {pathname.includes('search') ? (
        <CustomButton
          title="Return home"
          handlePress={() => router.push('/home')}
          isLoading={false}
        />
      ) : (
        <CustomButton
          title="Upload a Video"
          handlePress={() => router.push('/create')}
          isLoading={false}
        />
      )}
    </View>
  );
}

export default EmptyState