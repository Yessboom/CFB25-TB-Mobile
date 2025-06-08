import { Image } from 'expo-image';
import React from 'react';
import { ImageSourcePropType, ImageStyle, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
  imgSource?: ImageSourcePropType | string | null;
  selectedImage?: string;
  style?: ImageStyle;
  placeholderStyle?: ViewStyle;
  showPlaceholder?: boolean; // Whether to show placeholder when no image
  placeholderText?: string;
};

export default function ImageViewer({ 
  imgSource, 
  selectedImage, 
  style,
  placeholderStyle,
  showPlaceholder = true,
  placeholderText = "No Image"
}: Props) {
  
  const getImageSource = () => {
    if (selectedImage) {
      return { uri: selectedImage };
    }
    
    if (imgSource) {
      if (typeof imgSource === 'string') {
        return { uri: imgSource };
      }
      return imgSource;
    }
    
    return null;
  };

  const imageSource = getImageSource();

  // Show placeholder if no image and placeholder is enabled
  if (!imageSource && showPlaceholder) {
    return (
      <View style={[styles.placeholder, style, placeholderStyle]}>
        <Text style={styles.placeholderText}>{placeholderText}</Text>
      </View>
    );
  }

  // Don't render anything if no image and placeholder is disabled
  if (!imageSource) {
    return null;
  }

  return (
    <Image 
      source={imageSource} 
      style={[styles.image, style]} 
      contentFit="cover"
      transition={200}
      onError={(error) => {
        console.log('Image load error:', error);
      }}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  placeholder: {
    width: 320,
    height: 440,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
