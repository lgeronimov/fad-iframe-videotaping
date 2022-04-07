window.onload = function () {
  initIframe();
};

// events available
const EVENT_MODULE = {
  INIT_MODULE: "INIT_MODULE",
  PROCESS_INIT: "PROCESS_INIT",
  PROCESS_ERROR: "PROCESS_ERROR",
  PROCESS_COMPLETED: "PROCESS_COMPLETED",
  MODULE_READY: "MODULE_READY",
};

// mandatory, videoagreement legend
const LEGEND =
  "Yo Nombre del firmante, con fecha de nacimiento 20 de Junio, con credencial de elector número: 1234134134 declaro que soy Soltero, con ingresos mensuales de $15,667.21, cuento con Casa o depto propio actualmente SI cuento con tarjetas de crédito y reconozco que la información que he proporcionado es verídica_ts";

// optional, the app has default legends and colors
const CUSTOMIZATION = {
  fadCustomization: {
    colors: {
      primary: "#A70635",
      secondary: "#A70635",
      tertiary: "#363636",
    },
    buttons: {
      primary: {
        backgroundColor: "#A70635",
        backgroundColorDisabled: "#dcdcdc",
        labelColor: "#ffffff",
        labelColorDisabled: "#8e8e8e",
        border: "1px solid #A70635",
      },
    },
  },
  moduleCustomization: {
    legends: {
      buttonRecord: "Iniciar grabación_iframe",
      buttonFinish: "Terminar_iframe",
      initializing: "iniciando_iframe",
      processing: "procesando_iframe",
      acceptancetInstruction:
        "Graba el siguiente texto de forma clara y fuerte_iframe",
      recording: "Grabando_iframe",
      focusface: "Enfoca tu rostro dentro de la guía_iframe",
    },
  },
};

// optional, default ID_MEX_FRONT
const IDS_ALLOWED = {
  ID_MEX_FRONT: 'ID_MEX_FRONT',
  ID_MEX_BACK: 'ID_MEX_BACK',
  ID_PASSPORT: 'ID_PASSPORT'
}

// errors
const ERROR_CODE = {
  BROWSER_NOT_SUPPORTED: -1,
  NOT_ACCEPT_CAMERA_PERMISSION: -2,
  VIDEO_CREATION_FAIL: -3,
  MEDIA_RECORDER_ERROR: -4,
  FACE_UNDETECTED: -5,
  REQUIRED_LEGEND: -6,
};

// models
class ResponseEvent {
  event;
  data;
  constructor(event, data) {
    this.event = event;
    this.data = data;
  }
}

class Result {
  video; // video as Blob
  startSecond; // second in which the videoagreement starts
  constructor(data) {
    this.video = data.video;
    this.startSecond = data.startSecond;
  }
}

// subscribe to message event to recive the events from the iframe
window.addEventListener("message", (message) => {
  // IMPORTANT: check the origin of the data
  if (message.origin.includes("firmaautografa.com")) {
    if (message.data.event === EVENT_MODULE.MODULE_READY) { // MODULE_READY
      initModule();
    }
    if (message.data.event === EVENT_MODULE.PROCESS_INIT) { // PROCESS_INIT
      // only informative
      console.log("Process init");
    } else if (message.data.event === EVENT_MODULE.PROCESS_ERROR) { // PRROCESS_ERROR
      console.error(message.data.data);
    } else if (message.data.event === EVENT_MODULE.PROCESS_COMPLETED) { // PROCESS_COMPLETED
      alert("Process completed");
      const result = new Result(message.data.data);
      const videoUrl = URL.createObjectURL(result.video);
      const startSecondResult = result.startSecond;
      // // show result example

      const containerResult = document.getElementById("container-result");
      const containerIframe = document.getElementById("container-iframe-videotaping");
      const videoId = document.getElementById("video-id");
      const startSecond = document.getElementById("startSecond");
      const downloadAncord = document.getElementById("donwload-ancord");

      containerIframe.style.display = "none";
      containerResult.style.display = "flex";
      videoId.src = videoUrl;
      downloadAncord.href = videoUrl;
      startSecond.innerHTML = startSecondResult;
    }
  } else return;
});

function initIframe() {
  // get iframe
  const iframe = document.getElementById("fad-iframe-videotaping");
  // url - https://apiiduat.firmaautografa.com/fad-iframe-videotaping
  const username = "example@email.com";
  const password = "password";
  const url = `https://apiiduat.firmaautografa.com/fad-iframe-videotaping/fad-iframe-videotaping?user=${username}&pwd=${password}`;
  // set src to iframe
  iframe.src = url;
}

function initModule() {
  const iframe = document.getElementById("fad-iframe-videotaping");
  iframe.contentWindow.postMessage(
    new ResponseEvent(EVENT_MODULE.INIT_MODULE, {
      legend: LEGEND,
      customization: CUSTOMIZATION,
      identifications: [{ name: IDS_ALLOWED.ID_MEX_FRONT, title: 'Front example' }],
      recordEverything: true,
      probability: 0.8
    }),
    iframe.src
  );
}
