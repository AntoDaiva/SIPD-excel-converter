(function() {
    const oldXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
      this.addEventListener("load", function() {
        if (this.responseURL.includes('/api/renja/laporan/rkaBelanjaSkpd')) {
          console.log("Intercepted Response:", this.responseText);
        }
      });
      return oldXHROpen.apply(this, arguments);
    };

    console.log("Injected script successfully loaded!");

  })();
  