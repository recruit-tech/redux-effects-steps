export function sync(name) {
  return {
    type: 'SYNC',
    payload: {
      name,
    },
  };
}

export function async(payload) {
  return {
    type: 'ASYNC',
    payload,
  };
}

export function error(message) {
  return {
    type: 'ERROR',
    payload: new Error(message),
    error: true,
  };
}

export function failure(payload) {
  return {
    type: 'FAILURE',
    payload,
    error: true,
  };
}
