// promise utility
const asyncHandler = () => {
    (req, res, next) => {
        Promise.resolve().catch((error) => next(error)).
        catch((error) => next(error))
    }
}

export {asyncHandler}


// const asyncHandler = () => {}
// const asyncHandler = (func) =>{ async () => {

// }} below syntax explanation
// try catch utility
// const asyncHandler = (fn) => async(req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }