import React, { useState, FC, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from './Header';

interface Item {
  id: number;
  listName: string;
  text: { id: number; text: string; completed: boolean }[];
  completed: boolean;
  isExpanded: boolean;
}

const MainScreen: FC = () => {
  const [lists, setLists] = useState<Item[]>([]);
  const [listName, setListName] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [userName, setUserName] = useState<string | null>('');
  const [showWelcomeMessage, setShowWelcomeMessage] = useState<boolean>(false);

  useEffect(() => {
    
    retrieveUserName();
  }, []);

  const retrieveUserName = async () => {
    try {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName !== null) {
        setUserName(storedName);
        setShowWelcomeMessage(true);
      }
    } catch (error) {
      console.error('Error retrieving user name:', error);
    }
  };

  const saveUserName = async (name: string) => {
    try {
      await AsyncStorage.setItem('userName', name);
      setUserName(name);
      setShowWelcomeMessage(true);
      addList();
    } catch (error) {
      console.error('Error saving user name:', error);
    }
  };

  const addList = () => {
    if (listName.trim() !== '') {
      setLists([
        ...lists,
        { id: Date.now(), listName, text: [], completed: false, isExpanded: false },
      ]);
      setListName('');
    }
  };

  const addItem = (listId: number) => {
    if (text.trim() !== '') {
      setLists(
        lists.map((list) =>
          list.id === listId
            ? { ...list, text: [...list.text, { id: Date.now(), text, completed: false }] }
            : list
        )
      );
      setText('');
    }
  };

  const removeList = (listId: number) => {
    setLists(lists.filter((list) => list.id !== listId));
  };

  const removeItem = (listId: number, itemId: number) => {
    setLists(
      lists.map((list) =>
        list.id === listId
          ? { ...list, text: list.text.filter((item) => item.id !== itemId) }
          : list
      )
    );
  };

  const toggleCompleted = (listId: number, itemId: number) => {
    setLists(
      lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              text: list.text.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              ),
            }
          : list
      )
    );
  };

  const toggleListExpansion = (listId: number) => {
    setLists(
      lists.map((list) =>
        list.id === listId ? { ...list, isExpanded: !list.isExpanded } : list
      )
    );
  };

  const renderList = ({ item }: { item: Item }) => (
    <View style={styles.listContainer}>
      <TouchableOpacity onPress={() => toggleListExpansion(item.id)}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>{item.listName}</Text>
          <MaterialCommunityIcons name="note-edit" size={24} color="#7E675F" />
        </View>
      </TouchableOpacity>
      {item.isExpanded && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Add item..."
            onChangeText={(inputText) => setText(inputText)}
            value={text}
          />
          <TouchableOpacity style={styles.addButton} onPress={() => addItem(item.id)}>
            <Text style={styles.buttonText}>Add Item</Text>
          </TouchableOpacity>
          <FlatList
            data={item.text}
            renderItem={({ item: listItem }) => (
              <View style={styles.listItem}>
                <TouchableOpacity
                  onPress={() => toggleCompleted(item.id, listItem.id)}
                  style={styles.checkbox}
                >
                  {listItem.completed && <View style={styles.checkedCircle} />}
                </TouchableOpacity>
                <Text
                  style={[
                    styles.listItemText,
                    { textDecorationLine: listItem.completed ? 'line-through' : 'none' },
                  ]}
                >
                  {listItem.text}
                </Text>
                <TouchableOpacity onPress={() => removeItem(item.id, listItem.id)}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(listItem) => listItem.id.toString()}
          />
          <TouchableOpacity style={styles.removeListButton} onPress={() => removeList(item.id)}>
            <Text style={styles.removeListButtonText}>Remove List</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderWelcomeMessage = () => {
    return userName && showWelcomeMessage ? (
      <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
    ) : (
      <View style={styles.nameInputContainer}>
        <TextInput
          style={styles.nameInput}
          placeholder="Enter your name..."
          onChangeText={(name) => setUserName(name)}
          onSubmitEditing={() => saveUserName(userName || '')}
        />
        {userName && (
          <TouchableOpacity style={styles.saveButton} onPress={() => saveUserName(userName || '')}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Shopping Lists" />
      {renderWelcomeMessage()}
      <Text style={styles.title}>My Lists</Text>
      <TextInput
        style={styles.input}
        placeholder="Add a new list..."
        onChangeText={(inputText) => setListName(inputText)}
        value={listName}
      />
      <TouchableOpacity style={styles.addButton} onPress={addList}>
        <Text style={styles.buttonText}>Add List</Text>
      </TouchableOpacity>
      <FlatList data={lists} renderItem={renderList} keyExtractor={(list) => list.id.toString()} />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3EE', // Warm beige
    padding: 16,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 16,
    color: '#635D5A', // Muted gray
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#635D5A', // Muted gray
  },
  listContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8D0C7', // Light taupe
    padding: 16,
    marginBottom: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#635D5A', // Muted gray
  },
  input: {
    height: 40,
    borderRadius: 4,
    borderColor: '#D8D0C7',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    color: '#635D5A', // Muted gray
  },
  addButton: {
    backgroundColor: '#A1877D', // Soft taupe
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  removeListButton: {
    backgroundColor: '#8D4B37', // Dusty rose
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 8,
  },
  removeListButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D8D0C7', // Light taupe
    padding: 10,
    marginVertical: 4,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: '#635D5A', // Muted gray
  },
  removeButtonText: {
    color: '#A62C1F', // Dark coral
    marginLeft: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    marginRight: 8,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#A1877D', // Soft taupe
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#A1877D', // Soft taupe
  },
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameInput: {
    flex: 1,
    height: 40,
    borderRadius: 4,
    borderColor: '#D8D0C7',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    color: '#635D5A', // Muted gray
  },
  saveButton: {
    backgroundColor: '#A1877D', // Soft taupe
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 8,
  },
});


export default MainScreen;