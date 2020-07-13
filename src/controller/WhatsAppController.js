import { Format } from './../util/Format';
import { CameraController } from './CameraController';
import { DocumentPreviewController } from './DocumentPreviewController';
// import { MicrophoneController } from './MicrophoneController';
// import { Firebase } from './../util/Firebase';
// import { User } from './../model/User';
// import { Chat } from './../model/Chat';
import { Message } from '../model/Message';
import { Base64 } from '../util/Base64';
// import { ContactsController } from './ContactsController';


export class WhatsAppController {

  constructor() {

    this.elementsPrototype()
    this.loadElements()
    this.initEvents()

  }
  // methods
  loadElements() {

    this.el = {}

    document.querySelectorAll('[id]').forEach(element => {

      this.el[Format.getCamelCase(element.id)] = element

    })

  }
  elementsPrototype() {

    Element.prototype.hide = function () {

      this.style.display = 'none'
      return this
    }
    Element.prototype.show = function () {

      this.style.display = 'block'
      return this

    }
    Element.prototype.toggle = function () {

      this.style.display = (this.style.display === 'none') ? 'block' : 'none'
      return this
    }
    Element.prototype.on = function (events, fn) {

      events.split(' ').forEach(e => {

        this.addEventListener(e, fn)

      })
      return this
    }
    Element.prototype.css = function (styles) {

      for (let name in styles) {

        this.style[name] = styles[name]

      }
      return this
    }
    Element.prototype.addClass = function (name) {

      this.classList.add(name)
      return this
    }
    Element.prototype.removeClass = function (name) {

      this.classList.remove(name)
      return this
    }
    Element.prototype.toggleClass = function (name) {

      this.classList.toggle(name)
      return this
    }
    Element.prototype.hasClass = function (name) {

      return this.classList.contains(name)

    }
    HTMLFormElement.prototype.getForm = function () {

      return new FormData(this)

    }
    HTMLFormElement.prototype.toJSON = function () {

      let json = {}

      this.getForm().forEach((value, key) => {

        json[key] = value

      })

      return json

    }

  }
  initEvents() {
    // edit profile
    this.el.myPhoto.on('click', e => {

      this.closeAllLeftPanel()
      this.el.panelEditProfile.show()
      setTimeout(() => {
        this.el.panelEditProfile.addClass('open')
      }, 100)

    })
    this.el.btnClosePanelEditProfile.on('click', e => {

      this.el.panelEditProfile.removeClass('open')

    })
    this.el.photoContainerEditProfile.on('click', e => {

      this.el.inputProfilePhoto.click()

    })
    this.el.inputNamePanelEditProfile.on('keypress', e => {

      if (e.key === 'Enter') {

        e.preventDefault()
        this.el.btnSavePanelEditProfile.click()

      }

    })
    this.el.btnSavePanelEditProfile.on('click', e => {

      console.log(this.el.inputNamePanelEditProfile.innerHTML);


    })
    // new contact
    this.el.btnNewContact.on('click', e => {

      this.closeAllLeftPanel()
      this.el.panelAddContact.show()
      setTimeout(() => {
        this.el.panelAddContact.addClass('open')
      }, 100)

    })
    this.el.btnClosePanelAddContact.on('click', e => {

      this.el.panelAddContact.removeClass('open')

    })
    this.el.formPanelAddContact.on('submit', e => {

      e.preventDefault()
      let formData = new FormData(this.el.formPanelAddContact)

    })
    // contacts messages list
    this.el.contactsMessagesList.querySelectorAll(".contact-item").forEach(item => {

      item.on('click', e => {

        this.el.home.hide()
        this.el.main.css({
          display: 'flex'
        })
      })

    })
    // attach
    this.el.btnAttach.on('click', e => {

      e.stopPropagation()
      this.el.menuAttach.addClass('open')
      document.addEventListener('click', this.closeMenuAttach.bind(this))
    })
    // picture
    this.el.btnAttachPhoto.on('click', e => {

      this.el.inputPhoto.click()

    })
    this.el.inputPhoto.on('change', e => {

      console.log(this.el.inputPhoto.files);

      [...this.el.inputPhoto.files].forEach(file => {

        console.log(file);

      })
    })
    // camera
    this.el.btnAttachCamera.on('click', e => {

      this.closeAllMainPanel()
      this.el.panelCamera.addClass('open')
      this.el.panelCamera.css({
        'height': '100% '
      })

      this._camera = new CameraController(this.el.videoCamera)

    })
    this.el.btnClosePanelCamera.on('click', e => {

      this.closeAllMainPanel()
      this.el.panelMessagesContainer.show()
      this._camera.stop()

    })
    this.el.btnTakePicture.on('click', e => {

      console.log('take photo');
      let dataURL = this._camera.takePicture()

      this.el.pictureCamera.src = dataURL
      this.el.pictureCamera.show()
      this.el.videoCamera.hide()
      this.el.btnReshootPanelCamera.show()
      this.el.containerTakePicture.hide()
      this.el.containerSendPicture.show()

    })
    this.el.btnReshootPanelCamera.on('click',e=>{

      this.el.pictureCamera.hide()
      this.el.videoCamera.show()
      this.el.btnReshootPanelCamera.hide()
      this.el.containerTakePicture.show()
      this.el.containerSendPicture.hide()

    })
    this.el.btnSendPicture.on('click',e=>{

      console.log(this.el.pictureCamera.src);
      

    })
    // docs
    this.el.btnAttachDocument.on('click', event => {

      this.el.inputDocument.click();

  });

  this.el.inputDocument.on('change', event => {

      if (this.el.inputDocument.files.length) {

          let file = this.el.inputDocument.files[0];

          this.closeAllMainPanel();
          this.el.panelMessagesContainer.hide();
          this.el.panelDocumentPreview.addClass('open');
          this.el.panelDocumentPreview.css({
            height: 'calc(100% - 120px)'
        });


          this._documentPreview = new DocumentPreviewController(file);

          this._documentPreview.getPriviewData().then(data => {

              this.el.filePanelDocumentPreview.hide();
              this.el.imagePanelDocumentPreview.show();
              this.el.imgPanelDocumentPreview.src = data.src;
              this.el.imgPanelDocumentPreview.show();

              this.el.infoPanelDocumentPreview.innerHTML = data.info;

          }).catch(event => {

              if (event.error) {
                  console.error(event.event);
              } else {

                  switch (file.type) {
                      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                      case 'application/msword':
                          this.el.iconPanelDocumentPreview.classList.value = 'jcxhw icon-doc-doc';
                          break;

                      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                      case 'application/vnd.ms-excel':
                          this.el.iconPanelDocumentPreview.classList.value = 'jcxhw icon-doc-xls';
                          break;

                      case 'application/vnd.ms-powerpoint':
                      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                          this.el.iconPanelDocumentPreview.classList.value = 'jcxhw icon-doc-ppt';
                          break;

                      default:
                          this.el.iconPanelDocumentPreview.classList.value = 'jcxhw icon-doc-generic';
                  }

                  this.el.filePanelDocumentPreview.show();
                  this.el.imagePanelDocumentPreview.hide();

                  this.el.filenamePanelDocumentPreview.innerHTML = file.name;

              }

          });

      }

  });

  this.el.btnClosePanelDocumentPreview.on('click', event => {

      this.closeAllMainPanel();
      this.el.panelMessagesContainer.show();

  });

  this.el.btnSendDocument.on('click', event => {

      let documentFile = this.el.inputDocument.files[0];

      if (documentFile.type === 'application/pdf') {

          Base64.toFile(this.el.imgPanelDocumentPreview.src).then(imageFile => {

              Message.sendDocument(this._activeContact.chatId, this._user.email, documentFile, imageFile, this.el.infoPanelDocumentPreview.innerHTML);

          });

      } else {

          Message.sendDocument(this._activeContact.chatId, this._user.email, documentFile);

      }

      this.el.btnClosePanelDocumentPreview.click();

  });
    // contact
    this.el.btnAttachContact.on('click', e => {

      this.el.modalContacts.show()

    })
    this.el.btnCloseModalContacts.on('click', e => {

      this.el.modalContacts.hide()

    })//attach end
    // mic
    this.el.btnSendMicrophone.on('click', e => {

      this.el.recordMicrophone.show()
      this.el.btnSendMicrophone.hide()
      this.startRecordMicrophoneTime()

    })
    this.el.btnCancelMicrophone.on('click', e => {

      this.closeRecordMicrophone()

    })
    this.el.btnFinishMicrophone.on('click', e => {

      this.closeRecordMicrophone()

    })
    //messages
    this.el.inputText.on('keypress', e => {

      if (e.key === 'Enter' && !e.ctrlKey) {

        e.preventDefault()
        this.el.btnSend.click()
      }

    })
    this.el.inputText.on('keyup', e => {

      if (this.el.inputText.innerHTML.length) {

        this.el.inputPlaceholder.hide()
        this.el.btnSendMicrophone.hide()
        this.el.btnSend.show()

      } else {

        this.el.inputPlaceholder.show()
        this.el.btnSendMicrophone.show()
        this.el.btnSend.hide()

      }

    })
    this.el.btnSend.on('click', e => {

      console.log(this.el.inputText.innerHTML);

    })
    // emoji
    this.el.btnEmojis.on('click', e => {

      this.el.panelEmojis.toggleClass('open')

    })
    this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji => {

      emoji.on('click', e => {

        let img = this.el.imgEmojiDefault.cloneNode()

        img.style.cssText = emoji.style.cssText
        img.dataset.unicode = emoji.dataset.unicode
        img.alt = emoji.dataset.unicode

        emoji.classList.forEach(name => {

          img.classList.add(name)

        })

        let cursor = window.getSelection()

        if (!cursor.focusNode || !cursor.focusNode.id == 'input-text') {

          this.el.inputText.focus()
          cursor = window.getSelection()
        }

        let range = document.createRange()

        range = cursor.getRangeAt(0)
        range.deleteContents()

        let frag = document.createDocumentFragment()
        frag.appendChild(img)
        range.insertNode(frag)
        range.setStartAfter(img)

        this.el.inputText.dispatchEvent(new Event('keyup'))

      })

    })

  }

  startRecordMicrophoneTime() {

    let start = Date.now()
    this._recordMicrophoneInterval = setInterval(() => {
      let time = (this.el.recordMicrophoneTimer.innerHTML = Format.formatTimeToHuman(Date.now() - start))

    }, 100)

  }
  closeRecordMicrophone() {

    this.el.btnSendMicrophone.show()
    this.el.recordMicrophone.hide()
    clearInterval(this._recordMicrophoneInterval)

  }
  closeAllMainPanel() {

    this.el.panelMessagesContainer.hide()
    this.el.panelDocumentPreview.removeClass('open')
    this.el.panelCamera.removeClass('open')

  }
  closeMenuAttach(e) {
    document.removeEventListener('click', this.closeMenuAttach)
    this.el.menuAttach.removeClass('open')
  }
  closeAllLeftPanel() {

    this.el.panelEditProfile.hide()
    this.el.panelAddContact.hide()

  }

}