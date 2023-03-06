const { Performance, Project, Karyawan } = require("../models");

class PerformaController {
  static getPerforma(req, res, next) {
    const { name } = req.query;

    Performance.findAll({
      include: [
        { model: Karyawan },
        { model: Project },
    ],
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
        console.log(err, `<<<<< error get performa`);
      });
  }

  static getOnePerforma(req, res, next) {
    let id = req.params.id;

    Performance.findOne({
      where: { id },
    })
      .then((data) => {
        if (!data) {
          throw { msg: `maaf id yang anda masukkan tidak di temukan` };
        } else {
          res.status(200).json(data);
        }
      })
      .catch((err) => {
        console.log(err, `<<< error get one performa`);
      });
  }

  static addPerforma(req, res, next) {
    let nilaiKehadiran = (req.body.presensiJumlahKehadiran / 30 ) * 100;
    let nilaiIzinSakit = (req.body.presensiIzinSakit /2 / 30 ) * 100 / 3;
    let nilaiAlfa = (req.body.presensiAlfa / 30 ) * 100 / 3;
    let nilaiKinerja = req.body.kinerja === 'A' ? 100 : req.body.kinerja === 'B' ? 80 : req.body.kinerja === 'C' ? 60 : req.body.kinerja === 'D' ? 40 : 0;
    let totalNilai = ((nilaiKehadiran - nilaiIzinSakit - nilaiAlfa) + nilaiKinerja) / 2;

    let body = {
      KaryawanId: req.body.KaryawanId,
      bulan: req.body.bulan,
      presensiJumlahKehadiran: req.body.presensiJumlahKehadiran,
      presensiIzinSakit: req.body.presensiIzinSakit,
      presensiAlfa: req.body.presensiAlfa,
      presensiNilai: Math.round(nilaiKehadiran - nilaiIzinSakit - nilaiAlfa),
      ProjectId: req.body.ProjectId,
      kinerja: req.body.kinerja,
      totalNilai: Math.round(totalNilai)
    };

    Performance.create(body)
      .then((data) => {
        res.status(201).json({
          msg: `selamat data telah berhasil ditambahkan`,
        });
      })
      .catch((err) => {
        console.log(err, `<<< error add performa`);
      });
  }

  static async editPerforma(req, res, next) {
    let nilaiKehadiran = (req.body.presensiJumlahKehadiran / 30 ) * 100;
    let nilaiIzinSakit = (req.body.presensiIzinSakit /2 / 30 ) * 100 / 3;
    let nilaiAlfa = (req.body.presensiAlfa / 30 ) * 100 / 3;
    let nilaiKinerja = req.body.kinerja === 'A' ? 100 : req.body.kinerja === 'B' ? 80 : req.body.kinerja === 'C' ? 60 : req.body.kinerja === 'D' ? 40 : 0;
    let totalNilai = ((nilaiKehadiran - nilaiIzinSakit - nilaiAlfa) + nilaiKinerja) / 2;
    
    try {
      let id = req.params.id;
      let obj = {
        KaryawanId: req.body.KaryawanId,
        bulan: req.body.bulan,
        presensiJumlahKehadiran: req.body.presensiJumlahKehadiran,
        presensiIzinSakit: req.body.presensiIzinSakit,
        presensiAlfa: req.body.presensiAlfa,
        presensiNilai: Math.round(nilaiKehadiran - nilaiIzinSakit - nilaiAlfa),
        ProjectId: req.body.ProjectId,
        kinerja: req.body.kinerja,
        totalNilai: Math.round(totalNilai)
      };

      const data = await Performance.update(obj, { where: { id } });
      if (data) res.status(201).json({ msg: `data berhasil diubah` });
    } catch (error) {
      console.log(error, `<<<< error edit performa`);
      next(error);
    }
  }

  static async deletePerforma(req, res, next) {
    try {
      let id = +req.params.id;
      const data = await Performance.destroy({ where: { id } });
      if (data) {
        res.status(201).json({ msg: `data berhasil dihapus` });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PerformaController;
