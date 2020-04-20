require('../src/db/mongoose')
const Task = require('../src/models/task')

//"5e9c6d23adf62e84f532cfe7"

const deleteTask = async (taskId) => {
    const task = Task.findByIdAndDelete(taskId)
    const toDo = await Task.countDocuments({completed:false})

    return toDo
}


deleteTask('5e9cd2d12b2a50b8977ba915').then((result)=>{
    console.log(result)
}).catch((error)=>{
    console.log(error)
})
