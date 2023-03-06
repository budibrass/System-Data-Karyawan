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
    });
  }

  static getOnePresensi(req, res, next){
    let id = req.params.id;

    Presensi.findOne({ 
        where: {KaryawanId: id},
        include: [Karyawan]
    })
    .then((data) => {            
        if(!data) {
            throw ({ msg: `maaf email yang anda masukkan tidak di temukan` })
        } else {
            res.status(200).json(data)
        }
    })
    .catch((err) => {
        console.log(err, `<<< error get one presensi`);
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
        console.log(err, `<<< error add clock in`);
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
      console.log(error, `<<<< error edit presensi`);
      next(error);
    }
  }
}

module.exports = PresensiController;
