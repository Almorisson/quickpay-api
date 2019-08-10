/**
 * @author : Mor NDIAYE - Lucas CHEN
 * @copyright: 2019 - 2020
 * Permet de mettre la première lettre d'une chaîne de caractère en majuscule
 *  dans notre cas: les champs firstName, country, etc
 * @param {*} s
 */

// Mettre la première lettre d'une chaîne de caractères en Majuscule
const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

module.exports = capitalize;
