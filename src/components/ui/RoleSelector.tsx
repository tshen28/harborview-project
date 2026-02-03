import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface RoleSelectorProps {
  role: "admin" | "student" | null;
  onSelect: (role: "admin" | "student") => void;
}

export default function RoleSelector({ role, onSelect }: RoleSelectorProps) {
  const data = [
    { label: "Admin", value: "admin" },
    { label: "Student", value: "student" },
  ];

  const renderItem = (item: { label: string; value: string }) => {
    const isFirstItem = item.value === "admin";
    return (
      <View
        style={[
          styles.itemContainerStyle,
          isFirstItem && styles.firstItemContainer,
        ]}
      >
        <Text style={styles.itemTextStyle}>{item.label}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select your role:</Text>
      <Dropdown
        style={styles.dropdown}
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Choose role..."
        value={role}
        onChange={(item) => onSelect(item.value)}
        containerStyle={styles.dropdownContainer}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        renderItem={renderItem}
        iconStyle={styles.iconStyle}
        activeColor="#dcedc8"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
    color: "black",
  },
  dropdown: {
    borderWidth: 2,
    borderColor: "black",
    padding: 12,
    marginBottom: 12,
    borderRadius: 30,
    width: 200,
    backgroundColor: "#f1f8e9",
  },
  dropdownContainer: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 12,
    backgroundColor: "#f1f8e9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#666",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "black",
    fontWeight: "600",
  },
  itemTextStyle: {
    fontSize: 16,
    color: "black",
  },
  itemContainerStyle: {
    padding: 12,
  },
  firstItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#dcedc8",
  },
  iconStyle: {
    width: 20,
    height: 20,
    tintColor: "black",
  },
});
