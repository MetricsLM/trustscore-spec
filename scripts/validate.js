const fs = require('fs');
const Ajv2020 = require('ajv/dist/2020');
const addFormats = require('ajv-formats'); // ✅ NEW

const schema = JSON.parse(fs.readFileSync('trustscore.schema.json', 'utf-8'));
const filenames = ['trustscore.min.json', 'trustscore.full.json', 'trustscore.json'];

let found = false;
for (const file of filenames) {
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const ajv = new Ajv2020();
    addFormats(ajv); // ✅ NEW: adds support for "uri", "email", etc.
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (valid) {
      console.log(`✅ ${file} is valid.`);
      process.exit(0);
    } else {
      console.error(`❌ ${file} is invalid:`);
      console.error(validate.errors);
      process.exit(1);
    }
  }
}

console.error('❌ No trustscore file found to validate.');
process.exit(1);
