import bcrypt from "bcrypt";
import httpStatus from "http-status"; 
import User from "../models/user.model.js";

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ msg: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(httpStatus.UNAUTHORIZED).json({ msg: "Incorrect password" });
        }
        const token=crypto.randomBytes(20).toString("hex");
        user.token=token;
        user.save();

        return res.status(httpStatus.OK).json({ msg: "Login successful",token:token });
        
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Server error", error: error.message });
    }
};

const register = async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(httpStatus.FOUND).json({ msg: "User already exists" });
        }
        
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashPassword
        });
        
        await newUser.save();
        res.status(httpStatus.CREATED).json({ msg: "User successfully created" });

    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Server error", error: error.message });
    }
};

export { login, register };
