export class CameraController {

  constructor(videoEl) {

    this._videoEl = videoEl

    navigator.mediaDevices.getUserMedia({
      video: true

    }).then(stream => {

      this._videoEl.srcObject = new MediaStream(stream);
      this._videoEl.play()

    }).catch(err => {

      console.error(err);

    })

  }

}