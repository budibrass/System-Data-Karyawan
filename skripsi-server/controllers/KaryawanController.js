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
      if (!data || data.length === 0) {
        return res.status(404).json({ message: `maaf data anda masih kosong` });
      } else {
        let dataFilter = data;
        
        if (name) {
          dataFilter = dataFilter.filter((e) => 
            e.namaDepan && e.namaDepan.toLowerCase().includes(name.toLowerCase())
          );
        }
        res.status(200).json(dataFilter);
      }
    })
    .catch((err) => {
        res.status(500).json({
          message: "Gagal mengambil data karyawan",
          error: err.message || err
        });
    });
  }

  static getOneKaryawan(req, res, next) {
    let id = req.params.id;

    Karyawan.findByPk(id, {
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
          return res.status(404).json({ message: `maaf id yang anda masukkan tidak di temukan` });
        } else {
          res.status(200).json(data);
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "Gagal mengambil detail data karyawan",
          error: err.message || err
        });
      });
  }

  static getOneKaryawanEmail(req, res, next) {
    let email = req.params.email;

    Karyawan.findOne({
      where: { email }
    })
      .then((data) => {
        if (!data) {
          return res.status(404).json({ message: `maaf email yang anda masukkan tidak di temukan` });
        } else {
          res.status(200).json(data);
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "Gagal mengambil data karyawan berdasarkan email",
          error: err.message || err
        });
      });
  }

  static addKaryawan(req, res, next) {
    let imagePath = "";
    
    if (req.file) {
        imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

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
      statusKerja: req.body.statusKerja, 
      tanggalMasuk: req.body.tanggalMasuk,
      jumlahTanggunganAnak: req.body.jumlahTanggunganAnak,
      fotoProfile: imagePath 
    };

    Karyawan.create(body)
      .then((data) => {
        res.status(201).json({
          msg: `selamat data telah berhasil ditambahkan`,
          data
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "Gagal menambahkan data karyawan",
          error: err.message || err
        });
      });
  }

  static async deleteKaryawan(req, res, next) {
    try {
      let id = +req.params.id;
      const deletedRows = await Karyawan.destroy({ where: { id } });
      
      if (deletedRows === 0) {
        return res.status(404).json({ message: "Data tidak ditemukan, gagal menghapus" });
      }

      res.status(200).json({ msg: `data berhasil dihapus` });
    } catch (error) {
      res.status(500).json({
        message: "Gagal menghapus data karyawan",
        error: error.message || error
      });
    }
  }

  static async editKaryawan(req, res, next) {
    try {
      let id = req.params.id;
      
      const karyawanEksis = await Karyawan.findByPk(id);
      if (!karyawanEksis) {
        return res.status(404).json({ message: "Data karyawan tidak ditemukan" });
      }
      
      let imagePath = req.body.fotoProfile || karyawanEksis.fotoProfile; 

      if (req.file) {
          imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }

      let obj = {
        GolonganId: req.body.GolonganId !== undefined && req.body.GolonganId !== "" ? Number(req.body.GolonganId) : karyawanEksis.GolonganId,
        ProjectId: req.body.ProjectId !== undefined && req.body.ProjectId !== "" ? Number(req.body.ProjectId) : karyawanEksis.ProjectId,
        nip: req.body.nip !== undefined ? req.body.nip : karyawanEksis.nip,
        email: req.body.email !== undefined ? req.body.email : karyawanEksis.email,
        namaDepan: req.body.namaDepan !== undefined ? req.body.namaDepan : karyawanEksis.namaDepan,
        namaBelakang: req.body.namaBelakang !== undefined ? req.body.namaBelakang : karyawanEksis.namaBelakang,
        tempatLahir: req.body.tempatLahir !== undefined ? req.body.tempatLahir : karyawanEksis.tempatLahir,
        tanggalLahir: req.body.tanggalLahir !== undefined && req.body.tanggalLahir !== "" ? req.body.tanggalLahir : karyawanEksis.tanggalLahir,
        jenisKelamin: req.body.jenisKelamin !== undefined ? req.body.jenisKelamin : karyawanEksis.jenisKelamin,
        agama: req.body.agama !== undefined ? req.body.agama : karyawanEksis.agama,
        jabatan: req.body.jabatan !== undefined ? req.body.jabatan : karyawanEksis.jabatan,
        pendidikan: req.body.pendidikan !== undefined ? req.body.pendidikan : karyawanEksis.pendidikan,
        noHandphone: req.body.noHandphone !== undefined ? req.body.noHandphone : karyawanEksis.noHandphone,
        alamat: req.body.alamat !== undefined ? req.body.alamat : karyawanEksis.alamat,
        statusPernikahan: req.body.statusPernikahan !== undefined ? req.body.statusPernikahan : karyawanEksis.statusPernikahan,
        statusKerja: req.body.statusKerja !== undefined ? req.body.statusKerja : karyawanEksis.statusKerja, 
        tanggalMasuk: req.body.tanggalMasuk !== undefined && req.body.tanggalMasuk !== "" ? req.body.tanggalMasuk : karyawanEksis.tanggalMasuk,
        jumlahTanggunganAnak: req.body.jumlahTanggunganAnak !== undefined && req.body.jumlahTanggunganAnak !== "" ? Number(req.body.jumlahTanggunganAnak) : karyawanEksis.jumlahTanggunganAnak,
        fotoProfile: imagePath 
      };

      await Karyawan.update(obj, { where: { id } });

      res.status(200).json({ message: "Data berhasil diubah" });
    } catch (error) {
      res.status(500).json({
        message: "Gagal memperbarui data karyawan",
        error: error.message || error
      });
    }
}
}

module.exports = KaryawanController;