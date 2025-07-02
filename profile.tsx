import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Bell, LogOut, ChevronRight, User, Shield, CircleHelp as HelpCircle, UserPlus } from 'lucide-react-native';
import { useMedicineContext } from '../../context/MedicineContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { users, activeUser, setActiveUser, addUser, deleteUser } = useMedicineContext();
  const [showUserManagement, setShowUserManagement] = useState(false);

  const handleUserSwitch = async (userId: string) => {
    await setActiveUser(userId);
    Alert.alert(
      "User Switched",
      "You are now managing medicines for this user.",
      [{ text: "OK" }]
    );
  };

  const handleAddUser = () => {
    const newUser = {
      id: Date.now().toString(),
      name: `User ${users.length + 1}`,
      email: `user${users.length + 1}@example.com`,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      isActive: false,
    };
    
    addUser(newUser);
    Alert.alert(
      "User Added",
      "New user has been added successfully.",
      [{ text: "OK" }]
    );
  };

  const handleDeleteUser = (userId: string) => {
    Alert.alert(
      "Delete User",
      "Are you sure you want to delete this user? All their medicine data will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteUser(userId);
            Alert.alert(
              "User Deleted",
              "User has been deleted successfully.",
              [{ text: "OK" }]
            );
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Active User Card */}
        {activeUser && (
          <View style={styles.userCard}>
            <Image 
              source={{ uri: activeUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }} 
              style={styles.userAvatar} 
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{activeUser.name}</Text>
              <Text style={styles.userEmail}>{activeUser.email}</Text>
            </View>
          </View>
        )}

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setShowUserManagement(!showUserManagement)}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <UserPlus size={20} color="#4F46E5" />
              </View>
              <Text style={styles.menuItemText}>Manage Users</Text>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <Bell size={20} color="#4F46E5" />
              </View>
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <Shield size={20} color="#4F46E5" />
              </View>
              <Text style={styles.menuItemText}>Privacy</Text>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <HelpCircle size={20} color="#4F46E5" />
              </View>
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <Settings size={20} color="#4F46E5" />
              </View>
              <Text style={styles.menuItemText}>App Settings</Text>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* User Management Section */}
        {showUserManagement && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>User Management</Text>
              <TouchableOpacity 
                style={styles.addUserButton}
                onPress={handleAddUser}
              >
                <Text style={styles.addUserButtonText}>Add User</Text>
              </TouchableOpacity>
            </View>
            
            {users.map(user => (
              <View key={user.id} style={styles.userListItem}>
                <Image 
                  source={{ uri: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }} 
                  style={styles.userListAvatar} 
                />
                <View style={styles.userListInfo}>
                  <Text style={styles.userListName}>{user.name}</Text>
                  <Text style={styles.userListEmail}>{user.email}</Text>
                </View>
                <View style={styles.userListActions}>
                  {!user.isActive && (
                    <TouchableOpacity 
                      style={styles.switchUserButton}
                      onPress={() => handleUserSwitch(user.id)}
                    >
                      <Text style={styles.switchUserButtonText}>Switch</Text>
                    </TouchableOpacity>
                  )}
                  {users.length > 1 && (
                    <TouchableOpacity 
                      style={styles.deleteUserButton}
                      onPress={() => handleDeleteUser(user.id)}
                    >
                      <Text style={styles.deleteUserButtonText}>Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>MediFill v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addUserButton: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addUserButtonText: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#374151',
  },
  userListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  userListAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userListInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userListName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  userListEmail: {
    fontSize: 12,
    color: '#6B7280',
  },
  userListActions: {
    flexDirection: 'row',
  },
  switchUserButton: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  switchUserButtonText: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 12,
  },
  deleteUserButton: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteUserButtonText: {
    color: '#B91C1C',
    fontWeight: '600',
    fontSize: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    margin: 20,
    marginTop: 0,
    padding: 15,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: '#B91C1C',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  versionText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
});