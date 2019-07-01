import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image
} from "react-native";

import { Container, Content, Icon, Header, Body } from 'native-base'


// ExponentPushToken[d-5SOaPwmwib6k19lSblfe]

// curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/send" -d '{
//   "to": "ExponentPushToken[d-5SOaPwmwib6k19lSblfe]",
//   "title":"hello",
//   "body": "world"
// }'

// {
//   custom_notification: JSON.stringify({
//       "title": "Some title",
//       "body": 'Some body',
//       "sound": 'default',
//       "badge": '1',
//       "priority": "high", 
//       "show_in_foreground": true,
//       "content_available": true
//   })
// };

// {
//   data: {
//       custom_notification: JSON.stringify({
//           title: 'Some title',
//           body: 'Some body',
//           sound: 'default',
//           badge: '1',
//           priority: "high", 
//           show_in_foreground: true,
//           content_available: true
//       })
//   }
// }

// {
//   "title": "Some title",
//   "body": "Some body",
//   "sound": "default",
//   "badge": "1",
//   "priority": "high", 
//   "show_in_foreground": true,
//   "content_available": true
// }