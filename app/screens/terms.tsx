// file: components/Terms.tsx
import { ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import { ThemedText } from '@/components/ThemedText';

const Terms = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>
          Terms and Conditions
        </ThemedText>
        <ThemedText style={styles.lastUpdated}>Last Updated: September 7, 2025</ThemedText>
        <ThemedText style={styles.paragraph}>
          Welcome to MojiFusion! These Terms and Conditions (&ldquo;Terms&rdquo;) govern your use of the MojiFusion mobile game (the &ldquo;Service&rdquo;). By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
        </ThemedText>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          1. Intellectual Property
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          The Service and its original content, features, and functionality are and will remain the exclusive property of MojiFusion and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of MojiFusion.
        </ThemedText>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          2. User Obligations
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          You agree not to use the Service for any unlawful purpose or in any way that might harm, disrupt, or impair the functionality of the Service. This includes, but is not limited to:
        </ThemedText>
        <ThemedText style={styles.listItem}>- Distributing viruses or other harmful computer code.</ThemedText>
        <ThemedText style={styles.listItem}>- Attempting to gain unauthorized access to the Service or any related systems.</ThemedText>
        <ThemedText style={styles.listItem}>- Interfering with other users&rsquo; enjoyment of the Service.</ThemedText>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          3. Disclaimer of Warranties
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          The Service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. We make no warranties, expressed or implied, regarding the operation of the Service or the information, content, or materials included on it.
        </ThemedText>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          4. Limitation of Liability
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          In no event shall MojiFusion, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </ThemedText>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          5. Changes to Terms
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days&rsquo; notice before any new terms take effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
        </ThemedText>
        
      </ScrollView>
    </View>
  );
};

export default Terms;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fbf8ef',
    paddingTop: 100,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 24,
    color: '#333',
  },
  lastUpdated: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  paragraph: {
    marginBottom: 10,
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  listItem: {
    marginLeft: 20,
    marginBottom: 5,
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  contactInfo: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
    color: '#0a7ea4',
  },
});