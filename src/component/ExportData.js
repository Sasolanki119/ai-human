import React from 'react';
import * as XLSX from 'xlsx';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig'; // Your firebase configuration

const ExportData = () => {
  const exportToExcel = async () => {
    try {
      // Fetch data from a collection, e.g., 'users'
      const querySnapshot = await getDocs(collection(db, "users"));
      const data = [];
      querySnapshot.forEach((doc) => {
        // Include doc.id if you want, along with the data
        data.push({ id: doc.id, ...doc.data() });
      });

      // Convert JSON data to worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);
      // Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, "users_export.xlsx");
    } catch (error) {
      console.error("Error exporting data: ", error);
    }
  };

  return (
    <div>
      <button onClick={exportToExcel}>Export Data to Excel</button>
    </div>
  );
};

export default ExportData;
