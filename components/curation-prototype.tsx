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
import { IconSymbol } from "./ui/icon-symbol";

export default function CurationPrototype() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const suggestionChips = [
    "How is Reddit is performing?",
    "Analyze Tesla stock",
    "What's trending in stocks?",
  ];

  const handleSuggestion = (suggestion: string) => {
    setQuery(suggestion);
  };

  const hasContent = messages.length > 0;

  async function handleAsk() {
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

    // Simulate API response but this should correctly moved to a context for now it's living here.
    setTimeout(() => {
      // Mock response with table data for demonstration
      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: "assistant",
        content:
          "Reddit's primary revenue sources can be summarized as follows:\n\n1. **Advertising Revenue**: This is the most significant revenue source for Reddit. In recent quarters, ad revenue has shown substantial growth.\n   - In Q2 of 2025, advertising revenue reached approximately **$465 million**, growing **84% year-over-year**【4:1†source】.\n   - For Q3 2024, ad revenue was **$315.1 million**, reflecting a **56% year-over-year growth**【4:8†source】.\n   - In Q4 2024, advertising revenue further climbed to **$395 million**, growing **60% year-over-year**【4:10†source】.\n\n2. **Other Revenue**: This includes income from various sources, such as data licensing.\n   - In Q2 of 2025, other revenue accounted for **$35 million**, which was a **24% year-over-year increase**【4:1†source】.\n   - During the same quarter, the overall revenue reached **$500 million**, showing a growth trajectory across various monetization strategies【4:1†source】【4:18†source】.\n\n3. **Performance and Brand Advertising**: Both performance-based ads and brand ads contribute substantially to overall advertising revenue. Over **60% of total ad revenue** comes from performance ads, highlighting the trend of advertisers focusing on measurable outcomes【4:1†source】【4:14†source】.\n\n4. **International Growth**: As Reddit expands internationally, revenue growth is also seen in these markets, which adds to the overall financial performance【4:4†source】【4:11†source】.\n\nIn conclusion, Reddit relies heavily on its advertising business for revenue generation, complemented by growing contributions from other revenue streams such as data licensing.\n\nHere's a summary table of recent revenue figures:\n\n| Quarter       | Total Revenue | Advertising Revenue | Other Revenue | Year-over-Year Growth |\n|---------------|---------------|---------------------|---------------|-----------------------|\n| Q2 2025       | $500 million  | $465 million        | $35 million   | 78%                   |\n| Q3 2024       | $348.4 million| $315.1 million      | $33.2 million | 68%                   |\n| Q4 2024       | $428 million  | $395 million        | -             | 71%                   |",
        created_at: new Date().toISOString(),
        graph: [
          {
            Quarter: "Q2 2025",
            "Total Revenue": 500,
            "Advertising Revenue": 465,
            "Other Revenue": 35,
            "Year-over-Year Growth": "78%",
          },
          {
            Quarter: "Q3 2024",
            "Total Revenue": 348.4,
            "Advertising Revenue": 315.1,
            "Other Revenue": 33.2,
            "Year-over-Year Growth": "68%",
          },
          {
            Quarter: "Q4 2024",
            "Total Revenue": 428,
            "Advertising Revenue": 395,
            "Other Revenue": null,
            "Year-over-Year Growth": "71%",
          },
        ],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }, 1200);
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
