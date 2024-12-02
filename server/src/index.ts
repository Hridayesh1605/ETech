import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import * as dynamoose from "dynamoose"
import { clerkMiddleware, createClerkClient, requireAuth } from "@clerk/express"

import courseRoutes from "./routes/courseRoutes"
import userClerkRoutes from "./routes/userClerkRoutes"
import transactionRoutes from "./routes/transactionRoutes"
import userCourseProgressRoutes from "./routes/userCourseProgressRoutes"
import serverless from "serverless-http"
import seed from "./seed/seedDynamodb"

dotenv.config();  // is commonly used to load environment variables from a .env file into your application's process environment

const isProduction = process.env.NODE_ENV === "production";

if(!isProduction){
    dynamoose.aws.ddb.local();
}   //this setup dynamo db 

export const clerkClient = createClerkClient(
    {
        secretKey:process.env.CLERK_SECRET_KEY
    }
)


const app = express();  //create instance of express application
app.use(express.json()); //Parses incoming requests with a Content-Type: application/json
app.use(bodyParser.json());
app.use(helmet()); //security for app
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));  //It sets the Cross-Origin-Resource-Policy header, which controls how resources like images and scripts are shared with other origins.
app.use(morgan("common"))  //Morgan logs details about incoming HTTP requests in a predefined format.
app.use(bodyParser.urlencoded({extended:false})) //req.body = { name: "John", age: "30" };

app.use(cors());  //Enables Cross-Origin Resource Sharing (CORS) for your API.
app.use(clerkMiddleware());



app.get("/",(req,res)=>{
    res.send("Hello World");
}); //check the working

app.use('/courses',courseRoutes);
app.use("/users/clerk",requireAuth(), userClerkRoutes);
app.use("/transactions",requireAuth(),transactionRoutes);
app.use("/users/course-progress",requireAuth(),userCourseProgressRoutes)


//server
const port = process.env.PORT || 3000;

if(!isProduction){
app.listen(port, () => {
    console.log(`Server is running on port ${port}`
        );
    })
}

//aws production env

const serverlessApp = serverless(app);
export const handler = async(event:any,context:any)=>{
    if(event.action==="seed"){
        await seed();
        return{
            statusCode:200,
            body:JSON.stringify({message:"seeded successfully"})
        }
    } else{
        return serverlessApp(event,context);
    }
}
