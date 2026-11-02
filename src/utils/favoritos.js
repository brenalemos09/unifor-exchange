
var CHAVE_FAVORITOS = 'unifor-exchange-favoritos'

export function obterFavoritos() {
  var favoritosSalvos = localStorage.getItem(CHAVE_FAVORITOS)

  return favoritosSalvos ? JSON.parse(favoritosSalvos) : []
}

export function alternarFavorito(universidade) {
  var favoritos = obterFavoritos()

  var jaFavoritada = favoritos.some(function (item) {
    return item.slug === universidade.slug
  })

  if (jaFavoritada) {
    favoritos = favoritos.filter(function (item) {
      return item.slug !== universidade.slug
    })
  } else {
    favoritos.push(universidade)
  }

  localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos))

  return favoritos
}

export function verificarFavorito(slug) {
  var favoritos = obterFavoritos()

  return favoritos.some(function (item) {
    return item.slug === slug
  })
}
