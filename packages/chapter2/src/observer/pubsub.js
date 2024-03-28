let currentCallback = null; // 현재 실행중인 구독 함수 저장
const observers = {}; // 각 속성별로 구독 함수를 저장하는 객체

export const 구독 = (fn) => {
  currentCallback = fn;
  fn();
  currentCallback = null;
};

export const 발행기관 = (obj) => {
  // return obj;

  const state = new Proxy(obj, {
    get(target, property) {
      if (!observers[property]) {
        observers[property] = new Set(); // new Set() : 중복을 허용하지 않는 유니크한 값들의 집합
      }
      if (currentCallback) {
        observers[property].add(currentCallback);
      }
      return target[property];
    },
    set(target, property, value) {
      target[property] = value;
      if (observers[property]) {
        observers[property].forEach((callback) => callback());
      }
      return true;
    },
  });
  return state;
};
