const express = require('express')
const cors = require('cors');
const app = express();
app.use(cors());
app.options('*', cors());

let { HoribaPentra60Reader, HoribaPentra60Parser } = require('node-astm');

resultQueue = []

__fillDummyData = _ => {
  let parser = new HoribaPentra60Parser();
  let results = parser.parse(`
1H|\^&|||ABX|||||||P|E1394-97|20060210061533
2P|1
3O|1|17033680|761|^^^DIF|||||||||||||||||||||F
4R|1|^^^WBC^804-5|10.1|10)/mm)||H||W
5C|1|I|Alarm_WBC^LMNE+|I
6C|2|I|EOSINOPHILIA|I
7R|2|^^^LYM#^731-0|3.51|||||W
0R|3|^^^LYM%^736-9|34.7|||||W
1R|4|^^^MON#^742-7|0.22|||||W
2R|5|^^^MON%^744-3|2.2|||||W
3R|6|^^^NEU#^751-8|5.43|||||W
4R|7|^^^NEU%^770-8|53.7|||||W
5R|8|^^^EOS#^711-2|0.95|||HH||W
6R|9|^^^EOS%^713-8|9.4|||||W
7R|10|^^^BAS#^704-7|0.00|||||W
0R|11|^^^BAS%^706-2|0.0|||||W
1R|12|^^^RBC^789-9|5.14|102/mm)||||F
2C|1|I|HYPOCHROMIA|I
3R|13|^^^HGB^717-9|13.8|g/dl||||F
4R|14|^^^HCT^4544-3|44.0|%||||F
5R|15|^^^MCV^787-2|86|5m)||||F
6R|16|^^^MCH^785-6|26.8|pg||L||F
7R|17|^^^MCHC^786-4|31.4|g/dl||LL||F
0R|18|^^^RDW^788-0|11.5|%||||F
1R|19|^^^PLT^777-3|355|10)/mm)||||F
2R|20|^^^MPV^776-5|8.3|5m)||||F
3L|1|N
  `);
  resultQueue.unshift(results);
}

writeLog = (...args) => {
  args.unshift('(bdemr-pentra60-reporter)>')
  console.log(...args);
}

app.all('/get-reading', (req, res) => {
  let subList = resultQueue.slice(0, 2);
  res.send(subList);
});

__fillDummyData();
app.listen(8020, () => {
  writeLog('listening on 8020');
});


let machine = new HoribaPentra60Reader();

machine.on('log', (...args) => {
  console.log(...args);
});

machine.on('error', (error) => {
  console.log(error);
});

machine.on('parse-error', (error) => {
  console.log(error);
});

machine.on('data', (transmission) => {
  let string = machine.summarizeTransmission(transmission);
  let parser = new HoribaPentra60Parser();
  let results = parser.parse(string);
  console.log(results); // outputs { testResultList, suspectedPathologyList }
  resultQueue.unshift(results);
  if (resultQueue.length > 10){
    resultQueue = resultQueue.slice(0,9);
  }
})

machine.initiate('COM2');



