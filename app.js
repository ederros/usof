const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const mail = require('./utils/mailer');

var sess = {
    secret: "cookie_secret",
    resave: true,
    saveUninitialized: true
};

const authRouter = require('./routes/authRoutes');
const postRouter = require('./routes/postRoutes');
const usersRouter = require('./routes/userRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const commentRouter = require('./routes/commentRoutes');
const session = require('express-session');
const Mail = require('nodemailer/lib/mailer');
;
app.use(session(sess));
app.set('view engine', 'ejs'); 
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())

app.use('/api/auth', authRouter); 
app.use('/api/users', usersRouter); 
app.use('/api/posts', postRouter); 
app.use('/api/categories', categoryRouter); 
app.use('/api/comments', commentRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
