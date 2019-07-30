(async function load () {

  async function getData(url) {
    const response = await fetch(url)
    const data = await response.json()
    return data;
  }

  const URL_API = 'https://yts.lt/api/v2/list_movies.json?'
  const $form = document.querySelector('.search')
  const $container = document.querySelector('.container')
  const $featContainer = document.querySelector('.home-featuring')

  function addAttributes(element, attributes){
    for (const key in attributes) {
      element.setAttribute(key, attributes[key])
    }
  }
  
  // template featuring
  function featTemplate(searchMovie) {
    return (
      `
      <div class="featuring">
        <div class="featuring-image">
          <img src="${searchMovie.medium_cover_image}" alt="">
        </div>

        <div class="featuring-content">
          <p class="featuring-title">Movie Found</p>
          <p class="featuring-movie">${searchMovie.title}</p>
        </div>
      </div>
      `
    )
  }

  $form.addEventListener('submit', async (event) => { //la volvemos asincrona porque vamos a hacer consultas a una API
    event.preventDefault() //Evita que recarge la página en cada búsqueda
    $container.classList.add('search-active')
    
    const loader = document.createElement('img')
    addAttributes(loader, {
      src: 'src/images/loading-page.gif',
      height: 50,
      width: 100,
    })
    $featContainer.append(loader)

    const searching = new FormData($form) // creamos una clase FormData para obtener los valores del input del formulario
    
    // Vamos a destructurar un objeto:
    // const searchMovie = await getData(`${URL_API}limit=1&query_term=${searching.get('name')}`) //Es necesario que el input del formulario cuente con el atributo 'name'
    const {
      data: {
        movies: myMovie
      }
    }= await getData(`${URL_API}limit=1&query_term=${searching.get('name')}`) //Es necesario que el input del formulario cuente con el atributo 'name'
    
    const HTMLfeat = featTemplate(myMovie[0])
    $featContainer.innerHTML = HTMLfeat
    
  })
  
  // -----------list -----------
  const adventureList = await getData(`${URL_API}genre=adventure`)
  const actionList = await getData(`${URL_API}genre=action`)
  const horrorList = await getData(`${URL_API}genre=horror`)
  const dramaList = await getData(`${URL_API}genre=drama`)
  const animationList = await getData(`${URL_API}genre=animation`)
  const comedyList = await getData(`${URL_API}genre=comedy`)

  // template
  function movieTemplate(item, genre){
    return (
      `<div class="movie" data-id="${item.id}" data-genre=${genre}>
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
      showModal(element)
    })
  }

  function renderMovieList(list, genreContainer, genre) {
    genreContainer.children[0].remove()
    
    list.forEach((item) => {
      const HTMLString = movieTemplate(item, genre) // convertimos a un template
      const movieElements = createHtml(HTMLString) //creamos un elemento nuevo porque son elementos en cadena 
      
      genreContainer.append(movieElements) //Para que nos imprima cada elemento en el navegador
      clickEvent(movieElements)
    })
  };
  
  // ---- rendering movie list ------------
  const advContainer = document.querySelector('#adventure')
  renderMovieList(adventureList.data.movies, advContainer, 'adventure')
  
  const actionContainer = document.querySelector('#action')
  renderMovieList(actionList.data.movies, actionContainer, 'action')
  
  const horrorContainer = document.querySelector('#horror')
  renderMovieList(horrorList.data.movies, horrorContainer, 'horror')
  
  const dramaContainer = document.querySelector('#drama')
  renderMovieList(dramaList.data.movies, dramaContainer, 'drama')
  
  const animationContainer = document.querySelector('#animation')
  renderMovieList(animationList.data.movies, animationContainer, 'animation')
  
  const comedyContainer = document.querySelector('#comedy')
  renderMovieList(comedyList.data.movies, comedyContainer, 'comedy')

  // Variables
  const $overlay = document.querySelector('.overlay')
  
  const $modal = document.querySelector('.modal')
  const $modalTitle = $modal.querySelector('h1')
  const $modalImage = $modal.querySelector('img')
  const $modalDescription = $modal.querySelector('p')
  const $hideModal = document.querySelector('#hide-modal')

  function showModal(element){
    $overlay.classList.add('active')
    // $modal.classList.toggle('show-modal')
    $modal.style.animation = 'modalIn .8s forwards'
    const id = element.dataset.id
    debugger

  }

  $hideModal.addEventListener('click', () => {
    $overlay.classList.remove('active')
    // $modal.classList.toggle('show-modal')
    $modal.style.animation= 'modalOut .8s forwards'
  })

})()