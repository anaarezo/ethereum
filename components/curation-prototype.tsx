import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ChatMessage, ChatMessageCard } from "@/components/ui/chat-message";
import { HeaderTitle } from "@react-navigation/elements";
import { useCuration } from "./hook/useCuration";
import { IconSymbol } from "./ui/icon-symbol";

export default function CurationPrototype() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { mutate, data, isPending, error } = useCuration();

  const handleOnSubmit = () => {
    if (!query.trim()) return;

    const payload = {
      message: query,
      conversation_id: conversationId,
      conversation_topic: null,
      context: {
        previous_messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        summary_checkpoint: null,
      },
      metadata: {
        type: conversationId ? "follow_up" : "new",
        user_id: "user_12345",
        session_id: "sess_abc123",
        timestamp: new Date().toISOString(),
        message_index: messages.length + 1,
      },
    };

    mutate(payload, {
      onSuccess: (response) => {
        console.log("Success:", response);
        // Handle success - update UI with response
      },
      onError: (err) => {
        console.error("Error:", err);
        // Handle error - show error message to user
      },
    });
  };

  const suggestionChips = [
    "What are investors saying about Tesla?",
    "What about their competition from China?",
  ];

  const handleSuggestion = (suggestion: string) => {
    setQuery(suggestion);
  };

  const hasContent = messages.length > 0;

  function handleAsk() {
    if (!query.trim()) return;
    setLoading(true);
    const currentQuery = query;

    // Add user message into the chat
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: currentQuery,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");

    // Build payload for API
    const payload = {
      message: currentQuery,
      conversation_id: conversationId,
      conversation_topic: null,
      context: {
        previous_messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        summary_checkpoint: null,
      },
      metadata: {
        type: conversationId ? "follow_up" : "new",
        user_id: "user_12345", // TODO: Replace with actual user ID
        session_id: "sess_abc123", // TODO: Replace with actual session ID
        timestamp: new Date().toISOString(),
        message_index: messages.length + 1,
      },
    };

    // Call the mutation
    mutate(payload, {
      onSuccess: (response) => {
        console.log("API Response:", response);

        // Update conversation ID if this is a new conversation
        if (!conversationId && response.conversation_id) {
          setConversationId(response.conversation_id);
        }

        // Add assistant response to messages
        const assistantMessage: ChatMessage = {
          id: response.message.message_id || `msg_${Date.now()}`,
          role: "assistant",
          content: response.message.content || "No response received",
          created_at: response.message.timestamp || new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setLoading(false);
      },
      onError: (err) => {
        console.error("API Error:", err);

        // Add error message to chat
        const errorMessage: ChatMessage = {
          id: `error_${Date.now()}`,
          role: "assistant",
          content:
            "Sorry, I encountered an error processing your request. Please try again.",
          created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, errorMessage]);
        setLoading(false);
      },
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <HeaderTitle style={styles.headerTitle}>curation.</HeaderTitle>

        {!hasContent ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <IconSymbol name="sparkles" size={48} color="#A855F7" />
            </View>
            <Text style={styles.emptyTitle}>Discover Stock Insights</Text>
            <Text style={styles.emptySubtitle}>
              Ask me about any stock or cryptocurrency to get AI-powered
              insights
            </Text>
            <View style={styles.suggestionsContainer}>
              {suggestionChips.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => handleSuggestion(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                  <Ionicons name="arrow-forward" size={14} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <>
            <View style={styles.messagesList}>
              {messages.map((message) => (
                <ChatMessageCard key={message.id} message={message} />
              ))}
              {loading && (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>T H I N K I N G...</Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.bottomInputContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleAsk}
            placeholder="Ask a question about a stock..."
            placeholderTextColor="#6B7280"
            style={styles.searchInput}
            returnKeyType="search"
          />
          <TouchableOpacity
            onPress={handleAsk}
            disabled={loading}
            style={[styles.askButton, loading && styles.askButtonDisabled]}
          >
            <Text style={styles.askButtonText}>{loading ? "..." : "Ask"}</Text>
            <Ionicons name="arrow-forward" size={16} color="#C4B5FD" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0b",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroSection: {
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 38,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  suggestionsContainer: {
    width: "100%",
    gap: 10,
  },
  suggestionChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  suggestionText: {
    fontSize: 14,
    color: "#FFFFFF",
    flex: 1,
  },
  messagesList: {
    gap: 0,
  },
  loadingContainer: {
    padding: 16,
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  bottomInputContainer: {
    padding: 12,
    backgroundColor: "#0a0a0b",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  searchContainer: {
    position: "relative",
  },
  searchInput: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingRight: 100,
    fontSize: 14,
    color: "#FFFFFF",
  },
  askButton: {
    position: "absolute",
    right: 8,
    top: 8,
    bottom: 8,
    backgroundColor: "rgba(142, 79, 251, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(142, 79, 251, 0.3)",
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  askButtonDisabled: {
    opacity: 0.5,
  },
  askButtonText: {
    color: "#C4B5FD",
    fontSize: 14,
    fontWeight: "500",
  },
});
