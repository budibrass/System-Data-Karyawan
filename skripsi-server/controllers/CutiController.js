const { Cuti, Karyawan } = require("../models");

class CutiController {
  static getCuti(req, res, next) {
    const { name } = req.query;

    Cuti.findAll({
        include: [{ 
          model: Karyawan
        }]
    })
    .then((data) => {
      if (!data) {
        throw { msg: `maaf data anda masih kosong` };
      } else {
        // let dataFilter = data;
        // if (name !== undefined) {
        //   dataFilter = dataFilter.filter((e) => e.namaDepan.toLowerCase().includes(name.toLowerCase()));
        // }
        res.status(200).json(data);
      }
    })
    .catch((err) => {
        console.log(err, `<<<<< error get gaji`);
    })
  }

  static getOneCuti(req, res, next) {
    let id = req.params.id;

    Cuti.findOne({
      where: {id}
    })
      .then((data) => {
        if (!data) {
          throw { msg: `maaf id yang anda masukkan tidak di temukan` };
        } else {
          res.status(200).json(data);
        }
      })
      .catch((err) => {
        console.log(err, `<<< error get one cuti`);
      });
  }

  static addCuti(req, res, next) {
    let body = {
        KaryawanId: req.body.KaryawanId,
        mulaiTanggal: req.body.mulaiTanggal,
        sampaiTanggal: req.body.sampaiTanggal,
        alasan: req.body.alasan,
        status: req.body.status
    };

    Cuti.create(body)
      .then((data) => {
        res
          .status(201)
          .json({
            msg: `selamat data telah berhasil ditambahkan`
          });
      })
      .catch((err) => {
        console.log(err, `<<< error add cuti`);
      });
  }

  static async editGaji(req, res, next) {
    try {
      let id = req.params.id;
      let obj = {
        KaryawanId: req.body.KaryawanId,
        mulaiTanggal: req.body.mulaiTanggal,
        sampaiTanggal: req.body.sampaiTanggal,
        alasan: req.body.alasan,
        status: req.body.status
      };

      const data = await Cuti.update(obj, { where: { id } });
      if (data) res.status(201).json({ msg: `data berhasil diubah` });
    } catch (error) {
      console.log(error, `<<<< error edit cuti`);
      next(error);
    }
  }
}

module.exports = CutiController;
