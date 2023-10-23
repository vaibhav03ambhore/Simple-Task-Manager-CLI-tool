import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import ora from 'ora'
import chalk from 'chalk'

export async function connectDB() {
    try{
        const spinner = ora('Connecting to database...').start()
        await mongoose.connect(process.env.MONGO_URI)
        spinner.stop()
        console.log(chalk.greenBright('Connected to database'))
    }
    catch(error){
        console.log(chalk.redBright('Error: '),error);
        process.exit(1);
    }
}


export async function disconnectDB(){
    try{
        await mongoose.disconnect()
        console.log(chalk.greenBright('Disconnected from database'))

    }
    catch(err){
        console.log(chalk.redBright('Error: '),err);
        process.exit(1);
    }
}


// connectDB()
// disconnectDB()