(async function load () {

  async function getData(url) {
    const response = await fetch(url)
    const data = await response.json()
    return data;
  }

  const $form = document.querySelector('.search')
  const $container = document.querySelector('.container')
  const $featContainer = document.querySelector('.home-featuring')


  function addAttributes(element, attributes){
    for (const key in attributes) {
      element.setAttribute(key, attributes[key])
    }
  }
  
  $form.addEventListener('submit', (event) => {
    event.preventDefault() //Evita que recarge la página en cada búsqueda
    $container.classList.add('search-active')
    
    const loader = document.createElement('img')
    addAttributes(loader, {
      src: 'src/images/loading-page.gif',
      height: 50,
      width: 100,
    })
    $featContainer.append(loader)
  })
  
  const urlApi = 'https://yts.lt/api/v2/list_movies.json?genre='
  
  const adventureList = await getData(urlApi +'adventure')
  const actionList = await getData(urlApi + 'action')
  const horrorList = await getData(urlApi + 'horror')
  const dramaList = await getData(urlApi + 'drama')
  const animationList = await getData(urlApi + 'animation')
  const comedyList = await getData(urlApi + 'comedy')

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

  // functions
  function createHtml(HTMLString) {  //Creamos nuestro HTML
    const html = document.implementation.createHTMLDocument() // convertimos a un html
    html.body.innerHTML = HTMLString // agregamos elementos al DOM
    const eachItem = html.body.children[0]

    return eachItem
  }
  
  function clickEvent(element) {
    element.addEventListener('click', () => {
      showModal()
    })
  }

  function renderMovieList(list, genreContainer) {
    genreContainer.children[0].remove()
    
    list.forEach((item) => {
      const HTMLString = movieTemplate(item) // convertimos a un template
      const movieElements = createHtml(HTMLString)
      
      genreContainer.append(movieElements) //Para que nos imprima cada elemento en el navegador
      clickEvent(movieElements)
    })
  }
  
  // ---- rendering movie list ------------
  const advContainer = document.querySelector('#adventure')
  renderMovieList(adventureList.data.movies, advContainer)
  
  const actionContainer = document.querySelector('#action')
  renderMovieList(actionList.data.movies, actionContainer)
  
  const horrorContainer = document.querySelector('#horror')
  renderMovieList(horrorList.data.movies, horrorContainer)
  
  const dramaContainer = document.querySelector('#drama')
  renderMovieList(dramaList.data.movies, dramaContainer)
  
  const animationContainer = document.querySelector('#animation')
  renderMovieList(animationList.data.movies, animationContainer)
  
  const comedyContainer = document.querySelector('#comedy')
  renderMovieList(comedyList.data.movies, comedyContainer)

  // Variables
  const $overlay = document.querySelector('.overlay')
  
  const $modal = document.querySelector('.modal')
  const $modalTitle = $modal.querySelector('h1')
  const $modalImage = $modal.querySelector('img')
  const $modalDescription = $modal.querySelector('p')
  const $hideModal = document.querySelector('#hide-modal')

  function showModal(){
    $overlay.classList.add('active')
    // $modal.classList.toggle('show-modal')
    $modal.style.animation = 'modalIn .8s forwards'

  }

  $hideModal.addEventListener('click', () => {
    $overlay.classList.remove('active')
    // $modal.classList.toggle('show-modal')
    $modal.style.animation= 'modalOut .8s forwards'
  })

})()