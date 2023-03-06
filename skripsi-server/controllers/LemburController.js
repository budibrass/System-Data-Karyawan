const { PengajuanLembur, Karyawan } = require("../models");

class LemburController {
  static getLembur(req, res, next) {
    const { name } = req.query;

    PengajuanLembur.findAll({
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

  static getOneLembur(req, res, next) {
    let id = req.params.id;

    PengajuanLembur.findOne({
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
        console.log(err, `<<< error get one gaji`);
      });
  }

  static addLembur(req, res, next) {
    let body = {
        KaryawanId: req.body.KaryawanId,
        tanggal: req.body.tanggal,
        lamaJam: req.body.lamaJam,
        status: req.body.status
    };

    PengajuanLembur.create(body)
      .then((data) => {
        res
          .status(201)
          .json({
            msg: `selamat data telah berhasil ditambahkan`
          });
      })
      .catch((err) => {
        console.log(err, `<<< error add karyawan`);
      });
  }

  static async editLembur(req, res, next) {
    try {
      let id = req.params.id;
      let obj = {
        KaryawanId: req.body.KaryawanId,
        tanggal: req.body.tanggal,
        lamaJam: req.body.lamaJam,
        status: req.body.status
      };

      const data = await PengajuanLembur.update(obj, { where: { id } });
      if (data) res.status(201).json({ msg: `data berhasil diubah` });
    } catch (error) {
      console.log(error, `<<<< error edit lembur`);
      next(error);
    }
  }
}

module.exports = LemburController;
