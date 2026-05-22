const { Presensi, Karyawan } = require("../models");

class PresensiController {
  static getPresensi(req, res, next) {
    const { name } = req.query;

    Presensi.findAll({
      include: [Karyawan]
    })
    .then((data) => {
      if (!data) {
        throw { msg: `maaf data anda masih kosong` };
      } else {
        let dataFilter = data;
        if (name !== undefined) {
          dataFilter = dataFilter.filter((e) => e.namaDepan.toLowerCase().includes(name.toLowerCase()));
        }
        res.status(200).json(dataFilter);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
  }

  static getOnePresensi(req, res, next){
    let id = req.params.id;

    Presensi.findOne({ 
        where: {KaryawanId: id},
        include: [Karyawan]
    })
    .then((data) => {  
      res.status(200).json(data)
    })
    .catch((err) => {
        res.status(500).json({ message: "Internal server error" });
    })
  };

  static pushClock(req, res, next) {
    let body = {
      KaryawanId: req.body.KaryawanId,
      clockin: req.body.clockin,
      clockout: req.body.clockout,
    };

    Presensi.create(body)
      .then((data) => {
        res
          .status(201)
          .json({
            msg: `selamat data telah berhasil ditambahkan`
          });
      })
      .catch((err) => {
        res.status(500).json({ message: "Internal server error saat menambahkan data presensi" });
      });
  }

  static async editPushClock(req, res, next) {
    try {
      let id = req.params.id;
      let obj = {
        KaryawanId: req.body.KaryawanId,
        clockin: req.body.clockin,
        clockout: req.body.clockout,
      };

      const data = await Presensi.update(obj, { where: { id } });
      if (data) res.status(201).json({ msg: `data berhasil diubah` });
    } catch (error) {
      res.status(500).json({ message: "Internal server error saat mengubah data presensi" });
    }
  }
}

module.exports = PresensiController;
