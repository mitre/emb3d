var threatData;
var rows = [];

//Load the json file that contains the threat and device properties mapping
fetch("../_data/properties_threat_mappings.json")
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  })
  .then((json) => {
    threatData = json;
    generateData();
  });

function generateData() {
  for (let i = 0; i < threatData.properties.length; i++) {
    var propID = threatData.properties[i].id;
    var propText = threatData.properties[i].text;
    for (let j = 0; j < threatData.properties[i].threats.length; j++) {
      rows.push({
        pid: propID,
        pdesc: propText,
        tid: threatData.properties[i].threats[j].id,
        tdesc: threatData.properties[i].threats[j].text
      });
    }
  }
}

function getData(propertyID) {
  for (let i = 0; i < threatData.properties.length; i++) {
    if (threatData.properties[i].id == propertyID) {
      return threatData.properties[i].threats.length;
    }
  }
}
async function downloadCSV() {
  let columnNames = [];
  for (let i = 65; i <= 90; i++) {
    columnNames.push(String.fromCharCode(i));
  }
  const workbook = new ExcelJS.Workbook();
  const propertySheet = workbook.addWorksheet("Properties List");
  propertySheet.columns = [
    { header: "Device Property ID", key: "pid", width: 15 },
    { header: "Device Property Description", key: "pdesc", width: 50 },
    { header: "Threat ID", key: "tid", width: 10 },
    { header: "Threat Description", key: "tdesc", width: 50 }
  ];
  rows.forEach(function (rowArray) {
    propertySheet.addRow({
      pid: {
        text: rowArray.pid,
        hyperlink:
          "https://emb3d.mitre.org/properties-mapper/?id=" + rowArray.pid
      },
      pdesc: rowArray.pdesc,
      tid: {
        text: rowArray.tid,
        hyperlink: "https://emb3d.mitre.org/threats/" + rowArray.tid + ".html"
      },
      tdesc: rowArray.tdesc
    });
  });
  let websiteColumn = propertySheet.getColumn("tid");
  // Iterate over the cells in the column
  websiteColumn.eachCell((cell, rowNumber) => {
    // Skip the header row
    if (rowNumber === 1) return;
    // Set the font style to underline
    cell.font = { underline: true };
  });

  let propertiesColumn = propertySheet.getColumn("pid");
  propertiesColumn.eachCell((cell, rowNumber) => {
    // Skip the header row
    if (rowNumber === 1) return;
    // Set the font style to underline
    cell.font = { underline: true };
  });

  // Merge the cells
  for (let i = 2; i <= propertySheet.rowCount; i++) {
    var val = propertySheet.getRow(i).getCell(1).value.text;
    var threatLength = getData(val);
    propertySheet.mergeCells("A" + i + ":A" + (i + threatLength - 1));
    propertySheet.mergeCells("B" + i + ":B" + (i + threatLength - 1));
    i = i + threatLength - 1;
  }

  // Fix alignment
  for (let i = 2; i <= propertySheet.rowCount; i++) {
    let cellColumn1 = propertySheet.getRow(i).getCell(1);
    cellColumn1.alignment = { horizontal: "center", vertical: "middle" };
    let cellColumn2 = propertySheet.getRow(i).getCell(2);
    cellColumn2.alignment = { vertical: "middle" };
  }
  const buffer = await workbook.xlsx.writeBuffer();
  // Create a blob from the buffer and create a link to download it
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "properties_list.xlsx";
  a.click();
}
