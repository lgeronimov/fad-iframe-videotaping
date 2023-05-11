window.onload = function () {
 initIframe();
};

// events available
const EVENT_MODULE = {
 INIT_MODULE: 'INIT_MODULE',
 PROCESS_INIT: 'PROCESS_INIT',
 PROCESS_ERROR: 'PROCESS_ERROR',
 PROCESS_COMPLETED: 'PROCESS_COMPLETED',
 MODULE_READY: 'MODULE_READY',
 CAMERA_ACCEPTED: 'CAMERA_ACCEPTED',
 MODULE_CLOSED: 'MODULE_CLOSED',
};

// IDS ALLOWED
const IDS_ALLOWED = {
 ID_MEX_FRONT: 'ID_MEX_FRONT',
 ID_MEX_BACK: 'ID_MEX_BACK',
 ID_PASSPORT: 'ID_PASSPORT',
};

// mandatory, videoagreement legend
const LEGEND =
 'Yo Nombre del firmante, con fecha de nacimiento 20 de Junio, con credencial de elector número: 1234134134 declaro que soy Soltero, con ingresos mensuales de $15,667.21, cuento con Casa o depto propio actualmente SI cuento con tarjetas de crédito y reconozco que la información que he proporcionado es verídica';

// optional, the app has default configuration, legends and colors
const CONFIGURATION = {
 views: {
  instructions: true,
  preview: true,
 },
 idDetection: {
  captureId: true,
  probability: 0.8,
 },
 selfie: {
  captureSelfie: false,
  imageType: 'image/png',
  imageQuality: 1,
 },
 selfieId: {
  captureSelfieId: false,
  imageType: 'image/png',
  imageQuality: 1,
  captureTimeout: 100,
 },
 recorder: {
  recordEverything: false,
 },
 iOS: {
  videoConstraints: {
   video: {
    width: { min: 640, ideal: 640, max: 1920 },
    height: { min: 480, ideal: 480, max: 1080 },
    facingMode: 'user',
   },
   audio: true,
  },
 },
 android: {
  videoConstraints: {
   video: {
    width: { min: 640, ideal: 640, max: 1920 },
    height: { min: 480, ideal: 480, max: 1080 },
    facingMode: 'user',
   },
   audio: true,
  },
 },
 customization: {
  fadCustomization: {
   colors: {
    primary: '#A70635',
    secondary: '#A70635',
    tertiary: '#363636',
    succesful: '#5A9A92',
   },
   buttons: {
    primary: {
     backgroundColor: '#A70635',
     labelColor: '#ffffff',
     borderColor: '#A70635',
     borderStyle: 'solid',
     borderWidth: '1px',
    },
    secondary: {
     backgroundColor: '#363636ad',
     labelColor: '#ffffff',
     borderColor: '#ffffff',
    },
    common: {
     backgroundColorDisabled: '#dcdcdc',
     labelColorDisabled: '#8e8e8e',
    },
   },
   fonts: {
    title: {
     fontSize: '25px',
     fontFamily: 'system-ui',
    },
    subtitle: {
     fontSize: '17px',
     fontFamily: 'system-ui',
    },
    content: {
     fontSize: '15px',
     fontFamily: 'system-ui',
    },
    informative: {
     fontSize: '12px',
     fontFamily: 'system-ui',
    },
    button: {
     fontSize: '17px',
     fontFamily: 'system-ui',
    },
   },
  },
  moduleCustomization: {
   legends: {
    videoagreement: {
     buttonRecord: 'Iniciar grabación',
     buttonFinish: 'Terminar',
     acceptancetInstruction: 'Graba el siguiente texto de forma clara y fuerte',
     recording: 'Grabando',
     focusFace: 'Enfoca tu rostro dentro de la guía',
    },
    idDetection: {
     instruction: 'Acerca y aleja tu identificación',
     instructionCustomOne: 'Acerca y aleja el',
     instructionCustomTwo: 'de tu identificación',
    },
    loader: {
     initializing: 'iniciando',
     processing: 'procesando',
    },
   },
   legendsInstructions: {
    title: 'Videograbación',
    subtitle: 'Acerca y aleja tu identificación, posteriormente graba el texto de forma clara y fuerte',
    buttonNext: 'Continuar',
    instructions: 'Recuerda no hacer uso de lentes de sol, gorras u otros elementos que dificulten la identificación de tu rostro.',
   },
   legendsPreview: {
    title: 'Videograbación',
    buttonRetry: 'Volver_a_grabar',
    buttonNext: 'Confirmar_grabación',
   },
   style: {
    common: {
     loader: {
      backgroundColor: '#000',
     },
    },
   },
  },
 },
 pathDependencies: {
  // imageDirectory: 'ASSETS_URL/'
 },
};

