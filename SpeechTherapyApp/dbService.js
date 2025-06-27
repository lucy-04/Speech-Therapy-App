import * as SQLite from expo-SQLite;

let displayedLetter;
let spokenLetter;
let isCorrect;
const assignValues = ((given,said,Correct)=>{
    displayedLetter = given;
    spokenLetter = said;
    isCorrect = Correct;
});
const db = SQLite.openDatabase('speechTherapy.db');

db.transaction(tx => {
    tx.executeSql(
        `CREATE TABLE IF NOT EXISIST progress(
        id INTEGER PRIMARY KEY AUTOINCREMENT
        given TEXT
        said TEXT
        isCorrect INTEGER
        );`
    );
});

db.transaction(tx => {
    tx.executeSql(
        `INSERT INTO PROGRESS(given, said, isCorrect) values (?,?,?,?);`,
        [displayedLetter, spokenLetter, isCorrect],
        (_,result) => console.log(result),
        (_,error) => console.log('error: ',error)
    );
});

db.transaction(tx => {
  tx.executeSql(
    `SELECT DISTINCT letter FROM progress WHERE isCorrect = 0;`,
    [],
    (_, { rows }) => {
      const wrongLetters = rows._array.map(row => row.given);
      console.log('Letters to revise:', wrongLetters);
    }
  );
});

