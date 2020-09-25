/* Author : Muhammad Arif Uddin
GitHub : GitHub.com/arif-un */

let pageX, pageY, primary_tran, target_tran, popAllow;
let show = false;
let target = false;
let selection = "";
let lang = ["Afrikaans", "Albanian", "Arabic", "Azerbaijani", "Basque", "Bengali", "Belarusian", "Bulgarian", "Catalan", "Chinese Simplified", "Chinese Traditional", "Croatian", "Czech", "Danish", "Dutch", "English", "Esperanto", "Estonian", "Filipino", "Finnish", "French", "Galician", "Georgian", "German", "Greek", "Gujarati", "Haitian Creole", "Hebrew", "Hindi", "Hungarian", "Icelandic", "Indonesian", "Irish", "Italian", "Japanese", "Kannada", "Korean", "Latin", "Latvian", "Lithuanian", "Macedonian", "Malay", "Maltese", "Norwegian", "Persian", "Polish", "Portuguese", "Romanian", "Russian", "Serbian", "Slovak", "Slovenian", "Spanish", "Swahili", "Swedish", "Tamil", "Telugu", "Thai", "Turkish", "Ukrainian", "Urdu", "Vietnamese", "Welsh", "Yiddish"];
let langCode = ["af", "sq", "ar", "az", "eu", "bn", "be", "bg", "ca", "zh-CN", "zh-TW", "hr", "cs", "da", "nl", "en", "eo", "et", "tl", "fi", "fr", "gl", "ka", "de", "el", "gu", "ht", "iw", "hi", "hu", "is", "id", "ga", "it", "ja", "kn", "ko", "la", "lv", "lt", "mk", "ms", "mt", "no", "fa", "pl", "pt", "ro", "ru", "sr", "sk", "sl", "es", "sw", "sv", "ta", "te", "th", "tr", "uk", "ur", "vi", "cy", "yi"];

//read config
chrome.storage.sync.get(["primaryTranslate"], result => {
  primary_tran = result.primaryTranslate == undefined ? "en" : result.primaryTranslate;
});
chrome.storage.sync.get(["targetTranslate"], result => {
  target_tran = result.targetTranslate == undefined ? "ru" : result.targetTranslate;
});
chrome.storage.sync.get(["pop_win"], result => {
  popAllow = result.pop_win == undefined ? false : result.pop_win;
});


// popup element
let div = document.createElement("div");
div.id = "____tooltip";
div.innerHTML = `<a id="__search"><img title="Search" src='${chrome.runtime.getURL("data/search.png")}'></a>
                 <a id="__copy" ><img title="Copy" src='${chrome.runtime.getURL("data/copy.png")}'></a>
                 <a id="__translate" ><img title="Translate" src='${chrome.runtime.getURL("data/translate.png")}'></a>
                 <a id="__anki" ><img title="Add to anki" src='${chrome.runtime.getURL("data/plus-icon.png")}'></a>
                `;

/*  <a id="__currency" ><img src='${chrome.runtime.getURL("data/currency_tk.png")}'></a> */

document.body.appendChild(div);

// Copy Alert element
const CopyAlert = document.createElement("div");
CopyAlert.id = "__cpyAlrt";
CopyAlert.innerHTML = `Copied !`;

document.body.appendChild(CopyAlert);

const currencyPopUp = document.createElement("div");
currencyPopUp.id = "__cuncy_pop";


document.body.appendChild(currencyPopUp);

const transltPopUp = document.createElement("div");
transltPopUp.id = "__trns_pop";

document.body.appendChild(transltPopUp);

// Show pop up
window.addEventListener("mouseup", (event) => {
  selection = getSelectedTxt();
  // get x y pos
  if (event.button == 0 && !target) {
    pageX = event.x - 100;
    event.screenY < 150 ? pageY = event.pageY + 20 : pageY = event.pageY - 75;
  }
  //show pop
  if (selection != "") {
    div.style.opacity = "0.9";
    div.style.display = "flex";

    div.style.top = pageY + "px";
    div.style.left = pageX + "px";

    show = true;
  } else if (selection == "" && show) {
    document.getElementById("____tooltip").style.display = "none";
    currencyPopUp.style.display = "none";
    transltPopUp.style.display = "none";
    show = false;
    target = false;
  }

  updateProfileName();
  translate();
});

