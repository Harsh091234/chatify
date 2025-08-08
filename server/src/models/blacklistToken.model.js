import mongoose  from "mongoose";

const blacklistTokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400,
    },
}) 

const BlacklistToken = mongoose.model("blacklist_token", blacklistTokenSchema);

export default BlacklistToken;