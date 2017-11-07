const express = require('express')
const app = express()

writeLog = (...args)=>{
  args.unshift('(bdemr-pentra60-reporter)>')
  console.log(...args);
}

app.get('/get-reading', (req, res) => {
  res.send('Hello World!');
});

app.listen(8020, () => {
  writeLog('listening on 8020');
});