const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
   res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// run a brain dead static server on port 9000, or on process.env.PORT
app.listen(process.env.PORT ? process.env.PORT : 9000);
