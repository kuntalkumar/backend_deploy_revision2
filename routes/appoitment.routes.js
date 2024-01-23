const express=require("express");
const { AppoitmentModel } = require("../model/appoitment.model");
const appoitmentRouter=express.Router();

appoitmentRouter.post("/",async(req,res)=>{
    
    // res.send({appoitment:"appoitments"})

    try {
        const newAppointment = new AppoitmentModel(req.body);
        const savedAppointment = await newAppointment.save();
        res.status(201).json(savedAppointment);
      } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
})

module.exports={appoitmentRouter}