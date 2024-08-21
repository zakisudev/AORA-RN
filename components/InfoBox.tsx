import { View, Text } from 'react-native'

type InfoBoxProps = {
  title: string
  subTitle?: string
}

const InfoBox:React.FC<InfoBoxProps> = ({title, subTitle}) => {
  return (
    <View style={{marginHorizontal: 20}}>
      <Text style={{ fontSize: 20, textAlign: 'center', color: 'white' }}>
        {title}
      </Text>
      <Text style={{ fontSize: 12, textAlign: 'center', color: 'white' }}>
        {subTitle}
      </Text>
    </View>
  );
}

export default InfoBox