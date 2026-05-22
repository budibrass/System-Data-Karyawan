const { Info } = require("../models");

class InfoController {
  static getInfo(req, res, next) {
    Info.findAll()
    .then((data) => {
      if (!data || data.length === 0) {
        return res.status(404).json({ message: `maaf data anda masih kosong` });
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
        res.status(500).json({
          message: "Gagal mengambil data info",
          error: err.message || err
        });
    });
  }

  static getOneInfo(req, res, next) {
    let id = req.params.id;

    Info.findOne({
      where: { id }
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
          message: "Gagal mengambil detail data info",
          error: err.message || err
        });
      });
  }

  static addInfo(req, res, next) {
    let imagePath = "";
    
    if (req.file) {
        imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    let body = {
        judul: req.body.judul,
        deskripsi: req.body.deskripsi,
        gambarInfo: imagePath
    };

    Info.create(body)
      .then((data) => {
        res.status(201).json({
          msg: `selamat data telah berhasil ditambahkan`,
          data
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "Gagal menambahkan data info",
          error: err.message || err
        });
      });
  }

  static async editInfo(req, res, next) {
    try {
      let id = req.params.id;
      let obj = {
        judul: req.body.judul,
        deskripsi: req.body.deskripsi,
        gambarInfo: req.body.gambarInfo
      };

      const [updatedRows] = await Info.update(obj, { where: { id } });
      
      if (updatedRows === 0) {
        return res.status(404).json({ message: "Data tidak ditemukan atau tidak ada perubahan" });
      }

      res.status(200).json({ msg: `data berhasil diubah` });
    } catch (error) {
      res.status(500).json({
        message: "Gagal memperbarui data info",
        error: error.message || error
      });
    }
  }

  static async deleteInfo(req, res, next) {
    try {
      let id = +req.params.id;
      const deletedRows = await Info.destroy({ where: { id } });
      
      if (deletedRows === 0) {
        return res.status(404).json({ message: "Data tidak ditemukan, gagal menghapus" });
      }

      res.status(200).json({ msg: `data berhasil dihapus` });
    } catch (error) {
      res.status(500).json({
        message: "Gagal menghapus data info",
        error: error.message || error
      });
    }
  }
}

module.exports = InfoController;