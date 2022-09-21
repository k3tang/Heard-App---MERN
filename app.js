const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const debug = require('debug');
const csurf = require('csurf');
const passport = require('passport');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/api/users');
const confessionsRouter = require('./routes/api/confessions');
const csrfRouter = require('./routes/api/csrf');
const chatsRouter = require("./routes/api/chats")
require('./config/passport');
// const { createServer } = require("http");
// const { Server } = require("socket.io");
const eiows = require("eiows")
const app = express();
// const httpServer = createServer(app);

const { Server } = require("socket.io");


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
            methods: ['GET', 'POST']
    }
}
);





app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))
app.use(passport.initialize());

const { isProduction } = require('./config/keys');
const { createSocket } = require('dgram');


if(!isProduction) {
    app.use(cors());
}

app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/csrf', csrfRouter);
app.use('/api/chats', chatsRouter)

io.on('connection', (socket) => {
    console.log("Un utilisateur s'est connecté au chat", socket.id );
    console.log(socket.rooms)
    socket.on('disconnect', () => {
        console.log("Un utilisateur s'est déconnecté du chat");
    });
    socket.on("private message", (msg) => {
        io.emit("message de chat", msg);
    })
      socket.on("connected message", (msg) => {
        socket.emit("CONNECTION RECEIVED");
    })

});


io.listen(8080, () => {
    console.log("Listening on *:8080");
})

// app.listen(8080, () => {
//     console.log("Listening on *:8080");
// })

// server.listen(8080, () => {
//     console.log("Listening on *:8080");
// })


app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.statusCode = 404;
    next(err);
});


const serverErrorLogger = debug('backend:error');

app.use((err, req, res, next) => {
    serverErrorLogger(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        statusCode,
        errors: err.errors
    })
});

module.exports = app;
