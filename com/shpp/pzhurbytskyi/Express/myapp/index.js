const express = require('express');
const app = express();
const port = 3000;


app.get('/', (req, res) => {
    let counter = require('fs').readFileSync('com/shpp/pzhurbytskyi/Express/myapp/count.txt', 'utf-8');
	res.send((counter++)+'');
    require('fs').writeFileSync('com/shpp/pzhurbytskyi/Express/myapp/count.txt', (counter)+'');
});

app.post('/sum', (req, res) => {
	const params = req.query;
    res.send(((+params.a)+(+params.b))+'');
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
});