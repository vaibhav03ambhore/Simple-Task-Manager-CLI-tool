import inquire from "inquirer";
import {connectDB, disconnectDB} from '../db/connectDB.js';
import Todos  from "../schema/TodoSchema.js";
import ora from 'ora';
import chalk from 'chalk';

async function input(){
    const answers=await inquire.prompt([
        {name: 'name',message: 'Enter the name of the task',type: 'input'},
        {name: 'detail',message: 'Enter the detail of the task',type: 'input'},
    ])

    return answers
}

// const output=await input()
// console.log(output)

const askQuestion = async()=>{
    const todoArray=[]
    let loop=false
    do{
        const userRes=await input()
        todoArray.push(userRes)
        const confirmQ=await inquire.prompt([{name:'confirm',message:'Do you want to add more task?', type: 'confirm'}])
        if(confirmQ.confirm){
            loop=true
        }
        else loop=false

    }while(loop)

    return todoArray
}

// const output=await askQuestion()
// console.log(output)

export default async function addTask(){
    try{
        const userResponse=await askQuestion()

        await connectDB()

        let spinner=ora('creating the todos...').start()
        for(let i=0;i<userResponse.length;i++){
            const response=userResponse[i]
            await Todos.create(response)
        }

        spinner.stop()
        console.log(chalk.green('Todos created successfully'))

        await disconnectDB()

    }
    catch(error){
        console.log('something went wrong, Error: ',error)
        process.exit(1)
    }
}