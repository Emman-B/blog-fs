// express app
const app = require('./app');

// port to listen on
const PORT = 3000;

// listen on the specified port
app.listen(PORT, () => {
    console.log(`Backend is listening on port ${PORT}`)
});