//Search Action 
document.getElementById('__search').addEventListener('click', () => {
  div.style.display = "none";
  window.open("https://www.google.com/search?q=" + selection, "_blank");
});

// Copy Action
document.getElementById('__copy').addEventListener('click', () => {
  div.style.display = "none";
  document.execCommand("copy");

  CopyAlert.style.right = 80 + "px";
  setTimeout(function () {
    CopyAlert.style.right = -150 + "px";
  }, 2000);
});

/* //Currency Action
document.getElementById('__currency').addEventListener('click', () => {
  let currency_from = selection.match(/[a-z]+/gi);
  let val = selection.match(/\d+|[.]/g);
  if (currency_from != null && val != null) {
    let number = "";
    if (val.length > 0) {
      for (let i = 0; i < val.length; i++) {
        number += val[i];
      }
    }
    let from = currency_from[0].toUpperCase();
    let to = primary_curr;
    let num = Number(number);
    let from_to = from + "_" + to;

    const url = "https://free.currencyconverterapi.com/api/v5/convert?q=" + from_to;
    fetch(url).then(response => {
      return response.json()
    }).then(data => {
      if (data.query.count > 0) {
        let value = parseFloat(data.results[from_to].val);
        let rounded = value.toFixed(2);
        let output = num * rounded;

        currencyPopUp.innerHTML = to + " " + output;
        currencyPopUp.style.top = pageY + "px";
        currencyPopUp.style.left = pageX + 170 + "px";
        currencyPopUp.style.display = "block";
      } else {
        crrencyErorMsg();
      }

    }).catch((err) => {
      crrencyErorMsg();
      console.log(err);
    })

  } else {
    crrencyErorMsg();
  }

});

//currency err msg
let crrencyErorMsg = () => {
  currencyPopUp.innerHTML = "Error!";
  currencyPopUp.style.top = pageY + "px";
  currencyPopUp.style.left = pageX + 170 + "px";
  currencyPopUp.style.display = "block";
  setTimeout(() => currencyPopUp.style.display = "none", 1000);
}
 */
