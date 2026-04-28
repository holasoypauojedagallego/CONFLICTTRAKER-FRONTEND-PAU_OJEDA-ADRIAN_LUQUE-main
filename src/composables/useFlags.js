export const getFlagUrl = (countryName) => {
  // Mapeo de nombres a códigos ISO de 2 letras (en minúscula para FlagCDN)
  const countryCodes = {
    'españa': 'es', 'espanya': 'es', 'spain': 'es',
    'ucrania': 'ua', 'ucraïna': 'ua', 'ukraine': 'ua',
    'rusia': 'ru', 'rússia': 'ru', 'russia': 'ru',
    'francia': 'fr', 'franxa': 'fr', 'france': 'fr',
    'israel': 'il',
    'palestina': 'ps',
    'siria': 'sy', 'síria': 'sy', 'syria': 'sy'
  }
  
  const lowerName = countryName.toLowerCase().trim()
  const code = countryCodes[lowerName]
  
  // Si encontramos el código devolvemos la bandera de flagcdn, si no, una bandera genérica (ONU)
  if (code) {
    return `https://flagcdn.com/w40/${code}.png`
  }
  return `https://flagcdn.com/w40/un.png`
}