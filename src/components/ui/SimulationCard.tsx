import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  id: string;
  title: string;
  description: string;
  assignedTo?: string;
  assignedUserIds?: string[];
  locked?: boolean;
  isAdmin?: boolean;
  onEdit?: (id: string) => void;
  onToggleLock?: (id: string, locked: boolean) => void;
  onDelete?: (id: string) => void;
  onManageUsers?: (id: string) => void;
}

export default function SimulationCard({
  id,
  title,
  description,
  assignedTo,
  assignedUserIds,
  locked,
  isAdmin = false,
  onEdit,
  onToggleLock,
  onDelete,
  onManageUsers,
}: Props) {
  const router = useRouter();

  const handlePress = () => {
    if (locked && !isAdmin) {
      Alert.alert("This simulation is locked");
    } else {
      router.push(`/simulation/${id}?assignedTo=${assignedTo}`);
    }
  };

  const handleEdit = (e: any) => {
    e.stopPropagation();
    onEdit?.(id);
  };

  const handleToggleLock = (e: any) => {
    e.stopPropagation();
    onToggleLock?.(id, !locked);
  };

  const handleDelete = (e: any) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  const handleManageUsers = (e: any) => {
    e.stopPropagation();
    onManageUsers?.(id);
  };

  return (
    <View>
      <Pressable
        style={[styles.card, locked && !isAdmin && styles.locked]}
        onPress={handlePress}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        {assignedUserIds && assignedUserIds.length > 0 && (
          <View style={styles.userBadge}>
            <FontAwesome5 name="users-cog" size={14} color="#666" />
            <Text style={styles.userCount}>
              {assignedUserIds.length} user
              {assignedUserIds.length !== 1 ? "s" : ""}
            </Text>
          </View>
        )}

        {locked && !isAdmin && (
          <EvilIcons name="lock" style={styles.lockIcon}></EvilIcons>
        )}

        {isAdmin && (
          <View style={styles.adminControls}>
            <Pressable
              style={[styles.iconButton, styles.usersIconButton]}
              onPress={handleManageUsers}
            >
              <FontAwesome5 name="users-cog" size={24} color="black" />
            </Pressable>
            <Pressable style={styles.iconButton} onPress={handleEdit}>
              <FontAwesome5 name="pen" style={styles.penIcon} />
            </Pressable>
            <Pressable style={styles.iconButton} onPress={handleToggleLock}>
              <EvilIcons
                name={locked ? "lock" : "unlock"}
                size={36}
                color={locked ? "grey" : "black"}
              />
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={handleDelete}>
              <Ionicons name="trash" size={24} color="#d32f2f" />
            </Pressable>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f1f8e9",
    padding: 16,
    borderRadius: 30,
    marginBottom: 12,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderColor: "black",
    borderWidth: 2,
    marginTop: 2,
  },
  locked: {
    opacity: 0.7,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 6,
  },
  description: {
    color: "black",
    marginTop: 6,
  },
  userBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  userCount: {
    fontSize: 12,
    color: "#666",
  },
  penIcon: {
    position: "absolute",
    right: -10,
    top: 8,
    fontSize: 20,
    color: "black",
  },
  lockIcon: {
    position: "absolute",
    right: 16,
    top: "50%",
    fontSize: 36,
    color: "black",
  },
  adminControls: {
    position: "absolute",
    right: 12,
    top: 12,
    flexDirection: "row",
    gap: 8,
  },
  usersIconButton: {
    top: 2,
  },
  iconButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 0,
    left: -8,
    top: 6,
  },
  closeButton: {
    marginTop: 12,
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
