// file: components/Privacy.tsx
import { ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import { ThemedText } from '@/components/ThemedText';

const Privacy = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>
          Privacy Policy
        </ThemedText>
        <ThemedText style={styles.lastUpdated}>Last Updated: September 7, 2025</ThemedText>
        <ThemedText style={styles.paragraph}>
          MojiFusion (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the MojoFusion mobile application (the &ldquo;Service&rdquo;). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
        </ThemedText>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          1. Information Collection and Use
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          We collect several different types of information for various purposes to provide and improve our Service to you.
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subsectionTitle}>
          Personal Data
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          While using our Service, we do not ask you to provide us with any personally identifiable information.
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subsectionTitle}>
          Usage Data
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          We may also collect information that your device sends whenever you use our Service (&ldquo;Usage Data&rdquo;). This Usage Data may include information such as your device's Internet Protocol address (e.g. IP address), device type, and other diagnostic data.
        </ThemedText>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          2. Data Storage
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          To provide a seamless gaming experience, we store certain game-related data locally on your device. This includes:
        </ThemedText>
        <ThemedText style={styles.listItem}>- Your best score and current score.</ThemedText>
        <ThemedText style={styles.listItem}>- Your game board state, best tile, theme selection, and power-up counts.</ThemedText>
        <ThemedText style={styles.listItem}>- Your sound preferences.</ThemedText>
        <ThemedText style={styles.paragraph}>
          This data is stored using your device&rsquo;s local storage mechanisms (e.g., AsyncStorage) and is not transmitted to our servers or any third-party services.
        </ThemedText>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          3. Use of Data
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          MojiFusion uses the collected data for various purposes:
        </ThemedText>
        <ThemedText style={styles.listItem}>- To provide and maintain the Service.</ThemedText>
        <ThemedText style={styles.listItem}>- To notify you about changes to our Service.</ThemedText>
        <ThemedText style={styles.listItem}>- To provide customer care and support.</ThemedText>
        <ThemedText style={styles.listItem}>- To monitor the usage of the Service.</ThemedText>
        <ThemedText style={styles.listItem}>- To detect, prevent and address technical issues.</ThemedText>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          4. Links to Other Sites
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party&rsquo;s site. We strongly advise you to review the Privacy Policy of every site you visit.
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
        </ThemedText>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          5. Changes to This Privacy Policy
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via a prominent notice on our Service, prior to the change becoming effective and update the &ldquo;last updated&rdquo; date at the top of this Privacy Policy.
        </ThemedText>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          6. Contact Us
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us:
        </ThemedText>
        <ThemedText style={styles.contactInfo}>By email: info@amekr.com</ThemedText>
      </ScrollView>
    </View>
  );
};

export default Privacy;

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
  subsectionTitle: {
    marginTop: 15,
    marginBottom: 5,
    fontWeight: '600',
    fontSize: 16,
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