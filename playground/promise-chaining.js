require('../src/db/mongoose')
const User = require('../src/models/user')

//5e9c6b2c9d96fc82eac2b7ea


const updateAgeAndCount = async (id,age) =>{
    const user = await User.findByIdAndUpdate(id, {age})
    const count = await User.countDocuments({age})

    return count
}

updateAgeAndCount('5e9c6b2c9d96fc82eac2b7ea', 61).then((count) =>{
    console.log(count)
}).catch((error) =>{
    console.log(error)
})