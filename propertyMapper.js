var threatData;
var allThreats;
var rows = [];
var idFromUrl;
var urlParams = new URLSearchParams(window.location.search);
var categoryList = [];
var selectedThreats = [];

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
    if (urlParams.size > 0) {
      // get clicked id from url
      idFromUrl = urlParams.get("id");
      var propID = document.getElementById(idFromUrl);
      propID.checked = true;
      id_found = false;
      // below code is run if the parent property is selected
      for (let i = 0; i < threatData.properties.length; i++) {
        if (
          threatData.properties[i].isparentProp &&
          threatData.properties[i].id === idFromUrl
        ) {
          updateList(threatData.properties[i].id);
          id_found = true;
        }
      }
      // below code is run if any of the sub properties is selected
      if (!id_found) {
        has_parent(idFromUrl);
      }
    }
  });

fetch("../_data/threats.json")
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  })
  .then((json) => {
    allThreats = json;
    createThreatColumn();
  });

// Displays threats depending on device property checkbox selected
function updatePropertiesNew() {
  var selectedProperties = [];
  var propertiesDiv = document.getElementById("props");
  var propertiesDiv_inner = "";
  selectedThreats = [];
  rows = [];
  for (let i = 0; i < threatData.properties.length; i++) {
    var propID = threatData.properties[i].id;
    var propText = threatData.properties[i].text;
    if (document.getElementById(propID).checked) {
      selectedProperties = selectedProperties.concat(
        threatData.properties[i]["threats"]
      );
      if (selectedProperties.length != 0) {
        propertiesDiv_inner += "<br><b>" + propID + "</b>";
        for (var j = 0; j < selectedProperties.length; j++) {
          selectedThreats.push(selectedProperties[j].id);
          var tid = selectedProperties[j].id;
          var tdesc = selectedProperties[j].text;
          propertiesDiv_inner +=
            "<li><a href='/threats/" +
            tid +
            ".html'>" +
            tid +
            "</a> - " +
            tdesc +
            "</li>";
          rows.push({ tid: tid, tdesc: tdesc, pid: propID, pdesc: propText });
        }
      }
    }

    selectedProperties = [];
  }
  propertiesDiv.innerHTML = "<ul>" + propertiesDiv_inner + "</ul>";
}

function createThreatColumn() {
  dict = [];
  var categoryDict = {};
  for (let threat of allThreats.threats) {
    category = threat.category;
    if (!(category in categoryDict)) {
      categoryDict[category] = [];
    }
    categoryDict[category].push({
      text: threat.id + " - " + threat.text,
      hyperlink: "https://emb3d.mitre.org/threats/" + threat.id + ".html"
    });
  }
  for (let category in categoryDict) {
    categoryList.push({ id: category, threats: categoryDict[category] });
  }
}

