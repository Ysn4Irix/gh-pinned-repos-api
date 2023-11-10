<h2 align="center">
Github Pinned Repositories API
</h2>

<br>

<p align="center">
An API service to get pinned repositories from a Github profile powered by
</p>

<p align="center">
  <img width="150px" src="https://res.cloudinary.com/ydevcloud/image/upload/v1658183164/yassi/mgkhs4y9ydmoyjyozulf.svg" align="center" alt="nodejs" />
  &nbsp; &nbsp; &nbsp;
  <img width="150px" src="https://res.cloudinary.com/ydevcloud/image/upload/v1662120635/yassi/r923h19buxqfs5ouzzf6.svg" align="center" alt="express" />
</p>
<br>

![📟](https://res.cloudinary.com/ydevcloud/image/upload/v1656874185/asm9cp84cbuuqmarw9wq.png)

## Usage

<b style="color:brown;">The number of requests per user is limited to 5 requests per 30 seconds </b>

### Get pinned repositories

```sh
# with json format
GET /api/get/?username=ysn4irix
```

### Response

```json
{
  "isError": false,
  "statusMessage": "OK",
  "statusCode": 200,
  "response": [
    {
      "name": "madina",
      "repo": "https://github.com/Ysn4Irix/madina",
      "description": "Fast API for getting moroccan cities and their districts in json/xml/csv formats.",
      "demo": "https://madina.ysnirix.xyz/api/alive",
      "language": {
        "name": "JavaScript",
        "color": "#f1e05a"
      },
      "stars": 31,
      "forks": 4
    },
    { .... },
    { .... },
    { .... },
    { .... }
```

<br>

![🙌](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/connect.png)

## ❯ About

<summary>
  <strong>
    Contributing
  </strong>
</summary>

Pull requests and stars are always welcome. For bugs and features requests, [please create an issue](../../issues/new).

<br>

![📃](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/license.png)

## ❯ License

Copyright © 2022-present, [Ysn4Irix](https://github.com/Ysn4Irix).
Released under the [MIT License](LICENSE).
