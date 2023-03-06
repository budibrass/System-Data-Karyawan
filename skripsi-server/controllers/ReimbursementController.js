const { Reimbursement, Karyawan } = require("../models");

class ReimbursementController {
  static getReimbursement(req, res, next) {
    const { name } = req.query;

    Reimbursement.findAll({
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
        console.log(err, `<<<<< error get rembursement`);
    })
  }

  static getOneReimbursement(req, res, next) {
    let id = req.params.id;

    Reimbursement.findOne({
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
        console.log(err, `<<< error get one Reimbursement`);
      });
  }

  static addReimbursement(req, res, next) {
    let body = {
        KaryawanId: req.body.KaryawanId,
        tanggal: req.body.tanggal,
        namaReimbursement: req.body.namaReimbursement,
        jumlah: req.body.jumlah,
        imageUrl: req.body.imageUrl,
        status: req.body.status
    };

    Reimbursement.create(body)
      .then((data) => {
        res
          .status(201)
          .json({
            msg: `selamat data telah berhasil ditambahkan`
          });
      })
      .catch((err) => {
        console.log(err, `<<< error add Reimbursement`);
      });
  }

  static async editReimbursement(req, res, next) {
    try {
      let id = req.params.id;
      let obj = {
        KaryawanId: req.body.KaryawanId,
        tanggal: req.body.tanggal,
        namaReimbursement: req.body.namaReimbursement,
        jumlah: req.body.jumlah,
        status: req.body.status,
        imageUrl: req.body.imageUrl,
      };

      const data = await Reimbursement.update(obj, { where: { id } });
      if (data) res.status(201).json({ msg: `data berhasil diubah` });
    } catch (error) {
      console.log(error, `<<<< error edit reimbursement`);
      next(error);
    }
  }

  static async deleteReimbursement(req, res, next) {
    try {
      let id = +req.params.id;
      const data = await Reimbursement.destroy({ where: { id } });
      if (data) {
        res.status(201).json({ msg: `data berhasil dihapus` });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReimbursementController;
