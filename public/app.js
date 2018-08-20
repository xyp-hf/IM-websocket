/**
 * 服务端
 */

/**
 * 1 将nodejs-websock包引进来
 */
var ws = require("nodejs-websocket");

/**
 * 2 创建一个WebSocket服务，建立TCP连接,
 * conn就是连进来的连接
 * server 监听2333端口
 */
var server = ws
  .createServer(function(conn) {
    console.log("New connection"); // 表示新的连接进来了
    /**
     * conn绑一个text事件,并接受一个回调
     */
    conn.on("text", function(str) {
      console.log(str);
      // 给客户端返回信息
      var data = JSON.parse(str);

      switch (data.type) {
        case "setname":
          conn.nickname = data.name;
          boardcast(
            JSON.stringify({
              name: "Server",
              text: data.name + "加入了房间"
            })
          );
          break;

        case "chat":
          boardcast(
            JSON.stringify({
              name: conn.nickname,
              text: data.text,
              type: "chat"
            })
          );
          break;

        default:
          break;
      }
    });

    // 退出房间提示
    conn.on("close", function() {
      boardcast(
        JSON.stringify({
          name: "Server",
          text: conn.nickname + "离开了房间"
        })
      );
    });

    conn.on("error", function(err) {
      console.log(err);
    });
  })
  .listen(2333);

/**
 * 编写广播的方法
 */
function boardcast(str) {
  // connections包含所有的conn,即自己的和别人的都包含
  /**
   * 即先拿到所有的链接,给他做一个循环,这样就能拿到它得每一个对象
   */
  server.connections.forEach(function(conn) {
    conn.sendText(str);
  });
}
