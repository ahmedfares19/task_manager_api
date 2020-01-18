const bcrypt = require('bcryptjs')
const myFunc = async () => {
    const myPassword = "Ahmed123!";
    const myHashed1 = await bcrypt.hash(myPassword, 8)
    console.log(myHashed1);
    const myHashed2 = await bcrypt.hash(myPassword, 8)
    console.log(myHashed2);
    const res = await bcrypt.compare(myPassword, myHashed1)
    console.log(res)
}


myFunc()