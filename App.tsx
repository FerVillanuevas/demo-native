import { StatusBar } from 'expo-status-bar';
import React, {useRef, useEffect} from 'react';
import { StyleSheet, Text, View, Animated, FlatList, Dimensions, SafeAreaView, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Button } from 'expo-ui-kit'
import { BlurView } from 'expo-blur'
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList  } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

interface Slice {
  key: string,
  description: string,
  icon: string,
  headline: string,
  background: string
}

interface ScrollX{
  scrollX: Animated.Value
};

const {width, height} = Dimensions.get('screen');

const DATA:Slice[] = [
  {
    key: "3737577",
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Inventore reiciendis laborum culpa non, unde tenetur a illum ipsa et cupiditate qui minus, voluptatum optio, vitae porro tempora corrupti ducimus asperiores!',
    icon: "https://image.flaticon.com/icons/png/256/3737/3737577.png",
    headline: "Templo",
    background: "red"
  },
  {
    key: "3737617",
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Inventore reiciendis laborum culpa non, unde tenetur a illum ipsa et cupiditate qui minus, voluptatum optio, vitae porro tempora corrupti ducimus asperiores!',
    icon: "https://image.flaticon.com/icons/png/256/3737/3737617.png",
    headline: "Papiro",
    background: "rgb(243,124,190)"
  },
  {
    key: "3737540",
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Inventore reiciendis laborum culpa non, unde tenetur a illum ipsa et cupiditate qui minus, voluptatum optio, vitae porro tempora corrupti ducimus asperiores!',
    icon: "https://image.flaticon.com/icons/png/256/3737/3737540.png",
    headline: "Ying/Yang",
    background: "#333"
  },
  {
    key: "3571780",
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Inventore reiciendis laborum culpa non, unde tenetur a illum ipsa et cupiditate qui minus, voluptatum optio, vitae porro tempora corrupti ducimus asperiores!',
    icon: "https://image.flaticon.com/icons/png/256/3571/3571780.png",
    headline: "Ying/Yang",
    background: "tomato"
  }
]

const Indicators = ({scrollX}: ScrollX) => {
  
  return (<View style={{ flexDirection:"row", width, position:'absolute', bottom:100, justifyContent:"center", alignItems:"center" }}>
    {
      DATA.map((_, i) => {
        const inputRange = [(i-1) * width, i * width, (i+1) * width];
        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.8, 1.5, 0.8], 
          extrapolate: "clamp"
        })
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3], 
          extrapolate: "clamp"
        })
        return <Animated.View key={`indicator-${i}`} style={{ 
          width:10, 
          height:10, 
          backgroundColor:"black", 
          borderRadius:5, 
          margin:10,
          transform: [
            {scale}
          ],
          opacity
        }}/>
      })
    }
  </View>)
}

const BackDrop = ({scrollX}: ScrollX) => {
  const backgroundColor = scrollX.interpolate({
    inputRange: DATA.map((_, i) => i * width),
    outputRange: DATA.map(({background}) => background)
  });
  return (<Animated.View 
    style={[StyleSheet.absoluteFill, {
      backgroundColor
    }]}
  />)
}


const DrawerContent = (props: any) => {
  return (
      <BlurView intensity={100} style={[StyleSheet.absoluteFill]}>
        <DrawerContentScrollView {...props}>
          <DrawerItemList activeTintColor="white" inactiveTintColor="#333" {...props} />
        </DrawerContentScrollView>
      </BlurView>
  );
}

const HomeScreen = () => {
  const scrollX = useRef(new Animated.Value(0)).current
  return (<SafeAreaView style={styles.container}>
    <StatusBar hidden />
    <BackDrop scrollX={scrollX} />

    <Animated.FlatList 
      data={DATA}
      horizontal
      style={{ width }}
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.key}
      onScroll={Animated.event([{
        nativeEvent: {contentOffset: {x: scrollX}}
      }],{useNativeDriver: false})}
      renderItem={({item}) => {
        return (
          <View style={{ width, alignItems:"center", justifyContent:"space-around" }}>
            <View style={{ flex:0.7, justifyContent:"center" }}>
              <Image source={{ uri: item.icon }} style={{ width: width/2, height: width/2, resizeMode:"contain" }}/>
            </View>
            <View style={{ flex:0.3 }}>
              <Text>{item.headline}</Text>
            </View>
          </View>
        )
      }}
    /> 
    <Indicators scrollX={scrollX} />
  </SafeAreaView>);
}


const StackScreen = ({navigation}: any) => {
  return (
    <Stack.Navigator screenOptions={{ 
      headerTransparent:true,
      headerTitle: '',
      headerLeft: () => {
        return (<Button transparent padding onPress={() => navigation.openDrawer()}>
          <AntDesign name="menuunfold" style={{ fontSize:20 }}/>  
        </Button>)
      }
     }}>
        <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  )
}

const DemoScreen = () => {
  return (<View style={[StyleSheet.absoluteFill, {flex:1, backgroundColor:"#222", justifyContent:"center", alignContent:"center"}]}>
    <Text style={{ color:"white", fontSize:28, textAlign:"center" }}>Demo Screen</Text>
  </View>)
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator overlayColor="0" sceneContainerStyle={{ backgroundColor:"red" }} drawerStyle={{ width, backgroundColor: "transparent" }} initialRouteName="Home" drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen name="Stack" component={StackScreen} />
        <Drawer.Screen name="Demo" component={DemoScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
