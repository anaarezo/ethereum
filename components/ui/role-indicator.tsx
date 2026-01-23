import { StyleSheet, Text, View } from "react-native";

interface RoleIndicatorProps {
  isUser: boolean;
  timestamp: string;
}

export function RoleIndicator({ isUser, timestamp }: RoleIndicatorProps) {
  return (
    <View style={styles.roleRow}>
      <View
        style={[
          styles.roleIcon,
          isUser ? styles.userIcon : styles.assistantIcon,
        ]}
      >
        <Text style={styles.roleInitial}>{isUser ? "ME" : "AI"}</Text>
      </View>
      <Text style={styles.roleLabel}>{isUser ? "Me" : "Curation AI"}</Text>
      <Text style={styles.timestamp}>
        {new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  roleIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  userIcon: {
    backgroundColor: "rgba(142, 79, 251, 0.9)",
  },
  assistantIcon: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  roleInitial: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 11,
  },
  roleLabel: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    flex: 1,
  },
  timestamp: {
    color: "#6B7280",
    fontSize: 11,
  },
});
