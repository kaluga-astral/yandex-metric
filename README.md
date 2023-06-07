# @astral/yandex-metrika

---

Библиотека для взаимодействия с Яндекс.Метрикой

# Table of contents

---

- [Installation](#installation)
- [Methods](#methods)
    - [init](#init)
    - [reachGoal](#reachgoal)
    - [addUserInfo](#addUserInfo)
    - [addParams](addParams)

# Installation

```shell
npm i --save @astral/yandex-metrika
```

```shell
yarn add @astral/yandex-metrika
```

---

# Methods
## init

Инициализация сервиса метрики.

```ts
import { YandexMetrika } from '@astral/yandex-metrika';

const yandexMetrika = new YandexMetrika();

yandexMetrika.init({ 
  enabled: process.env.IS_PRODUCTION,
  counterID: 'XXXXXX',
  onEror: (error) => console.error(error) 
})
```

---

## reachGoal
Метод достижения цели.

```ts
yandexMetrika.reachGoal({ 
  extra: { customParam: 'value' },
  target: 'XXXXXX',
  onSuccess: () => console.info('success') 
})
```

---

## addUserInfo
Метод, позволяющий к счетчику добавить произвольные пользовательские данные.

```ts
yandexMetrika.addUserInfo({ 
  userID: 'id',
  email: 'email@gmail.com',
  ...
})
```

---

## addParams
Метод, позволяющий передать произвольные параметры визита.

```ts
yandexMetrika.addParams({ 
  param1: 'value1',
  param2: 'value2',
  ...
})
```
