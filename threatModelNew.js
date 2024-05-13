var threatData;
var rows = [];

//Load the json file that contains the threat and device properties mapping
fetch('/assets/deviceprops.json')
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  })
  .then((json) => {
    threatData = json;
  });

// Displays threats depending on device property checkbox selected
function updatePropertiesNew() {
  var selectedProperties = [];
  var propertiesDiv = document.getElementById('props');
  var propertiesDiv_inner = '';
  rows = [];
  var foo = [];
  for (let i = 0; i < threatData.deviceprops.length; i++) {
    var propID = threatData.deviceprops[i].id;
    var propText = threatData.deviceprops[i].text;
    if (document.getElementById(propID).checked) {
      selectedProperties = selectedProperties.concat(
        threatData.deviceprops[i]['threats']
      );
      if (selectedProperties.length != 0) {
        propertiesDiv_inner += '<br><b>' + propID + '</b>';
        for (var j = 0; j < selectedProperties.length; j++) {
          var tid = selectedProperties[j].id;
          var tdesc = selectedProperties[j].threatShort;
          propertiesDiv_inner +=
            "<li><a href='/threats/" +
            tid +
            ".html'>" +
            tid +
            '</a> - ' +
            tdesc +
            '</li>';
          foo.push(tid);
          rows.push([tid, '"' + tdesc + '"', propID, '"' + propText + '"']);
        }
      }
    }

    selectedProperties = [];
    foo = [];
  }
  propertiesDiv.innerHTML = '<ul>' + propertiesDiv_inner + '</ul>';
}

// Downloads the current device property-threat selection as a CSV
function downloadCSV() {
  let csvContent = 'Threat ID, Threat Description, Device Property ID, Device Property Description\r\n';
  rows.forEach(function (rowArray) {
    let row = rowArray.join(',');
    csvContent += row + '\r\n';
  });
  var downloadLink = document.createElement('a');
  var blob = new Blob(['\ufeff', csvContent]);
  var url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = 'data.csv';
  // Add the link to the DOM
  document.body.appendChild(downloadLink);
  // Click the link to start the download
  downloadLink.click();
  // Remove the link from the DOM
  document.body.removeChild(downloadLink);
}

// Uses the updateList_helper() function to accurately hide/display sub properties until their parent property is checked/unchecked
function updateList(parent) {
  for (let i = 0; i < threatData.deviceprops.length; i++) {
    if (
      parent == threatData.deviceprops[i].id &&
      threatData.deviceprops[i].subProps.length != 0
    ) {
      has_subprop = true;
      updateList_helper(
        parent,
        threatData.deviceprops[i].subProps,
        has_subprop
      );
    }
    if (threatData.deviceprops[i].subProps.length == 0) {
      has_subprop = false;
      updateList_helper(
        parent,
        threatData.deviceprops[i].subProps,
        has_subprop
      );
    }
  }
}

// Helps the updateList() function to accurately hide/display sub properties until their parent property is checked/unchecked
// Depending on the selction, the updatePropertiesNew() function displays the corresponding threats
function updateList_helper(parent, child, has_subprop) {
  if (has_subprop) {
    for (let i = 0; i < child.length; i++) {
      const el = document.getElementById(parent);
      parent_margin = document.getElementById(parent).style.marginLeft;
      if (parent_margin == '') {
        parent_margin = '0px';
      }
      if (el.checked) {
        className = document.getElementsByClassName(child[i]);
        className[0].style.marginLeft =
          parseInt(parent_margin.replace(/px/, '')) + 20 + 'px';
        for (let j = 0; j < className.length; j++) {
          className[j].style.display = 'inline';
        }
        updatePropertiesNew();
      } else {
        className = document.getElementsByClassName(child[i]);
        for (let j = 0; j < className.length; j++) {
          className[j].checked = false;
          className[j].style.display = 'none';
        }
        updatePropertiesNew();
      }
      updateList(child[i]);
    }
  } else {
    updatePropertiesNew();
  }
}
