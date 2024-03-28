export function createHooks(callback) {
  /*  let frameRequested = false;
  const stateContext = {
    current: 0,
    states: [],
  };

  const memoContext = {
    current: 0,
    memos: [],
  };

  function resetContext() {
    stateContext.current = 0;
    memoContext.current = 0;
    frameRequested = false;
  }

  const useState = (initState) => {
    const { current, states } = stateContext;
    stateContext.current += 1;

    states[current] = states[current] ?? initState;

    const setState = (newState) => {
      if (newState === states[current]) return;
      states[current] = newState;
      callback();
    };

    if (!frameRequested) {
      frameRequested = true;
      requestAnimationFrame(() => {
        callback();
        frameRequested = false;
      });
    }

    return [states[current], setState];
  };
 */

  let pending = false; // 변경 사항이 대기 중인지 추적
  const stateContext = {
    current: 0,
    states: [],
    queue: [], // 상태 업데이트를 위한 큐
  };

  const memoContext = {
    current: 0,
    memos: [],
  };

  function resetContext() {
    stateContext.current = 0;
    memoContext.current = 0;
    stateContext.queue = [];
    pending = false;
  }

  const useState = (initState) => {
    const id = stateContext.current;
    stateContext.current += 1;

    if (stateContext.states[id] === undefined) {
      stateContext.states[id] = initState;
    }

    const setState = (newState) => {
      stateContext.queue.push({ id, newState }); // 변경 사항을 큐에 추가

      if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
          // 모든 상태 업데이트를 처리
          while (stateContext.queue.length) {
            const { id, newState } = stateContext.queue.shift();
            stateContext.states[id] = newState;
          }
          callback(); // 콜백 호출
          pending = false;
        });
      }
    };

    return [stateContext.states[id], setState];
  };

  const useMemo = (fn, refs) => {
    const { current, memos } = memoContext;
    memoContext.current += 1;

    const memo = memos[current];

    const resetAndReturn = () => {
      const value = fn();
      memos[current] = {
        value,
        refs,
      };
      return value;
    };

    if (!memo) {
      return resetAndReturn();
    }

    if (refs.length > 0 && memo.refs.find((v, k) => v !== refs[k])) {
      return resetAndReturn();
    }
    return memo.value;
  };

  return { useState, useMemo, resetContext };
}
