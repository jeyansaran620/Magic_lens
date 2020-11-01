function setErrorText(text) {
  document.getElementById("unsuccessful").innerHTML = text || 'மன்னிக்கவும், ஏதோ பிழை நேர்ந்து விட்டது!!! மீண்டும் முயற்ச்சிக்கவும்...';
}

function clearErrorText() {
  document.getElementById("unsuccessful").innerHTML = '';
}

function getLitRefString(array) {
  if (array && array.length) {
    return array.reduce((output, item) => `${output}, ${item.book} ${item.loc}`, '');
  }
  return '';
}

function clearResults() {
  document.getElementById("results").style.display = "none";
  document.getElementById("inputImage").src = '';
  document.getElementById('englishName').innerHTML = '';
  document.getElementById('scientificName').innerHTML = '';
  document.getElementById('score').innerHTML = '';
  document.getElementById('flowerName').innerHTML = '';
  document.getElementById('litRefs').innerHTML = '';
  document.getElementById('notes').innerHTML = '';
}

document.getElementById('form').onsubmit = function (event) {
  event.preventDefault() // prevent form from posting without JS
  var xhttp = new XMLHttpRequest(); // create new AJAX request

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      document.getElementById("loading").innerHTML = '';
      clearErrorText();
      clearResults();

      if (this.status === 200) {
        var responseText = JSON.parse(this.responseText);
        document.getElementById("results").style.display = "block";
        document.getElementById("inputImage").src = responseText.filePath;
        if ('fullyMatched' in responseText.data) {
          document.getElementById('englishName').innerHTML = `<b>ஆங்கிலப் பெயர்:</b> ${(responseText.data.commonNames && responseText.data.commonNames.join(', ')) || 'தெரியவில்லை'}`;
          document.getElementById('scientificName').innerHTML = `<b>அறிவியல் பெயர்:</b> ${responseText.data.scientificName}`;
          document.getElementById('score').innerHTML = `இந்த வகையாய் இருப்பதற்கான நிகழ்தகவு: <b>${responseText.data.score}</b>`;
          if (responseText.data.fullyMatched) {
            document.getElementById('flowerName').innerHTML = `<b>பெயர்:</b> ${responseText.data.name}`;
            document.getElementById('litRefs').innerHTML = `<b>இலக்கியக் குறிப்புகள்:</b> ${getLitRefString(responseText.data.litRef)}`;
            document.getElementById('notes').innerHTML = responseText.data.notes;
          }
        } else {
          setErrorText('மன்னிக்கவும். இது எந்த வகை என எங்களால் கண்டறியமுடியவில்லை.');
        }
      } else {
        setErrorText();
      }
    } else {
      clearErrorText();
      clearResults();64446444644444644444
      document.getElementById("loading").innerHTML = 'தேடல் நடைபெறுகிறது. சிறிது நேரம் காத்திருக்கவும்...';
    }
  }

  xhttp.open("POST", "find-image")
  var formData = new FormData()
  // the text data
  // since inputs allow multi files submission, therefore files are in array
  formData.append('image', document.getElementById('image').files[0])


  console.log(document.getElementById('image'))
  console.log(document.getElementById('image').files)

  // xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  // var data = "name=asdasdasdas&degree=MS";
  xhttp.send(formData)

}