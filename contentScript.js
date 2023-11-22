const skipAd = async () => {
  let skipBtn = document.querySelector('.ytp-ad-skip-button-modern.ytp-button');
  skipBtn.click();
  console.log("Reklam geçilmesi istendi.");
};


const endAnimaiton = async (popupForm,event)=> {
  if (event.animationName == "slide")
  {
    popupForm.remove();
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createPopup()
{
  const popupPage = document.createElement("div");
    popupPage.className = "popup-container-sw";
    popupPage.innerHTML = `
    <div class="text" id="mainText">Ad skipped!</div>
    <div class="text" id="check">✓</div>
    `;
    document.body.appendChild(popupPage);

    popupPage.addEventListener("animationend", (event) =>  endAnimaiton(popupPage,event));    
}

async function ytmodule()
{
  let ytm = document.querySelector('.ytp-chrome-bottom');

  while (ytm == null)
  {
    console.log("Module bekleniyor...");
    await sleep(200);
    ytm = document.querySelector('.ytp-chrome-bottom');
  }

}

const killAd = async () => {

    await ytmodule();

    let module = document.querySelector('.video-ads.ytp-ad-module');
    if (module == null)
    {
      console.log("Reklam çıkmadı! (Modul bulunamadı.)");
      return;
    }

    let adElementCount = document.querySelector('.video-ads.ytp-ad-module').childElementCount;

    if (adElementCount == 0)
    {
      console.log(adElementCount);
      console.log("Reklam çıkmadı! (Modül bulundu.)");
      return;
    }

    while (adElementCount == 1)
    {
      console.log("Reklam farkedildi.");
      await skipAd();
      await sleep(200);
      adElementCount = document.querySelector('.video-ads.ytp-ad-module').childElementCount;
    }

    console.log("Reklam geçme başarılı!");
    createPopup();
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'TabUpdated') {
    killAd();
  }
})