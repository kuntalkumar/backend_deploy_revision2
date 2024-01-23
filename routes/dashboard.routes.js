const express=require("express");
const { AppoitmentModel } = require("../model/appoitment.model");
const dashboardRouter=express.Router();

dashboardRouter.get("/",async(req,res)=>{
    

    try {
        const appointments = await AppoitmentModel.find(); 
        res.status(200).json(appointments);

      } catch (error) {
        console.error('Error to shownig Dashboard:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
})

module.exports={dashboardRouter}