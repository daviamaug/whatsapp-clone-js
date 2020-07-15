  const firebase=require('firebase')
  require('firebase/firestore')

  export class Firebase{
  constructor(){
    this._firebaseConfig={
      apiKey: "AIzaSyD22FKI2c3V8m36KZp0iNDbHop4h1mOf-A",
    authDomain: "whatsapp-clone-afdb3.firebaseapp.com",
    databaseURL: "https://whatsapp-clone-afdb3.firebaseio.com",
    projectId: "whatsapp-clone-afdb3",
    storageBucket: "whatsapp-clone-afdb3.appspot.com",
    messagingSenderId: "1016658941625",
    appId: "1:1016658941625:web:40ebdb7568001510432d68",
    measurementId: "G-WQBB0HGB62"
  }

    this.init()
  }
  init(){  
  if(!window._initializedFirebase){
    firebase.initializeApp(this._firebaseConfig);
    firebase.analytics();

    this._initializedFirebase=true
  }
  }
  initAuth(){

    return new Promise((s, f)=>{

        let provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function (result) {

            let token = result.credential.accessToken;
            let user = result.user;

            s({
              user, 
              token
            });

        }).catch(function (error) {

            f(error);

        });

    });        

}

  static db(){

    return firebase.firestore()

  }
  static hd(){

    return firebase.storage()

  }
}