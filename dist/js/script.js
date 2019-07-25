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
    
    const url = 'https://yts.lt/api/v2/list_movies.json?'
    const adventureList = await getData(url,'genre=horror')
    console.log(adventureList)

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