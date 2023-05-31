/**
 * @description все параметры из документации https://yandex.ru/support/metrica/code/counter-initialize.html
 */
export type DocParams = {
  accurateTrackBounce?: boolean | number;
  childIframe?: boolean;
  clickmap?: boolean;
  defer?: boolean;
  ecommerce?: boolean | string;
  userParams?: Record<string, unknown>;
  trackHash?: boolean;
  trackLinks?: boolean;
  trustedDomains?: string[];
  type?: number;
  webvisor?: boolean;
  triggerEvent?: boolean;
};

export type InitParams = {
  /**
   * Параметры инициализации счетчика
   */
  docParams?: DocParams;
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

const DEFAULT_DOC_PARAMS: DocParams = {
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true,
  webvisor: true,
};

export class Metrika {
  private enabled?: boolean = true;

  private onError?: (error: Error) => void = undefined;

  private counterID: string = '';

  private get metrika() {
    if (Boolean(window.ym)) {
      return window.ym;
    } else {
      const unavailableError = 'Сервис Яндекс.Метрики недоступен';

      console.error(unavailableError);
      this.handleError(new Error(unavailableError));

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
   * @example Metrika.init({ counterID: 'XXXXXX', enabled: process.env.IS_PRODUCTION })
   */
  public init({ docParams = {}, enabled, onError, counterID }: InitParams) {
    this.enabled = enabled;
    this.onError = onError;
    this.counterID = counterID;

    const params = { ...DEFAULT_DOC_PARAMS, ...docParams };

    this.metrika(this.counterID, 'init', params);
  }

  /**
   * @description Метод достижения цели
   * @example Metrika.reachGoal({ target: "XXXXXX", extra: { param: "values" } })
   */
  public reachGoal({ target, extra, onSuccess }: ReachGoalParams) {
    this.runCommand(() => {
      const goalTarget = this.formatGoalTarget(target);

      this.metrika(this.counterID, 'reachGoal', goalTarget, extra, onSuccess);
    });
  }

  /**
   * @description Метод, позволяющий к счетчику добавить произвольные пользовательские данные
   * @example Metrika.addUserInfo({ param: "XXXXXX" })
   */
  public addUserInfo(info: Record<string, unknown>) {
    this.runCommand(() => this.metrika(this.counterID, 'userParams', info));
  }

  /**
   * @description Метод, позволяющий передать произвольные параметры визита
   * @example Metrika.addParam({ param: "XXXXXX" })
   */
  public addParam(params: Record<string, unknown>) {
    this.runCommand(() => this.metrika(this.counterID, 'addParam', params));
  }
}
