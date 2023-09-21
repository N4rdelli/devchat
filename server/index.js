const app = require("express")(); //É a aplicação, utiliza o sistema express (de entrega)
const server = require("http").createServer(app); //Starta a aplicação com o protocolo http
const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:5173" }, //Servidor de borda, conecta na borda do servidor
});
const PORT = 3001;

io.on("connection", (socket) => {
  socket.on("set_username", (username) => {
    socket.data.username = username;
    console.log(`Bem vindo ${username}! Seu id é ${socket.id}.`);
  });

  socket.on("message", (text) =>{
    io.emit("receive_message",{ //As emissões vão ser feitas pelo emit, e vão vir com o ID e com o author
        text, 
        authorID: socket.id, 
        author:socket.data.username});
    console.log(`Usuário ${socket.data.username} enviou uma mensagem!`)
  })

  socket.on("disconnect", (reason) => {
    console.log(`${socket.data.username} desconectado, motivo: ${reason}.`);
  });
});

server.listen(PORT, () => {
  console.log("Server running...");
});