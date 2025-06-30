import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler( (req,res)=> {
    res.json(201).json({message: "Everything is okey"})
})

export {
    registerUser
}
