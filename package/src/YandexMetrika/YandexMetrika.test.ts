import { YandexMetrika } from './YandexMetrika';

describe('YandexMetrika.init', () => {
  it('Вызывается переданный onError при отсутствии ym в window', () => {
    const initParams = {
      counterID: 'counterID',
      onError: vi.fn(),
    };

    const yandexMetrika = new YandexMetrika();

    yandexMetrika.init(initParams);
    expect(initParams.onError).toHaveBeenCalled();
  });

  it('Не вызывается переданный onError при отсутствии ym в window и флаге enabled=false', () => {
    const initParams = {
      counterID: 'counterID',
      onError: vi.fn(),
      enabled: false,
    };

    const yandexMetrika = new YandexMetrika();

    yandexMetrika.init(initParams);
    expect(initParams.onError).not.toHaveBeenCalled();
  });
});

describe('YandexMetrika.reachGoal', () => {
  it('Не вызывается переданный onSuccess при флаге enabled=false', () => {
    const initParams = {
      counterID: 'counterID',
      onError: vi.fn(),
      enabled: false,
    };

    const onSuccess = vi.fn();

    const yandexMetrika = new YandexMetrika();

    yandexMetrika.init(initParams);
    yandexMetrika.reachGoal({ target: 'target', onSuccess });
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
