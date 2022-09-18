/* eslint-disable no-undef */
export const request = (apiFunctionName, payload = {}) => {
  payload = JSON.stringify(payload);
  return new Promise((reslove, reject) => {
    google.script.run
      .withSuccessHandler((res) => {
        reslove(JSON.parse(res));
      })
      .withFailureHandler((err) => reject(err))
      [apiFunctionName](payload);
  });
};
