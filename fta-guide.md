## Documentation Link
https://ftaproject.dev/docs/getting-started

## Installation:

### Run `npm install --save-dev fta-cli` in the console

### Add the following commands to the `'scripts'` object in the `package.json` file

```
"fta": "fta src",
"fta-save": "fta src > fta-output.txt && echo 'FTA Output saved to fta-output.txt'"
```

## Available Commands

- `fta`  -  runs fta on NodeBB logging results to console
- `fta-save`  -  runs fta on NodeBB saving results to fta-output.txt file