//translate action 
document.getElementById('__translate').addEventListener('click', () => {

  if (popAllow) {
    let tran_url = `https://translate.google.com/#auto/${primary_tran}/${selection}`;
    let leftPosition = (screen.width) ? (screen.width - 800) / 2 : 100;
    let topPosition = (screen.height) ? (screen.height - 500) / 2 : 100;
    window.open(tran_url, 'Google Translate', `width=800,height=500,top=${topPosition},left=${leftPosition},scrollbars=yes,location=no,directories=no,status=no,menubar=no,toolbar=no,resizable=yes`);
  } else {
    const translate_url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${primary_tran}&dt=t&q=${selection}`;

    fetch(translate_url).then(response => {
      return response.json();
    }).then(data => {

      let langIndx_frm = langCode.indexOf(data[2]);
      let langIndx_to = langCode.indexOf(primary_tran);
      lang[langIndx_frm];

      transltPopUp.innerHTML = `<div><span style="font-weight:bold">${lang[langIndx_frm]} : </span> ${selection}</div>
    <hr style="margin:8px;height:1px">
    <div><span style="font-weight:bold">${lang[langIndx_to]} : </span> ${data[0][0][0]}</div>
    `;
      transltPopUp.style.top = pageY + 100 + "px";
      transltPopUp.style.left = pageX + "px";
      transltPopUp.style.display = "block";
      transltPopUp
    }).catch(err => console.log(err));
  }
});


// tooltip active
document.getElementById('____tooltip').addEventListener("mouseover", function (event) {
  target = true;
});
document.getElementById('____tooltip').addEventListener("mouseleave", function (event) {
  target = false;
});

// get selected text
function getSelectedTxt() {
  let txt = "";

  if (window.getSelection) {
    txt = window.getSelection();
  } else if (document.getSelection) {
    txt = document.getSelection();
  } else if (document.selection) {
    txt = document.selection.createRange().text;
  }

  t = txt.toString();

  return t.trim();
}
//__anki

let selectionYt;
let translationYt;
let profileName;

function updateProfileName(){
  // profileName = document.querySelector("html").lang;
  // profileName = profileName.substring(0, 2);
  profileName = primary_tran
}

document.getElementById('__anki').addEventListener('click', () => {

  youtubeLink = getYtLink();
  selectionYt = selection;

  httpRequestToAnki(selectionYt, translationYt, getYtLink(), false)
});

function getYtLink() {

  let thumbLink = window.location.href;
  let link;
  if (thumbLink.includes("youtube")) {
    let youtubeId = thumbLink.match(/=[^"&?\/\s]{11}/)[0].replace("=", "");
    link = "https://www.youtube.com/watch?v=" + youtubeId;
  }else if  (thumbLink.includes("youglish")) {

    let thumbLink = document.getElementsByClassName("vs-unit slick-slide selected-video slick-active")[0].firstChild.src
    let youtubeId = thumbLink.match(/\/[^"&?\/\s]{11}\//)[0].match(/[^"&?\/\s]{11}/)[0]
    link = "https://www.youtube.com/watch?v=" + youtubeId
  } else {
    link = null;
  }

  return link

}

function translate () {
  if(!selection){
    console.log("no selection");
    return
  }

  let translate_url;
  let useGoogle = true;

  console.log(profileName);

  let langSource = primary_tran;
  let langTarget = target_tran;

  if(useGoogle) {
    translate_url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${langSource}&tl=${langTarget}&dt=t&q=${selection}`;
  }else {
    translate_url = `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20200120T134831Z.fcb4ea0693bf486d.c8f57768820b7afec24833517dd63a3a0dbd3366&lang=${langSource}-${langTarget}&text=${selection}`;
  }

  fetch(translate_url).then(response => {
    return response.json();
  }).then(data => {

    console.log(data);
    if(useGoogle) {
      translationYt = data[0][0][0];
    } else {
      translationYt = data.def[0].tr[0].text;
    }

    transltPopUp.innerHTML = `<div><span style="font-weight:bold">${lang[langCode.indexOf(langSource)]} : </span> ${selection}</div>
    <hr style="margin:8px;height:1px">
    <div><span style="font-weight:bold">${lang[langCode.indexOf(langTarget)]} : </span> ${translationYt}</div>
    `;
    transltPopUp.style.top = pageY + 100 + "px";
    transltPopUp.style.left = pageX + "px";
    transltPopUp.style.display = "block";
    transltPopUp
  }).catch(err => console.log(err));
}

function httpRequestToAnki(word, translation, url, shadowingEnable) {

  let deck;
  let model;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "text/plain;charset=UTF-8");
  myHeaders.append("Origin", "chrome-extension://bgmdidihfjpekadbhmadmebajbcdbkem");

  if(shadowingEnable) {
    deck = settings.profiles[profileName].deckShadowing;
    model = settings.profiles[profileName].modelShadowing;
  } else {
    deck = settings.profiles[profileName].deck;
    model = settings.profiles[profileName].model;
  }


  var body = {
    "action":"addNote",
    "version":6,
    "params":{
      "note":{
        "deckName":deck,
        "modelName":model,
        "fields":{
          "word": word,
          "translation": translation,
          "URL":url ,
          "gif":"",
          "gifAudio":"",
          "yourLangAudio":"",
          "targetLangAudio":"",
          "context":"",
          "contextTranslation":""
        },
        "tags":[
          ""
        ]
      }
    }
  };

  var raw = JSON.stringify(body);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("http://localhost:8765/", requestOptions)
      .then(response => response.text())
      .then(result => checkResponse(result, word))
      .catch(error => alert('error', error));

}

function checkResponse(result, word){
  let parsedResp = JSON.parse(result);
  if(parsedResp.error != null) {
    alert(word + ": "+ parsedResp.error)
  } else {
    alert("added: " + word)
  }
}

let settings = {
  "profiles": {
    "nl": {
      "deck": "Dutch::00. youtube",
      "deckShadowing": "Outloud::Dutch::01. Video shadowing",
      "model": "Youtube-Front-Back",
      "modelShadowing": "Youtube-Front-Back"
    },
    "en": {
      "deck": "Outloud::English::00. youtube",
      "deckShadowing": "Outloud::English::00. youtube",
      "model": "Youtube-Back-Front",
      "modelShadowing": "Youtube-Back-Front"
    }
  }
};