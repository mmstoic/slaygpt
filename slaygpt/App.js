import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

export default function App() {
  // State to store the user's input prompt
  const [prompt, setPrompt] = useState("");

  // State to store the AI's response
  const [response, setResponse] = useState("");

  // State to track if we're waiting for a response from the API
  const [loading, setLoading] = useState(false);

  /**
   * Function to send the prompt to OpenAI's API
   * This gets called when the user presses the "Send" button
   */
  const sendPrompt = async () => {
    // Don't do anything if the prompt is empty
    if (!prompt.trim()) return;

    // Show loading indicator
    setLoading(true);

    // Clear any previous response
    setResponse("");

    try {
      // Make the API call to OpenAI
      // Note: You'll need to add your OpenAI API key to your .env file
      const apiResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Read the API key from your environment variable
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            // Using GPT-3.5-turbo for cost efficiency, but you can change to gpt-4
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are SlayGPT. You respond to all prompts with words like bestie, slay, and queen. You are a hype woman! Yasss!!!",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            // Max tokens controls the length of the response
            max_tokens: 500,
          }),
        }
      );

      // Parse the JSON response
      const data = await apiResponse.json();

      // Check if the API returned an error
      if (data.error) {
        setResponse(`Error: ${data.error.message}`);
      } else {
        // Extract and display the AI's response
        setResponse(data.choices[0].message.content);
      }
    } catch (error) {
      // Handle any network or parsing errors
      setResponse(`Error: ${error.message}`);
    } finally {
      // Hide loading indicator regardless of success or failure
      setLoading(false);
    }
  };

  return (
    // KeyboardAvoidingView ensures the input doesn't get hidden by the keyboard
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Safe area for status bar */}
      <View style={styles.header}>
        <Text style={styles.title}>SlayGPT</Text>
      </View>

      {/* Scrollable area for the AI response */}
      <ScrollView style={styles.responseContainer}>
        {loading ? (
          // Show a spinner while waiting for response
          <ActivityIndicator
            size="large"
            color="#f6a2a5"
            style={styles.loader}
          />
        ) : response ? (
          // Show the AI's response
          <Text style={styles.responseText}>{response}</Text>
        ) : (
          // Show placeholder text when there's no response yet
          <Text style={styles.placeholderText}>
            Enter a prompt below bestie!
          </Text>
        )}
      </ScrollView>

      {/* Input area at the bottom */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind today, queen?"
          value={prompt}
          onChangeText={setPrompt}
          // Allow multiple lines for longer prompts
          multiline
          // Disable input while loading
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={sendPrompt}
          // Disable button while loading
          disabled={loading}
        >
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fef7f2",
  },
  header: {
    backgroundColor: "#f6a2a5",
    paddingTop: Platform.OS === "ios" ? 60 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fef7f2",
    fontFamily: "Snell Roundhand",
  },
  responseContainer: {
    flex: 1,
    padding: 20,
  },
  responseText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333333",
    fontFamily: "Snell Roundhand",
  },
  placeholderText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#999999",
    //fontStyle: "italic",
    textAlign: "center",
    marginTop: 50,
    fontFamily: "Snell Roundhand",
  },
  loader: {
    marginTop: 50,
  },
  inputContainer: {
    //footer
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fef7f2",
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
    paddingBottom: Platform.OS === "ios" ? 30 : 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
    backgroundColor: "#fef7f2",
    fontFamily: "Snell Roundhand",
  },
  button: {
    backgroundColor: "#f6a2a5",
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "#fef7f2",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Snell Roundhand",
  },
});
