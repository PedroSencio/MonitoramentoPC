self.addEventListener("fetch", event => {
  console.log("Pedido interceptado:", event.request.url);
});
