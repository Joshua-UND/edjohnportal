const bcrypt = require("bcrypt")

const hashdata = async (data , saltRounds = 10)=>{
    try{
        const hashdata = await bcrypt.hash(data , saltRounds);
        
        return hashdata;
    }catch(error){
        throw error
    }
}

const verifyHashedData = async (unhashed , hashed) =>{
    try {
        const match = await bcrypt.compare(unhashed, hashed);
        return match;
    } catch (error) {
        throw error
    }
}

module.exports = {hashdata ,verifyHashedData}