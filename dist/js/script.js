(async function load () {

  async function getData(url) {
    const response = await fetch(url)
    const data = await response.json()
    if (data.data.movie_count > 0){
      return data;
    } 

    throw new Error ("We couldn't find the movie")
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
  
  // ------ SIDEBARD GENERATING -----------
  // friends online

  async function getUser(url) {
    const response = await fetch(url)
    const data = await response.json()
    return data;
  }

  function friendsTemplate(user) {
    return (
      `
      <li class="eachfriend-item" data-name=${user.name.first}>
        <a href="">
          <img src="${user.picture.thumbnail}" alt="${user.name.first} ${user.name.last} avatar">
          <span>
          ${user.name.first} ${user.name.last}
          </span>
        </a>
      </li>
      `
    )
  }

  function renderFriendList(list, $container) {
    list.forEach((user) => {
      const HTMLString = friendsTemplate(user) // convertimos a un template
      const friendElements = createHtml(HTMLString) //creamos un elemento nuevo porque son elementos en cadena 
      
      $container.append(friendElements) //Para que nos imprima cada elemento en el navegador
    })
  };

  const URL_USER = 'https://randomuser.me/api/?'
  const { results: friendList }  = await getUser(`${URL_USER}results=10`)

  const $personContainer = document.querySelector('ul')
  renderFriendList(friendList, $personContainer)

  // ------ playlist
  function playlistTemplate(movie) {
    return (
      `
      <li class="myplaylist-item">  
        <a href="">
          <span>
            ${movie.title}
          </span>
        </a>
      </li>
      `
    )
  }

  function renderPlaylist(list, $container) {
    list.forEach((movie) => {
      const HTMLString = playlistTemplate(movie) // convertimos a un template
      const playElements = createHtml(HTMLString) //creamos un elemento nuevo porque son elementos en cadena 
      
      $container.append(playElements) //Para que nos imprima cada elemento en el navegador
    })
  };

  const { data: { movies: topPlaylist } } = await getData(`${URL_API}sort_by=rating&limit=10`)
  const $playlistContainer = document.querySelector('ol')
  renderPlaylist(topPlaylist, $playlistContainer)


  // template featuring
  function featTemplate(searchMovie, genres) {
    return (
      `
      <div class="featuring" data-id="${searchMovie.id}" data-genre=${searchMovie.genres[0]}>
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
    $featContainer.classList.remove('featuring-hide')
    const loader = document.createElement('img')

    addAttributes(loader, {
      src: 'src/images/loading-page.gif',
      height: 50,
      width: 100,
    })
    $featContainer.append(loader)

    const searching = new FormData($form) // creamos una clase FormData para obtener los valores del input del formulario
    try {
      // Vamos a destructurar un objeto:
      // const searchMovie = await getData(`${URL_API}limit=1&query_term=${searching.get('name')}`) //Es necesario que el input del formulario cuente con el atributo 'name'
      const {
        data: {
          movies: myMovie
        }
      }= await getData(`${URL_API}limit=1&query_term=${searching.get('name')}`) //Es necesario que el input del formulario cuente con el atributo 'name'
      
      const HTMLfeat = featTemplate(myMovie[0])
      $featContainer.innerHTML = HTMLfeat
      clickEvent($featContainer)
      
    } catch(error) {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: error.message
      })
      loader.remove()
      $container.classList.remove('search-active')
      $featContainer.classList.add('featuring-hide')
    }
    
  })
  
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
      const imageCartel = movieElements.querySelector('img')
      imageCartel.addEventListener('load', (event) => {
        // imageCartel.classList.add('fadeIn') es lo mismo:
        event.srcElement.classList.add('fadeIn')
      })
      clickEvent(movieElements)
    })
  };
  

  // -----------list and render-----------
  const { data: { //desestructumas las variables en un objeto
    movies: adventureList} } = await getData(`${URL_API}genre=adventure`)
  // ---- rendering movie list ------------
  const advContainer = document.querySelector('#adventure')
  renderMovieList(adventureList, advContainer, 'adventure')
  
  const { data: {
     movies: actionList} } = await getData(`${URL_API}genre=action`)
  const actionContainer = document.querySelector('#action')
  renderMovieList(actionList, actionContainer, 'action')
  
  const { data: { 
    movies: horrorList} } = await getData(`${URL_API}genre=horror`)
  const horrorContainer = document.querySelector('#horror')
  renderMovieList(horrorList, horrorContainer, 'horror')
  
  const { data: { 
    movies: dramaList} } = await getData(`${URL_API}genre=drama`)
  const dramaContainer = document.querySelector('#drama')
  renderMovieList(dramaList, dramaContainer, 'drama')
  
  const { data: { 
    movies: animationList} } = await getData(`${URL_API}genre=animation`)
  const animationContainer = document.querySelector('#animation')
  renderMovieList(animationList, animationContainer, 'animation')
    
  const { data: { 
    movies: comedyList} } = await getData(`${URL_API}genre=comedy`)
  const comedyContainer = document.querySelector('#comedy')
  renderMovieList(comedyList, comedyContainer, 'comedy')

  // Variables
  const $overlay = document.querySelector('.overlay')
  const $featuring = document.querySelector('.featuring')
  
  const $modal = document.querySelector('.modal')
  const $modalTitle = $modal.querySelector('h1')
  const $modalImage = $modal.querySelector('img')
  const $modalDescription = $modal.querySelector('p')
  const $hideModal = document.querySelector('#hide-modal')

  function findById(list, id) {
    return list.find((movie) => movie.id === parseInt(id, 10))
  }

  function modalMovie(id, genre) {
      // actionList.find((movie) => {
      // return movie.id === id
      // })
    switch (genre) {
      case 'adventure': {
        return findById(adventureList, id)
      }
      case 'action' : {
        return findById(actionList, id)
      }
      case 'horror' : {
        return findById(horrorList, id)
      }
      case 'drama' : {
        return findById(dramaList, id)
      }
      case 'comedy' : {
        return findById(comedyList, id)
      }
      default: {
        return findById(animationList, id)
      }
    }
  }

  function showModal(element){
    $overlay.classList.add('active')
    // $modal.classList.toggle('show-modal')
    $modal.style.animation = 'modalIn .8s forwards'
    
    const id = element.dataset.id
    const genre = element.dataset.genre
    const dataMovie = modalMovie(id, genre)

    $modalTitle.textContent = dataMovie.title
    $modalImage.setAttribute('src', dataMovie.medium_cover_image)
    $modalDescription.textContent = dataMovie.description_full
  }

  $hideModal.addEventListener('click', () => {
    $overlay.classList.remove('active')
    // $modal.classList.toggle('show-modal')
    $modal.style.animation= 'modalOut .8s forwards'
    $container.classList.remove('search-active')
    $featContainer.classList.add('featuring-hide')
  })


})()

