window.apiFetch = function apiFetch(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId));
};

if (window.location.protocol === "file:") {
  alert("Abra a loja em http://localhost:3000 (rode npm start antes)");
}
