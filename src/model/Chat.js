import { Model } from './../util/Model'
import { Firebase } from './../util/Firebase'

export class Chat extends Model {

    get users() { return this._data.users; }
    set users(value) { this._data.users = value; }

    constructor(){



    }
    
    static create(meEmail, contactEmail){

        return new Promise((s, f)=>{

            let users = {};

            users[btoa(meEmail)] = true;
            users[btoa(contactEmail)] = true;

            Chat.getRef().add({
                users,
                timeStamp: new Date()
            }).then(doc=>{

                Chat.getRef().doc(doc.id).get().then(chat=>{

                    s(chat);

                }).catch(err=>{ f(err) });

            }).catch(err => { f(err) });

        });

    }

    static getRef() {
        return Firebase.db().collection('chats');
    }

    static find(meEmail, contactEmail){
        return Chat.getRef().where(`users.${btoa(meEmail)}`, '==', true).where(`users.${btoa(contactEmail)}`, '==', true).get();
    }

    static createIfNotExists(meEmail, contactEmail) {

        return new Promise((s, f) => {

            Chat.find(meEmail, contactEmail).then(chats => {

                if (chats.empty) {

                    Chat.create(meEmail, contactEmail).then(chat => {

                        s(chat);

                    }).catch(err => { f(err); });

                } else {

                    chats.forEach(chat => {

                        s(chat);

                    });

                }

            }).catch(err => { f(err); });

        });

    }

}