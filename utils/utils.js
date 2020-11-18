const XLSX = require('xlsx');

const exportObjectToExcel = (data, sheetName, excelFile) => {
    let ws = XLSX.utils.json_to_sheet(data);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, excelFile);
};

exports.exportObjectToExcel = exportObjectToExcel;