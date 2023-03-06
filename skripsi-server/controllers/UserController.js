const { User, Cart } = require("../models");
const { comparePass } = require("../helpers/bcrypt");
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
            next(error)
        }
    };

    static async login (req, res, next) {
        try {
            const { email, password } = req.body;

            const data = await User.findOne({
                where : { email }
            })

            if(!data) throw { msg : `invalid email or password`, name : `invalidEmailOrPassword`};

            let comparePassword = comparePass(password, data.password);
            if(!comparePassword) throw { msg : `invalid email or password`, name : `invalidEmailOrPassword`};

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
            console.log(error, `<<<<< error login`);
        }
    };

    static getUsers (req, res, next) {
        User.findAll()
        .then((data) => {
            if(!data) {
                throw ({ msg: `maaf data anda masih kosong` })
            } else {
                res.status(200).json(data)
            }
        })
    };

    static getOneUser(req, res, next){
        let email = req.params.email;

        User.findOne({ 
            where: {email}
        })
        .then((data) => {            
            if(!data) {
                throw ({ msg: `maaf email yang anda masukkan tidak di temukan` })
            } else {
                res.status(200).json(data)
            }
        })
        .catch((err) => {
            console.log(err, `<<< error get one user`);
        })
    };

    // static async change_user(req, res, next) {
    //     try {
    //       let id = req.params.id;
    //       let obj = {
    //         email: req.body.email,
    //         // password: req.body.password,
    //         nama_depan: req.body.nama_depan,
    //         nama_belakang: req.body.nama_belakang,
    //         no_telepon: req.body.no_telepon,
    //         tanggal_lahir: req.body.tanggal_lahir,
    //         username: req.body.username,
    //         jenis_kelamin: req.body.jenis_kelamin,
    //         pekerjaan: req.body.pekerjaan,
    //         foto_profile: req.body.foto_profile
    //       };

    //       console.log(obj, `<<<< obj`);
    
    //       const data = await User.update(obj, { where: { id } });
    //       console.log(data, `<<<< data`);
    //       if (data) res.status(201).json({ msg: `data berhasil diubah` });
    //     } catch (error) {
    //       console.log(error, `<<<< error edit product`);
    //       next(error);
    //     }
    // };
};

module.exports = UserController;