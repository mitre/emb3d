var threatData;

//Load the json file that contains the threat and device properties mapping
window.onload = (event) => {
  fetch('/assets/deviceprops.json')
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((json) => {
      threatData = json;
      var threatTitle = document
        .getElementById('threattitle')
        .innerHTML.replaceAll('\n', '')
        .replaceAll(' ', '');
      getRelatedThreats(threatTitle);
    });
};

// Get device properties and threats related to the current one and display as a list on the threat description page
function getRelatedThreats(threatTitle) {
  var foundRelated = false;
  var devpropsID = [];
  var devpropsDesc = [];
  var selectedIDs = [];
  for (let i = 0; i < threatData.deviceprops.length; i++) {
    for (let j = 0; j < threatData.deviceprops[i].threats.length; j++) {
      if (threatTitle == threatData.deviceprops[i].threats[j].id) {
        for (let k = 0; k < threatData.deviceprops[i].threats.length; k++) {
          if (threatTitle == threatData.deviceprops[i].threats[k].id) {
            devpropsID.push(threatData.deviceprops[i].id);
            devpropsDesc.push(threatData.deviceprops[i].text);
            continue;
          }
          selectedIDs.push(threatData.deviceprops[i].threats[k].id);
          foundRelated = true;
        }
      }
    }
  }
  var threatsDiv = document.getElementById('relatedthreats');
  var propertiesDiv = document.getElementById('devprops');
  if(selectedIDs.length != 0){
    var threatsDiv_inner = '<h2>Related Threats:</h2>';
    for (var i = 0; i < selectedIDs.length - 1; i++) {
      threatsDiv_inner +=
        "<a href='/threats/" +
        selectedIDs[i] +
        ".html'>" +
        selectedIDs[i] +
        '</a>, ';
    }
    threatsDiv_inner +=
    "<a href='/threats/" +
    selectedIDs[selectedIDs.length - 1] +
    ".html'>" +
    selectedIDs[selectedIDs.length - 1] +
    '</a>';
  threatsDiv.innerHTML = threatsDiv_inner;
  }
  var propertiesDiv_inner = '';
  for (var i = 0; i < devpropsID.length; i++) {
    propertiesDiv_inner += devpropsID[i] + " - " + devpropsDesc[i] + "<br>"
  }
  propertiesDiv.innerHTML = propertiesDiv_inner;
}
