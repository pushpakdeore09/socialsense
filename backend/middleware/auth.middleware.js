import jwt from 'jsonwebtoken';

export const authUser = async (req, res, next) => {
    try {
        const authHeader = res.headers.authorization
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).send({ errors: "Unauthorized user" });
        }
        const token = authHeader.split(" ")[1]
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).send({ errors: "Unauthorized user" });
    }
}