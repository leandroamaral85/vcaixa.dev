# vcaixa.dev
## API de Controle de Caixa

Este projeto é composto por uma API que permite ao usuário cadastrar movimentações de caixa e obter um resumo diário destas movimentações. Ela utiliza o sistema de banco de dados MongoDB e o banco utilizado encontra-se hospedado no serviço MongoDB Atlas.

## Para instalar as depenências do projeto utilize o comando abaixo:
npm install

## Para executar o projeto em modo de desenvolvimento utilize o comando abaixo:
npm run dev

## Para executar o projeto em modo de produção utilize o comando abaixo:
npm run start

## Como usar

### Login
Para acessar os endpoints da API é necessário fazer o login. Para fins de testes, foi disponibilizado um usuário pré-cadastrado. Para efetuar o login, basta enviar uma requisição do tipo POST para o endpoint /v1/login com e-mail e senha, conforme abaixo:
```json
{
    "email": "teste@teste.com"
    "password": "12345678"
}
```

Ao fazer o login, serão devolvidos na resposta os dados do usuário, a empresa a qual o mesmo está vinculado e um token que deverá ser utilizado para acessar os demais endpoints. Este token tem a duração de 1 hora e sempre deverá ser enviado no cabeçalho de nome "x-access-token" de cada requisição:
```json
{
    "sucess": true,
    "username": "teste@teste.com",
    "name": "Teste",
    "email": "teste@teste.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNTY0ZDYwYmQyYTQ3MDI4Y2E1YWFmYSIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tIiwibmFtZSI6IlRlc3RlIiwiaWF0IjoxNTk5NTE5Mzg5LCJleHAiOjE1OTk1MjI5ODl9.Qrpibk0Y20_b3DaahIe0TIf3ldGjqqlXaztybsD1kbg",
    "seller": {
        "_id": "5f564d60bd2a47028ca5aaf9",
        "companyName": "Empresa de teste",
        "registeredNumber": "01001001000101",
        "__v": 0
    }
}
```

### Cadastro de categorias
Para cadastrar categorias, basta enviar uma requisição do tipo POST para o endpoint /v1/categories, conforme abaixo. Estão disponíveis algumas categorias pré-cadastradas que podem ser obtidas através do método GET:

{
    "name": "Folha de Pagamento"
}

### Cadastro de movimentações
Para cadastrar movimentações, basta enviar uma requisição do tipo POST para o endpoint /v1/transactions, conforme abaixo:
```json
{
    "date": "2020-09-07",
    "type": "SAIDA",
    "value": 80,
    "description": "Material para limpeza da loja",
    "category": "5f56bcacd3bc9625b0bd2407"
}
```

O campo "type" deve conter obrigatoriamente a string "ENTRADA" ou "SAIDA" dependendo do tipo da movimentação. O campo "category" deve conter o ID da categoria.

### Resumo diário
Para obter o resumo diário das movimentações, basta enviar uma requisição do tipo GET para o endpoint /v1/daily-summary. Serão retornados os dados de movimentação da data atual para a empresa a qual o usuário atual está vinculado.

### Outras features
Pode ser cadastrada uma nova empresa através do endpoint /v1/register utilizando o método POST. Neste cadastro, deve ser informado o nome da empresa, o CNPJ e os dados para a criação de um novo usuário como: e-mail, nome e senha:
```json
{
    "company": {
        "companyName": "Nova empresa",
        "registeredNumber": "01001001000102"
    },
    "user": {
        "name": "Novo usuário",
        "email": "novo@teste.com",
        "password": "12345678"
    }
}
```
