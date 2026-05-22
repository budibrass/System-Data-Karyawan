const { Golongan, Karyawan } = require("../models");

class GolongaController {
  static getGolongan(req, res, next) {
    const { name } = req.query;

    Golongan.findAll({
      include: [{ model: Karyawan }]
    })
    .then((data) => {
      if (!data || data.length === 0) {
        throw { msg: `maaf data anda masih kosong`, name: "DataEmpty" };
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
        const status = err.name === "DataEmpty" ? 404 : 500;
        res.status(status).json({
          message: err.msg || "Internal Server Error"
        });
    });
  }

  static getOneGolongan(req, res, next) {
    let id = req.params.id;

    Golongan.findOne({
      where: { id }
    })
      .then((data) => {
        if (!data) {
          throw { msg: `maaf id yang anda masukkan tidak di temukan`, name: "DataNotFound" };
        } else {
          res.status(200).json(data);
        }
      })
      .catch((err) => {
        const status = err.name === "DataNotFound" ? 404 : 500;
        res.status(status).json({
          message: err.msg || "Internal Server Error"
        });
      });
  }

  static addGolongan(req, res, next) {
    let body = {
        kodeGolongan: req.body.kodeGolongan,
        namaGolongan: req.body.namaGolongan,
        uangTransportasi: req.body.uangTransportasi,
        uangSkill: req.body.uangSkill
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
        res.status(500).json({
          message: err.errors?.[0]?.message || err.msg || "Internal Server Error"
        });
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
      res.status(500).json({
        message: error.errors?.[0]?.message || error.msg || "Internal Server Error"
      });
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
      res.status(500).json({
        message: error.msg || "Internal Server Error"
      });
    }
  }
}

module.exports = GolongaController;