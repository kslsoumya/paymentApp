// let socketio = require('socket.io')
// const events = require('events')
// const mongoose = require('mongoose')

// const shortId = require('shortid')
// const chatModel = mongoose.model('Chat')


// const eventEmitter = new events.EventEmitter()
// let setServer = (server) => {

//     let allGroups =[];
//     let io = socketio.listen(server)
//     let myIo = io.of('/')

//     myIo.on('connection', (socket) => {
        
//         socket.on('set-active', (data) => {
//             console.log(data.groupId+'-------' + data.groupName+ data.adminId)
//             let groupObj = { groupId: data.groupId, groupName: data.groupName,adminId : data.adminId};
//             const msg = `${data.groupName} is Active`;
//                     allGroups.push(groupObj)
//                     console.log('admin joining-----');
//                     socket.broadcast.emit('active-groups', allGroups);
//                     socket.broadcast.emit('notification',msg)
//         })
//         socket.on('set-inActive', (data) => {
//             var removeIndex = allGroups.map((group) => {
//                 return group.groupId
//             }).indexOf(data.groupId)
//             const msg = `${data.groupName} is Inactive`;
//                     allGroups.splice(removeIndex,1)
//                     socket.broadcast.emit('active-groups', allGroups);
//                     socket.broadcast.emit('notification',msg)
//         })

        
//         socket.on('join-group',(data)=>{
//             console.log('joining group------'+data.userName)

//             socket.join(data.groupName);
//             let msg = `${data.userName} joined group`
//             socket.broadcast.to(data.groupName).emit('notification',msg)
//         })
//         socket.on('leave-group',(data)=>{
//             console.log('leaving group------'+data.userName)
//             socket.leave(data.groupName);
//             let msg = `${data.userName} left the group`
//             socket.broadcast.to(data.groupName).emit('notification',msg);
//         })

//         socket.on('typing',(data)=>{
//             console.log('typing ------'+data.userName)
//             let msg = `${data.userName} is typing`
//             const note = {
//                 msg:msg,
//                 groupName :data.groupName
//             }
//             socket.to(data.groupName).emit('typingNote',note);
//         })
        
//         socket.on('stopTyping',(data)=>{
//             console.log('Stoppedtyping ------'+data.userName)
//             let msg = `${data.userName} stopped typing`
//             const stopNote = {
//                 msg:msg,
//                 groupName :data.groupName
//             }
//             socket.to(data.groupName).emit('stopTypingNote',stopNote);
//         })

//         socket.on('send-msg',(data)=>{
//             console.log('socket chat-msg called')
//             data['chatId'] = shortId.generate()
//             setTimeout(()=>{
//                 eventEmitter.emit('save-chat',data)
//             },2000)
//             console.log(data)
//             socket.to(data.groupName).emit('get-msg',data)
//         })


//         socket.on('disconnect', () => {
//             console.log('user is disconnected');
//             console.log(socket.userId)
//             allGroups=[];
//             socket.leave(socket.group)
//         })
//     })
// }

// eventEmitter.on('save-chat', (data) => {
//     let newChat = new chatModel({
//         chatId: data.chatId,
//         senderId: data.senderId,
//         senderName: data.senderName,
//         groupName: data.groupName,
//         groupId: data.groupId,
//         message: data.message,
//         createdOn: data.createdOn
//     })

//     newChat.save((err, result) => {
//         if (err) {
//             console.log(`error occured : ${err}`)
//         } else if (result == undefined || result == null || result == '') {
//             console.log('chat is not saved')
//         } else {
//             console.log('chat saved')
//         }
//     })
// })


// module.exports = {
//     setServer: setServer
// }