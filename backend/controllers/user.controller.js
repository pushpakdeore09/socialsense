import * as userService from '../services/user.service.js'

export const registerController = async (req, res) => {
    try {
        const user = await userService.createUser(req)
        
    } catch (error) {
        console.log(error.message);
        res.status(400).send(error.message)
        
    }
}