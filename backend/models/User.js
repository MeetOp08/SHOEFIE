const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
        phone: {
            type: String,
            required: false,
        },
        avatar: {
            type: String,
            required: false,
            default: ''
        },
        notificationPreferences: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: true }
        },
        addresses: [
            {
                name: { type: String },
                phoneNumber: { type: String },
                address: { type: String },
                city: { type: String },
                postalCode: { type: String },
                country: { type: String },
                isDefault: { type: Boolean, default: false }
            },
        ],
    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
