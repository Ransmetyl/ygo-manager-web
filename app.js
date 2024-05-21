const express = require('express');
const app = express();
const path = require('path');

// Percorso della cartella contenente i file statici
const publicPath = path.join(__dirname, 'public');

// Imposta la cartella "public" come cartella statica
app.use(express.static(publicPath));

// Avvia il server sulla porta 3000
app.listen(3000, () => {
    console.log('Server in ascolto sulla porta 3000...');
});
