
var lastVideoSrc = "";
var btnClassName = ".ytp-ad-skip-button-modern.ytp-button";


const skipAd = async () => {
  let skipBtn = document.querySelector('.ytp-ad-skip-button-modern.ytp-button');
  skipBtn.click();
};



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

const endAnimaiton = async (popupForm,event)=> {
  if (event.animationName == "slide")
  {
    popupForm.remove();
  }
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


var token = true;

async function Start()
{
  token = true;
  console.log("Started!");
  await Process();
  console.log("Stopped!");

}

async function Cancel()
{
  token = false;
  console.log("Cancelling...");

}


async function Process()
{
  let step = 0;

  while (token)
  {

    if (!(await IsElementNull(btnClassName)))
    {
      await skipAd();
      await createPopup();
      console.log(`Ad skipped! (${step})`);
      step = 0;
    }
    else
    {
      // console.log(`Skip button not found. (${step++})`);
    }

    await sleep(100);
  }


  while ((await IsElementNull(btnClassName)) && token)
  {
    
    await sleep(50);
  }
}



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'TabUpdated') {
    console.log("swytadb injected");
    killAd();
  }
  else if (request.message === 'StartProcess') {

    Start();
  }
  else if (request.message === 'StopProcess') {

    Cancel();
  }
})