const fs = require('fs');

function taskManager (runner, per) {
    var task_runner = {};
   for (var prop in runner) {
       var uuid = runner[prop].taskUuid;
       var pathArr = runner[prop].path; // []
       var name = prop;
       task_runner[uuid] = {
           path: pathArr,
           name:name,
           person: per
       }
   }
   fs.writeFile("public/storage/task_uuid.json",JSON.stringify(task_runner) ,"utf8", (err)=> {
       if (err) throw err;
   })
}

module.exports = taskManager;