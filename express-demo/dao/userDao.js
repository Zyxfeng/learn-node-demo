const mysql = require('mysql');

const $conf = require('../config/db');

const $sql = require('./userSqlMapping');

//使用连接池，提升性能
const pool = mysql.createPool($conf.mysql);

const jsonWrite = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
}

module.exports = {
    add(req, res, next) {
        pool.getConnection((err, connection) => {
            let param = req.query || req.params;
            connection.query($sql.insert, [param.name, param.age], (err, result) => {
                if (result) {
                    result = {
                        code: 200,
                        msg: '添加成功'
                    };
                }
                //以json的形式把操作结果返回
                jsonWrite(res, result);
                //释放连接
                connection.release();
            });
        });
    },
    delete(req, res, next) {
        pool.getConnection((err, connection) => {
            let id = +req.query.id;
            connection.query($sql.delete, id, (err, result) => {
                if (result.affectedRows > 0) {
                    result = {
                        code: 200,
                        msg: '删除成功'
                    };
                } else {
                    result = void 0;
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    update(req, res, next) {
        let param = req.body;
        if (param.name == null || param.age == null || param.id == null) {
            jsonWrite(res, undefined);
            return;
        }
        pool.getConnection((err, connection) => {
            connection.query($sql.update, [param.name, param.age, +param.id], (err, result) => {
                if (result.affectedRows > 0) {
                    res.render('suc', {
                        result: result
                    });
                } else {
                    res.render('fail', {
                        result: result
                    });
                }
                connection.release();
            });
        });
    },
    queryById(req, res, next) {
        let id = +req.query.id;
        pool.getConnection((err, connection) => {
            connection.query($sql.queryById, id, (err, result) => {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    queryAll(req, res, next) {
        pool.getConnection((err, connection) => {
            connection.query($sql.queryAll, (err, result) => {
                jsonWrite(res, result);
                connection.release();
            });
        });
    }
}