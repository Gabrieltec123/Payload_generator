
if ('undefined' == typeof window.asm68k) {

  var asm68k = {

    on_headers_received: function(info) {
      console.log("asm68k.org.on_headers_received: \n");
      console.log(info);
    },


    on_send_headers: function(info) {
      console.log("asm68k.org.on_send_headers: \n");
      console.log(info);
    },

  }

}

