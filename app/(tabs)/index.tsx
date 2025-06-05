import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


import Button from '@/components/Button';
import CircleButton from '@/components/CircleButton';
import EmojiList from '@/components/EmojiList';
import EmojiPicker from '@/components/EmojiPicker';
import IconButton from '@/components/IconButton';
import ImageViewer from '@/components/ImageViewer';

import EmojiSticker from '@/components/EmojiSticker';
import { testCorsHeaders, testOptions } from '@/helpers/newtest';
import { testLogin, testLoginWithoutCredentials } from '@/helpers/testlogin';


const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<ImageSourcePropType | undefined>(undefined);


  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('You did not select any image.');
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {
    // we will implement this later
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
        {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>

      {/* Debug button - only show in development */}
      { (
        <TouchableOpacity 
          onPress={testLogin}
          style={{
            position: 'absolute',
            top: 50,
            right: 20,
            backgroundColor: 'red',
            padding: 10,
            borderRadius: 5
          }}
        >
          <Text style={{ color: 'white' }}>Test Login</Text>
        </TouchableOpacity>
      )}
            { (
        <TouchableOpacity 
          onPress={testLoginWithoutCredentials}
          style={{
            position: 'absolute',
            top: 10,
            right: 20,
            backgroundColor: 'red',
            padding: 10,
            borderRadius: 5
          }}
        >
          <Text style={{ color: 'white' }}>Test Login without cred</Text>
        </TouchableOpacity>
      )}

                  { (
        <TouchableOpacity 
          onPress={testCorsHeaders}
          style={{
            position: 'absolute',
            top: 90,
            right: 20,
            backgroundColor: 'red',
            padding: 10,
            borderRadius: 5
          }}
        >
          <Text style={{ color: 'white' }}>Test Cors header</Text>
        </TouchableOpacity>
      )}

                        { (
        <TouchableOpacity 
          onPress={testOptions}
          style={{
            position: 'absolute',
            top: 150,
            right: 20,
            backgroundColor: 'red',
            padding: 10,
            borderRadius: 5
          }}
        >
          <Text style={{ color: 'white' }}>Test Options</Text>
        </TouchableOpacity>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
