import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Markdown from "react-native-markdown-package";
import Animated, {
  FadeInDown,
  LinearTransition,
} from "react-native-reanimated";

import { RoleIndicator } from "./role-indicator";

export interface GraphData {
  [key: string]: string | number | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  graph?: GraphData[];
}

interface ChatMessageProps {
  message: ChatMessage;
}

function stripMarkdownTables(content: string) {
  const tableRegex = /\n?\|[^\n]+\|\n\|[-:\s|]+\|(\n\|[^\n]+\|)*/g;
  return content.replace(tableRegex, "").trim();
}

export function ChatMessageCard({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const hasGraph = message.graph && message.graph.length > 0;
  const content = hasGraph
    ? stripMarkdownTables(message.content)
    : message.content;

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      layout={LinearTransition.duration(400)}
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      <RoleIndicator isUser={isUser} timestamp={message.created_at} />

      {isUser ? (
        <Text style={styles.userContent}>{message.content}</Text>
      ) : (
        <Markdown styles={markdownStyles}>{content}</Markdown>
      )}

      {hasGraph && (
        <View style={styles.tableContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            nestedScrollEnabled
          >
            <View style={styles.tableWrapper}>
              <View style={styles.tableRow}>
                {Object.keys(message.graph![0]).map((key) => (
                  <View key={key} style={styles.tableHeaderCell}>
                    <Text style={styles.tableHeaderText} numberOfLines={1}>
                      {key}
                    </Text>
                  </View>
                ))}
              </View>

              {message.graph!.map((row, idx) => (
                <View key={idx} style={styles.tableRow}>
                  {Object.values(row).map((val, i) => (
                    <View key={i} style={styles.tableCell}>
                      <Text style={styles.tableCellText} numberOfLines={1}>
                        {val ?? "-"}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  userContainer: {
    backgroundColor: "rgba(142, 79, 251, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(142, 79, 251, 0.3)",
    marginLeft: 40,
  },
  assistantContainer: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  userContent: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 22,
  },
  tableContainer: {
    marginTop: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  tableWrapper: {
    flexDirection: "column",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeaderCell: {
    backgroundColor: "rgba(142, 79, 251, 0.3)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 120,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.05)",
  },
  tableHeaderText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  tableCell: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 120,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.03)",
  },
  tableCellText: {
    color: "#9CA3AF",
    fontSize: 11,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});

const markdownStyles = {
  text: {
    color: "#E5E7EB",
    fontSize: 14,
    lineHeight: 22,
  },
  strong: {
    color: "#FFFFFF",
    fontWeight: "700" as const,
  },
  heading1: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700" as const,
    marginBottom: 12,
    marginTop: 16,
  },
  heading2: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600" as const,
    marginBottom: 10,
    marginTop: 14,
  },
  heading3: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600" as const,
    marginBottom: 8,
    marginTop: 12,
  },
  listItemNumber: {
    color: "#A855F7",
    fontWeight: "700" as const,
  },
  listItemBullet: {
    color: "#A855F7",
  },
  link: {
    color: "#A855F7",
    textDecorationLine: "underline" as const,
  },
  blockquote: {
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    borderLeftColor: "#A855F7",
    borderLeftWidth: 3,
    paddingLeft: 12,
    paddingVertical: 8,
    marginVertical: 8,
  },
  codeBlock: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 8,
    padding: 12,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
    color: "#E5E7EB",
  },
  inlineCode: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
    color: "#F472B6",
  },
  table: {
    borderColor: "rgba(255,255,255,0.1)",
  },
  tableHeader: {
    backgroundColor: "rgba(142, 79, 251, 0.2)",
  },
  tableHeaderCell: {
    color: "#FFFFFF",
    fontWeight: "700" as const,
  },
  tableCell: {
    color: "#9CA3AF",
  },
};
