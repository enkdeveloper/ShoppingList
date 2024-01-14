import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

enum Language {
  EN = 'en',
  FI = 'fi',
  SV = 'sv',
  DE = 'de',
}

export interface SettingsScreenProps {
  setLanguage: (language: Language) => void;
  currentLanguage: Language;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ setLanguage, currentLanguage }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(currentLanguage);

  const translations: Record<string, Record<string, string>> = {
    en: {
      shoppingLists: 'Shopping Lists',
      newListName: 'New List Name',
      addList: 'Add List',
      addItem: 'Add Item',
      removeAllItems: 'Remove All Items',
      removeCompletedItems: 'Remove Completed Items',
      removeList: 'Remove List',
    },
    fi: {
      shoppingLists: 'Ostoslistat',
      newListName: 'Uusi luettelon nimi',
      addList: 'Lisää lista',
      addItem: 'Lisää tuote',
      removeAllItems: 'Poista kaikki kohteet',
      removeCompletedItems: 'Poista valmiit kohteet',
      removeList: 'Poista lista',
    },
    sv: {
      shoppingLists: 'Inköpslistor',
      newListName: 'Nytt listnamn',
      addList: 'Lägg till lista',
      addItem: 'Lägg till objekt',
      removeAllItems: 'Ta bort alla objekt',
      removeCompletedItems: 'Ta bort avslutade objekt',
      removeList: 'Ta bort lista',
    },
    de: {
      shoppingLists: 'Einkaufslisten',
      newListName: 'Neuer Listenname',
      addList: 'Liste hinzufügen',
      addItem: 'Element hinzufügen',
      removeAllItems: 'Alle Elemente entfernen',
      removeCompletedItems: 'Abgeschlossene Elemente entfernen',
      removeList: 'Liste entfernen',
    },
  };

  const colors = {
    primary: '#3E7CB1',
    secondary: '#A4C3B2',
    accent: '#F26522',
    background: '#F9F6F2',
    text: '#333',
    placeholder: '#888',
    border: '#DDD',
  };

  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = (language: Language) => {
    setSelectedLanguage(language);
    setLanguage(language);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.languageContainer}>
        {Object.keys(translations).map((language) => (
          <TouchableOpacity
            key={language}
            style={[
              styles.languageButton,
              { backgroundColor: language === selectedLanguage ? '#A1877D' : colors.secondary },
            ]}
            onPress={() => changeLanguage(language as Language)}
          >
            <Text style={styles.languageButtonText}>{language}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View>
        <Text>{translations[selectedLanguage]?.shoppingLists}</Text>
        <Text>{translations[selectedLanguage]?.newListName}</Text>
        {/* Add similar Text components for other translated texts as needed */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3EE',
    padding: 16,
  },
  title: {
    marginTop: 50,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    color: '#A1877D',
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },  
  languageButton: {
    padding: 10,
    borderRadius: 5,
    width: 45,
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#8B4513',  
    borderWidth: 1,
    borderColor: '#6A4B3C',  
  },
  
  languageButtonText: {
    color: '#F5F5DC',  
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
