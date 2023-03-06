const { Gaji, Karyawan } = require("../models");

class KaryawanController {
  static getGaji(req, res, next) {
    const { name } = req.query;

    Gaji.findAll({
        include: [
          { model: Karyawan }
        ]
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

  static getOneGaji(req, res, next) {
    let id = req.params.id; //di FE mbil dari field KaryawanId

    Gaji.findOne({
      where: {id},
      include: [
        { model: Karyawan }
      ]
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

  static addGaji(req, res, next) {
    let body = {
      KaryawanId: req.body.KaryawanId,
      tanggal: req.body.tanggal,
      gajiPokok: req.body.gajiPokok,
      lembur: req.body.lembur,
      lamaLembur: req.body.lamaLembur,
      potongan: req.body.potongan,
      gajiTunjangan: req.body.gajiTunjangan,
      totalPotongan: req.body.totalPotongan,
      totalGajiLembur: req.body.totalGajiLembur,
      totalGaji: req.body.totalGaji
    };

    Gaji.create(body)
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

  static async deleteGaji(req, res, next) {
    try {
      let id = +req.params.id;
      const data = await Gaji.destroy({ where: { id } });
      if (data) {
        res.status(201).json({ msg: `data berhasil dihapus` });
      }
    } catch (error) {
      next(error);
    }
  }

  static async editGaji(req, res, next) {
    try {
      let id = req.params.id;
      let obj = {
        KaryawanId: req.body.KaryawanId,
        tanggal: req.body.tanggal,
        gajiPokok: req.body.gajiPokok,
        lembur: req.body.lembur,
        lamaLembur: req.body.lamaLembur,
        potongan: req.body.potongan,
        gajiTunjangan: req.body.gajiTunjangan,
        totalPotongan: req.body.totalPotongan,
        totalGajiLembur: req.body.totalGajiLembur,
        totalGaji: req.body.totalGaji
      };

      const data = await Gaji.update(obj, { where: { id } });
      if (data) res.status(201).json({ msg: `data berhasil diubah` });
    } catch (error) {
      console.log(error, `<<<< error edit gaji`);
      next(error);
    }
  }
}

module.exports = KaryawanController;