// errors
const ERROR_CODE = {
 BROWSER_NOT_SUPPORTED: -1,
 NOT_ACCEPT_CAMERA_PERMISSION: -2,
 VIDEO_CREATION_FAIL: -3,
 MEDIA_RECORDER_ERROR: -4,
 FACE_UNDETECTED: -5,
 REQUIRED_LEGEND: -6,
 VIDEO_EMPTY: -7,
 NOT_READABLE_CAMERA: -8,
 TEACHABLE_MACHINE_LOAD_FAIL: -9,
 TENSORFLOW_LOAD_FAIL: -10,
 MEDIA_RECORDER_NOT_SUPPORTED: -11,
 IDENTIFICATIONS_REQUIRED: -12,
 NO_AUDIO: -13,
 CONTEXT_SWITCH: -14,
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
 selfie; // selfie of user
 selfieId; // array of identifications detected selfies
 constructor(data) {
  this.video = data.video;
  this.startSecond = data.startSecond;
  console.log(data);
 }
}

// subscribe to message event to recive the events from the iframe
window.addEventListener('message', (message) => {
 // IMPORTANT: check the origin of the data
 if (message.origin.includes('firmaautografa.com')) {
  if (message.data.event === EVENT_MODULE.MODULE_READY) {
   // MODULE_READY
   initModule();
  } else if (message.data.event === EVENT_MODULE.PROCESS_INIT) {
   // PROCESS_INIT
   // only informative
   console.log('Process init');
  } else if (message.data.event === EVENT_MODULE.CAMERA_ACCEPTED) {
   // PRROCESS_ERROR
   // only informative
   console.log('Camera accepted');
  } else if (message.data.event === EVENT_MODULE.MODULE_CLOSED) {
   // PRROCESS_ERROR
   // module closed, the user clicked (X)
   console.log('module closed');
  } else if (message.data.event === EVENT_MODULE.PROCESS_ERROR) {
   // PRROCESS_ERROR
   console.error(message.data.data);
  } else if (message.data.event === EVENT_MODULE.PROCESS_COMPLETED) {
   // PROCESS_COMPLETED
   alert('Process completed');
   const result = new Result(message.data.data);
   const videoUrl = URL.createObjectURL(result.video);
   const startSecondResult = result.startSecond;
   // // show result example

   const containerResult = document.getElementById('container-result');
   const containerIframe = document.getElementById('container-iframe-videotaping');
   const videoId = document.getElementById('video-id');
   const startSecond = document.getElementById('startSecond');
   const downloadAncord = document.getElementById('donwload-ancord');

   containerIframe.style.display = 'none';
   containerResult.style.display = 'flex';
   videoId.src = videoUrl;
   downloadAncord.href = videoUrl;
   startSecond.innerHTML = startSecondResult;
  }
 }
});

function initIframe() {
 // get iframe
 const iframe = document.getElementById('fad-iframe-videotaping');
 // url - https://devapiframe.firmaautografa.com/fad-iframe-videotaping;
 const tkn = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
 const url = `https://devapiframe.firmaautografa.com/fad-iframe-videotaping?tkn=${tkn}`;
 // set src to iframe
 iframe.src = url;
}

function initModule() {
 const iframe = document.getElementById('fad-iframe-videotaping');
 iframe.contentWindow.postMessage(
  new ResponseEvent(EVENT_MODULE.INIT_MODULE, {
   legend: LEGEND,
   // optional, identifications to detect, default ID_MEX_FRONT
   identifications: [
    { name: IDS_ALLOWED.ID_MEX_FRONT, title: 'FRENTE' },
    { name: IDS_ALLOWED.ID_MEX_BACK, title: 'REVERSO' },
   ],
   configuration: CONFIGURATION,
  }),
  iframe.src
 );
}
