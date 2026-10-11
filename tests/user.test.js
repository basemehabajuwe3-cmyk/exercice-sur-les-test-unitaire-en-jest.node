import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isAdult, getFullName, filterUsersByName } from '../src/user.js';

const htmlPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../src/index.html'
);
const html = readFileSync(htmlPath, 'utf8');

const users = [
  { name: 'Sammy' },
  { name: 'Jephte' },
  { name: 'Resia' }
];

/* ============================
   Tests pour isAdult
   ============================ */
describe('isAdult', () => {
  test('retourne true pour un âge de 18 ans', () => {
    expect(isAdult(18)).toBe(true);
  });

  test('retourne true pour un âge supérieur à 18 ans', () => {
    expect(isAdult(25)).toBe(true);
  });

  test('retourne false pour un âge inférieur à 18 ans', () => {
    expect(isAdult(17)).toBe(false);
  });

  test('retourne false pour un âge de 0 an', () => {
    expect(isAdult(0)).toBe(false);
  });

  test('retourne true pour un âge très élevé', () => {
    expect(isAdult(100)).toBe(true);
  });

  test('retourne false pour un âge négatif', () => {
    expect(isAdult(-1)).toBe(false);
  });

  test('retourne false pour une valeur non numérique', () => {
    expect(isAdult(NaN)).toBe(false);
  });

  test('convertit correctement une chaîne numérique en comparaison', () => {
    expect(isAdult('18')).toBe(true);
  });
});

/* ============================
   Tests pour getFullName
   ============================ */
describe('getFullName', () => {
  test('retourne le nom complet formaté correctement', () => {
    expect(getFullName('Sammy', 'Resia')).toBe('Sammy Resia');
  });

  test('fonctionne avec des prénoms/noms courts', () => {
    expect(getFullName('Jo', 'Do')).toBe('Jo Do');
  });

  test('fonctionne avec des chaînes vides', () => {
    expect(getFullName('', '')).toBe(' ');
  });

  test('gère les prénoms composés', () => {
    expect(getFullName('Jean-Pierre', 'Martin')).toBe('Jean-Pierre Martin');
  });

  test('gère les noms avec espaces en début ou fin', () => {
    expect(getFullName('  Sammy', ' Resia ')).toBe('  Sammy  Resia ');
  });
});

/* ============================
   Tests pour filterUsersByName
   ============================ */

describe('filterUsersByName', () => {
  test('retourne les utilisateurs dont le nom contient la recherche', () => {
    const result = filterUsersByName(users, 'e');
    expect(result).toEqual([{ name: 'Jephte' }, { name: 'Resia' }]);
  });

  test('recherche insensible à la casse', () => {
    const result = filterUsersByName(users, 'SAMMY');
    expect(result).toEqual([{ name: 'Sammy' }]);
  });

  test('retourne un tableau vide si aucun utilisateur ne correspond', () => {
    const result = filterUsersByName(users, 'Zoe');
    expect(result).toEqual([]);
  });

  test('retourne tous les utilisateurs si la recherche est vide', () => {
    const result = filterUsersByName(users, '');
    expect(result).toEqual(users);
  });

  test('retourne tous les utilisateurs si la recherche est undefined', () => {
    const result = filterUsersByName(users, undefined);
    expect(result).toEqual(users);
  });

  test('retourne tous les utilisateurs si la recherche est null', () => {
    const result = filterUsersByName(users, null);
    expect(result).toEqual(users);
  });

  test('recherche à la fin du nom', () => {
    const result = filterUsersByName(users, 'ia');
    expect(result).toEqual([{ name: 'Resia' }]);
  });

  test('conserve l’ordre original des utilisateurs trouvés', () => {
    const result = filterUsersByName(users, 'a');
    expect(result).toEqual([{ name: 'Sammy' }, { name: 'Resia' }]);
  });

  test('fonctionne sur un tableau vide', () => {
    const result = filterUsersByName([], 'Sammy');
    expect(result).toEqual([]);
  });

  test('ne modifie pas le tableau original', () => {
    const original = [...users];
    filterUsersByName(users, 'Sammy');
    expect(users).toEqual(original);
  });
});

describe('Page HTML', () => {
  test('déclare un document HTML en anglais', () => {
    expect(html).toMatch(/<!doctype html>/i);
    expect(html).toMatch(/<html\s+lang="en">/i);
  });

  test('contient un titre de page et un titre principal', () => {
    expect(html).toMatch(/<title>test jest<\/title>/i);
    expect(html).toMatch(/<h1>hello world<\/h1>/i);
  });

  test('charge le module JavaScript local existant', () => {
    const scriptTag = html.match(
      /<script\s+src="([^"]+)"\s+type="module"\s*><\/script>/i
    );

    expect(scriptTag).not.toBeNull();
    if (scriptTag) {
      expect(existsSync(resolve(dirname(htmlPath), scriptTag[1]))).toBe(true);
    }
  });
});
