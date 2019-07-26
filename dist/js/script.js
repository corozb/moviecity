(async function load () {

// adventure
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
  const adventureList = await getData(urlApi,'horror')

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

  adventureList.data.movies.forEach((item) => {
    const HTMLString = movieTemplate(item)
    console.log(HTMLString)
  })

  // Variables
  const advContainer = document.querySelector('#adventure')

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