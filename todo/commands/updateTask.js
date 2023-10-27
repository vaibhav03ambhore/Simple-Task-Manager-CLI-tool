import {connectDB, disconnectDB} from '../db/connectDB.js'
import { getTaskCode } from './deleteTask.js'
import inquirer from 'inquirer'
import Todos from '../schema/TodoSchema.js'
import ora from 'ora'
import chalk from 'chalk'

async function askUpdateQ(todo){
    try{
        const update = await inquirer.prompt([
            {name: 'name', message: 'Update the name?',type: 'input' ,defult: todo.name},
            {name: 'detail', message: 'Update the Description?',type: 'input', default: todo.detail},
            {name:'status',message: 'Update the status', type: 'list', choices: ['pending', 'completed'], default: todo.status}
        ])
        return update

    } catch(error) {
        console.log('something went wrong...\n',error)
    }
}


export default async function updateTask(){
    try {
        const userCode = await getTaskCode()

        await connectDB()

        const spinner = ora('Finding the todo...').start()

        const todo = await Todos.findOne({code: userCode.code})

        spinner.stop()
        if(!todo){
            console.log(chalk.redBright('Could not find a Todo with the code you provided.'))
        } else{
            console.log(chalk.blueBright('Type the updated properties. Press Enter if you don\'t want to update the data.'))

            const update = await askUpdateQ(todo)

            if(update.status === 'completed'){
                spinner.text = 'Deleting the todo...'
                spinner.start()
                await Todos.deleteOne({_id : todo._id})

                spinner.stop()
                console.log(chalk.greenBright('Deleted the todo.'))
            } else {
                spinner.text = 'Updating the todo'
                spinner.start()
                await Todos.updateOne({_id: todo._id}, update, {runValidators: true})
                spinner.stop()
                console.log(chalk.greenBright('Updated the todo.'))
            }
        }
    
        await disconnectDB()
    } catch (error) {
        
        console.log('Something went wrong, Error: ', error)
        process.exit(1)
    }
}

updateTask()