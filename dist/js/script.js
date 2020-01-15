(async function load () {

  async function getData(url) {
    const response = await fetch(url)
    const data = await response.json()
    if (data.data.movie_count > 0){
      return data;
    } 

    throw new Error ("We couldn't find the movie")
  }

  // Variables
  const URL_API = 'https://yts.lt/api/v2/list_movies.json?'
  const $overlay = document.querySelector('.overlay')
  
  const $modal = document.querySelector('.modal')
  const $modalTitle = $modal.querySelector('h1')
  const $modalImage = $modal.querySelector('img')
  const $modalDescription = $modal.querySelector('p')
  const $hideModal = document.querySelector('#hide-modal')

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

  function findByName(name, list) {
    return list.find(element => element.name.first === name)
  }

  function showModalUser(element) {
    $overlay.classList.add('active')
    $modal.style.animation = 'modalIn .8s forwards'

    const firstname = element.dataset.name
    const {
      name,
      picture,
      email,
      dob,
      location,
      phone,
    } = findByName(firstname, friendList)

    $modalTitle.textContent = `${name.first} ${name.last}`
    $modalImage.setAttribute('src', picture.large)
    $modalDescription.innerHTML = 
    `
      <strong>Email: </strong> ${email} <br/><br/>
      <strong>Phone: </strong> ${phone} <br/><br/>
      <strong>Age: </strong> ${dob.age} <br/><br/>
      <strong>Location: </strong> ${location.city}, ${location.state}
    `;
  }

  function userClick($container) {
    const userList = Array.from($container.children)
    userList.forEach((element) => {
      element.addEventListener('click', () => {
        event.preventDefault()
        showModalUser(element)
      })
    })
  }

  function renderFriendList(list, $container) {
    $container.children[0].remove()

    list.forEach((user) => {
      const HTMLString = friendsTemplate(user) // convertimos a un template
      $container.innerHTML += HTMLString
      
      userClick($container)
    })
  };

  const URL_USER = 'https://randomuser.me/api/?'
  const { results: friendList }  = await getUser(`${URL_USER}results=10`)
  window.localStorage.setItem('friendList', JSON.stringify(friendList))

  const $personContainer = document.querySelector('ul')
  renderFriendList(friendList, $personContainer)

  // ------ playlist
  const $playlistContainer = document.querySelector('ol')

  function playlistTemplate(movie, category) {
    return (
      `
      <li class="myplaylist-item" data-id=${movie.id} data-category=${category}>  
        <a href="">
          <span>
            ${movie.title}
          </span>
        </a>
      </li>
      `
    )
  }

  function renderPlaylist(list, playContainer, category) {
    playContainer.children[0].remove()

    list.forEach((movie) => {
      const HTMLString = playlistTemplate(movie, category) 
      const playElements = createHtml(HTMLString)

      playContainer.append(playElements) 
      clickEvent(playElements)
    })
  };

  const { data: { movies: topPlaylist } } = await getData(`${URL_API}sort_by=rating&limit=10`)
  window.localStorage.setItem('topPlaylist', JSON.stringify(topPlaylist))
  renderPlaylist(topPlaylist, $playlistContainer, 'top')


  // template featuring
  function featTemplate(searchMovie, category) {
    return (
      `
      <div class="featuring" data-id="${searchMovie.id}" data-category=${category}>
        <div class="featuring-image">
          <img src="${searchMovie.medium_cover_image}" alt="">
        </div>

        <div class="featuring-content">
          <p class="featuring-title">Movie Found</p>
          <p class="featuring-movie">${searchMovie.title}</p>
          <p class="featuring-text">${searchMovie.description_full}</p>
        </div>
      </div>
      `
    )
  }

  $form.addEventListener('submit', async (event) => { //la volvemos asincrona porque vamos a hacer consultas a una API
    event.preventDefault() //Evita que recarge la página en cada búsqueda
    $container.classList.add('search-active')
    $featContainer.classList.remove('featuring-hide')
    
    setTimeout(() => {
      $featContainer.classList.add('featuring-hide')
      $container.classList.remove('search-active')
    }, 7000)
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
      const { data: { movies: myMovie }
      }= await getData(`${URL_API}limit=1&query_term=${searching.get('name')}`) //Es necesario que el input del formulario cuente con el atributo 'name'

      const HTMLString = featTemplate(myMovie[0])
      $featContainer.innerHTML = HTMLString

      // const featElements = createHtml(HTMLString)
      // $featContainer.append(featElements) 
      // clickEvent(featElements)
      
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
  function movieTemplate(item, category){
    return (
      `<div class="movie" data-id="${item.id}" data-category=${category}>
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
      event.preventDefault()
      showModal(element)
    })
  }

  function renderMovieList(list, genreContainer, category) {
    genreContainer.children[0].remove()
    
    list.forEach((item) => {
      const HTMLString = movieTemplate(item, category) // convertimos a un template
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
  

  // --------------- Responsive Burger Menu ----------------
  (function responsiveMenu() {
    const $home_sidebar = document.querySelector('.home-sidebar')
    
    const $btnResponsive = document.querySelector('.burger-button')
    const $sidebarResponsive = document.querySelector('.sidebar-responsive')
    $btnResponsive.addEventListener('click', () => $home_sidebar.classList.toggle('activo') )
    $sidebarResponsive.addEventListener('click', () => $home_sidebar.classList.remove('activo') )
  })()

  // ---------- cache data ---------
  async function cacheExist(category) {
    const listName = `${category}List`
    const cacheList = window.localStorage.getItem(listName)

    if (cacheList) { //if cache it's true then do this:
      return JSON.parse(cacheList)
    } 
    //if not make a new request
    const { data: { movies: myCategory } } = await getData(`${URL_API}genre=${category}`)
    window.localStorage.setItem(listName, JSON.stringify(myCategory))
    
    return myCategory
  }

  // -----------list and render-----------
  
  // Codigo Inicial:
  // const { data: { //desestructumas las variables en un objeto
  // movies: adventureList} } = await getData(`${URL_API}genre=adventure`)
  // window.localStorage.setItem('adventureList', JSON.stringify(adventureList))
  const adventureList = await cacheExist('adventure')
  // ---- rendering movie list ------------
  const advContainer = document.querySelector('#adventure')
  renderMovieList(adventureList, advContainer, 'adventure')

  
  // const { data: {
  //    movies: actionList} } = await getData(`${URL_API}genre=action`)
  // window.localStorage.setItem('actionList', JSON.stringify(actionList))
  const actionList = await cacheExist('action')
  const actionContainer = document.querySelector('#action')
  renderMovieList(actionList, actionContainer, 'action')
  
  // const { data: { 
  //   movies: horrorList} } = await getData(`${URL_API}genre=horror`)
  // window.localStorage.setItem('horrorList', JSON.stringify(horrorList))
  const horrorList = await cacheExist('horror')
  const horrorContainer = document.querySelector('#horror')
  renderMovieList(horrorList, horrorContainer, 'horror')
  
  // const { data: { 
  //   movies: dramaList} } = await getData(`${URL_API}genre=drama`)
  // window.localStorage.setItem('dramaList', JSON.stringify(dramaList))
  const dramaList = await cacheExist('drama')
  const dramaContainer = document.querySelector('#drama')
  renderMovieList(dramaList, dramaContainer, 'drama')
  
  // const { data: { 
  //   movies: animationList} } = await getData(`${URL_API}genre=animation`)
  // window.localStorage.setItem('animationList', JSON.stringify(animationList))
  const animationList = await cacheExist('animation')
  const animationContainer = document.querySelector('#animation')
  renderMovieList(animationList, animationContainer, 'animation')
    
  // const { data: { 
  //   movies: comedyList} } = await getData(`${URL_API}genre=comedy`)
  // window.localStorage.setItem('comedyList', JSON.stringify(comedyList))
  const comedyList = await cacheExist('comedy')
  const comedyContainer = document.querySelector('#comedy')
  renderMovieList(comedyList, comedyContainer, 'comedy')

  function findById(list, id) {
    return list.find((movie) => movie.id === parseInt(id, 10))
  }
  
  function modalMovie(id, category) {
      switch (category) {
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
        case 'top' : {
          return findById(topPlaylist, id)
        }
        default: {
          return findById(animationList, id)
        }
      }
    }
    
    function showModal($element){
      $overlay.classList.add('active')
      // $modal.classList.toggle('show-modal')
      $modal.style.animation = 'modalIn .6s forwards'
      
    const id = $element.dataset.id
    const category = $element.dataset.category
    const dataMovie = modalMovie(id, category)

    $modalTitle.textContent = dataMovie.title
    $modalImage.setAttribute('src', dataMovie.medium_cover_image)
    $modalDescription.textContent = dataMovie.description_full
  }

  function close () {
    $overlay.classList.remove('active')
    // $modal.classList.toggle('show-modal')
    $modal.style.animation= 'modalOut .8s forwards'
    $container.classList.remove('search-active')
    $featContainer.classList.add('featuring-hide')
  }

  // const close =  () => {
  // }

  $overlay.addEventListener('click', close)
  $hideModal.addEventListener('click', close)

  // (function responsiveMenu() {
  //   const $home_sidebar = document.querySelector('.home-sidebar')
    
  //   const $btnResponsive = document.querySelector('.burger-button')
  //   const $sidebarResponsive = document.querySelector('.sidebar-responsive')
  //   $btnResponsive.addEventListener('click', () => $home_sidebar.classList.toggle('activo') )
  //   $sidebarResponsive.addEventListener('click', () => $home_sidebar.classList.remove('activo') )
  // })()

})()

