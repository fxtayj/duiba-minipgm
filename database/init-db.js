const model = require('./model.js');

model.sync().then(() => {
    console.log('sync done,init db ok.');
    process.exit(0);
}).catch((e) => {
    console.log('failed with: ' + e);
    process.exit(0);
});