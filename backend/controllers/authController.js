export const login = (req, res) => {
  const { username, password } = req.body;


}

export const register = (req,res) =>{
    const { email , name , phoneNumber , password } = req.body;

if(!email  || !name || !phoneNumber || !password){
    return res.status(400).json({ message: "All fields are required" });
};




}
