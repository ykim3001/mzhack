import React, { useState } from 'react';
import { CheckBox } from 'react-native-elements';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const events = [
  { date: '2023-11-20', category: 'Work', title: 'Meeting with Team' },
  { date: '2023-11-21', category: 'Personal', title: 'Doctor Appointment' },
  // ... more events ...
];
const Drawer = createDrawerNavigator();
const w = Dimensions.get('window').width;
const h = Dimensions.get('window').height;
const Arrow = ({ direction }) => {
  return (
    <Text style={{ fontSize: 18 }}>
      {direction === 'left' ? '<' : '>'}
    </Text>
  );
};

function CustomDrawerContent({ navigation, setSelectedCategory }) {
  const [categories, setCategories] = useState([
    { name: 'All', checked: true },
    { name: '교육', checked: false },
    { name: '문화', checked: false },
    { name: '음식', checked: false },
    { name: '종교', checked: false },
    { name: '운동', checked: false },
    // ... add more categories as needed
  ]);

  const handleCategoryChange = (index) => {
    let newCategories = categories.map((category, catIndex) => {
      if (index === 0) { // If 'All' is selected, uncheck all others
        return { ...category, checked: catIndex === 0 };
      } else if (catIndex === 0) { // If any other category is selected, uncheck 'All'
        return { ...category, checked: false };
      } else {
        return catIndex === index ? { ...category, checked: !category.checked } : category;
      }
    });

    setCategories(newCategories);
    const selectedCategories = newCategories.filter(cat => cat.checked).map(cat => cat.name);
    setSelectedCategory(selectedCategories.length === 0 ? 'All' : selectedCategories.join(','));
  };

  // ... (rest of your component code, like rendering the checkboxes)

  return (
    <View style={styles.drawerContainer}>
      {categories.map((category, index) => (
        <TouchableOpacity key={category.name} style={styles.drawerItem} onPress={() => handleCategoryChange(index)}>
          <CheckBox
            checked={category.checked}
            onPress={() => handleCategoryChange(index)}
          />
          <Text style={styles.drawerText}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function MyDrawer({ setSelectedCategory }) {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} setSelectedCategory={setSelectedCategory} />}>
      <Drawer.Screen name="SVK" component={CalendarScreen} />
      {/* No need for individual category screens anymore */}
    </Drawer.Navigator>
  );
}

  

function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredEvents = events.filter(event => 
    selectedCategory === 'All' || event.category === selectedCategory
  );

  // Combine markings for filtered events and selected date
  const markedDates = filteredEvents.reduce((acc, event) => {
    const isSelectedDate = event.date === selectedDate;
    acc[event.date] = {
      ...acc[event.date],
      marked: true,
      dotColor: 'gray',
      selected: isSelectedDate,
      selectedColor: isSelectedDate ? 'orangered' : undefined,
      selectedTextColor: isSelectedDate ? 'white' : undefined,
      selectedFontWeight: isSelectedDate ? 'bold' : undefined,
      borderRadius: isSelectedDate ? 0 : undefined,
    };
    return acc;
  }, {});

  // Ensure selected date styling is retained even if not an event date
  if (!markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: 'orangered',
      selectedTextColor: 'white',
      selectedFontWeight: 'bold',
      dotColor: 'gray',
      borderRadius: 0,
    };
  }

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    console.log('selected day', day);
  };
  // const markedDates = {
  //   [selectedDate]: {
  //     selected: true,
  //     selectedColor: 'orangered',
  //     selectedTextColor: 'white',
  //     selectedFontWeight: 'bold',
  //     borderRadius: 0,
  //   },
  //   text: {
  //     color: 'white',
  //     fontWeight: 'bold',
  //   }
  // };
  const customStyle = {
    'stylesheet.calendar.header': {
      week: {
        marginTop: 5, // Adjust this value to change the gap after the month/year
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
    },
    // Customizing the day cell style to make it bigger
    'stylesheet.day.basic': {
      // container: {
      //   width: 120,  // Adjust the width
      //   height: 120, // Adjust the height
      //   alignItems: 'center',
      // },
      monthText: {
        fontWeight: '400', // Make the month text bold
        fontSize: 18,
      },
      base: {
        width: 60,      // Adjust the width of the day cell
        height: (h - 200) / 8.5, // Adjust the height relative to the calendar height
        alignItems: 'center',
      },
      text: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '400',
      },
    },
  };
  const currentDate = new Date().toISOString().split('T')[0];
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          {/* <Text style={styles.menuButton}>Menu</Text> */}
        </TouchableOpacity>
      <Calendar
        // Initially visible month. Default = Date()
        current={currentDate}
        // Handler which gets executed on day press. Default = undefined
        onDayPress={onDayPress}
        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
        monthFormat={'MMMM yyyy'}
        // Do not show days of other months in month page. Default = false
        hideExtraDays={true}
        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
        firstDay={1}
        // Hide day names. Default = false
        hideDayNames={false}
        // Show week numbers to the left. Default = false
        showWeekNumbers={false}
        // Disable left/right swipe gestures. Default = false
        disableSwipe={true}
        // Replace default arrows with custom ones (direction can be 'left' or 'right')
        renderArrow={(direction) => (<Arrow direction = {direction}/>)}
        markedDates = {markedDates}
        theme={customStyle}
        style={{
          marginTop: 5,
          borderWidth: 0,
          borderColor: 'gray',
          height: h - 200,
          width: w,
          // height: screenHeight - (headerHeight + footerHeight), // Example if you have headers or footers
          // day: { 
          //   width: 60,  
          //   height: 400, 
          // },
        }}
        // Enable the option to swipe between months. Default = false
        enableSwipeMonths={true}
      />
    </View>
  );
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <NavigationContainer>
      <MyDrawer setSelectedCategory={setSelectedCategory} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  calendarStyle: {
    marginTop: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    height: 60, // Adjust as needed
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#f0f0f0', // Adjust color as needed
    paddingHorizontal: 10,
  },
  menuButton: {
    fontSize: 18,
    color: '#000', // Adjust color as needed
  },
  drawerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Center content horizontally
  },
  drawerItem: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Center items vertically in the row
    padding: 10,
    width: '100%', // Set width to fill the drawer width
  },
  drawerText: {
    marginLeft: 10,
  },
});
