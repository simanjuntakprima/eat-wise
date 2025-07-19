"use client";

import React, { useMemo } from "react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
  title: { fontSize: 18, marginBottom: 10, textAlign: "center" },
  daySection: { marginBottom: 20 },
  dayTitle: { fontSize: 14, marginBottom: 5 },
  mealItem: { marginBottom: 4 }
});

function MealPlanPDF({ itemsMenu }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Meal Plan</Text>
        {itemsMenu.map((day, idx) => (
          <View key={idx} style={styles.daySection}>
            <Text style={styles.dayTitle}>Day {day.day}</Text>
            {["breakfast", "lunch", "dinner"].map((mealType) => (
              <Text key={mealType} style={styles.mealItem}>
                {mealType.toUpperCase()}: {day[mealType]}
              </Text>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}

export default function ExportMealPlanPDF({ itemsMenu }) {
  const data = useMemo(() => JSON.parse(JSON.stringify(itemsMenu)), [itemsMenu]);

  return (
    <PDFDownloadLink
      document={<MealPlanPDF itemsMenu={data} />}
      fileName={`meal-plan-${Date.now()}.pdf`}
    >
      {({ loading }) => (
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Generating..." : "Download PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
