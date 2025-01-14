const mongoose = require('mongoose')
const LogSchema = require('./schema/Log')
const UserSchema = require('./schema/User')

const Log = LogSchema
const User = UserSchema

async function connect() {
    if(mongoose.connection.readyState === 1){
        return
    }
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.h7oc7.mongodb.net/${process.env.DB}?retryWrites=true&w=majority&appName=Cluster0`
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('MongoDB connected')
}

function disconnect() {
    mongoose.disconnect()
    .then(() => console.log('MongoDB disconnected'))
    .catch(err => console.error('MongoDB disconnection error:', err))
}

async function make(namespace, identifier){
    try{
        await connect()
        const users = await User.find({namespace, identifier})
        if(users.length > 0) return {status: 409}

        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            namespace,
            identifier
        })
        
        await newUser.save()
        return {status: 200}
    }
    catch(e){
        console.error(e)
        return {status: 500}
    }
    finally{
        disconnect()
    }
}

async function up(namespace, identifier){
    try{
        await connect()
        const newLog = new Log({
            _id: new mongoose.Types.ObjectId(),
            date: new Date(),
            namespace,
            identifier
        })
        
        const users = await User.find({namespace, identifier})
        if(users.length === 0) return {status: 404}
        
        await newLog.save()
        
        const {namespace: name, identifier: id} = users[0]
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)

        const todayLogs = await Log.find({
            date: {$gte: startOfDay, $lt: endOfDay},
            namespace: name,
            identifier: id
        })
        
        return {status: 200, count: todayLogs.length}
    }
    catch(e){
        console.error(e)
        return {status: 500}
    }
    finally{
        disconnect()
    }
}

async function log(namespace, identifier){
    try{
        await connect()
        const user = await User.find({namespace, identifier})
        const logs = await Log.find({namespace, identifier})

        if(user.length === 0) return {status: 404}
        return {status: 200, logs}
    }
    catch(e){
        console.error(e)
        return {status: 500}
    }
    finally{
        disconnect()
    }
}

module.exports = {make, up, log}