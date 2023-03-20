const Fontmin = require('fontmin');
const path = require('path');

const fontPath = path.join(__dirname, './semibold.ttf'); // 字体文件的位置
const destPath = path.join(__dirname, './fonts'); // 生成文件导出的文件夹
const text = '效果'; // 需要抽取的文字
const fontName = 'semibold'; // font-family 的名称，字体输出后的文件名称

const fontmin = new Fontmin()
  .src(fontPath)
  .use(
    Fontmin.glyph({
      text,
    })
  )
  .dest(destPath);
const css = `
  @font-face {
    font-family: "${fontName}";
    src: url("${fontName}") format("truetype");
    font-style: normal;
    font-weight: normal;
  }`;
fontmin.run(function (err, files) {
  if (err) {
    throw err;
  }
  console.log('<style>');
  console.log(css);
  console.log('</style>');
  console.log(
    '-------------字体包裁剪成功，请在输出的文件目录里查看----------------'
  );
});
