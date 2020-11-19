import numbro from 'numbro';
import deDE from 'numbro/languages/de-DE';
import Core from 'handsontable/core';
import {
  getRegisteredRendererNames,
  getRenderer,
} from '../../renderers';
import numericRenderer from '../index';

describe('numericRenderer', () => {
  describe('registering', () => {
    it('should auto-register renderer after import', () => {
      expect(getRegisteredRendererNames()).toEqual(['base', 'text', 'numeric']);
      expect(getRenderer('numeric')).toBeInstanceOf(Function);
    });
  });

  describe('rendering', () => {
    function getInstance() {
      return new Core(document.createElement('div'), {});
    }

    describe('formatting', () => {
      it('should format value with numericFormat', () => {
        const TD = document.createElement('td');
        const instance = getInstance();
        const cellMeta = {
          numericFormat: {
            culture: 'de-DE',
            pattern: {
              mantissa: 2,
              output: 'currency',
            }
          }
        };

        numbro.registerLanguage(deDE);

        numericRenderer(instance, TD, void 0, void 0, void 0, 1.002, cellMeta);

        expect(TD.outerHTML).toBe('<td class="htRight htNumeric">1,00€</td>');
      });
    });

    describe('class names management', () => {
      it('should add default class names for numeric values', () => {
        const TD = document.createElement('td');
        const instance = getInstance();
        const cellMeta = {};

        numericRenderer(instance, TD, void 0, void 0, void 0, 1, cellMeta);

        expect(TD.outerHTML).toBe('<td class="htRight htNumeric">1</td>');
      });

      it('should add default class names for numeric values passed as a string', () => {
        const TD = document.createElement('td');
        const instance = getInstance();
        const cellMeta = {};

        numericRenderer(instance, TD, void 0, void 0, void 0, '100', cellMeta);

        expect(TD.outerHTML).toBe('<td class="htRight htNumeric">100</td>');
      });

      it('should add default class names only if value is numeric', () => {
        const TD = document.createElement('td');
        const instance = getInstance();
        const cellMeta = {};

        numericRenderer(instance, TD, void 0, void 0, void 0, 'A', cellMeta);

        expect(TD.outerHTML).toBe('<td>A</td>');
      });

      it('should add only htNumeric class name if any alignment was defined', () => {
        const TD = document.createElement('td');
        const instance = getInstance();
        const cellMeta = {
          className: 'htCenter'
        };

        numericRenderer(instance, TD, void 0, void 0, void 0, 1, cellMeta);

        expect(TD.outerHTML).toBe('<td class="htCenter htNumeric">1</td>');
      });
    });
  });
});
