import Stripe from "stripe";
import dotenv from "dotenv"
import { Request, Response } from "express";
import Course from "../models/courseModel";
import Transaction from "../models/transactionModel";
import UserCourseProgress from "../models/userCourseProgressModel";

dotenv.config();

if(!process.env.STRIPE_SECRET_KEY){
    throw new Error(
        "Stripe secret key is not set. Please set it in your .env file."
    )
}


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const listTransactions = async(
  req:Request,
  res:Response
):Promise<void> => {
  const { userId } = req.query;
  try {
    const transactions = userId ? await Transaction.query("userId").eq(userId).exec()
    : await Transaction.scan().exec();
    

    res.json({ message: "Transactions retrived succesfully", data: transactions });
  } catch (error) {
    res.status(500).json({ message: "Error retriving transaction", error });
  }
};

export const createStripePaymentIntent = async(
    req:Request,
    res:Response
):Promise<void> => {
    let { amount } = req.body;
    if(!amount || amount <= 0){
        amount = 50;
    }
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        automatic_payment_methods:{
            enabled: true,
            allow_redirects:"never"
        }
      })
  
      res.json({ message: "", data: {
        clientSecret: paymentIntent.client_secret
      } });
    } catch (error) {
      res.status(500).json({ message: "Error creating strip payment intent", error });
    }
  };


  export const createTransaction = async(
    req:Request,
    res:Response
):Promise<void> => {
  const {userId,courseId,transactionId,amount,paymentProvider} = req.body;

    
    try {
      const course = await Course.get(courseId);

      const newTransaction = new Transaction({
        dateTime: new Date().toISOString(),
        userId,
        courseId,
        transactionId,
        amount,
        paymentProvider
      })
      await newTransaction.save();

      const initialProgress = new UserCourseProgress({
        userId,
        courseId,
        enrollmentDate: new Date().toISOString(),
        overallProgress: 0,
        sections: course.sections.map((section: any)=>({
          sectionId: section.sectionId,
          chapters: section.chapters.map((chapter:any)=>({
            chapterId: chapter.chapterId,
            completed: false
          }))
        })),
        lastAccessedTimestamp: new Date().toISOString(),

      })
      await initialProgress.save();

      await Course.update(
        { courseId },
        {
          $ADD:{
            enrollments:[{ userId }],
          }
        }
      )
      
  
      res.json({ message: "Purchase Course Successfully", data: {
        transaction:newTransaction,
        courseProgress:initialProgress
      } });
    } catch (error) {
      res.status(500).json({ message: "Error creating transaction and enrollment", error });
    }
  };