## 前言

网页体验离不开炫酷的字体。
有时我们只需要给几个文字设置特殊字体，加载几 MB 的字体文件会降低体验感, 推荐使用 fontmin 进行字体抽取。

## Install

```
npm i
node index.js
```

## Usage

- fontPath: 字体文件的位置
- destPath: 生成文件导出的文件夹
- text: 需要抽取的文字
- fontName: font-family 的名称，字体输出后的文件名称

```
fontmin new Fontmin()
  .src(fontPath)
  .use(
    Fontmin.glyph({
      text,
    })
  )
  .dest(destPath);

fontmin.run(function (err, files) {
  if (err) {
    throw err;
  }
  console.log('------字体包裁剪成功-----');
});
```

当前只生成 ttf 文件
如需导出 css\woff\woff2 等格式自行添加 use
例如增加 css\woff

```
.use(
    Fontmin.css({
        fontFamily: fontName,
    })
)
.use(
    Fontmin.ttf2woff({
        deflate: true // deflate woff. default = false
    })
)
```

## 官方文档

`https://gitcode.net/mirrors/ecomfe/fontmin?utm_source=csdn_github_accelerator`