// Downloads the current device property-threat selection as a CSV
async function downloadCSV() {
  let columnNames = [];
  for (let i = 65; i <= 90; i++) {
    columnNames.push(String.fromCharCode(i));
  }
  const workbook = new ExcelJS.Workbook();
  const threatSheet = workbook.addWorksheet("Selected Threats");
  var columnIncrement = 0;
  for (let i = 0; i < categoryList.length; i++) {
    threatList = categoryList[i].threats;
    threatList.unshift({
      text: categoryList[i].id,
      hyperlink:
        "https://emb3d.mitre.org/threats/" +
        categoryList[i].id.replace(/\s+/g, "-").toLowerCase() +
        ".html",
    });
    threatSheet.getColumn(columnNames[columnIncrement]).values = threatList;
    columnIncrement = columnIncrement + 1;
  }

  // highlight the invoked threats
  threatSheet.eachRow((row) => {
    row.eachCell((cell) => {
      if (selectedThreats.includes(cell.value.text.substring(0, 7))) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "CC66FF" }
        };
      }
      cell.font = { underline: true };
    });
  });

  // sheet formatting
  threatSheet.getColumn(1).width = 58;
  threatSheet.getColumn(2).width = 54;
  threatSheet.getColumn(3).width = 57;
  threatSheet.getColumn(4).width = 43;
  threatSheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
  threatSheet.getCell('A1').font = { name: 'Arial Black', family: 2, size: 13, bold: true };
  threatSheet.getCell('B1').alignment = { vertical: 'middle', horizontal: 'center' };
  threatSheet.getCell('B1').font = { name: 'Arial Black', family: 2, size: 13, bold: true };
  threatSheet.getCell('C1').alignment = { vertical: 'middle', horizontal: 'center' };
  threatSheet.getCell('C1').font = { name: 'Arial Black', family: 2, size: 13, bold: true };
  threatSheet.getCell('D1').alignment = { vertical: 'middle', horizontal: 'center' };
  threatSheet.getCell('D1').font = { name: 'Arial Black', family: 2, size: 13, bold: true };
  

  const propertySheet = workbook.addWorksheet("Selected Properties");
  propertySheet.columns = [
    { header: "Threat ID", key: "tid", width: 10 },
    { header: "Threat Description", key: "tdesc", width: 51 },
    { header: "Device Property ID", key: "pid", width: 18 },
    { header: "Device Property Description", key: "pdesc", width: 95 }
  ];
  rows.forEach(function (rowArray) {
    propertySheet.addRow({
      tid: {
        text: rowArray.tid,
        hyperlink: "https://emb3d.mitre.org/threats/" + rowArray.tid + ".html"
      },
      tdesc: rowArray.tdesc,
      pid: {
        text: rowArray.pid,
        hyperlink:
          "https://emb3d.mitre.org/properties-mapper/?id=" + rowArray.pid
      },
      pdesc: rowArray.pdesc
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

  // sheet formatting
  propertySheet.getCell('A1').font = { size: 13, bold: true}
  propertySheet.getCell('B1').font = { size: 13, bold: true}
  propertySheet.getCell('C1').font = { size: 13, bold: true}
  propertySheet.getCell('D1').font = { size: 13, bold: true}

  const buffer = await workbook.xlsx.writeBuffer();
  // Create a blob from the buffer and create a link to download it
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "heat_map.xlsx";
  a.click();
}

// Uses the updateList_helper() function to accurately hide/display sub properties until their parent property is checked/unchecked
function updateList(parent) {
  for (let i = 0; i < threatData.properties.length; i++) {
    if (
      parent == threatData.properties[i].id &&
      threatData.properties[i].subProps.length != 0
    ) {
      has_subprop = true;
      updateList_helper(parent, threatData.properties[i].subProps, has_subprop);
    }
    if (threatData.properties[i].subProps.length == 0) {
      has_subprop = false;
      updateList_helper(parent, threatData.properties[i].subProps, has_subprop);
    }
  }
}

// this function is run when there is a property id in the url
// recursively checks the parent checkbox so that the checkboxes are accurately selected and displayed
function has_parent(child) {
  for (let i = 0; i < threatData.properties.length; i++) {
    for (let j = 0; j < threatData.properties[i].subProps.length; j++) {
      if (threatData.properties[i].subProps[j] === child) {
        const propID = document.getElementById(threatData.properties[i].id);
        if (propID) {
          propID.checked = true;
          // Recursively check the parent
          has_parent(threatData.properties[i].id);
          updateList(threatData.properties[i].id);
        }
        return; // Exit the loop
      }
    }
  }
}

// Helps the updateList() function to accurately hide/display sub properties until their parent property is checked/unchecked
// Depending on the selction, the updatePropertiesNew() function displays the corresponding threats
function updateList_helper(parent, child, has_subprop) {
  // if id is present in url then run below code
  if (urlParams.size > 0) {
    has_parent(parent);
    has_subprop = true;
    urlParams = [];
  }
  if (has_subprop) {
    for (let i = 0; i < child.length; i++) {
      const el = document.getElementById(parent);
      parent_margin = document.getElementById(parent).style.marginLeft;
      if (parent_margin == "") {
        parent_margin = "0px";
      }
      if (el.checked) {
        className = document.getElementsByClassName(child[i]);
        className[0].style.marginLeft =
          parseInt(parent_margin.replace(/px/, "")) + 20 + "px";
        for (let j = 0; j < className.length; j++) {
          className[j].style.display = "inline";
        }
        updatePropertiesNew();
      } else {
        className = document.getElementsByClassName(child[i]);
        for (let j = 0; j < className.length; j++) {
          className[j].checked = false;
          className[j].style.display = "none";
        }
        updatePropertiesNew();
      }
      updateList(child[i]);
    }
  } else {
    updatePropertiesNew();
  }
}
