/**
 * Copyright (c) 2024 Anthony Mugendi
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getProperty } from 'dot-prop';
import util from 'util';

class Templatar {
  constructor(options = {}) {
    this.delimiters = {
      starting: options.delimiters?.starting || '<{',
      closing: options.delimiters?.closing || '}>',
    };
    this.ignoreMissing = options.ignoreMissing || false;
    this.transform = options.transform || ((data) => data.value);
  }

  replace(template, data) {
    if (typeof template !== 'string') {
      throw new Error('Template must be a string');
    }

    if (typeof data !== 'object' || data === null) {
      throw new Error('Data must be an object');
    }

    const { starting, closing } = this.delimiters;
    const escapedStart = starting.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedEnd = closing.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`${escapedStart}([\\w\\W]+?)${escapedEnd}`, 'g');

    return template.replace(pattern, (match, keyStr) => {
      const [key, defaultVal] = keyStr.split('||');
      const trimmedKey = key.trim();

      // get value or use default
      let value = getProperty(data, trimmedKey, defaultVal);

      // throw if missing key
      if (value === undefined && !this.ignoreMissing) {
        throw new Error(
          `Key "${trimmedKey}" is not found and ignoreMissing is false`
        );
      }

      // handle values that are objects
      if (typeof value == 'object') {
        value = util.inspect(value, { depth: 4});
      }
      // stringify the rest
      else if (typeof value !== 'string') {
        value = String(value);
      }

      return String(this.transform({ value, defaultVal, key: trimmedKey }));
    });
  }
}

export default Templatar;
