const express = require('express');
const FontModel = require('../models/FontModel');
const Fontmin = require('fontmin');
const path = require('path');
const fs = require('fs');

const cm = FontModel.getInstance();
const router = express.Router();
/**
 *
 * @param {*} url  网络文件url地址
 * @param {*} fileName 	文件名
 * @param {*} dir 下载到的目录
 */
const cssDestPath = path.join(__dirname, '../cache/fontcss/');
const deleteFolder = (path) => {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      const curPath = `${path}/${file}`;
      if (fs.statSync(curPath).isDirectory()) {
        deleteFolder(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

const clip = (dir, text, name) => {
  const fontmin = new Fontmin()
    .src(dir) // 输入配置
    .use(
      Fontmin.glyph({
        // 字型提取插件
        text, // 所需文字
      }),
    )
    .use(
      Fontmin.css({
        fontFamily: name,
      }),
    )
    .dest(cssDestPath);
  return new Promise((resolve) => {
    fontmin.run((err, files, stream) => {
      if (err) {
        console.log('error====', err);
        resolve({ error: err });
      }
      const font = files[0];
      const buffer = font._contents;
      const base64 = buffer.toString('base64');
      const arr = name.split('.');
      const css = `
      @font-face {
        font-family: "${name}";
        src: url("${name}") format("truetype");
        font-style: normal;
        font-weight: normal;
      }`;
      fs.readFile(path.join(cssDestPath, `${arr[0]}.css`), 'utf-8', (err, data) => {
        if (err) {
          console.log('error====', err);
          resolve({ error: err });
        } else {
          resolve({ data: { font: `data:font/ttf;base64,${base64}`, css } });
        }
      });
    });
  });
};

router.post('/add', async (req, res) => {
  const { text, name } = req.body;
  const dirPath = path.join(__dirname, '../cache/font'); // 字体目录
  const dir = path.join(dirPath, name);
  clip(dir, text, name).then((resolve) => {
    if (resolve.error) {
      res.json({
        code: 1,
        msg: '裁剪字体失败',
      });
    }
    if (resolve.data) {
      deleteFolder(cssDestPath);
      res.json({
        code: 0,
        data: resolve.data,
        msg: '成功',
      });
    }
  });
});

// 先查询数据是否存在id 后台判断更新或者新增操作
router.post('/save', async (req, res) => {
  try {
    const data = await cm.query({ _id: req.body._id });
    if (!data) {
      // console.log('新增操作');
      await cm.insert(req.body);
    } else {
      // console.log('更新操作');
      await cm.update(
        {
          _id: req.body._id,
        },
        req.body,
      );
    }
    res.json({
      code: 0,
      msg: 'ok',
    });
  } catch (e) {
    res.json({
      code: 1,
      msg: e,
    });
  }
});

router.post('/update', async (req, res) => {
  try {
    await cm.update(
      {
        _id: req.body._id,
      },
      req.body,
    );
    res.json({
      code: 0,
      msg: 'ok',
    });
  } catch (e) {
    res.json({
      code: 1,
      msg: e,
    });
  }
});

router.post('/fontList', async (req, res) => {
  try {
    const dirPath = path.join(__dirname, '../../font/'); // 根目录
    const fileList = fs.readdirSync(dirPath);
    res.json({
      code: 0,
      list: fileList,
      total: fileList.length,
      msg: '成功',
    });
  } catch (e) {
    res.json({
      code: 1,
      msg: e,
    });
  }
});

router.post('/getFont', async (req, res) => {
  try {
    const data = await cm.queryFont(req.body);
    let arr = [];
    if (data.length) {
      data.forEach((item) => {
        arr.push(item.analysisList);
      });
      arr = arr.flat();
      arr = arr.filter((i) => i.content.includes(req.body.condition));
    }
    res.json({
      data: arr,
      code: 0,
      list: data,
      total: arr.length,
    });
  } catch (e) {
    res.json({
      code: 1,
      msg: e,
    });
  }
});

router.post('/delete', async (req, res) => {
  try {
    await cm.delete(req.body);
    res.json({
      code: 0,
      msg: 'ok',
    });
  } catch (e) {
    res.json({
      code: 1,
      msg: e,
    });
  }
});

/** 腾讯文档获取code */
router.get('/txdocsauth', async (req, res) => {
  const { code } = req.query;
  res.json({
    code: 0,
    msg: 'ok',
    data: code,
  });
});

module.exports = router;
