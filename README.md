# Serverless OCR

Serverless OCR Application developed by Serverless Framework.

### Prepare

Before all below steps, you should install
[Serverless Framework](https://www.github.com/serverless/serverless) globally:

```bash
$ npm i serverless -g
```

### Download

Severless cli is very convenient, it can download templates in any github
project which should contain `serverless.yml` file.

```bash
$ serverless create --template-url https://github.com/yugasun/serverless-ocr
```

### Bootstrap

Copy `.env.example` file to `.env` in project root:

Add the access keys of a
[Tencent CAM Role](https://console.cloud.tencent.com/cam/capi) with
`AdministratorAccess` in the `.env` file, like below:

```dotenv
# .env
TENCENT_SECRET_ID=xxx
TENCENT_SECRET_KEY=xxx

# region of bucket
REGION=ap-guangzhou
# bucket name, using to store upload pictures
BUCKET=ocr-images
```

> Notice: you should create a bucket for storing user's uploaded images.

Install the NPM dependencies:

```bash
$ npm run bootstrap
```

### Development

Start server:

```bash
$ cd server && npm run start
```

Start frontend:

```bash
$ cd frontend && npm run start
```

Then you can access frontend page by http://localhost:3000.

### Support commands

Deploy:

```bash
$ npm run deploy
```

Get deploy info:

```bash
$ npm run info
```

Remove:

```bash
$ npm run remove
```

## License

MIT
