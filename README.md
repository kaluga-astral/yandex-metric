# @astral/yandex-metrika

---

Библиотека для взаимодействия с Яндекс.Метрикой

# Table of contents

---

- [Installation](#installation)
- [Добавление скрипта в html](#installation)
- [Basic usage](#methods)
    - [init](#init)
    - [reachGoal](#reachgoal)
    - [addUserInfo](#addUserInfo)
    - [addParams](#addParams)
- [Custom reachGoal](#Custom)

# Installation

```shell
npm i --save @astral/yandex-metrika
```

```shell
yarn add @astral/yandex-metrika
```

---

Добавление скрипта в html

```js
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
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

---

# Custom reachGoal

```ts
type SuccessSignGoalParams = {
  signID: string;
  status: string;
};

class Metrics extends YandexMetrics {
  constructor() {
    super();
  }

  /**
   * @description Цель, указывающее на успешное подписание
   */
  successSignGoal = (params: SuccessSignGoalParams) => {
    this.reachGoal('sign-target', params);
  };
}

const metrics = new Metrics();

metrics.successSignGoal({ signID: '123', status: 'success' });
```
