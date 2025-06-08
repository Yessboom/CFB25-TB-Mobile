import React from 'react';
import { Text, View } from 'react-native';

interface ImpactPlayerProps {
    isImpact: boolean;
}

const ImpactPlayer: React.FC<ImpactPlayerProps> = ({ isImpact }) => {
    const isHighlighted = isImpact === true;
return (
    <View style={[]}>
      <Text 
        style={[
          { 
            color: isHighlighted ? '#FFD700' : '#D3D3D3' // Gold or Light Grey
          }
        ]}
      >
        ★
      </Text>
    </View>
  );
};



export default ImpactPlayer;