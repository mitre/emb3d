var threatData;
var mitigationsData;
//Load the json file that contains the threat and device properties mapping
window.onload = () => {
  fetch("../_data/properties_threat_mappings.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((json) => {
      threatData = json;
      var threatTitle = document
        .getElementById("threattitle")
        .innerHTML.replaceAll("\n", "")
        .replaceAll(" ", "");
      getRelatedThreats(threatTitle);
    });

  //Load the json file that contains the threat, device properties and mitigation mappings
  fetch("../_data/threats_properties_mitigations_mappings.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((json) => {
      mitigationsData = json;
      var threatTitle = document
        .getElementById("threattitle")
        .innerHTML.replaceAll("\n", "")
        .replaceAll(" ", "");
      getRelatedMitigations(threatTitle);
    });
};

// Get device properties and threats related to the current one and display as a list on the threat description page
function getRelatedThreats(threatTitle) {
  var foundRelated = false;
  var devpropsID = [];
  var devpropsDesc = [];
  var selectedIDs = [];
  for (let i = 0; i < threatData.properties.length; i++) {
    for (let j = 0; j < threatData.properties[i].threats.length; j++) {
      if (threatTitle == threatData.properties[i].threats[j].id) {
        for (let k = 0; k < threatData.properties[i].threats.length; k++) {
          if (threatTitle == threatData.properties[i].threats[k].id) {
            devpropsID.push(threatData.properties[i].id);
            devpropsDesc.push(threatData.properties[i].text);
            continue;
          }
          selectedIDs.push(threatData.properties[i].threats[k].id);
          foundRelated = true;
        }
      }
    }
  }
  var threatsDiv = document.getElementById("relatedthreats");
  var propertiesDiv = document.getElementById("devprops");
  if (selectedIDs.length != 0) {
    var threatsDiv_inner = "<h2>Related Threats:</h2>";
    for (var i = 0; i < selectedIDs.length - 1; i++) {
      threatsDiv_inner +=
        "<a href='/threats/" +
        selectedIDs[i] +
        ".html'>" +
        selectedIDs[i] +
        "</a>, ";
    }
    threatsDiv_inner +=
      "<a href='/threats/" +
      selectedIDs[selectedIDs.length - 1] +
      ".html'>" +
      selectedIDs[selectedIDs.length - 1] +
      "</a>";
    threatsDiv.innerHTML = threatsDiv_inner;
  }
  var propertiesDiv_inner = "";
  for (var i = 0; i < devpropsID.length; i++) {
    propertiesDiv_inner +=
      "<a href='/properties-mapper/?id=" +
      devpropsID[i] +
      "'>" +
      devpropsID[i] +
      "</a>" +
      " - " +
      devpropsDesc[i] +
      "<br>";
  }
  propertiesDiv.innerHTML = propertiesDiv_inner;
}

// Get mitigations for the current threat
function getRelatedMitigations(threatTitle) {
  var mitigations = [];
  for (let i = 0; i < mitigationsData.threats.length; i++) {
    if (threatTitle == mitigationsData.threats[i].id) {
      for (let j = 0; j < mitigationsData.threats[i].mitigations.length; j++) {
        mitigations.push({
          id: mitigationsData.threats[i].mitigations[j].id,
          desc: mitigationsData.threats[i].mitigations[j].text,
          level: mitigationsData.threats[i].mitigations[j].level
        });
      }
    }
  }

  var mitigationsDiv = document.getElementById("mitigations");
  if (mitigations.length != 0) {
    var foundational = [];
    var intermediate = [];
    var leading = [];
    for (var i = 0; i < mitigations.length; i++) {
      var mitigationText =
        "<a href='/mitigations/" +
        mitigations[i].id +
        ".html'>" +
        mitigations[i].id +
        "</a>" +
        " - " +
        mitigations[i].desc;
      if (mitigations[i].level === "foundational") {
        foundational.push(mitigationText);
      } else if (mitigations[i].level === "intermediate") {
        intermediate.push(mitigationText);
      } else if (mitigations[i].level === "leading") {
        leading.push(mitigationText);
      }
    }
    var mitigationsDiv_inner = "<h2>Mitigations:</h2>";
    mitigationsDiv_inner +=
      '<table class="mitigationsTableOnThreat"><tr class="mitigationTableoOnThreatRow"><th>Foundational</th><th>Intermediate</th><th>Leading</th></tr>';
    mitigationsDiv_inner += "<tr>";
    mitigationsDiv_inner +=
      '<td>' + foundational.join("<br>") + "</td>";
    mitigationsDiv_inner +=
      '<td>' + intermediate.join("<br>") + "</td>";
    mitigationsDiv_inner +=
      '<td>' + leading.join("<br>") + "</td>";
    mitigationsDiv_inner += "</tr></table>";

    mitigationsDiv.innerHTML = mitigationsDiv_inner;
  }
}
