const mongoose=require("mongoose")

const appoitmentSchema=mongoose.Schema({
  name: String,
  imageUrl: String, 
  specialization: String,
  experience: Number,
  location: String,
  date: String,
  slots: Number,
  fee: Number
})

const AppoitmentModel=mongoose.model("Appoitment",appoitmentSchema)

module.exports={AppoitmentModel}