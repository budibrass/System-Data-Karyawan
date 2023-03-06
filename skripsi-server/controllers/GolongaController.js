const { Golongan, Karyawan } = require("../models");

class GolongaController {
  static getGolongan(req, res, next) {
    const { name } = req.query;

    Golongan.findAll({
      include: [{model : Karyawan}]
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
        console.log(err, `<<<<< error get golongan`);
    })
  }

  static getOneGolongan(req, res, next) {
    let id = req.params.id;

    Golongan.findOne({
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
        console.log(err, `<<< error get one golongan`);
      });
  }

  static addGolongan(req, res, next) {
    let body = {
        kodeGolongan: req.body.kodeGolongan,
        namaGolongan: req.body.namaGolongan,
        uangTunjangan: req.body.uangTunjangan,
        uangLembur: req.body.uangLembur
    };

    Golongan.create(body)
      .then((data) => {
        res
          .status(201)
          .json({
            msg: `selamat data telah berhasil ditambahkan`
          });
      })
      .catch((err) => {
        console.log(err, `<<< error add golongan`);
      });
  }

  static async editGolongan(req, res, next) {
    try {
      let id = req.params.id;
      let obj = {
        kodeGolongan: req.body.kodeGolongan,
        namaGolongan: req.body.namaGolongan,
        uangTunjangan: req.body.uangTunjangan,
        uangLembur: req.body.uangLembur
      };

      const data = await Golongan.update(obj, { where: { id } });
      if (data) res.status(201).json({ msg: `data berhasil diubah` });
    } catch (error) {
      console.log(error, `<<<< error edit golongan`);
      next(error);
    }
  }

  static async deleteGolongan(req, res, next) {
    try {
      let id = +req.params.id;
      const data = await Golongan.destroy({ where: { id } });
      if (data) {
        res.status(201).json({ msg: `data berhasil dihapus` });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GolongaController;
