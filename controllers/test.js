const bcrypt = require('bcryptjs');

const testPassword = async () => {
    const plainPassword = '123456'; // Password used during account creation
    const hashedPassword = '$2b$10$amKW3ppy9nuGC.mTLKfhG.m9ygg/5RsBXKhi4C/DpB6pg49R8DLeG'; // Stored hashed password

    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('Password Match:', isMatch); // Should be true
};

testPassword();
