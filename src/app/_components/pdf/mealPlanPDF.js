import { Document, Image, Page, Text, View } from '@react-pdf/renderer';
import React from 'react'

export default function mealPlanPDF( { data }) {
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontSize: 12,
      fontFamily: '',
    },
    section: {
      marginBottom: 20,
    },
    title: {
      fontSize: 16,
      marginBottom: 10,
      fontWeight: 'bold',
    },
    mealTitle: {
      fontSize: 14,
      marginTop: 10,
      fontWeight: 'semibold',
    },
    image: {
      width: '100%',
      height: 150,
      marginVertical: 5,
      objectFit: 'cover',
    },
  });

    return (
      <Document>
        <Page style={styles.page}>
          <Text style={styles.title}>Meal-Plan</Text>

          {['breakfast', 'lunch', 'dinner'].map((mealType) => (
            <View style={styles.section} key={mealType}>
              <Text style={styles.mealTitle}>{mealType.toUpperCase()}</Text>
              {data[mealType].map((item, idx) => (
                <View key={idx}>
                  <Image src={item.image} style={styles.image} />
                  <Text>{item.title}</Text>
                </View>
              ))}
            </View>
          ))}
        </Page>
      </Document>
    );
}
