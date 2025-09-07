// file: components/Legal.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { useRouter } from 'expo-router';

const Legal = () => {
  const router = useRouter();

  const handleTermsPress = () => {
    router.push('/screens/terms');
  };

  const handlePrivacyPress = () => {
    router.push('/screens/privacy');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleTermsPress}>
        <ThemedText style={styles.linkText} type="link">
          Terms & Conditions
        </ThemedText>
      </TouchableOpacity>
      <ThemedText style={styles.separator}>&bull;</ThemedText>
      <TouchableOpacity onPress={handlePrivacyPress}>
        <ThemedText style={styles.linkText} type="link">
          Privacy Policy
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

export default Legal;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  linkText: {
    fontSize: 14,
    color: '#FF6B35',
  },
  separator: {
    marginHorizontal: 10,
    color: '#666',
  },
});