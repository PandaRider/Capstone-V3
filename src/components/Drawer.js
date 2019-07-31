import React from "react";
import { StyleSheet } from "react-native";
import { DrawerItems } from "react-navigation";
import { Container, Content, Header, Body } from "native-base";

export default props => (
  <Container>
    <Header style={styles.drawerHeader}>
      <Body />
    </Header>
    <Content>
      <DrawerItems {...props} />
    </Content>
  </Container>
);

const styles = StyleSheet.create({
  drawerHeader: {
    height: 100,
    backgroundColor: "white"
  },
  drawerImage: {
    height: 150,
    width: 150,
    borderRadius: 75
  }
});
