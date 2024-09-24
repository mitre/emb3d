var mitigationsData;
//Load the json file that contains the threat and mitigation mappings
window.onload = (event) => {
    fetch('../_data/mitigations_threat_mappings.json')
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((json) => {
      mitigationsData = json;
      var mitigationTitle = document
        .getElementById('mitigationTitle')
        .innerHTML.replaceAll('\n', '')
        .replaceAll(' ', '');
      getRelatedThreats(mitigationTitle);
    });
};

// Get threats mitigated by the current mitigation
function getRelatedThreats(mitigationTitle) {
  var threats = [];
  for (let i = 0; i < mitigationsData.mitigations.length; i++) {
    if (mitigationTitle == mitigationsData.mitigations[i].id) {
      for (let j = 0; j < mitigationsData.mitigations[i].threats.length; j++) {
        threats.push({id: mitigationsData.mitigations[i].threats[j].id, desc: mitigationsData.mitigations[i].threats[j].text})
      }
    }
  }
  var threatsDiv = document.getElementById('relatedthreats');
  if(threats.length != 0){
    var threatsDiv_inner = '<h2>Mitigated Threats:</h2>';
    for (var i = 0; i < threats.length; i++) {
      threatsDiv_inner += "<a href='/threats/" + threats[i].id + ".html'>" + threats[i].id + "</a>" + " - "
      + threats[i].desc + "<br>"
    }
    threatsDiv.innerHTML = threatsDiv_inner;
  }
}