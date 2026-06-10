const express = require('express');
const path = require('path');
const app = express();
const PORT = 8000;

app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`Presentation running at http://localhost:${PORT}`);
});
