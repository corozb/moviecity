;(async function load() {
	//Variables
	const API_URL = 'https://yts.mx/api/v2/list_movies.json?'

	// Selectors
	const actionContainer = document.getElementById('action')
	const animeContainer = document.getElementById('animation')
	const horrorContainer = document.getElementById('horror')
	const adventureContainer = document.getElementById('adventure')
	const dramaContainer = document.getElementById('drama')
	const comedyContainer = document.getElementById('comedy')
	const topPlaylist = document.querySelector('.myplaylist')

	const modal = document.querySelector('.modal')
	const modalTitle = modal.querySelector('h1')
	const modalImage = modal.querySelector('img')
	const modalDescription = modal.querySelector('p')
	const hideModal = document.querySelector('#hide-modal')
	const closeFeat = document.getElementById('close-feat')
	const overlay = document.querySelector('.overlay')

	const usersContainer = document.querySelector('.online_friends')
	const form = document.querySelector('.search')
	const container = document.querySelector('.container')
	const featContainer = document.querySelector('.home-featuring')

	// Fetch Data
	getData = async (url) => {
		const response = await fetch(url)
		const data = await response.json()
		if (data.data.movie_count > 0) {
			return data
		}

		throw new Error("We couldn't find the movie")
	}

	const getUserData = async (url) => {
		const response = await fetch(url)
		const data = await response.json()
		return data
	}

	// Templates
	const movieTemplate = (movie, category) => {
		return `<div class="movie" data-id="${movie.id}" data-category=${category} >
        <div class="movie-image">
          <img src="${movie.medium_cover_image}">
        </div>
        <h4 class="movie-title">
          ${movie.title}
        </h4>
			</div>`
	}

	const featTemplate = (query) => {
		return `
			<div class="featuring" data-id="${query.id}" >
				<div class="featuring-image">
				<img src="${query.medium_cover_image}" alt="">
				</div>
			
			<div class="featuring-content">
				<p class="featuring-title">Movie Found</p>
				<p class="featuring-movie">${query.title}</p>
				<p class="featuring-text">${query.description_full}</p>
			</div>
      `
	}

	const playlistTemplate = (movie, category) => {
		return `
		<li class="myplaylist-item" data-id=${movie.id} data-category=${category}>  
			<a href="">
				<span>
					${movie.title}
				</span>
			</a>
		</li>
		`
	}

	const usersTemplate = (user) => {
		return `
		<li class="eachfriend-item" data-name=${user.name.first} >
		<a href="">
			<img src="${user.picture.thumbnail}" alt="${user.name.first} ${user.name.last} avatar">
			<span>
			${user.name.first} ${user.name.last}
			</span>
		</a>
	</li>
		`
	}

	//Functions
	const createHtml = (HTMLString) => {
		const html = document.implementation.createHTMLDocument()
		html.body.innerHTML = HTMLString
		const eachMovie = html.body.children[0]
		return eachMovie
	}

	const findById = (list, id) => {
		return list.find((movie) => movie.id === parseInt(id, 10))
	}

	const modalMovie = (id, category) => {
		switch (category) {
			case 'action': {
				return findById(actionMovies, id)
			}
			case 'horror': {
				return findById(horrorMovies, id)
			}
			case 'adventure': {
				return findById(adventureMovies, id)
			}
			case 'drama': {
				return findById(dramaMovies, id)
			}
			case 'comedy': {
				return findById(comedyMovies, id)
			}
			case 'top': {
				return findById(topMovies, id)
			}
			default: {
				return findById(animeMovies, id)
			}
		}
	}

	const openModal = (element) => {
		overlay.classList.add('active')
		modal.style.animation = 'modalIn 0.8s forwards'
		const id = element.dataset.id
		const category = element.dataset.category
		const dataMovie = modalMovie(id, category)

		modalTitle.textContent = dataMovie.title
		modalImage.setAttribute('src', dataMovie.medium_cover_image)
		modalDescription.textContent = dataMovie.synopsis
	}

	const findByName = (list, name) => {
		return list.find((element) => element.name.first === name)
	}

	const modalUser = (element) => {
		overlay.classList.add('active')
		modal.style.animation = 'modalIn 0.8s forwards'

		const firstName = element.dataset.name
		const { name, picture, email, dob, location, phone } = findByName(
			usersList,
			firstName
		)

		modalTitle.textContent = `${name.first} ${name.last}`
		modalImage.setAttribute('src', `${picture.large}`)
		modalDescription.innerHTML = `
			<strong>Age: </strong> ${dob.age} </br></br>
			<strong>Email: </strong> ${email} </br></br>
			<strong>Phone: </strong> ${phone} </br></br>
			<strong>Location: </strong> ${location.city} - ${location.state} 
		`
	}

	const clickEvent = (element) => {
		element.addEventListener('click', () => {
			event.preventDefault()
			openModal(element)
		})
	}

	const clickUser = (element) => {
		element.addEventListener('click', () => {
			event.preventDefault()
			modalUser(element)
		})
	}

	const closeModal = () => {
		overlay.classList.remove('active')
		modal.style.animation = 'modalOut 0.8s forwards'
		container.classList.remove('search-active')
	}

	const renderMovieList = (list, container, category) => {
		container.children[0].remove()

		list.map((movie) => {
			const HTMLString = movieTemplate(movie, category)
			const movieElements = createHtml(HTMLString)
			container.append(movieElements)
			const image = movieElements.querySelector('img')
			image.addEventListener('load', (event) => {
				event.srcElement.classList.add('fadeIn')
			})
			clickEvent(movieElements)
		})
	}

	const renderPlayList = (list, container, category) => {
		container.children[0].remove()

		list.map((movie) => {
			const HTMLString = playlistTemplate(movie, category)
			const movieElements = createHtml(HTMLString)
			container.append(movieElements)
			clickEvent(movieElements)
		})
	}

	const addAttributes = (element, attributes) => {
		for (const key in attributes) {
			element.setAttribute(key, attributes[key])
		}
	}

	form.addEventListener('submit', async (event) => {
		event.preventDefault()
		container.classList.add('search-active')
		const loader = document.createElement('img')

		setTimeout(() => {
			container.classList.remove('search-active')
		}, 7000)

		addAttributes(loader, {
			src: 'src/images/loading-page.gif',
			height: 50,
			width: 50,
		})
		featContainer.append(loader)

		try {
			const searching = new FormData(form)
			const {
				data: { movies: movieQuery },
			} = await getData(`${API_URL}limit=1&query_term=${searching.get('name')}`)
			const HTMLString = featTemplate(movieQuery[0])
			featContainer.innerHTML = HTMLString
		} catch (error) {
			Swal.fire({
				type: 'error',
				title: 'Oops...',
				text: error.message,
			})
			loader.remove()
			container.classList.remove('search-active')
		}
	})

	const renderUser = (list, container) => {
		container.children[0].remove()

		list.map((user) => {
			const HTMLString = usersTemplate(user)
			const userElements = createHtml(HTMLString)
			container.append(userElements)
			clickUser(userElements)
		})
	}

	const cacheExist = async (category) => {
		const movieName = `${category}Movie`
		const cacheList = window.localStorage.getItem(movieName)

		if (cacheList) {
			return JSON.parse(cacheList)
		}

		const {
			data: { movies: categoryMovie },
		} = await getData(`${API_URL}genre=${category}`)
		window.localStorage.setItem(`${movieName}`, JSON.stringify(categoryMovie))

		return categoryMovie
	}

	// Responsive Menu
	const homeSidebar = document.querySelector('.home-sidebar')
	const btnResponsive = document.querySelector('.burger-button')

	btnResponsive.addEventListener('click', () =>
		homeSidebar.classList.toggle('active')
	)

	//Execution
	const {
		data: { movies: topMovies },
	} = await getData(`${API_URL}sort_by=rating&limit=10`)
	renderPlayList(topMovies, topPlaylist, 'top')

	const actionMovies = await cacheExist('action')
	renderMovieList(actionMovies, actionContainer, 'action')

	const animeMovies = await cacheExist('animation')
	renderMovieList(animeMovies, animeContainer, 'animation')

	const horrorMovies = await cacheExist('horror')
	renderMovieList(horrorMovies, horrorContainer, 'horror')

	const dramaMovies = await cacheExist('drama')
	renderMovieList(dramaMovies, dramaContainer, 'drama')

	const adventureMovies = await cacheExist('adventure')
	renderMovieList(adventureMovies, adventureContainer, 'adventure')

	const comedyMovies = await cacheExist('comedy')
	renderMovieList(comedyMovies, comedyContainer, 'comedy')

	const API_USER = 'https://randomuser.me/api/?'
	const { results: usersList } = await getUserData(`${API_USER}results=10`)
	renderUser(usersList, usersContainer)

	hideModal.addEventListener('click', closeModal)
	overlay.addEventListener('click', closeModal)
	closeFeat.addEventListener('click', () => console.log('cerrar'))
})()
