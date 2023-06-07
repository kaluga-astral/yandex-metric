/**
 * @description все параметры из документации https://yandex.ru/support/metrica/code/counter-initialize.html
 */
export type YandexMetrikaParams = {
  accurateTrackBounce?: boolean | number;
  childIframe?: boolean;
  clickmap?: boolean;
  defer?: boolean;
  ecommerce?: boolean | string;
  userParams?: Array<unknown> | Record<string, unknown>;
  trackHash?: boolean;
  trackLinks?: boolean;
  trustedDomains?: string[];
  type?: number;
  webvisor?: boolean;
  triggerEvent?: boolean;
};

export type YandexMetrikaInitParams = YandexMetrikaParams & {
  /**
   * ID счетчика
   */
  counterID: string;
  /**
   * флаг, позволяющий выключать метрику для локалки и необходимых тестовых стендов
   */
  enabled?: boolean;
  /**
   * callback, который будет вызываться при возникновении любой ошибки при работе сервиса. Можно сделать прокидывание в sentry
   * @param error
   */
  onError?: (error: Error) => void;
};

export type ReachGoalParams = {
  /**
   * Идентификатор цели метрики
   */
  target: string | string[];
  /**
   * callback, который будет вызываться после успешного достижения цели
   */
  onSuccess?: () => void;
  /**
   * Произвольные данные, которые можно отправить в метрику для анализа
   */
  extra?: object;
};

const DEFAULT_DOC_PARAMS: YandexMetrikaParams = {
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true,
  webvisor: true,
};

export class YandexMetrika {
  private enabled?: boolean = true;

  private onError?: (error: Error) => void = undefined;

  private counterID: string = '';

  /**
   * @description Метод получения объекта Яндекс.Метрики из глобальной области видимости
   */
  private get metrika() {
    if (Boolean(window.ym)) {
      return window.ym;
    } else {
      const unavailableError = new Error('Сервис Яндекс.Метрики недоступен');

      console.error(unavailableError);
      this.handleError(unavailableError);

      return () => {};
    }
  }

  /**
   * @description Метод для вызова onError callback
   * @param error {Error} Объект ошибки
   */
  private handleError = (error: Error) => {
    if (this.onError) {
      this.onError(error);
    }
  };

  /**
   * @description Вызывает передаваемый callback в зависимости от флага enabled, установленного при инициилизации
   * @param {void} callback Вызываемый метод
   */
  private runCommand = (callback: () => void) => {
    if (this.enabled) {
      callback();
    }
  };

  private formatGoalTarget = (target: string | string[]) => {
    if (Array.isArray(target)) {
      return target.join('_');
    }

    return target;
  };

  /**
   * @description Метод инициилизации сервиса метрик
   * @example yandexMetrika.init({ counterID: 'XXXXXX', enabled: process.env.IS_PRODUCTION })
   * @param {YandexMetrikaInitParams} params
   * @param {boolean} [params.clickmap=true]
   * @param {boolean} [params.trackLinks=true]
   * @param {boolean} [params.accurateTrackBounce=true]
   * @param {boolean} [params.webvisor=true]
   */
  public init({
    enabled,
    onError,
    counterID,
    ...docParams
  }: YandexMetrikaInitParams) {
    if (!Boolean(counterID) && enabled) {
      const error = new Error('Необходимо передать counterID');

      console.error(error);
      onError?.(error);
    }

    this.enabled = enabled;
    this.onError = onError;
    this.counterID = counterID;

    const params = { ...DEFAULT_DOC_PARAMS, ...docParams };

    if (enabled) {
      this.metrika(this.counterID, 'init', params);
    }
  }

  /**
   * @description Метод достижения цели
   * @example yandexMetrika.reachGoal({ target: "XXXXXX", extra: { param: "values" } })
   */
  public reachGoal({ target, extra, onSuccess }: ReachGoalParams) {
    this.runCommand(() => {
      const goalTarget = this.formatGoalTarget(target);

      this.metrika(this.counterID, 'reachGoal', goalTarget, extra, onSuccess);
    });
  }

  /**
   * @description Метод, позволяющий к счетчику добавить произвольные пользовательские данные
   * @example yandexMetrika.addUserInfo({ param: "XXXXXX" })
   */
  public addUserInfo(info: Record<string, unknown>) {
    this.runCommand(() => this.metrika(this.counterID, 'userParams', info));
  }

  /**
   * @description Метод, позволяющий передать произвольные параметры визита
   * @example yandexMetrika.addParam({ param: "XXXXXX" })
   */
  public addParams(params: Record<string, unknown>) {
    this.runCommand(() => this.metrika(this.counterID, 'addParams', params));
  }
}
