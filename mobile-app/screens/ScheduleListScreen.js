import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';

const ScheduleListScreen = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dropdown Data State
  const [routesList, setRoutesList] = useState([]);
  const [busesList, setBusesList] = useState([]);

  // Form and Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    routeId: '',
    busId: '',
    departureDate: '',
    departureTime: '',
    status: 'Scheduled'
  });

  useEffect(() => {
    fetchSchedules();
    fetchDropdownData();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await api.get('/schedules');
      setSchedules(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [routesResponse, busesResponse] = await Promise.all([
        api.get('/routes'),
        api.get('/buses')
      ]);
      
      // We will log the data here to see why the dropdowns are empty!
      console.log('Routes Data from API:', routesResponse.data);
      console.log('Buses Data from API:', busesResponse.data);

      // Sometimes APIs wrap data in an object. This ensures it's an array.
      const fetchedRoutes = Array.isArray(routesResponse.data) ? routesResponse.data : routesResponse.data.routes || [];
      const fetchedBuses = Array.isArray(busesResponse.data) ? busesResponse.data : busesResponse.data.buses || [];

      setRoutesList(fetchedRoutes);
      setBusesList(fetchedBuses);
    } catch (error) {
      console.error('Error fetching routes or buses. Are the backend endpoints built?', error.message);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Schedule', 'Are you sure you want to delete this schedule?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/schedules/${id}`);
            fetchSchedules();
          } catch (error) {
            console.error('Error deleting schedule:', error);
            Alert.alert('Error', 'Failed to delete schedule.');
          }
        }
      }
    ]);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ routeId: '', busId: '', departureDate: '', departureTime: '', status: 'Scheduled' });
    setModalVisible(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id);
    setFormData({
      routeId: item.routeId ? item.routeId._id : '',
      busId: item.busId ? item.busId._id : '',
      departureDate: item.departureDate ? item.departureDate.split('T')[0] : '',
      departureTime: item.departureTime || '',
      status: item.status || 'Scheduled'
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.routeId || !formData.busId) {
        Alert.alert('Validation Error', 'Please select both a Route and a Bus.');
        return;
      }

      if (editingId) {
        await api.put(`/schedules/${editingId}`, formData);
      } else {
        await api.post('/schedules', formData);
      }
      setModalVisible(false);
      fetchSchedules(); 
    } catch (error) {
      console.error('Error saving schedule:', error);
      Alert.alert('Error', 'Failed to save schedule. Check your inputs.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Route: {item.routeId ? item.routeId.routeName : 'N/A'}</Text>
      <Text style={styles.text}>Bus: {item.busId ? item.busId.busNumber : 'N/A'}</Text>
      <Text style={styles.text}>Date: {new Date(item.departureDate).toLocaleDateString()}</Text>
      <Text style={styles.text}>Time: {item.departureTime}</Text>
      <Text style={[styles.text, styles.statusText]}>{item.status}</Text>
      
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item._id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
        <Text style={styles.addButtonText}>+ Add New Schedule</Text>
      </TouchableOpacity>

      <FlatList
        data={schedules}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.center}>No schedules found.</Text>}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{editingId ? 'Edit Schedule' : 'Create Schedule'}</Text>
          
          <Text style={styles.label}>Select Route</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.routeId}
              onValueChange={(itemValue) => setFormData({ ...formData, routeId: itemValue })}
            >
              <Picker.Item label="-- Choose a Route --" value="" color="#888" />
              {routesList.map((route) => (
                <Picker.Item key={route._id} label={route.routeName} value={route._id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Select Bus</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.busId}
              onValueChange={(itemValue) => setFormData({ ...formData, busId: itemValue })}
            >
              <Picker.Item label="-- Choose a Bus --" value="" color="#888" />
              {busesList.map((bus) => (
                <Picker.Item key={bus._id} label={`${bus.busNumber} (${bus.type})`} value={bus._id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Departure Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="2026-04-25"
            value={formData.departureDate}
            onChangeText={(text) => setFormData({ ...formData, departureDate: text })}
          />

          <Text style={styles.label}>Departure Time (HH:MM)</Text>
          <TextInput
            style={styles.input}
            placeholder="14:30"
            value={formData.departureTime}
            onChangeText={(text) => setFormData({ ...formData, departureTime: text })}
          />

          <Text style={styles.label}>Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.status}
              onValueChange={(itemValue) => setFormData({ ...formData, status: itemValue })}
            >
              <Picker.Item label="Scheduled" value="Scheduled" />
              <Picker.Item label="In Transit" value="In Transit" />
              <Picker.Item label="Completed" value="Completed" />
              <Picker.Item label="Cancelled" value="Cancelled" />
            </Picker>
          </View>

          <View style={styles.modalActionRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Save Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addButton: { backgroundColor: '#007BFF', padding: 14, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 16, marginBottom: 12, borderRadius: 8, elevation: 2 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  text: { fontSize: 14, color: '#333', marginBottom: 2 },
  statusText: { color: 'green', fontWeight: 'bold', marginTop: 4, marginBottom: 12 },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  editButton: { backgroundColor: '#ffc107', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4 },
  deleteButton: { backgroundColor: '#dc3545', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  
  modalContainer: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 4, color: '#555' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 16, backgroundColor: '#f9f9f9', overflow: 'hidden' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  modalActionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelButton: { backgroundColor: '#6c757d', padding: 14, borderRadius: 8, flex: 0.48, alignItems: 'center' },
  saveButton: { backgroundColor: '#28a745', padding: 14, borderRadius: 8, flex: 0.48, alignItems: 'center' },
});

export default ScheduleListScreen;