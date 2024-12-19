# UFRRPG Store

Sistema de comércio eletrônico que está sendo desenvolvida com fins de aprendizado

## Instalação do Desenvolvimento

1 - Criar a pasta temporária para o banco SQLite

```console
mkdir tmp
```

2 - Inicializar o Banco de dados

```console
node ace migration:run
```

3 - Criar o `.env`

```console
cp .env.example .env
```

4 - Instalar as dependências

```console
npm install
node ace add @adonisjs/mail (escolha smtp)
```

5 - Popular o Banco de dados através dos seeders

```console
node ace db:seed  
```

## Execução

```console
npm run dev
```

