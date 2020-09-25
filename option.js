/* Author : Muhammad Arif Uddin
GitHub : GitHub.com/arif-un */

let translate_select = document.getElementById("translate");
let target_lang_select = document.getElementById("targetLang");
//let currency_select = document.getElementById("currency");
let pop_true = document.getElementById('pop-true');
let pop_false = document.getElementById('pop-false');

//default settings to storage
chrome.storage.sync.get(["primaryTranslate"], result => {
  let val = result.primaryTranslate == undefined ? "en" : result.primaryTranslate;
  translate_select.value = val;
  chrome.storage.sync.set({ primaryTranslate: val });
});

chrome.storage.sync.get(["targetTranslate"], result => {
  let val = result.targetTranslate == undefined ? "ru" : result.targetTranslate;
  target_lang_select.value = val;
  chrome.storage.sync.set({ targetTranslate: val });
  // console.log(val);
});

chrome.storage.sync.get(["pop_win"], result => {
  let popAllow = result.pop_win == undefined ? false : result.pop_win;
  popAllow ? pop_true.checked = true : pop_false.checked = true;
  chrome.storage.sync.set({ pop_win: popAllow });
  // console.log(popAllow);
});

document.getElementById('save').addEventListener("click", () => {
  console.log("save")
  primaryLang = translate_select.value;
  targetLang = target_lang_select.value;
  //c_val = currency_select.value;
  popAllow = pop_true.checked ? true : false;


  console.log(primaryLang)
  console.log(targetLang)
  chrome.storage.sync.set({ primaryTranslate: primaryLang });
  chrome.storage.sync.set({ targetTranslate: targetLang });
  chrome.storage.sync.set({ pop_win: popAllow });

  let save_alrt = document.getElementById('save-alrt');

  save_alrt.style.right = "80px";
  setTimeout(() => { save_alrt.style.right = "-80px"; }, 2000);
});