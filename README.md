<!--
 Copyright (c) 2024 Anthony Mugendi

 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

# Templatar

A lightweight, flexible template placeholder replacement library for JavaScript with customizable delimiters.

## Features

- 🎯 Simple and intuitive API
- 🔄 Customizable delimiters (default: `<{` and `}>`)
- ⚡ Fast and efficient string replacement
- 🛡️ Configurable missing value handling
- 🔧 Value transformation support
- 💪 TypeScript support
- 🐛 Comprehensive error handling

## Installation

```bash
npm install templatar
```

## Usage

### Basic Usage

```javascript
import Templatar from 'templatar';

const replacer = new Templatar();
const template = 'Hello <{name}>, welcome to <{place}>!';
const data = { name: 'Alice', place: 'Wonderland' };

const result = replacer.replace(template, data);
console.log(result); // "Hello Alice, welcome to Wonderland!"
```

### Custom Delimiters

```javascript
const replacer = new Templatar({
  delimiters: {
    starting: '{{',
    closing: '}}',
  },
});

const template = 'Hello {{name}}, your ID is {{userId}}';
const data = { name: 'Bob', userId: '12345' };

const result = replacer.replace(template, data);
console.log(result); // "Hello Bob, your ID is 12345"
```

### Handling Missing Values

By default, an error is thrown if a value is missing:

```javascript
const replacer = new Templatar();
const template = 'User: <{name}>, Score: <{score}>';
const data = { name: 'Charlie' };

// This will throw an error
try {
  replacer.replace(template, data);
} catch (error) {
  console.error(error); // Error: Key "score" is not found and ignoreMissing is false
}
```

Allow and transform missing values:

```javascript
const replacer = new Templatar({
  ignoreMissing: true,
  transform: ({ value, key }) => {
    return value || 'N/A';
  },
});

const template = 'User: <{name}>, Score: <{score}>';
const data = { name: 'Charlie' };

const result = replacer.replace(template, data);
console.log(result); // "User: Charlie, Score: N/A"
```

### Custom Value Transformation

```javascript
const replacer = new Templatar({
  transform: ({ value, key }) => {
    if (key === 'price') return `$${value.toFixed(2)}`;
    if (key === 'date') return new Date(value).toLocaleDateString();
    return String(value);
  },
});

const template = 'Item: <{item}>, Price: <{price}>, Date: <{date}>';
const data = {
  item: 'Widget',
  price: 19.99,
  date: '2024-01-15',
};

const result = replacer.replace(template, data);
console.log(result); // "Item: Widget, Price: $19.99, Date: 1/15/2024"
```

### Using Detault Values

We can also easily define default values within our placeholders by using the syntax `propName||defaultValue`.

```javascript
const template = 'User: <{name}>, Score: <{score||0}>';
const data = { name: 'Charlie' };

const result = replacer.replace(template, data);
console.log(result); // "User: Charlie, Score: 0"
```

Note: We do not need to set `ignoreMissing` to `true` as long as we have default values defined since any missing values use that default.

## API Reference

### Templatar

#### Constructor Options

```typescript
interface TemplatarOptions {
  delimiters?: {
    starting: string;
    closing: string;
  };
  ignoreMissing?: boolean;
  transform?: (data: { value: unknown; key: string }) => string;
}
```

- `delimiters`: Custom delimiters for template placeholders
  - `starting`: Starting delimiter (default: '<{')
  - `closing`: Closing delimiter (default: '}>')
- `ignoreMissing`: Whether to allow missing values (default: false)
- `transform`: Function to transform values before replacement

#### Methods

##### replace(template: string, data: Record<string, unknown>): string

Replaces placeholders in the template with corresponding values from the data object.

- `template`: String containing placeholders
- `data`: Object containing replacement values
- Returns: String with all placeholders replaced
- Throws: Error if keys are missing and `ignoreMissing` is false

<!-- TODO: Add advanced usage section -->

## Why the fuss?

So you might be wondering why this module is even useful when there are other template replacement modules out there.

Well I developed this for use with generating dynamic AI prompts using markdown templates. But new lines, spaces, symbols and tabs all have significant meaning in markdown. So we should be able to do crazy stuff like this.

```markdown
- ACCESSORIES:
  <{accessories ||
  Any Observable:
  - Headgear
  - Footwear
  - Body drapes
  - Neckpieces
  - Eyewear
  - Hair accessories
  - Waist accessories
  - Hand accessories
  - Ear accessories
  - Wristwear
    }>
```

Now imagine the following template replacement data:

```javascript
let accessories = `
  - Headgear
  - Footwear
  - Another bullet`;

const data = {
  accessories: `
  - Headgear
  - Footwear
  - Another bullet`,
};

const result = replacer.replace(template, data);
console.log(result); // "User: Charlie, Score: 0"
```

This yields :

```markdown
ACCESSORIES:
- Headgear
- Footwear
- Another bullet
```

But if `accessories` is null or missing, then it defaults to:

```markdown
ACCESSORIES: 
Any Observable:
- Headgear
- Footwear
- Body drapes
- Neckpieces
- Eyewear
- Hair accessories
- Waist accessories
- Hand accessories
- Ear accessories
- Wristwear
```

I hope you can now see how powerful this is and how it is useful, and different.

## Error Handling

Templatar throws errors in the following cases:

- Template is not a string
- Data is not an object
- Required key is missing in data object

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
