import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderProps {
  title: string;
}

const Header: FC<HeaderProps> = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#F7F3EE', 
    padding: 16,
    marginBottom: 20,
    marginTop: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#635D5A', 
  },
});

export default Header;