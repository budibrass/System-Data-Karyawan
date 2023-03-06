const { Project, Karyawan } = require("../models");

class ProjectController {
  static getProject(req, res, next) {
    const { name } = req.query;

    Project.findAll({
      include: [{model : Karyawan}]
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
        console.log(err, `<<<<< error get project`);
    })
  }

  static getOneProject(req, res, next) {
    let id = req.params.id;

    Project.findOne({
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
        console.log(err, `<<< error get one project`);
      });
  }

  static addProject(req, res, next) {
    let body = {
        nama: req.body.nama,
    };

    Project.create(body)
      .then((data) => {
        res
          .status(201)
          .json({
            msg: `selamat data telah berhasil ditambahkan`
          });
      })
      .catch((err) => {
        console.log(err, `<<< error add project`);
      });
  }

  static async editProject(req, res, next) {
    try {
      let id = req.params.id;
      let obj = {
        nama: req.body.nama,
      };

      const data = await Project.update(obj, { where: { id } });
      if (data) res.status(201).json({ msg: `data berhasil diubah` });
    } catch (error) {
      console.log(error, `<<<< error edit project`);
      next(error);
    }
  }

  static async deleteProject(req, res, next) {
    try {
      let id = +req.params.id;
      const data = await Project.destroy({ where: { id } });
      if (data) {
        res.status(201).json({ msg: `data berhasil dihapus` });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProjectController;
