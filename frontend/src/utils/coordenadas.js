// Posição aproximada (centro) de cada país no mapa, pelo nome usado no banco (pais.nome).
// O banco não guarda latitude/longitude, então essa tabela fica no front.
// Ao cadastrar um país novo no admin, acrescente a posição aqui para ele aparecer no mapa;
// enquanto isso, ele continua aparecendo na lista de países abaixo do mapa.
var COORDENADAS = {
  'Alemanha': [51.1657, 10.4515],
  'Argentina': [-38.4161, -63.6167],
  'Austrália': [-25.2744, 133.7751],
  'Bélgica': [50.5039, 4.4699],
  'Brasil': [-14.235, -51.9253],
  'Canadá': [56.1304, -106.3468],
  'Chile': [-35.6751, -71.543],
  'China': [35.8617, 104.1954],
  'Colômbia': [4.5709, -74.2973],
  'Coreia do Sul': [35.9078, 127.7669],
  'Espanha': [40.4637, -3.7492],
  'Estados Unidos': [37.0902, -95.7129],
  'França': [46.2276, 2.2137],
  'Holanda': [52.1326, 5.2913],
  'Irlanda': [53.1424, -7.6921],
  'Israel': [31.0461, 34.8516],
  'Itália': [41.8719, 12.5674],
  'Japão': [36.2048, 138.2529],
  'México': [23.6345, -102.5528],
  'Países Baixos': [52.1326, 5.2913],
  'Portugal': [39.3999, -8.2245],
  'Reino Unido': [55.3781, -3.436],
  'Suécia': [60.1282, 18.6435],
  'Suíça': [46.8182, 8.2275],
  'Uruguai': [-32.5228, -55.7658],
}

export function coordenadasDoPais(nome) {
  return COORDENADAS[nome] || null
}
