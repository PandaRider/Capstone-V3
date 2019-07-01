import React from "react";
import { StyleSheet } from "react-native";
import { DrawerItems } from "react-navigation";
import { Container, Content, Header, Body } from "native-base";

export default props => (
  <Container>
    <Header style={styles.drawerHeader}>
      <Body>
        {/* <Image
          style={styles.drawerImage}
          source={require('./assets/DrawerIcons/Unsure-Programmer-Logo.png')} /> */}
      </Body>
    </Header>
    <Content>
      <DrawerItems {...props} />
      {/* <Button title="Logout" onPress={DO_SOMETHING_HERE}/> */}
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
