(async function load () {
// action
// horror
// drama
// animation
// comedy

  async function getData(url) {
    const response = await fetch(url)
    const data = await response.json()
    return data;
  }

  const urlApi = 'https://yts.lt/api/v2/list_movies.json?genre='
  const adventureList = await getData(urlApi,'adventure')

  // template
  function movieTemplate(item){
    return (
      `<div class="movie">
        <div class="movie-image">
          <img src="${item.medium_cover_image}">
        </div>
        <h4 class="movie-title">
          ${item.title}
        </h4>
      </div>`
    )
  }

  const advContainer = document.querySelector('#adventure')
  
  adventureList.data.movies.forEach((item) => {
    const HTMLString = movieTemplate(item) // convertimos a un template
    const html = document.implementation.createHTMLDocument() // convertimos a un html
    html.body.innerHTML = HTMLString // agregamos elementos al DOM
    
    advContainer.append(html.body.children[0]) //Para que nos imprima cada elemento en el navegador
    console.log(HTMLString)
  })

  // Variables
  const container = document.querySelector('.container')
  const featContainer = document.querySelector('.featuring')
  const form = document.querySelector('.search')
  const overlay = document.querySelector('.overlay')
  const modal = document.querySelector('.modal')

  const modalTitle = modal.querySelector('h1')
  const modalImage = modal.querySelector('img')
  const modalDescription = modal.querySelector('p')
  const hideModal = document.querySelector('#hide-modal')

})()