
var lastVideoSrc = "";
var btnClassName = ".ytp-ad-skip-button-modern.ytp-button";


const skipAd = async () => {
  let skipBtn = document.querySelector('.ytp-ad-skip-button-modern.ytp-button');
  skipBtn.click();
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


async function getIntegerTime()
{
  return parseInt((document.querySelector('.ytp-time-current').textContent).replace(':',''));
}


async function createPopup()
{
  const popupPage = document.createElement("div");
    popupPage.className = "popup-container-sw";
    popupPage.innerHTML = `
    <div class="text-sw">Ad skipped!</div>
    <div class="check-sw">✓</div>
    `;
    document.body.appendChild(popupPage);

    popupPage.addEventListener("animationend", (event) =>  endAnimaiton(popupPage,event));    
}


async function IsNullTryUntilSeconds(sec,className)
{

  let countMs= 0;
  let waitMs = 100;
  let module = document.querySelector(className);
  while (module == null  && countMs < (sec * 1000))
  {
    await sleep(waitMs);
    countMs += waitMs;
    module = document.querySelector(className);
  }

  if (module == null) return true;
  else return false;

}

async function IsElementNull(className)
{

  let module = document.querySelector(className);
  if (module == null)
  {
    return true;
  }
  else return false;

}


async function waitFuncUntilSeconds(sec,func)
{
  let countMs= 0;
  let waitMs = 100;

  let result = await func();
  while (countMs < (sec * 1000) && result == false)
  {
    result = await func();
    await sleep(waitMs);
    countMs += waitMs;
  }

  
  if (result) return true;
  else return false;

}


async function IsVideoChanged()
{

  let newVideoSrc = '';
  let videoPanel =  document.querySelector('.video-stream.html5-main-video') ;
  if (videoPanel != null)  newVideoSrc = videoPanel.src.toString();

  if (lastVideoSrc != newVideoSrc && newVideoSrc != '')
  {
    lastVideoSrc = newVideoSrc;
    return true;
  }
  else
  {
    return false;
  }
}


async function killAd()  {

  if (!(await waitFuncUntilSeconds(5,IsVideoChanged)))
  {
    console.log(`'${'video_stream'}' not found!`);
    return;
  }

  if (await IsNullTryUntilSeconds(3,btnClassName))
  {
    console.log(`'${btnClassName}' not found!`);
    return;
  }
  
  await skipAd();
  await createPopup();
  console.log(`ad skipped!`);

};



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'TabUpdated') {
    console.log("swytadb injected");
    killAd();
  }
})