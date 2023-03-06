const { Karyawan, Gaji, Golongan, PengajuanLembur, Cuti, Project } = require("../models");

class KaryawanController {
  static getKaryawan(req, res, next) {
    const { name } = req.query;

    Karyawan.findAll({
      include: [
        { model: Gaji },
        { model: Golongan },
        { model: PengajuanLembur },
        { model: Cuti },
        { model: Project }
      ]
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

  static getOneKaryawan(req, res, next) {
    let id = req.params.id;

    Karyawan.findByPk(id)
      .then((data) => {
        if (!data) {
          throw { msg: `maaf id yang anda masukkan tidak di temukan` };
        } else {
          res.status(200).json(data);
        }
      })
      .catch((err) => {
        console.log(err, `<<< error get one karyawan`);
      });
  }

  static getOneKaryawanEmail(req, res, next) {
    let email = req.params.email;

    Karyawan.findOne({
      where: {email}
    })
      .then((data) => {
        if (!data) {
          throw { msg: `maaf email yang anda masukkan tidak di temukan` };
        } else {
          res.status(200).json(data);
        }
      })
      .catch((err) => {
        console.log(err, `<<< error get one karyawan email`);
      });
  }

  static addKaryawan(req, res, next) {
    let body = {
      GolonganId: req.body.GolonganId,
      ProjectId: req.body.ProjectId,
      nip: req.body.nip,
      email: req.body.email,
      namaDepan: req.body.namaDepan,
      namaBelakang: req.body.namaBelakang,
      tempatLahir: req.body.tempatLahir,
      tanggalLahir: req.body.tanggalLahir,
      jenisKelamin: req.body.jenisKelamin,
      agama: req.body.agama,
      jabatan: req.body.jabatan,
      pendidikan: req.body.pendidikan,
      noHandphone: req.body.noHandphone,
      alamat: req.body.alamat,
      statusPernikahan: req.body.statusPernikahan,
      statusKerja: req.body.statusPernikahan,
      tanggalMasuk: req.body.tanggalMasuk,
      jumlahTanggunganAnak: req.body.jumlahTanggunganAnak
    };

    Karyawan.create(body)
      .then((data) => {
        console.log(data, `<<<<< data`);
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

  static async deleteKaryawan(req, res, next) {
    try {
      let id = +req.params.id;
      const data = await Karyawan.destroy({ where: { id } });
      if (data) {
        res.status(201).json({ msg: `data berhasil dihapus` });
      }
    } catch (error) {
      next(error);
    }
  }

  static async editKaryawan(req, res, next) {
    try {
      let id = req.params.id;
      let obj = {
        GolonganId: req.body.GolonganId,
        ProjectId: req.body.ProjectId,
        nip: req.body.nip,
        email: req.body.email,
        namaDepan: req.body.namaDepan,
        namaBelakang: req.body.namaBelakang,
        tempatLahir: req.body.tempatLahir,
        tanggalLahir: req.body.tanggalLahir,
        jenisKelamin: req.body.jenisKelamin,
        agama: req.body.agama,
        jabatan: req.body.jabatan,
        pendidikan: req.body.pendidikan,
        noHandphone: req.body.noHandphone,
        alamat: req.body.alamat,
        statusPernikahan: req.body.statusPernikahan,
        statusKerja: req.body.statusPernikahan,
        tanggalMasuk: req.body.tanggalMasuk,
        jumlahTanggunganAnak: req.body.jumlahTanggunganAnak
      };

      const data = await Karyawan.update(obj, { where: { id } });
      if (data) res.status(201).json({ msg: `data berhasil diubah` });
    } catch (error) {
      console.log(error, `<<<< error edit karyawan`);
      next(error);
    }
  }
}

module.exports = KaryawanController;
