const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next))
        .catch((err)=>next(err))
    }
}

// const asyncHandler = (fn) => {async(req,res)=>{
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//           success: false,
//           message: error.message  
//         })
//     }
// }}

export default asyncHandler