const { Project, Karyawan } = require("../models");

class ProjectController {
  static getProject(req, res, next) {
    const { name } = req.query;

    Project.findAll({
      include: [{ model: Karyawan }]
    })
    .then((data) => {
      if (!data || data.length === 0) {
        throw { msg: `maaf data anda masih kosong`, name: "DataEmpty" };
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
        const status = err.name === "DataEmpty" ? 404 : 500;
        res.status(status).json({
          message: err.msg || "Internal Server Error"
        });
    });
  }

  static getOneProject(req, res, next) {
    let id = req.params.id;

    Project.findOne({
      where: { id }
    })
      .then((data) => {
        if (!data) {
          throw { msg: `maaf id yang anda masukkan tidak di temukan`, name: "DataNotFound" };
        } else {
          res.status(200).json(data);
        }
      })
      .catch((err) => {
        const status = err.name === "DataNotFound" ? 404 : 500;
        res.status(status).json({
          message: err.msg || "Internal Server Error"
        });
      });
  }

  static addProject(req, res, next) {
    let body = {
        nama: req.body.nama,
        projectManager: req.body.productManager,
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
        res.status(500).json({
          message: err.errors?.[0]?.message || err.msg || "Internal Server Error"
        });
      });
  }

  static async editProject(req, res, next) {
    try {
      let id = req.params.id;
      let obj = {
        nama: req.body.nama,
        projectManager: req.body.productManager,
      };

      const data = await Project.update(obj, { where: { id } });
      if (data) res.status(201).json({ msg: `data berhasil diubah` });
    } catch (error) {
      res.status(500).json({
        message: error.errors?.[0]?.message || error.msg || "Internal Server Error"
      });
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
      res.status(500).json({
        message: error.msg || "Internal Server Error"
      });
    }
  }
}

module.exports = ProjectController;