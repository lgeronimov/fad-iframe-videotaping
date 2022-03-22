window.onload = function () {
  initIframe();
};

// events available
const EVENT_MODULE = {
  INIT_MODULE: "INIT_MODULE",
  PROCESS_INIT: "PROCESS_INIT",
  PROCESS_ERROR: "PROCESS_ERROR",
  PROCESS_COMPLETED: "PROCESS_COMPLETED",
};

// videotaping credentials
const CREDENTIALS = {}

// legends of module
const LEGENDS = {
  buttonRecord: 'Iniciar grabación_iframe',
  buttonFinish: 'Terminar_iframe',
  initializing: 'iniciando_iframe',
  processing: 'procesando_iframe',
  acceptancetInstruction: 'Graba el siguiente texto de forma clara y fuerte_iframe',
  recording: 'Grabando_iframe',
  focusface: 'Enfoca tu rostro dentro de la guía_iframe',
};

const LEGEND ='Yo Nombre del firmante, con fecha de nacimiento 20 de Junio, con credencial de elector número: 1234134134 declaro que soy Soltero, con ingresos mensuales de $15,667.21, cuento con Casa o depto propio actualmente SI cuento con tarjetas de crédito y reconozco que la información que he proporcionado es verídica_ts';

const CUSTOMIZATION = {
  fadCustomization: {
    colors: {
      primary: '#A70635',
      secondary: '#A70635',
      tertiary: '#363636'
    },
    buttons: {
      primary: {
        backgroundColor: '#A70635',
        backgroundColorDisabled: '#dcdcdc',
        labelColor: '#ffffff',
        labelColorDisabled: '#8e8e8e',
        border: '1px solid #A70635'
      }
    }
  },
  moduleCustomization: {
    legends: {
      buttonRecord: 'Iniciar grabación_iframe',
      buttonFinish: 'Terminar_iframe',
      initializing: 'iniciando_iframe',
      processing: 'procesando_iframe',
      acceptancetInstruction: 'Graba el siguiente texto de forma clara y fuerte_iframe',
      recording: 'Grabando_iframe',
      focusface: 'Enfoca tu rostro dentro de la guía_iframe',
    }
  }
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


class ResponseEvent {
  event;
  data;
  constructor(event, data) {
    this.event = event;
    this.data = data;
  }
}

class Result {
  videoData;
  constructor(videoData){
    this.videoData = videoData;
  }
}


// subscribe to message event to recive the events from the iframe
window.addEventListener("message", (message) => {
  // IMPORTANT: check the origin of the data
  // if (message.origin.includes("firmaautografa.com")) {
  if (message.data.event === EVENT_MODULE.PROCESS_INIT) { // PROCESS_INIT
    // only informative
    console.log("Process init");
  } else if (message.data.event === EVENT_MODULE.PROCESS_ERROR) { // PRROCESS_ERROR
    console.error(message.data.data);
  } else if (message.data.event === EVENT_MODULE.PROCESS_COMPLETED) { // PROCESS_COMPLETED
    alert("Process completed");
    const videoUrl = URL.createObjectURL(message.data.data);
    // // show result example

    const containerResult = document.getElementById('container-result');
    const containerIframe = document.getElementById('container-iframe-videotaping');
    const videoId = document.getElementById('video-id');
    const downloadAncord = document.getElementById('donwload-ancord');
  
  
    containerIframe.style.display = 'none';
    containerResult.style.display = 'flex';
    videoId.src = videoUrl;
    downloadAncord.href =videoUrl;
  }
  // } else return;
});

function initIframe() {
  // get iframe
  const iframe = document.getElementById("fad-iframe-videotaping");
  // url - https://apiiduat.firmaautografa.com/
  const url = "https://localhost:4200/";
  // set src to iframe
  iframe.src = url;
  // subscribe to onload
  iframe.onload = () => {
    // send configuration
    iframe.contentWindow.postMessage(
      new ResponseEvent(EVENT_MODULE.INIT_MODULE, {
        legend:LEGEND,
        credentials: CREDENTIALS,
        customization: CUSTOMIZATION
      }), iframe.src);
  };
}
