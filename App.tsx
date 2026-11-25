import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TelaInicial from './src/screens/TelaInicial';
import TelaCadastro from './src/screens/TelaCadastro';
import TelaDetalhes from './src/screens/TelaDetalhes';
import TelaSobre from './src/screens/TelaSobre';
import Icone from './src/components/Icone';
import { Medicamento } from './src/types/Medicamento';

type RootStackParamList = {
  HomeTabs: undefined;
  Cadastro: { medicamento?: Medicamento };
  Detalhes: { medicamento: Medicamento };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E11D48',
        tabBarInactiveTintColor: '#A8A29E',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#FECDD3',
          borderTopWidth: 1,
          height: 66,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 10,
          shadowColor: '#881337',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Medicamentos"
        component={TelaInicial}
        options={{
          tabBarIcon: ({ color }) => (
            <Icone nome="pilula" tamanho={22} cor={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Sobre"
        component={TelaSobre}
        options={{
          tabBarIcon: ({ color }) => (
            <Icone nome="coracao" tamanho={22} cor={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#881337' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cadastro"
          component={TelaCadastro}
          options={({ route }) => ({
            title: route.params?.medicamento ? 'Editar Medicamento' : 'Novo Medicamento',
          })}
        />
        <Stack.Screen
          name="Detalhes"
          component={TelaDetalhes}
          options={{ title: 'Detalhes' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
