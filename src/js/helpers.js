import { TIMEOUT } from "./config";

const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
};

export const AJAX = async (url, uploadRecipe = null) => {
  try {
    const fetchPro =  uploadRecipe ? fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(uploadRecipe)
    }) : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} ${data.status}`);

    return data;

  } catch (err) {
      throw err;
  }
}