import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useFeed } from '../../hooks/useFeed';
import { TextFeed } from '../../components/text/TextFeed';
import { colors } from '../../constants/colors';

export default function TextFeedTab() {
  const { textFeed } = useFeed();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.heading}>Your read</Text>
        <TextFeed posts={textFeed} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, paddingTop: 16 },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});
