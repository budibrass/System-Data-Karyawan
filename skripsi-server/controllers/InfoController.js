const { Info} = require("../models");

class InfoController {
  static getInfo(req, res, next) {
    Info.findAll()
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
        console.log(err, `<<<<< error get info`);
    })
  }

  static getOneInfo(req, res, next) {
    let id = req.params.id;

    Info.findOne({
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
        console.log(err, `<<< error get one info`);
      });
  }

  static addInfo(req, res, next) {
    let body = {
        judul: req.body.judul,
        deskripsi: req.body.deskripsi
    };

    Info.create(body)
      .then((data) => {
        res
          .status(201)
          .json({
            msg: `selamat data telah berhasil ditambahkan`
          });
      })
      .catch((err) => {
        console.log(err, `<<< error add info`);
      });
  }

  static async editInfo(req, res, next) {
    try {
      let id = req.params.id;
      let obj = {
        judul: req.body.judul,
        deskripsi: req.body.deskripsi
      };

      const data = await Info.update(obj, { where: { id } });
      if (data) res.status(201).json({ msg: `data berhasil diubah` });
    } catch (error) {
      console.log(error, `<<<< error edit info`);
      next(error);
    }
  }

  static async deleteInfo(req, res, next) {
    try {
      let id = +req.params.id;
      const data = await Info.destroy({ where: { id } });
      if (data) {
        res.status(201).json({ msg: `data berhasil dihapus` });
      }
    } catch (error) {
    //   next(error);
    console.log(error, `<<< error delete info`);
    }
  }
}

module.exports = InfoController;
