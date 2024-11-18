const Joi = require("joi");

// Using Joi to validate student account creation
const createAccountValidation = (data) => {
    // Remove empty spaces from input fields
    data.First_Name = data.First_Name.trim();
    data.Last_Name = data.Last_Name.trim(); 
    data.Email = data.Email.trim();

    const validationSchema = Joi.object({
        First_Name: Joi.string().min(3).required().messages({
            'string.base': `"First_Name" should be a type of 'text'`,
            'string.empty': `"First_Name" cannot be an empty field`,
            'string.min': `"First_Name" should have a minimum length of {#limit}`,
            'any.required': `"First_Name" is a required field`
        }),
        Last_Name: Joi.string().min(3).required().messages({
            'string.base': `"Last_Name" should be a type of 'text'`,
            'string.empty': `"Last_Name" cannot be an empty field`,
            'string.min': `"Last_Name" should have a minimum length of {#limit}`,
            'any.required': `"Last_Name" is a required field`
        }),
        Email: Joi.string().email().required().messages({
            'string.base': `"Email" should be a type of 'text'`,
            'string.empty': `"Email" cannot be an empty field`,
            'string.email': `"Email" must be a valid email`,
            'any.required': `"Email" is a required field`
        }),
    });

    return validationSchema.validate(data);
}

// Using Joi to validate student login
const loginValidation = (data) => {
    // Check and remove empty spaces from input fields if they exist
    if (data.Matric) {
        data.Matric = data.Matric.toString().trim();
    }
    if (data.Password) {
        data.Password = data.Password.trim();
    }

    const validationSchema = Joi.object({
        Matric: Joi.string().required().messages({
            'string.base': `"Matric" should be a type of 'text'`,
            'string.empty': `"Matric" cannot be an empty field`,
            'any.required': `"Matric" is a required field`
        }),
        Password: Joi.string().required().messages({
            'string.base': `"Password" should be a type of 'text'`,
            'string.empty': `"Password" cannot be an empty field`,
            'any.required': `"Password" is a required field`
        }),
    });

    return validationSchema.validate(data);
}



module.exports = {
    createAccountValidation,
    loginValidation
};
