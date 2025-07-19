import { Document, Page, StyleSheet,Text, View } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "#eee",
    padding: 4,
    fontWeight: "bold",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 4,
  },
  tableCell: {
    fontSize: 10,
  },
});

export function MealPlanPDF({ itemsMenu }) {
  return React.createElement(
    Document,
    null,
    itemsMenu.map((item, index) =>
      React.createElement(
        Page,
        { key: index, style: styles.page },
        React.createElement(Text, { style: styles.sectionTitle }, `Day ${item.day}`),
        React.createElement(
          View,
          { style: styles.table },
          // Table Header
          React.createElement(
            View,
            { style: styles.tableRow },
            React.createElement(Text, { style: styles.tableColHeader }, "Meal"),
            React.createElement(Text, { style: styles.tableColHeader }, "Dish Name"),
            React.createElement(Text, { style: styles.tableColHeader }, "Ingredients"),
            React.createElement(Text, { style: styles.tableColHeader }, "Instructions")
          ),
          ["breakfast", "lunch", "dinner"].map((meal) =>
            React.createElement(
              View,
              { key: meal, style: styles.tableRow },
              React.createElement(Text, { style: styles.tableCol }, meal),
              React.createElement(Text, { style: styles.tableCol }, item[meal]?.dishName || "-"),
              React.createElement(Text, { style: styles.tableCol }, item[meal]?.ingredients || "-"),
              React.createElement(Text, { style: styles.tableCol }, item[meal]?.instructions || "-")
            )
          )
        )
      )
    )
  );
}
