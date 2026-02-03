import {
    assignUserToSimulation,
    getAllUsers,
    removeUserFromSimulation,
} from "@/src/services/adminService";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  simulationId: string;
  simulationTitle: string;
  assignedUserIds: string[];
}

export default function ManageUsersModal({
  visible,
  onClose,
  simulationId,
  simulationTitle,
  assignedUserIds,
}: Props) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const slideAnim = useState(() => new Animated.Value(600))[0]; // Start off-screen
  const fadeAnim = useState(() => new Animated.Value(0))[0]; // Start transparent

  useEffect(() => {
    if (visible) {
      // Reset to starting position
      slideAnim.setValue(600);
      fadeAnim.setValue(0);

      loadUsers();
      // Animate in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 600,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await getAllUsers();
      // Filter out admin users, only show students
      const students = allUsers.filter((user: any) => user.role === "student");
      setUsers(students);
    } catch (error: any) {
      Alert.alert("Error", "Failed to load users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      await assignUserToSimulation(simulationId, userId);
      Alert.alert("Success", "User assigned to simulation");
      loadUsers(); // Refresh
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    Alert.alert(
      "Remove Access",
      "Are you sure you want to remove this user's access?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setActionLoading(userId);
            try {
              await removeUserFromSimulation(simulationId, userId);
              Alert.alert("Success", "User access removed");
              loadUsers(); // Refresh
            } catch (error: any) {
              Alert.alert("Error", error.message);
            } finally {
              setActionLoading(null);
            }
          },
        },
      ],
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Manage User Access</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </Pressable>
          </View>

          <Text style={styles.subtitle}>{simulationTitle}</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search users by email or name..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="black" />
            </View>
          ) : (
            <ScrollView style={styles.userList}>
              {filteredUsers.length === 0 ? (
                <Text style={styles.emptyText}>No users found</Text>
              ) : (
                filteredUsers.map((user) => {
                  const isAssigned = assignedUserIds.includes(user.id);
                  const isLoading = actionLoading === user.id;

                  return (
                    <View key={user.id} style={styles.userItem}>
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>
                          {user.name || user.email}
                        </Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                      </View>

                      {isLoading ? (
                        <ActivityIndicator size="small" color="black" />
                      ) : isAssigned ? (
                        <Pressable
                          style={styles.removeButton}
                          onPress={() => handleRemoveUser(user.id)}
                        >
                          <Ionicons
                            name="close-circle"
                            size={24}
                            color="#d32f2f"
                          />
                          <Text style={styles.removeButtonText}>Remove</Text>
                        </Pressable>
                      ) : (
                        <Pressable
                          style={styles.assignButton}
                          onPress={() => handleAssignUser(user.id)}
                        >
                          <Ionicons
                            name="add-circle"
                            size={24}
                            color="#2e7d32"
                          />
                          <Text style={styles.assignButtonText}>Assign</Text>
                        </Pressable>
                      )}
                    </View>
                  );
                })
              )}
            </ScrollView>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#f1f8e9",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
    borderWidth: 2,
    borderColor: "black",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "white",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  userList: {
    maxHeight: 400,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    padding: 20,
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#dcedc8",
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "black",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  assignButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  assignButtonText: {
    color: "#2e7d32",
    fontWeight: "600",
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  removeButtonText: {
    color: "#d32f2f",
    fontWeight: "600",
  },
});
