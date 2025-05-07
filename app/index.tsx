import { Text, View, TextInput, Pressable, StyleSheet } from "react-native";
import { SafeAreaView} from "react-native-safe-area-context";
import { useState, useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { data } from '@/data/todos';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';


import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Animated, {LinearTransition} from "react-native-reanimated";

type todoType = {
  id: number;
  title: string;
  completed: boolean;
};


export default function Index() {
  const [todos, setTodos] = useState(data.sort((a,b) => b.id - a.id));
  const [text, setText] = useState('');  
  
  // using ThemeContext to use color mode
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);

  // using fonts (google)
  const [loaded, error] = useFonts({
    Inter_500Medium
  });

  if (!loaded && !error) {
    return null;
  }

  const styles = createStyles(theme, colorScheme);


  const renderItem = ({item}: {item : todoType} ) => (
      <View style={styles.todoItem}>
        <Text 
          style={[styles.todoText, item.completed && styles.completedText]}
          onPress={() => toggleTodo(item.id)}
        >
          {item.title}
        </Text>
        <Pressable onPress={() => removeTodo(item.id)}>
          <MaterialCommunityIcons name="delete-circle-outline" size={36} color="red" selectable={undefined} />
        </Pressable>
      </View>
    )

  const addTodo = () => {
    if (text.trim()) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      setTodos([{ id: newId, title: text, completed: false}, ...todos]);
      setText('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo ))
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id ))
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          placeholder="Add a new todo"
          placeholderTextColor="grey"
          value={text}
          onChangeText={setText}
        />
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
        <Pressable onPress={() => setColorScheme(colorScheme === 'light' ? "dark" : "light")} style={{ marginLeft: 10 }}>
          <Octicons name={colorScheme === "dark" ? "moon" : "sun"} size={36} color={theme.text} selectable={undefined}  style = {{ width: 36}} />
        </Pressable>
      </View>
      <Animated.FlatList 
        data={todos}
        keyExtractor={todo => todo.title}
        renderItem={renderItem}
        contentContainerStyle={{ flexGrow: 1}}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
      />
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      padding: 10,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',

    },
    input: {
      flex: 1,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      minWidth: 0,
      color: theme.text,

    },
    addButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    addButtonText: {
      fontSize: 18,
      color: colorScheme === "dark" ? "black" : "white",
    },
    todoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
      padding: 10,
      borderBottomColor: 'grey',
      borderBottomWidth: 1,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    todoText: {
      flex: 1,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    },
    completedText: {
      textDecorationLine: 'line-through',
      color: 'gray',
    },
  })
}