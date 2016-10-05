IMPLEMENTATION MAPPING
====

#### Use Case 1 : Join Community
| Design | Implementation |
| -------- | --------------- |
| Join Interface | `views/join.jade`, `public/scripts/join.js`, `views/welcome.jade`, `views/directory.jade`, `public/scripts/showUserDirectory.js` |
| Join Controller | `controllers/joinController.js` |
| User Info | `services/directoryServiceImpl.js`|

#### User Case 2: Public Wall
| Design | Implementation |
| -------- | --------------- |
| Public Chat Interface | `views/publicChat.jade`, `script/publicChat.js`|
| Public Chat Controller | `controller/messageController.js` |
| Public Wall |`services/publicMessageServiceImpl.js`|
| Message | `services/publicMessageServiceImpl.js` |
