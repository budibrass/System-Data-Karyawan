const { User, Cart } = require("../models");
const { comparePass, hashPass } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

class UserController {
    static async register (req, res, next) {
        try {
            let { email, password, role } = req.body;
    
            const data = await User.create({ email, password, role });
            res.status(201).json({
                msg : `registration success`,
                id : data.id,
                email : data.email
            })
        } catch (error) {
            res.status(400).json({
                message: "Gagal melakukan registrasi",
                error: error.message || error
            });
        }
    };

    static async login (req, res, next) {
        try {
            const { email, password } = req.body;

            const data = await User.findOne({
                where : { email }
            })

            if(!data) throw { msg : `Email atau Password anda salah`, name : `invalidEmailOrPassword`};

            let comparePassword = comparePass(password, data.password);
            if(!comparePassword) throw { msg : `Email atau Password anda salah`, name : `invalidEmailOrPassword`};

            let payload = {
                id : data.id,
                email : data.email,
            };

            let token = generateToken(payload);
            res.status(200).json({
                msg : 'login success',
                id: data.id,
                role: data.role,
                email: data.email,
                token
            });
        } catch (error) {
            const status = error.name === 'invalidEmailOrPassword' ? 401 : 500;
        
            res.status(status).json({
                message: error.msg || 'Internal Server Error'
            });
        }
    };

    static getUsers (req, res, next) {
        User.findAll()
        .then((data) => {
            if(!data || data.length === 0) {
                return res.status(404).json({ message: `maaf data anda masih kosong` });
            } else {
                res.status(200).json(data)
            }
        })
        .catch((err) => {
            res.status(500).json({
                message: "Gagal mengambil data user",
                error: err.message || err
            });
        });
    };

    static getOneUser(req, res, next){
        let email = req.params.email;

        User.findOne({ 
            where: {email}
        })
        .then((data) => {            
            if(!data) {
                return res.status(404).json({ message: `maaf email yang anda masukkan tidak di temukan` });
            } else {
                res.status(200).json(data)
            }
        })
        .catch((err) => {
            res.status(500).json({
                message: "Gagal mengambil detail user",
                error: err.message || err
            });
        })
    };

    static async editPassword(req, res, next) {
    try {
        const { email } = req.params;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        // Cari user
        const user = await User.findOne({ where: { email } });
        if (!user) throw { name: "NotFound", msg: "User tidak ditemukan" };

        // Panggil fungsi comparePass
        const isMatch = comparePass(oldPassword, user.password);
        if (!isMatch) throw { name: "Unauthorized", msg: "Password lama salah" };

        // Validasi password baru
        if (newPassword !== confirmPassword) {
            throw { name: "BadRequest", msg: "Password baru dan konfirmasi tidak cocok" };
        }

        // Panggil fungsi hashPass Anda
        const hashedPassword = hashPass(newPassword);
        
        // Update di DB
        await User.update(
            { password: hashedPassword },
            { where: { email } }
        );

        res.status(200).json({ message: "Password berhasil diubah" });

    } catch (error) {
        res.status(500).json({
            message: "Gagal merubah password",
            error: error.message || error
        });
    }
}
};

module.exports = UserController;