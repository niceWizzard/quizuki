import React from 'react';
import {Tabs} from "expo-router";
import {View} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";

const TabsLayout = () => {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    headerTitle: "Quiz",
                    tabBarIcon: ({ color,focused }) => (
                        <View>
                            <MaterialIcons name="quiz" size={ focused ? 26 : 24} color={color} />
                        </View>
                    ),
                    tabBarLabel: "Quiz",
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    headerTitle: "History",
                    tabBarLabel: "History",
                    tabBarIcon: ({ color,focused }) => (
                        <View>
                            <MaterialIcons name="history" size={ focused ? 26 : 24} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    headerTitle: "Settings",
                    tabBarIcon: ({ color,focused }) => (
                        <View>
                            <MaterialIcons name="settings" size={ focused ? 26 : 24} color={color} />
                        </View>
                    ),
                    tabBarLabel: "Settings",
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;