import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { useAppTheme } from "../context/ThemeContext";

export default function ArticleScreen() {
  const { url } = useLocalSearchParams<{ url: string }>();
  const { scheme } = useAppTheme();

  if (!url) {
    return <SafeAreaView style={styles.container} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: scheme === "dark" ? "#020617" : "#F8FAFC" }]}>
      <WebView
        source={{ uri: url }}
        style={{ flex: 1 }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0EA5E9" />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});
